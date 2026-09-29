/**
 * Shared helpers for the Cloudflare Pages static build scripts (scripts/cf/*).
 * Plain Node ESM — no dependencies.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

// Resolve NEXT_PUBLIC_* the same way `next build` does (.env files, most specific first).
// loadEnvFile never overrides a variable that is already set, so real environment
// variables (CI) and earlier files take precedence.
for (const name of ['.env.production.local', '.env.local', '.env.production', '.env']) {
  const file = path.join(ROOT, name)
  if (fs.existsSync(file)) process.loadEnvFile(file)
}
export const BUILD_DIR = path.join(ROOT, '.build')
export const MANIFEST_PATH = path.join(BUILD_DIR, 'manifest.json')
export const FAILURE_LOG = path.join(BUILD_DIR, 'fetch-failures.log')
export const OUT_DIR = path.join(ROOT, 'out')

// ── incremental-build state ─────────────────────────────────────────────────────────────────
// .cache/state.json  what the LAST successful build rendered (per page: record version, render time,
//                    asset generation) + the code fingerprint it was built from.
// .cache/site        the last deployed tree while a build is running (moved back to ./out at the end).
export const CACHE_DIR = path.join(ROOT, '.cache')
export const STATE_PATH = path.join(CACHE_DIR, 'state.json')
export const PREV_SITE_DIR = path.join(CACHE_DIR, 'site')
export const STATE_VERSION = 1

/**
 * Every manifest list that becomes files, and the rules that govern it.
 *   list     path into the manifest object      dir    output directory (…/<slug>.html)
 *   route    the Next route that renders it     leaf   drops its `.txt` RSC payload (1 file per page)
 *   entity   has a per-record `lastmod` we can compare (false = a hub whose content is derived data,
 *            so only age decides when it refreshes)
 *   maxAgeH  refresh at least this often (hours) — keeps time-derived text ("26 days left") honest and
 *            picks up changes in related data (a company's open roles, "similar" lists)
 *   guarded  rendering it fetches a `/<jobs|internships|companies|colleges|users|people|skills>/<slug>` detail
 *            URL from the backend — exactly what the backend's anti-scrape guard counts (600 distinct per
 *            5 min per IP unless the build sends WEBSITE_ISR_SECRET). Only guarded pages count against the
 *            render budget (see incremental.mjs).
 */
export const PAGE_KINDS = [
  { id: 'jobs', list: ['jobs'], dir: 'jobs', route: '/jobs/[slug]', leaf: true, entity: true, guarded: true, maxAgeH: 24 },
  { id: 'internships', list: ['internships'], dir: 'internships', route: '/internships/[slug]', leaf: true, entity: true, guarded: true, maxAgeH: 24 },
  { id: 'companies', list: ['companies'], dir: 'companies', route: '/companies/[slug]', leaf: true, entity: true, guarded: true, maxAgeH: 72 },
  { id: 'colleges', list: ['colleges'], dir: 'colleges', route: '/colleges/[slug]', leaf: true, entity: false, guarded: true, maxAgeH: 720 },
  { id: 'people', list: ['people'], dir: 'in', route: '/in/[slug]', leaf: true, entity: true, guarded: true, maxAgeH: 168 },
  { id: 'extraProfiles', list: ['extraProfiles'], dir: 'in', route: '/in/[slug]', leaf: true, entity: true, guarded: true, maxAgeH: 168 },
  { id: 'skills', list: ['skills'], dir: 'skills', route: '/skills/[slug]', leaf: false, entity: false, guarded: true, maxAgeH: 12 },
  { id: 'blogs', list: ['blogs'], dir: 'blog', route: '/blog/[slug]', leaf: false, entity: true, guarded: false, maxAgeH: 24 },
  { id: 'hackathons', list: ['hackathons'], dir: 'hackathons', route: '/hackathons/[slug]', leaf: false, entity: true, guarded: false, maxAgeH: 24 },
  { id: 'facets.jobs', list: ['facets', 'jobs'], dir: 'jobs/browse', route: '/jobs/browse/[[...slug]]', leaf: false, entity: false, guarded: false, maxAgeH: 12 },
  { id: 'facets.internships', list: ['facets', 'internships'], dir: 'internships/browse', route: '/internships/browse/[[...slug]]', leaf: false, entity: false, guarded: false, maxAgeH: 12 },
  { id: 'facets.companies', list: ['facets', 'companies'], dir: 'companies/browse', route: '/companies/browse/[[...slug]]', leaf: false, entity: false, guarded: false, maxAgeH: 24 },
  { id: 'facets.colleges', list: ['facets', 'colleges'], dir: 'colleges/browse', route: '/colleges/browse/[[...slug]]', leaf: false, entity: false, guarded: false, maxAgeH: 168 },
  { id: 'facets.people', list: ['facets', 'people'], dir: 'in/people', route: '/in/people/[filter]', leaf: false, entity: false, guarded: false, maxAgeH: 24 },
]

/**
 * When a build can only afford to render some of the pages that want rendering (CF_RENDER_BUDGET),
 * guarded kinds are served in this order: internships first (smallest, the core audience), then jobs, then the
 * companies that are hiring, then the rest.
 */
