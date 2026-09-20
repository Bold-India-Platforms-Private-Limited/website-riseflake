/**
 * Canonical redirects for faceted browse slugs whose real home is an existing
 * dedicated page.
 *
 * These used to live in next.config.js (`async redirects()`), which `output: 'export'`
 * does not support. Cloudflare Pages applies them from the generated `_redirects`
 * file instead — still real HTTP 308s at the edge, still no Worker involved.
 *
 * Kept in sync with src/lib/facets.ts (CITIES minus 'remote', INTERNSHIP_DOMAIN_SLUGS).
 */
const { PARKED_VERTICALS } = await import(new URL('../../src/lib/parkedVerticals.ts', import.meta.url).href)

const DOMAIN_INTERNSHIPS = [
  'software-development', 'web-development', 'marketing', 'data-science',
  'design', 'finance', 'content-writing', 'human-resources', 'sales', 'operations',
]

const CITIES = [
  'bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai',
  'kolkata', 'ahmedabad', 'gurgaon', 'noida', 'jaipur', 'indore',
  'chandigarh', 'coimbatore', 'kochi', 'lucknow', 'nagpur', 'bhopal',
  'surat', 'kanpur', 'visakhapatnam', 'thiruvananthapuram', 'nashik',
  'vadodara', 'mysore', 'mangalore', 'bhubaneswar', 'guwahati', 'patna',
  'dehradun', 'raipur', 'ranchi',
]

/** @type {{ source: string, destination: string, status: number }[]} */
export const FACET_REDIRECTS = [
  { source: '/internships/browse/work-from-home-internships', destination: '/internships/work-from-home', status: 308 },
  ...DOMAIN_INTERNSHIPS.map((d) => ({
    source: `/internships/browse/${d}-internships`,
    destination: `/internships/${d}`,
    status: 308,
  })),
  ...CITIES.flatMap((c) => [
    { source: `/internships/browse/internships-in-${c}`, destination: `/internships-in/${c}`, status: 308 },
    { source: `/jobs/browse/jobs-in-${c}`, destination: `/jobs-in/${c}`, status: 308 },
  ]),
  // The human-readable sitemap moved from /sitemap.html to /sitemap — Cloudflare
  // Pages serves clean URLs only, so a `.html` request can never be answered directly.
  { source: '/sitemap.html', destination: '/sitemap', status: 301 },
  // Parked verticals (src/lib/parkedVerticals.ts): only the HUB routes need an explicit
  // redirect — they're plain static pages (not gated by generateStaticParams), so without
  // this they'd keep building and serving an empty-looking page. Detail/facet sub-routes
  // (colleges/[slug], colleges/browse/[[...slug]], in/[slug], in/people/[filter]) already
  // produce zero files once their manifest list is empty, so a direct visit there is a
  // plain, honest 404 — no redirect rule needed or wanted for those.
  ...(PARKED_VERTICALS.colleges
    ? [
        { source: '/colleges', destination: '/', status: 301 },
        { source: '/colleges/browse', destination: '/', status: 301 },
      ]
    : []),
  ...(PARKED_VERTICALS.people ? [{ source: '/in/people', destination: '/', status: 301 }] : []),
]

/** Set of `/vertical/browse/slug` paths that redirect away and so must never be pre-rendered. */
export const REDIRECTED_SOURCES = new Set(FACET_REDIRECTS.map((r) => r.source))
