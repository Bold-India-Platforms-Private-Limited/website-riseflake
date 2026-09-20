/**
 * Sitemap generation for the static build.
 *
 * Replaces the old Next route handlers (src/app/sitemap-*.xml/route.ts and the
 * [...sitemap] catch-all), which proxied the backend at request time. Those cannot
 * exist in a static export — and proxying was also the wrong source of truth: the
 * backend lists every active job/company/profile, but the static site only contains
 * the pages in .build/manifest.json. Generating from the manifest guarantees that
 * every URL we advertise to search engines is a real file in the deployment.
 *
 * File names, index structure and changefreq/priority values match the previous
 * sitemaps so Search Console keeps working unchanged.
 */
import fs from 'node:fs'
import path from 'node:path'
import { SITE_ORIGIN, xmlEscape } from './lib.mjs'
const { PARKED_VERTICALS } = await import(new URL('../../src/lib/parkedVerticals.ts', import.meta.url).href)

const BATCH = 10_000 // URLs per child sitemap (protocol max is 50,000)
const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n'
const NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'

const today = () => new Date().toISOString().slice(0, 10)
const loc = (p) => `${SITE_ORIGIN}${p}`

/** Percent-encode a slug for use in a <loc> (sitemap protocol wants RFC 3986 URLs). */
const seg = (s) => encodeURI(s)