export const BUDGET_ORDER = ['internships', 'jobs', 'companies', 'skills', 'colleges', 'people', 'extraProfiles']
export const listOf = (m, kind) => kind.list.reduce((o, k) => o[k], m)
export const setList = (m, kind, v) => {
  const parent = kind.list.slice(0, -1).reduce((o, k) => o[k], m)
  parent[kind.list[kind.list.length - 1]] = v
}
export const pageKey = (kind, slug) => `${kind.dir}/${slug}`

export const sha1 = (data) => crypto.createHash('sha1').update(data).digest('hex')
/** Stable pseudo-random number in [0,1) from a string — spreads refreshes out instead of bunching them. */
export const hash01 = (s) => parseInt(sha1(s).slice(0, 8), 16) / 0x1_0000_0000

export function loadState() {
  try {
    const st = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'))
    return st && st.version === STATE_VERSION && st.pages && st.buildId ? st : null
  } catch {
    return null
  }
}

// Same value as WEBSITE_BASE_URL in src/lib/config.ts (override both with NEXT_PUBLIC_SITE_URL).
export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jobportal.riseflake.com').replace(/\/+$/, '')

/** Public website API (…/api/v2/website) and blog API (…/api/v2). */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend.riseflake.com/api/v2/website'
).replace(/\/+$/, '')
export const BLOG_API_URL = (
  process.env.NEXT_PUBLIC_BLOG_API_URL ?? 'https://backend.riseflake.com/api/v2'
).replace(/\/+$/, '')

/** Platform limit for Cloudflare Pages (free plan). */
export const PLATFORM_FILE_LIMIT = 20_000

/**
 * True when this build can identify itself to the backend as "our own site build" (the
 * x-riseflake-internal-key header, see preload.cjs) and so skips its rate limiter and anti-scrape guard.
 * Any backend — production or a local dev one — applies that guard (600 distinct detail URLs per 5 minutes
 * per IP) unless the request carries the key, so this is the only thing that lifts the render budget.
 */
export const HAS_INTERNAL_KEY = Boolean(process.env.WEBSITE_ISR_SECRET)

/**
 * Next refuses an export route with an empty generateStaticParams(), and a build legitimately has empty lists
 * (nothing new to render for a kind because every page was reused; no hackathons right now; a parked vertical).
 * src/lib/manifest.ts then returns this one stand-in slug — keep the two values identical. Its page is never
 * wanted: postbuild deletes every `<dir>/__no-pages__.{html,txt}`.
 */
export const PLACEHOLDER_SLUG = '__no-pages__'

/** Where a finished deployment publishes its own build state + page bundles for the NEXT build to reuse. */
export const BASELINE_PUBLIC_DIR = '_rf'

export const envInt = (name, fallback) => {
  const v = Number(process.env[name])
  return Number.isFinite(v) && v >= 0 && process.env[name] !== '' && process.env[name] != null ? v : fallback
}

/** Installs the hardened fetch (internal-key header, retry, concurrency cap) in THIS process. */
export function installBuildFetch() {
  createRequire(import.meta.url)('./preload.cjs')
}

const XML_ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" }
export const xmlUnescape = (s) => s.replace(/&(amp|lt|gt|quot|apos);/g, (m) => XML_ENTITIES[m])
export const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

/** All <loc> values of a sitemap document, XML-unescaped. */
export function locsOf(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => xmlUnescape(m[1]))
}

/**
 * A slug is only safe to use as a static file name AND as a URL path segment if it
 * has none of the characters that a URL parser or a static file host treats
 * specially. Anything else is dropped (and reported) rather than published broken.
 */
export function safeSlug(s) {
  if (typeof s !== 'string') return false
  if (!s || s.length > 200) return false
  if (/[/\\?#% -]/.test(s)) return false
  if (s === '.' || s === '..') return false
  return true
}

/** `/jobs/some-slug` (or a full URL) → `some-slug`, percent-decoded. null when the shape doesn't match. */
export function slugAfter(loc, prefix) {
  let p = loc
  try {
    p = new URL(loc, SITE_ORIGIN).pathname
  } catch {
    /* keep raw */
  }
  if (!p.startsWith(prefix)) return null
  let rest = p.slice(prefix.length)
  if (rest.endsWith('/')) rest = rest.slice(0, -1)
  try {
    rest = decodeURIComponent(rest)
  } catch {
    /* keep as-is */
  }
  return rest
}

export async function getText(url, { allow404 = false } = {}) {
  const res = await fetch(url)
  if (res.status === 404 && allow404) return null
  if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`)
  return res.text()
}

export async function getJson(url, { allow404 = false } = {}) {
  const text = await getText(url, { allow404 })
  return text == null ? null : JSON.parse(text)
}

export function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing ${path.relative(ROOT, MANIFEST_PATH)} — run "npm run build:manifest" first.`)
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
}

export function walkFiles(dir) {
  const out = []
  const stack = [dir]
  while (stack.length) {
    const d = stack.pop()
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) stack.push(p)
      else out.push(p)
    }
  }
  return out
}

export const log = (...a) => console.log('[cf]', ...a)
export const warn = (...a) => console.warn('[cf] WARN', ...a)
