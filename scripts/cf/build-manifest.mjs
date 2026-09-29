#!/usr/bin/env node
/**
 * Build manifest — the single source of truth for WHICH pages the static site contains.
 *
 * A static host can only serve pages that were generated at build time, and the
 * The build keeps a deployment under a file budget (CF_MAX_FILES). So instead of every
 * route independently guessing what to pre-render, this script asks the backend once,
 * applies an explicit file budget, and writes .build/manifest.json. Everything else
 * reads that file:
 *
 *   - each dynamic route's generateStaticParams()  (src/lib/manifest.ts)
 *   - the sitemaps                                 (scripts/cf/sitemaps.mjs)
 *   - the post-build audit + `.txt` trimming       (scripts/cf/postbuild.mjs)
 *
 * so the sitemaps can never advertise a URL that does not exist as a file.
 *
 * WHAT IS PRE-RENDERED (everything else is rendered on demand in the browser by the 404 fallback,
 * see src/lib/fallbackRoutes.ts — and is simply not a file):
 *
 *   jobs, internships   only ACTIVE ones (the backend's jobs/internships sitemaps already filter to those)
 *   companies           only companies that currently have an active job or internship
 *                       (backend: hiring-companies-sitemap.xml) — not the whole ~6k company registry
 *   hubs                facet landing pages, skills, blog, hackathons, static pages
 *   colleges, profiles  not pre-rendered (opt in with CF_COLLEGES_MAX / CF_EXTRA_PROFILES_MAX)
 *
 * Then the incremental planner (scripts/cf/incremental.mjs) decides which of those actually get RENDERED
 * this build — new / changed / stale — and which are reused untouched from the previous deployment.
 *
 * Tunables (all optional): CF_MAX_FILES, CF_OVERHEAD_FILES, CF_SAFETY_FILES,
 * CF_COLLEGES_MAX, CF_EXTRA_PROFILES_MAX, CF_RENDER_BUDGET, CF_MIN_COVERAGE, CF_ALLOW_SHRINK,
 * CF_COMPANIES_FALLBACK_MAX, CF_LIMIT_PER_ROUTE (dev shortcut: truncate every list to N entries for a
 * fast local build).
 */
import fs from 'node:fs'
import {
  API_BASE_URL, BLOG_API_URL, BUILD_DIR, HAS_INTERNAL_KEY, MANIFEST_PATH, PAGE_KINDS, PLATFORM_FILE_LIMIT,
  envInt, getJson, getText, installBuildFetch, listOf, loadState, locsOf, log, safeSlug, slugAfter, warn, xmlUnescape,
} from './lib.mjs'
import { REDIRECTED_SOURCES } from './redirects.mjs'
import { decideIncrementalBuild, describePlan } from './incremental.mjs'
import { computeCodeState } from './routes.mjs'
const { PARKED_VERTICALS } = await import(new URL('../../src/lib/parkedVerticals.ts', import.meta.url).href)

installBuildFetch()

const MAX_FILES = Math.min(envInt('CF_MAX_FILES', 19_000), PLATFORM_FILE_LIMIT)
const OVERHEAD = envInt('CF_OVERHEAD_FILES', 600)        // public/ + _next/static + 404 + misc (~350 measured)
const SAFETY = envInt('CF_SAFETY_FILES', 1_000)          // headroom for growth between builds
// Opt-in tiers: colleges and non-curated profiles are NOT worth a static file each (they are rendered on
// demand in the browser); raise these only for an experiment.
const COLLEGES_MAX = envInt('CF_COLLEGES_MAX', 0)
const EXTRA_PROFILES_MAX = envInt('CF_EXTRA_PROFILES_MAX', 0)
const DEV_LIMIT = envInt('CF_LIMIT_PER_ROUTE', 0)
// Companies to pre-render if the backend predates hiring-companies-sitemap.xml (newest-updated first).
const COMPANIES_FALLBACK_MAX = envInt('CF_COMPANIES_FALLBACK_MAX', 1_500)

