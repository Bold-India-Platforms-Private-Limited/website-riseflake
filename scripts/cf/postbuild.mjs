#!/usr/bin/env node
/**
 * Post-build stage for the Cloudflare Pages static export (./out).
 *
 * `next build` only produces pages; this step makes the result safe to publish:
 *
 *   1. AUDIT     — a page that hit `notFound()` / `redirect()` / a backend blip while being
 *                  pre-rendered is emitted by Next as a *200* "error shell". Published as-is
 *                  that is a soft-404 for Google. Such files are deleted so Cloudflare serves
 *                  a real 404, and the build fails if there are suspiciously many (a sign
 *                  the backend was unhealthy — better to keep the last good deploy).
 *   2. TRIM      — leaf pages (job / internship / company / college / profile) don't need their
 *                  `.txt` RSC payload (links to them are plain navigations), which halves their
 *                  cost against the 20,000-file limit.
 *   3. SITEMAPS  — written from the manifest, filtered to pages that actually survived (1–2).
 *   4. EDGE FILES— `_redirects` (canonical facet redirects) and `_headers` (asset caching).
 *   5. BUDGET    — fails if the deployment exceeds the file budget; verifies every sitemap URL
 *                  resolves to a real file.
 *
 * Tunables: CF_MAX_FILES, CF_MAX_BROKEN_RATIO, CF_MAX_BROKEN_MIN, CF_MAX_FETCH_FAILURES,
 * CF_ALLOW_DEGRADED=1 (local experiments only — bypasses the failure gates).
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  FAILURE_LOG, OUT_DIR, PLATFORM_FILE_LIMIT, ROOT, envInt, log, readManifest, walkFiles, warn,
} from './lib.mjs'
import { FACET_REDIRECTS } from './redirects.mjs'
import { STATIC_PAGE_PATHS, generateSitemaps } from './sitemaps.mjs'

const MAX_FILES = Math.min(envInt('CF_MAX_FILES', 19_000), PLATFORM_FILE_LIMIT)
const MAX_BROKEN_RATIO = Number(process.env.CF_MAX_BROKEN_RATIO ?? 0.02)
const MAX_BROKEN_MIN = envInt('CF_MAX_BROKEN_MIN', 30)
const MAX_FETCH_FAILURES = envInt('CF_MAX_FETCH_FAILURES', 25)
const ALLOW_DEGRADED = process.env.CF_ALLOW_DEGRADED === '1'

const failures = []
const fail = (msg) => failures.push(msg)

if (!fs.existsSync(OUT_DIR)) {
  console.error('[cf] ./out not found — run "npm run build" first.')
  process.exit(1)
}
const manifest = readManifest()
const rel = (f) => path.relative(OUT_DIR, f).split(path.sep).join('/')
const has = (p) => fs.existsSync(path.join(OUT_DIR, p))

// ── 1. AUDIT ────────────────────────────────────────────────────────────────
const LEAVES = [
  ['jobs', 'jobs'], ['internships', 'internships'], ['companies', 'companies'],
  ['colleges', 'colleges'], ['people', 'in'], ['extraProfiles', 'in'],
]
const HUBS = [
  [(m) => m.skills, (m, v) => (m.skills = v), 'skills'],
  [(m) => m.blogs, (m, v) => (m.blogs = v), 'blog'],
  [(m) => m.hackathons, (m, v) => (m.hackathons = v), 'hackathons'],
  [(m) => m.facets.jobs, (m, v) => (m.facets.jobs = v), 'jobs/browse'],
  [(m) => m.facets.internships, (m, v) => (m.facets.internships = v), 'internships/browse'],
  [(m) => m.facets.companies, (m, v) => (m.facets.companies = v), 'companies/browse'],
  [(m) => m.facets.colleges, (m, v) => (m.facets.colleges = v), 'colleges/browse'],
  [(m) => m.facets.people, (m, v) => (m.facets.people = v), 'in/people'],
]
// Every page the manifest asked for. A page in this set with a problem is a *data* problem (a record
// vanished or the backend blipped) → drop just that page. A page NOT in it (static routes) with the same
// problem is a *code* regression → fail the build.
const manifestPaths = new Set([
  ...LEAVES.flatMap(([list, dir]) => manifest[list].map((e) => `${dir}/${e.s}.html`)),
  ...HUBS.flatMap(([get, , dir]) => get(manifest).map((e) => `${dir}/${e.s}.html`)),
])
const htmlFiles = walkFiles(OUT_DIR).filter(
  (f) => f.endsWith('.html') && !rel(f).startsWith('resume/') && !rel(f).startsWith('_next/') && rel(f) !== '404.html',
)
// Pages that legitimately have no server-rendered <h1> (their heading lives in a client component,
// exactly as on the live site today). Anything else without one has been pushed into client-side
// rendering — usually a useSearchParams() outside <Suspense> — and crawlers would get an empty shell.
const H1_EXEMPT = new Set(['companies.html', 'colleges.html'])
const noH1 = []
const removed = []
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8')
  const errorShell = html.slice(0, 600).includes('id="__next_error__"')
  const degraded = !errorShell && html.includes('data-rf-degraded="1"')
  let loadingShell = false
  if (!errorShell && !degraded) {
    const noHeading = !H1_EXEMPT.has(rel(f)) && !/<h1[\s>]/.test(html.replace(/<script\b[\s\S]*?<\/script>/g, ''))
    if (!noHeading) continue
    // notFound() inside a segment that has a loading.tsx does not produce the error shell: Next emits the
    // loading skeleton as the page's HTML. For a manifest page that means "this record didn't render".
    if (!manifestPaths.has(rel(f))) {
      noH1.push(rel(f))
      continue
    }
    loadingShell = true
  }
  removed.push({
    file: rel(f),
    reason: errorShell ? 'notFound/redirect shell' : loadingShell ? 'loading skeleton, no <h1> (notFound behind loading.tsx)' : 'degraded (backend blip)',
  })
  fs.rmSync(f, { force: true })
  fs.rmSync(f.replace(/\.html$/, '.txt'), { force: true })
}
const brokenLimit = Math.max(MAX_BROKEN_MIN, Math.ceil(htmlFiles.length * MAX_BROKEN_RATIO))
log(`audit: scanned ${htmlFiles.length} pages, removed ${removed.length} soft-404/degraded (limit ${brokenLimit})`)
if (removed.length) {
  for (const r of removed.slice(0, 15)) log(`  removed ${r.file}  [${r.reason}]`)
  if (removed.length > 15) log(`  … and ${removed.length - 15} more`)
}
if (removed.length > brokenLimit) {
  fail(
    `${removed.length} pages rendered as not-found/degraded (limit ${brokenLimit}). ` +
      `That usually means the backend was unhealthy during the build — not deploying.`,
  )
}

if (noH1.length) {
  for (const f of noH1.slice(0, 10)) warn(`no server-rendered <h1>: ${f}`)
  fail(
    `${noH1.length} page(s) have no server-rendered <h1> (client-side rendering bailout). ` +
      `Wrap the useSearchParams() consumer in <Suspense>, or add the page to H1_EXEMPT if that is intended.`,
  )
}

// ── fetch failures that survived every retry ────────────────────────────────
if (fs.existsSync(FAILURE_LOG)) {
  const lines = fs.readFileSync(FAILURE_LOG, 'utf8').split('\n').filter(Boolean)
  log(`backend requests that failed after all retries: ${lines.length} (limit ${MAX_FETCH_FAILURES})`)
  for (const l of lines.slice(0, 5)) log(`  ${l}`)
  if (lines.length > MAX_FETCH_FAILURES) {
    fail(`${lines.length} backend requests failed after retries (limit ${MAX_FETCH_FAILURES}) — see .build/fetch-failures.log`)
  }
}

// ── 2. TRIM leaf `.txt` payloads ────────────────────────────────────────────
let trimmed = 0
for (const [list, dir] of LEAVES) {
  for (const e of manifest[list]) {
    const txt = path.join(OUT_DIR, dir, `${e.s}.txt`)
    if (fs.existsSync(txt)) {
      fs.rmSync(txt)
      trimmed++
    }
  }
}
log(`trim: dropped ${trimmed} leaf .txt payloads`)

// ── 3. Keep only manifest entries whose page actually exists ────────────────
const final = JSON.parse(JSON.stringify(manifest))
let missingTotal = 0
let expectedTotal = 0
const filterExisting = (label, entries, dir) => {
  const kept = entries.filter((e) => has(`${dir}/${e.s}.html`))
  const missing = entries.length - kept.length
  expectedTotal += entries.length
  missingTotal += missing
  if (missing) warn(`${label}: ${missing}/${entries.length} manifest pages have no file (dropped from sitemaps)`)
  return kept
}
for (const [list, dir] of LEAVES) final[list] = filterExisting(list, final[list], dir)
for (const [get, set, dir] of HUBS) set(final, filterExisting(dir, get(final), dir))

const missingLimit = Math.max(MAX_BROKEN_MIN, Math.ceil(expectedTotal * MAX_BROKEN_RATIO))
if (missingTotal > missingLimit) {
  fail(
    `${missingTotal} of ${expectedTotal} manifest pages are missing from the export (limit ${missingLimit}). ` +
      `Either pages failed to render or file names do not match the manifest.`,
  )
}

// ── sitemaps from what really exists ────────────────────────────────────────
const { files: sitemapFiles, urls } = generateSitemaps(final, OUT_DIR)
const staticMissing = STATIC_PAGE_PATHS.filter((p) => !has(p === '/' ? 'index.html' : `${p.slice(1)}.html`))
if (staticMissing.length) fail(`static pages listed in the sitemap have no file: ${staticMissing.join(', ')}`)

let dangling = 0
for (const u of urls) {
  const p = decodeURI(new URL(u).pathname)
  if (!has(p === '/' ? 'index.html' : `${p.slice(1)}.html`)) {
    dangling++
    if (dangling <= 5) warn(`sitemap URL has no file: ${u}`)
  }
}
if (dangling) fail(`${dangling} sitemap URLs do not resolve to a file`)
log(`sitemaps: ${sitemapFiles.length} files, ${urls.length} page URLs`)

// ── 4. _redirects / _headers ────────────────────────────────────────────────
const redirectsPath = path.join(OUT_DIR, '_redirects')
const existingRules = fs.existsSync(redirectsPath)
  ? fs.readFileSync(redirectsPath, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  : []
const seenSources = new Set(existingRules.map((l) => l.split(/\s+/)[0]))
const generated = FACET_REDIRECTS.filter((r) => !seenSources.has(r.source)).map(
  (r) => `${r.source} ${r.destination} ${r.status}`,
)
const rules = [...existingRules, ...generated]
if (rules.length > 2000) fail(`_redirects has ${rules.length} rules; Cloudflare Pages allows 2,000 static rules`)
fs.writeFileSync(
  redirectsPath,
  `# Generated by scripts/cf/postbuild.mjs (hand-written rules live in public/_redirects)\n${rules.join('\n')}\n`,
)
log(`_redirects: ${rules.length} rules`)

// The resume builder is a separate static app in public/resume. Production served its landing page
// at `/resume` (no trailing slash); Cloudflare would 308 that to `/resume/` because it only sees a
// directory. A sibling `resume.html` restores the exact URL.
if (has('resume/index.html') && !has('resume.html')) {
  fs.copyFileSync(path.join(OUT_DIR, 'resume', 'index.html'), path.join(OUT_DIR, 'resume.html'))
  log('resume: added resume.html so /resume is served directly')
}

// Values mirror what production served before the move (Referrer-Policy etc.).
fs.writeFileSync(
  path.join(OUT_DIR, '_headers'),
  `# Generated by scripts/cf/postbuild.mjs
# Hashed build assets never change — cache them for a year.
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: same-origin
`,
)

// ── 5. BUDGET + report ──────────────────────────────────────────────────────
fs.writeFileSync(
  path.join(OUT_DIR, 'build-info.json'),
  JSON.stringify({ builtAt: new Date().toISOString(), manifestAt: manifest.generatedAt, pages: htmlFiles.length - removed.length }) + '\n',
)
fs.writeFileSync(path.join(ROOT, '.build', 'manifest.final.json'), JSON.stringify(final))

const all = walkFiles(OUT_DIR)
const bytes = all.reduce((n, f) => n + fs.statSync(f).size, 0)
const big = all.filter((f) => fs.statSync(f).size > 20 * 1024 * 1024)
log(`FILES: ${all.length} / budget ${MAX_FILES} / platform limit ${PLATFORM_FILE_LIMIT}   SIZE: ${(bytes / 1048576).toFixed(0)} MB`)
if (all.length > MAX_FILES) {
  fail(
    `${all.length} files exceeds the budget of ${MAX_FILES} (Cloudflare Pages free plan hard limit: ${PLATFORM_FILE_LIMIT}). ` +
      `Lower CF_COLLEGES_MAX / CF_EXTRA_PROFILES_MAX in scripts/cf/build-manifest.mjs, or upgrade the Pages plan.`,
  )
}
if (big.length) fail(`files over Cloudflare's 25 MiB limit: ${big.map(rel).join(', ')}`)

if (failures.length) {
  console.error('\n[cf] POST-BUILD CHECKS FAILED:')
  for (const f of failures) console.error(`  ✗ ${f}`)
  if (ALLOW_DEGRADED) {
    warn('CF_ALLOW_DEGRADED=1 — continuing despite failures (do NOT deploy this output).')
  } else {
    process.exit(1)
  }
} else {
  log('post-build checks passed ✓')
}