function urlBlock({ url, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${xmlEscape(url)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

const urlset = (entries) => `${XML_HEAD}<urlset xmlns="${NS}">\n${entries.map(urlBlock).join('\n')}\n</urlset>\n`
const sitemapIndex = (locs, lastmod) =>
  `${XML_HEAD}<sitemapindex xmlns="${NS}">\n` +
  locs.map((l) => `  <sitemap>\n    <loc>${xmlEscape(l)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`).join('\n') +
  `\n</sitemapindex>\n`

// ── hand-maintained static pages (verbatim from the previous sitemap-static.xml) ──
const PROGRAMMATIC_CITIES = [
  'bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai',
  'kolkata', 'ahmedabad', 'jaipur', 'surat', 'lucknow', 'kanpur',
  'nagpur', 'indore', 'bhopal', 'noida', 'gurgaon', 'chandigarh',
  'coimbatore', 'kochi', 'remote',
]
const TIER_1_CITIES = new Set(['bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'remote'])
const cityPages = (segment) =>
  PROGRAMMATIC_CITIES.map((city) => ({
    url: loc(`/${segment}/${city}`),
    changefreq: 'daily',
    priority: TIER_1_CITIES.has(city) ? '0.8' : '0.7',
  }))

const P = (p, changefreq, priority, lastmod) => ({ url: loc(p), changefreq, priority, lastmod })
const STATIC_PAGES = [
  P('/', 'daily', '1.0'),
  P('/jobs', 'hourly', '0.9'),
  P('/internships', 'hourly', '0.9'),
  P('/companies', 'daily', '0.7'),
  ...(PARKED_VERTICALS.colleges ? [] : [P('/colleges', 'weekly', '0.6')]),
  P('/about', 'monthly', '0.5'),
  P('/contact', 'monthly', '0.5'),
  P('/careers', 'monthly', '0.4'),
  P('/support', 'monthly', '0.4'),
  // Human-readable sitemap — indexable hub that links every section
  P('/sitemap', 'weekly', '0.4'),
  P('/privacy-policy', 'yearly', '0.3', '2026-01-08'),
  P('/terms-of-service', 'yearly', '0.3', '2026-01-08'),
  P('/refund-policy', 'yearly', '0.3', '2026-01-08'),
  P('/trust-and-safety', 'yearly', '0.3', '2026-01-08'),
  P('/disclaimer', 'yearly', '0.3', '2026-01-08'),
  P('/cookie-policy', 'yearly', '0.3', '2026-01-08'),
  P('/delete-account', 'monthly', '0.3'),
  P('/campus-ambassador', 'monthly', '0.5'),
  P('/network', 'daily', '0.7'),
  ...(PARKED_VERTICALS.people ? [] : [P('/in/people', 'daily', '0.7')]),
  P('/hackathons', 'daily', '0.8'),
  P('/internships/work-from-home', 'daily', '0.9'),
  // Faceted discovery hubs — individual facet URLs live in the sitemap-*-facets.xml files
  P('/internships/browse', 'daily', '0.8'),
  P('/jobs/browse', 'daily', '0.8'),
  P('/companies/browse', 'daily', '0.7'),
  ...(PARKED_VERTICALS.colleges ? [] : [P('/colleges/browse', 'weekly', '0.7')]),
  P('/skills', 'daily', '0.7'),
  P('/internships/software-development', 'daily', '0.8'),
  P('/internships/web-development', 'daily', '0.8'),
  P('/internships/marketing', 'daily', '0.8'),
  P('/internships/data-science', 'daily', '0.8'),
  P('/internships/design', 'daily', '0.8'),
  P('/internships/finance', 'daily', '0.7'),
  P('/internships/content-writing', 'daily', '0.7'),
  P('/internships/human-resources', 'daily', '0.7'),
  P('/internships/sales', 'daily', '0.7'),
  P('/internships/operations', 'daily', '0.7'),
  ...cityPages('jobs-in'),
  ...cityPages('internships-in'),
]

/** Site paths a static page in STATIC_PAGES must exist for — used by the post-build audit. */
export const STATIC_PAGE_PATHS = STATIC_PAGES.map((p) => new URL(p.url).pathname)

/**
 * @param {import('./lib.mjs').Manifest} m  parsed manifest
 * @param {string} outDir                    export directory (./out)
 * @returns {{ files: string[], urls: string[] }}  files written + every page URL advertised
 */
export function generateSitemaps(m, outDir) {
  const t = today()
  const files = []
  const urls = []
  const write = (name, body) => {
    fs.writeFileSync(path.join(outDir, name), body)
    files.push(name)
  }

  /** Emits `${base}.xml` as an index of `${base}-{N}.xml` batches; returns false if empty. */
  const batched = (base, entries) => {
    if (!entries.length) return false
    const children = []
    for (let i = 0; i < entries.length; i += BATCH) {
      const n = i / BATCH + 1
      write(`${base}-${n}.xml`, urlset(entries.slice(i, i + BATCH)))
      children.push(loc(`/${base}-${n}.xml`))
    }
    write(`${base}.xml`, sitemapIndex(children, t))
    urls.push(...entries.map((e) => e.url))
    return true
  }

  const flat = (name, entries) => {
    if (!entries.length) return false
    write(`${name}.xml`, urlset(entries))
    urls.push(...entries.map((e) => e.url))
    return true
  }

  const mapEntries = (list, prefix, changefreq, priority) =>
    list.map((e) => ({ url: loc(`${prefix}${seg(e.s)}`), lastmod: e.m ?? t, changefreq, priority }))

  const children = []
  const add = (name, ok) => ok && children.push(loc(`/${name}.xml`))

  add('sitemap-static', flat('sitemap-static', STATIC_PAGES.map((p) => ({ ...p, lastmod: p.lastmod ?? t }))))
  add(
    'sitemap-blogs',
    flat('sitemap-blogs', [
      { url: loc('/blog'), lastmod: t, changefreq: 'daily', priority: '0.8' },
      ...mapEntries(m.blogs, '/blog/', 'monthly', '0.7'),
    ]),
  )
  add('sitemap-jobs', batched('sitemap-jobs', mapEntries(m.jobs, '/jobs/', 'daily', '0.8')))
  add('sitemap-internships', batched('sitemap-internships', mapEntries(m.internships, '/internships/', 'daily', '0.8')))
  add('sitemap-jobs-facets', flat('sitemap-jobs-facets', mapEntries(m.facets.jobs, '/jobs/browse/', 'daily', '0.6')))
  add('sitemap-internships-facets', flat('sitemap-internships-facets', mapEntries(m.facets.internships, '/internships/browse/', 'daily', '0.6')))
  add('sitemap-companies', batched('sitemap-companies', mapEntries(m.companies, '/companies/', 'weekly', '0.7')))
  add('sitemap-companies-facets', flat('sitemap-companies-facets', mapEntries(m.facets.companies, '/companies/browse/', 'weekly', '0.6')))
  add('sitemap-hackathons', flat('sitemap-hackathons', mapEntries(m.hackathons, '/hackathons/', 'daily', '0.8')))
  add('sitemap-colleges', flat('sitemap-colleges', mapEntries(m.colleges, '/colleges/', 'weekly', '0.6')))
  add('sitemap-colleges-facets', flat('sitemap-colleges-facets', mapEntries(m.facets.colleges, '/colleges/browse/', 'monthly', '0.4')))
  add('sitemap-skills', flat('sitemap-skills', mapEntries(m.skills, '/skills/', undefined, undefined)))
  add('sitemap-users', batched('sitemap-users', mapEntries(m.extraProfiles, '/in/', 'weekly', '0.6')))
  add('sitemap-people', batched('sitemap-people', mapEntries(m.people, '/in/', 'weekly', '0.6')))
  add('sitemap-people-directory', flat('sitemap-people-directory', mapEntries(m.facets.people, '/in/people/', undefined, undefined)))

  write('sitemap.xml', sitemapIndex(children, t))
  return { files, urls: [...new Set(urls)] }
}