// The backend's anti-scrape guard lets one IP open 600 DISTINCT detail URLs (job / company / skill page…)
// per rolling 5 minutes. A build that can't identify itself (no WEBSITE_ISR_SECRET) therefore can only
// render ~500 such pages before it is throttled into retry storms and a timeout. Rather than try and fail,
// such a build renders that many per run and the rest converge over the following builds (0 = unlimited).
const UNAUTHENTICATED_RENDER_BUDGET = 450
const RENDER_BUDGET = envInt('CF_RENDER_BUDGET', HAS_INTERNAL_KEY ? 0 : UNAUTHENTICATED_RENDER_BUDGET)
// Refuse to publish a site that lost more than this share of the previous deployment's pages because of the
// render budget (a code change forces a full re-render; a budget too small for it would silently shrink the site).
const MIN_COVERAGE = Number(process.env.CF_MIN_COVERAGE ?? 0.7)
const STATIC_ROUTE_ESTIMATE = 60                          // non-dynamic pages (about, legal, hubs, …)

const dropped = []
const cut = (arr) => (DEV_LIMIT > 0 ? arr.slice(0, DEV_LIMIT) : arr)

/** Parse <url> blocks → [{ slug, lastmod }] for one URL prefix. */
function entriesFromUrlset(xml, prefix, label) {
  const out = []
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>\s*([^<]+?)\s*<\/loc>/.exec(block[1])?.[1]
    if (!loc) continue
    const slug = slugAfter(xmlUnescape(loc), prefix)
    if (slug == null || slug === '') continue
    if (!safeSlug(slug)) {
      dropped.push({ type: label, slug, reason: 'unsafe-for-static-path' })
      continue
    }
    const lastmod = /<lastmod>\s*([^<]+?)\s*<\/lastmod>/.exec(block[1])?.[1]
    out.push({ s: slug, ...(lastmod ? { m: lastmod.slice(0, 10) } : {}) })
  }
  return out
}

/** `${kind}-sitemap.xml` is an index of `${kind}-sitemap-{N}.xml` batches. */
async function fromBatchedSitemap(kind, prefix) {
  const indexXml = await getText(`${API_BASE_URL}/${kind}-sitemap.xml`)
  const batches = locsOf(indexXml)
    .map((l) => /-(\d+)\.xml$/.exec(l)?.[1])
    .filter(Boolean)
  const all = []
  for (const n of batches) {
    all.push(...entriesFromUrlset(await getText(`${API_BASE_URL}/${kind}-sitemap-${n}.xml`), prefix, kind))
  }
  return uniqueBy(all)
}

async function fromFlatSitemap(path, prefix, label, { skip = () => false } = {}) {
  const xml = await getText(`${API_BASE_URL}/${path}`)
  return uniqueBy(entriesFromUrlset(xml, prefix, label)).filter((e) => !skip(e.s))
}

/**
 * Companies worth a static page = the ones hiring right now. The backend lists them in
 * hiring-companies-sitemap.xml; if it predates that endpoint (404), fall back to the most recently updated
 * companies from the full registry — a build must not stop working because the backend and the website deploy
 * in a different order. The fallback is deliberately cheap (the registry sitemap is newest-first, so 2 batches
 * cover the default 1,500) and fail-soft: it is an optional tier, so a slow backend must not fail the build.
 */
