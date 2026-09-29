#!/usr/bin/env node
/**
 * Post-deploy smoke test for the static site.
 *
 *   node scripts/cf/smoke.mjs <base-url> [--all] [--sample=300]
 *   npm run smoke -- https://<deployment>.vercel.app
 *
 * Reads the deployed /sitemap.xml tree, requests the pages it lists (a random sample by
 * default, every URL with --all) and checks each one is a real, indexable page:
 * HTTP 200, no Next error shell, and a canonical link pointing at riseflake.com + the same
 * path. Also checks the hand-written edge behaviour: redirects, real 404s, robots.txt.
 *
 * Only reads static files, so it costs nothing to run. Exit code 1 on any failure.
 */
import { SITE_ORIGIN, locsOf } from './lib.mjs'

const args = process.argv.slice(2)
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? '').replace(/\/+$/, '')
if (!base) {
  console.error('usage: node scripts/cf/smoke.mjs <base-url> [--all] [--sample=300]')
  process.exit(2)
}
const ALL = args.includes('--all')
const SAMPLE = Number(args.find((a) => a.startsWith('--sample='))?.split('=')[1] ?? 300)
const CONCURRENCY = 8

const fails = []
const ok = (m) => console.log(`  ✓ ${m}`)
const bad = (m) => {
  fails.push(m)
  console.log(`  ✗ ${m}`)
}

const get = (p, init) => fetch(base + p, { redirect: 'manual', ...init })
/** Sitemap <loc>s are riseflake.com URLs; request the same path on the deployment under test. */
const toPath = (u) => new URL(u).pathname + new URL(u).search

async function collectSitemapUrls() {
  const res = await get('/sitemap.xml')
  if (res.status !== 200) throw new Error(`/sitemap.xml → HTTP ${res.status}`)
  const pages = []
  for (const child of locsOf(await res.text())) {
    const r = await get(toPath(child))
    if (r.status !== 200) {
      bad(`sitemap child ${toPath(child)} → HTTP ${r.status}`)
      continue
    }
    const locs = locsOf(await r.text())
    // A child can itself be an index (jobs, companies, …) — one more level.
    if (/<sitemapindex/.test(await (await get(toPath(child))).text())) {
      for (const g of locs) {
        const gr = await get(toPath(g))
        if (gr.status === 200) pages.push(...locsOf(await gr.text()))
        else bad(`sitemap batch ${toPath(g)} → HTTP ${gr.status}`)
      }
    } else {
      pages.push(...locs)
    }
  }
  return [...new Set(pages)]
}

async function checkPage(url) {
  const p = toPath(url)
  const res = await get(p)
  if (res.status !== 200) return `${p} → HTTP ${res.status}`
  const html = await res.text()
  if (html.slice(0, 600).includes('__next_error__')) return `${p} → Next error shell served as 200 (soft 404)`
  const rawCanon = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]
  if (!rawCanon) return `${p} → no canonical link`
  // The attribute is HTML-escaped (&amp;), and the homepage canonical has no trailing slash.
  const canon = rawCanon.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
  const norm = (u) => decodeURI(u).replace(/\/$/, '')
  const want = SITE_ORIGIN + new URL(url).pathname
  // Compare decoded so `%E2%80%93` vs `–` doesn't matter.
  if (norm(canon) !== norm(want)) return `${p} → canonical is ${canon}, expected ${want}`
  return null
}

async function pool(items, worker) {
  const out = []
  let i = 0
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < items.length) {
        const item = items[i++]
        const r = await worker(item)
        if (r) out.push(r)
      }
    }),
  )
  return out
}

console.log(`Smoke test: ${base}`)

console.log('\nEdge behaviour')
{
  const r = await get('/robots.txt')
  r.status === 200 && (await r.text()).includes('Sitemap:') ? ok('/robots.txt served') : bad(`/robots.txt → HTTP ${r.status}`)

  const nf = await get('/this-page-does-not-exist-' + Date.now())
  nf.status === 404 ? ok('unknown URL → real HTTP 404') : bad(`unknown URL → HTTP ${nf.status} (expected 404)`)

  const rd = await get('/jobs/browse/jobs-in-bangalore')
  rd.status === 308 && (rd.headers.get('location') ?? '').endsWith('/jobs-in/bangalore')
    ? ok('facet redirect → 308 /jobs-in/bangalore')
    : bad(`/jobs/browse/jobs-in-bangalore → HTTP ${rd.status} ${rd.headers.get('location') ?? ''}`)

  const sm = await get('/sitemap.html')
  ;[301, 308].includes(sm.status) ? ok('/sitemap.html redirects to /sitemap') : bad(`/sitemap.html → HTTP ${sm.status}`)
}

console.log('\nSitemap coverage')
let urls = []
try {
  urls = await collectSitemapUrls()
  ok(`${urls.length} page URLs listed across the sitemap tree`)
} catch (err) {
  bad(`could not read sitemaps: ${err.message}`)
}

if (urls.length) {
  const picked = ALL || urls.length <= SAMPLE ? urls : [...urls].sort(() => Math.random() - 0.5).slice(0, SAMPLE)
  console.log(`\nChecking ${picked.length}${ALL ? ' (all)' : ` of ${urls.length}`} pages`)
  const problems = await pool(picked, checkPage)
  if (problems.length) {
    for (const p of problems.slice(0, 25)) bad(p)
    if (problems.length > 25) bad(`… and ${problems.length - 25} more`)
  } else {
    ok(`all ${picked.length} pages: 200, real page, correct canonical`)
  }
}

console.log(fails.length ? `\n${fails.length} problem(s) found.` : '\nAll smoke checks passed.')
process.exit(fails.length ? 1 : 0)