async function hiringCompanies() {
  const xml = await getText(`${API_BASE_URL}/hiring-companies-sitemap.xml`, { allow404: true })
  if (xml != null) return { entries: uniqueBy(entriesFromUrlset(xml, '/companies/', 'companies')), fallback: false }
  warn(
    `${API_BASE_URL}/hiring-companies-sitemap.xml returned 404 — the backend has not been deployed with it yet. ` +
      `Falling back to the ${COMPANIES_FALLBACK_MAX} most recently updated companies (instead of only those hiring).`,
  )
  try {
    const indexXml = await getText(`${API_BASE_URL}/companies-sitemap.xml`)
    const batches = locsOf(indexXml).map((l) => /-(\d+)\.xml$/.exec(l)?.[1]).filter(Boolean)
    const all = []
    for (const n of batches) {
      all.push(...entriesFromUrlset(await getText(`${API_BASE_URL}/companies-sitemap-${n}.xml`), '/companies/', 'companies'))
      if (all.length >= COMPANIES_FALLBACK_MAX) break
    }
    return { entries: uniqueBy(all).slice(0, COMPANIES_FALLBACK_MAX), fallback: true }
  } catch (err) {
    // Keep whatever the live site already has rather than silently dropping every company page.
    const kept = Object.entries(loadState()?.pages ?? {})
      .filter(([k]) => k.startsWith('companies/'))
      .map(([k, v]) => ({ s: k.slice('companies/'.length), ...(v.m ? { m: v.m } : {}) }))
    warn(`company fallback failed (${err.message}) — keeping the ${kept.length} company page(s) of the previous deployment`)
    return { entries: kept, fallback: true }
  }
}

function uniqueBy(entries) {
  const seen = new Set()
  return entries.filter((e) => (seen.has(e.s) ? false : (seen.add(e.s), true)))
}

const slugs = (entries) => entries.map((e) => e.s)

/** Same rule the college cards use to build a link (src/app/colleges/components/CollegeCard.tsx). */
function collegeSlug(name, id) {
  if (!name) return String(id)
  return (
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() + '-' + id
  )
}

/** Colleges a crawler can reach: the ones listed on page 1 of a (pre-rendered) college facet page. */
async function collegesFromFacets(facetSlugs) {
  const seen = new Set()
  const out = []
  // Page 1 of each facet landing is what gets baked into the static HTML.
  const queue = [...facetSlugs]
  const workers = Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const slug = queue.shift()
      try {
        const json = await getJson(`${API_BASE_URL}/colleges/directory/${encodeURIComponent(slug)}`, { allow404: true })
        for (const c of json?.result ?? []) {
          const s = c.slug || collegeSlug(c.name ?? c.college_name, c.id)
          if (s && safeSlug(s) && !seen.has(s)) {
            seen.add(s)
            out.push({ s })
          }
        }
      } catch (err) {
        warn(`college facet "${slug}" skipped: ${err.message}`)
      }
    }
  })
  await Promise.all(workers)
  return out
}

function requireAtLeast(name, arr, min) {
  if (arr.length < min) {
    throw new Error(
      `Manifest sanity check failed: "${name}" has ${arr.length} entries (expected ≥ ${min}). ` +
        `Refusing to build a site from a backend response that looks broken.`,
    )
  }
}

async function main() {
  log(`API: ${API_BASE_URL}`)
  // NEXT_PUBLIC_* values are inlined into the client bundles at build time. A static
  // site built against a local backend would ship localhost URLs to every visitor.
  if (/\/\/(localhost|127\.0\.0\.1)/.test(API_BASE_URL) && process.env.CF_ALLOW_LOCAL_API !== '1') {
    throw new Error(
      `NEXT_PUBLIC_API_BASE_URL points at a local backend (${API_BASE_URL}). Refusing to build a deployable static ` +
        `site against it. Set the production URLs (Vercel → Settings → Environment Variables), ` +
        `or CF_ALLOW_LOCAL_API=1 for a throwaway local build.`,
    )
  }
  // WEBSITE_ISR_SECRET (sent as the x-riseflake-internal-key header by scripts/cf/preload.cjs) is what tells
  // the backend's websiteApiHardening middleware "this is our own build, not a scraper". Without it the
  // backend's anti-scrape guard allows only 600 distinct detail URLs per 5 minutes per IP (about 100 pages a
  // minute), so a full build is throttled into retry storms and times out. This was the cause of the
  // Vercel build timeouts. Without the secret we cap how many pages a build renders (RENDER_BUDGET
  // below) instead of pretending it will work.
  if (!HAS_INTERNAL_KEY) {
    warn(
      'WEBSITE_ISR_SECRET is not set: the backend will throttle this build (600 detail URLs per 5 min per IP). ' +
        `Rendering at most ${RENDER_BUDGET || 'unlimited'} new/changed page(s) this run; the rest are picked up by the next builds. ` +
        'Set WEBSITE_ISR_SECRET (same value as the backend\'s own env var) as a Vercel environment variable ' +
        '(or GitHub Actions secret) to lift the limit — see DEPLOYMENT_GUIDE.md § One-time setup.',
    )
  }
  fs.mkdirSync(BUILD_DIR, { recursive: true })
  fs.rmSync(`${BUILD_DIR}/fetch-failures.log`, { force: true })

  // ── content that must exist ─────────────────────────────────────────────
  // Parked verticals (see src/lib/parkedVerticals.ts) are fetched as empty rather than
  // skipped outright, so every downstream calculation (budget math, manifest shape,
  // sitemap generation) sees the same "zero entries" shape it already handles for a
  // vertical with no data — no separate code path needed anywhere else in this file.
  const [jobs, internships, hiring, people] = await Promise.all([
    fromBatchedSitemap('jobs', '/jobs/'),
    fromBatchedSitemap('internships', '/internships/'),
    hiringCompanies(),
    PARKED_VERTICALS.people ? Promise.resolve([]) : fromBatchedSitemap('people', '/in/'),
  ])
  const companies = hiring.entries
  log(
    `active jobs=${jobs.length} internships=${internships.length} · companies with an active listing=${companies.length}` +
      `${hiring.fallback ? ' (FALLBACK: capped recent companies)' : ''} · people=${people.length}`,
  )

  // ── hubs & facet landings ───────────────────────────────────────────────
  const facetOf = (vertical) => (s) => REDIRECTED_SOURCES.has(`/${vertical}/browse/${s}`) || s === ''
  const [jobFacets, internshipFacets, companyFacets, collegeFacets, peopleFacets, skills] = await Promise.all([
    fromFlatSitemap('jobs-directory-sitemap.xml', '/jobs/browse/', 'jobs-facets', { skip: facetOf('jobs') }),
    fromFlatSitemap('internships-directory-sitemap.xml', '/internships/browse/', 'internships-facets', { skip: facetOf('internships') }),
    fromFlatSitemap('companies-directory-sitemap.xml', '/companies/browse/', 'companies-facets', { skip: facetOf('companies') }),
    PARKED_VERTICALS.colleges
      ? Promise.resolve([])
      : fromFlatSitemap('colleges-directory-sitemap.xml', '/colleges/browse/', 'colleges-facets', { skip: facetOf('colleges') }),
    PARKED_VERTICALS.people
      ? Promise.resolve([])
      : fromFlatSitemap('people-directory-sitemap.xml', '/in/people/', 'people-facets', { skip: (s) => s === '' || s === 'people' }),
    fromFlatSitemap('skills-directory-sitemap.xml', '/skills/', 'skills'),
  ])
  log(
    `facets: jobs=${jobFacets.length} internships=${internshipFacets.length} companies=${companyFacets.length} ` +
      `colleges=${collegeFacets.length} people=${peopleFacets.length} skills=${skills.length}`,
  )

  // ── blog & hackathons ──────────────────────────────────────────────────
  let blogs = []
  try {
    const j = await getJson(`${BLOG_API_URL}/blogs/public/slugs`)
    blogs = (j?.slugs ?? []).filter((b) => safeSlug(b.slug)).map((b) => ({ s: b.slug, ...(b.updated_at ? { m: String(b.updated_at).slice(0, 10) } : {}) }))
  } catch (err) {
    throw new Error(`blog slugs unavailable: ${err.message}`)
  }
  // Hand-written posts that ship with the site (no backend dependency).
  const { STATIC_BLOG_SITEMAP_ENTRIES } = await import(new URL('../../src/lib/staticBlogPosts.ts', import.meta.url).href)
  const haveBlog = new Set(blogs.map((b) => b.s))
  for (const e of STATIC_BLOG_SITEMAP_ENTRIES) {
    if (!haveBlog.has(e.slug)) blogs.push({ s: e.slug, ...(e.updated_at ? { m: String(e.updated_at).slice(0, 10) } : {}) })
  }

  let hackathons = []
  try {
    const j = await getJson(`${BLOG_API_URL}/hackathons?limit=500&sort=newest`)
    hackathons = (j?.hackathons ?? [])
      .filter((h) => safeSlug(h.slug))
      .map((h) => ({ s: h.slug, ...(h.updated_at ? { m: String(h.updated_at).slice(0, 10) } : {}) }))
  } catch (err) {
    throw new Error(`hackathons unavailable: ${err.message}`)
  }

  // ── sanity floors: never publish a site built from a broken backend answer ──
  // (skipped for a parked vertical — an empty list there is the intended state, not a
  // sign the backend answered badly)
  requireAtLeast('jobs', jobs, envInt('CF_MIN_JOBS', 1))
  // (not enforced for the fallback: there "few companies" means the backend is slow/behind, not that the answer is broken)
  if (!hiring.fallback) requireAtLeast('companies', companies, envInt('CF_MIN_COMPANIES', 10))
  if (!PARKED_VERTICALS.people) requireAtLeast('people', people, envInt('CF_MIN_PEOPLE', 10))
  requireAtLeast('skills', skills, envInt('CF_MIN_SKILLS', 10))
  requireAtLeast('jobs facets', jobFacets, envInt('CF_MIN_FACETS', 5))
  if (!PARKED_VERTICALS.people) requireAtLeast('people directory', peopleFacets, envInt('CF_MIN_FACETS', 5))

  // ── budget ──────────────────────────────────────────────────────────────
  // Every page costs 2 files (.html + the .txt RSC payload) except "leaf" pages
  // (job / internship / company / college / profile detail), whose .txt is dropped in
  // postbuild — links to them are plain navigations — so they cost 1 file each.
  const hubPages =
    STATIC_ROUTE_ESTIMATE + skills.length + blogs.length + hackathons.length +
    jobFacets.length + internshipFacets.length + companyFacets.length + collegeFacets.length + peopleFacets.length +
    66 /* jobs-in + internships-in city pages */ + 12 /* internship domain pages + WFH */
  const mandatoryLeaves = jobs.length + internships.length + companies.length + people.length
  const fixed = OVERHEAD + 2 * hubPages + mandatoryLeaves
  const room = MAX_FILES - SAFETY - fixed

  if (DEV_LIMIT === 0 && fixed > MAX_FILES) {
    throw new Error(
      `Over the file budget before optional pages: needs ~${fixed} files, budget is ${MAX_FILES} ` +
        `(platform limit ${PLATFORM_FILE_LIMIT}). Mandatory leaves: jobs=${jobs.length} internships=${internships.length} ` +
        `companies=${companies.length} people=${people.length}. Options: raise the plan's file limit, or trim a tier.`,
    )
  }

  // Optional tiers, in priority order, fill whatever room is left. Forced to 0 for a
  // parked vertical so the (otherwise expensive — one request per facet, or a full
  // batched sitemap fetch) crawl never runs at all rather than running and being discarded.
  const collegesWanted = PARKED_VERTICALS.colleges ? 0 : Math.max(0, Math.min(COLLEGES_MAX, Math.floor(room * 0.6)))
  const collegeCandidates =
    collegesWanted > 0 ? await collegesFromFacets(slugs(collegeFacets).slice(0, DEV_LIMIT || undefined)) : []
  const colleges = collegeCandidates.slice(0, collegesWanted)

  const peopleSet = new Set(slugs(people))
  const extraWanted = PARKED_VERTICALS.people ? 0 : Math.max(0, Math.min(EXTRA_PROFILES_MAX, room - colleges.length))
  const users =
    extraWanted > 0 ? (await fromBatchedSitemap('users', '/in/')).filter((e) => !peopleSet.has(e.s)) : []
  const extraProfiles = users.slice(0, extraWanted)

  const manifest = {
    generatedAt: new Date().toISOString(),
    api: API_BASE_URL,
    jobs: cut(jobs),
    internships: cut(internships),
    companies: cut(companies),
    colleges: cut(colleges),
    people: cut(people),
    extraProfiles: cut(extraProfiles),
    skills: cut(skills),
    blogs: cut(blogs),
    hackathons: cut(hackathons),
    facets: {
      jobs: cut(jobFacets),
      internships: cut(internshipFacets),
      companies: cut(companyFacets),
      colleges: cut(collegeFacets),
      people: cut(peopleFacets),
    },
    dropped,
  }

  const leaves =
    manifest.jobs.length + manifest.internships.length + manifest.companies.length +
    manifest.colleges.length + manifest.people.length + manifest.extraProfiles.length
  const estimate = OVERHEAD + 2 * hubPages + leaves
  manifest.budget = {
    maxFiles: MAX_FILES, platformLimit: PLATFORM_FILE_LIMIT, safety: SAFETY,
    hubPages, leafPages: leaves, estimatedFiles: estimate,
    candidates: { colleges: collegeCandidates.length, extraProfiles: users.length },
  }

  // ── incremental decision: which of these pages actually need to be (re)rendered ──────────
  // (new / changed / stale → render; unchanged → reuse from the previous deployment; over budget → deferred)
  const codeState = computeCodeState()
  const incStats = decideIncrementalBuild(manifest, codeState, { budget: RENDER_BUDGET })
  manifest.plan = incStats

  // Shrink guard. A code change (or a monthly title rollover) invalidates every previous page, and a render
  // budget smaller than the site can't rebuild all of it — publishing that would replace a full site with a
  // partial one. Better to fail the build and keep the last good deployment live.
  const kept = PAGE_KINDS.reduce((n, k) => n + listOf(manifest, k).length, 0)
  if (incStats.dropped > 0 && incStats.prevPages > 0 && process.env.CF_ALLOW_SHRINK !== '1') {
    const coverage = kept / incStats.prevPages
    if (coverage < MIN_COVERAGE) {
      throw new Error(
        `This build could only afford ${kept} of the ${incStats.prevPages} pages the live site has (${(coverage * 100).toFixed(0)}%, ` +
          `minimum ${(MIN_COVERAGE * 100).toFixed(0)}%) — the render budget is ${RENDER_BUDGET} and the code changed since the last ` +
          `deployment, so every page must be re-rendered. Not deploying a smaller site. Set WEBSITE_ISR_SECRET so the backend doesn't ` +
          `throttle the build (then there is no budget), or raise CF_RENDER_BUDGET, or set CF_ALLOW_SHRINK=1 to accept the smaller site.`,
      )
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest))
  log(
    `manifest written (${(fs.statSync(MANIFEST_PATH).size / 1024).toFixed(0)} KB) — ` +
      `hub pages ≈ ${hubPages}, leaf pages = ${leaves} ` +
      `(colleges ${manifest.colleges.length}/${collegeCandidates.length}, extra profiles ${manifest.extraProfiles.length}/${users.length}), ` +
      `estimated files ≈ ${estimate} of ${MAX_FILES}`,
  )
  if (dropped.length) warn(`${dropped.length} slug(s) dropped as unsafe for static paths (see manifest.dropped)`)
  log(
    incStats.canReuse
      ? `incremental build (buildId ${codeState.buildId} unchanged since the last deployment)`
      : `full build (buildId ${codeState.buildId}${codeState.unsafe ? ', unresolvable dynamic import — hashed whole tree' : ''}): ` +
        `no matching previous deployment to reuse`,
  )
  log(
    `plan: render ${incStats.rendered} (new ${incStats.new}, changed ${incStats.changed}, stale ${incStats.stale}), ` +
      `reuse ${incStats.reused - incStats.deferred}` +
      (incStats.deferred ? `, keep old copy of ${incStats.deferred} (over budget)` : '') +
      (incStats.dropped ? `, ${incStats.dropped} not built yet (over budget of ${RENDER_BUDGET} — next build)` : ''),
  )
  console.log(describePlan(incStats))
}

main().catch((err) => {
  console.error('[cf] manifest build FAILED:', err.message)
  process.exit(1)
})
