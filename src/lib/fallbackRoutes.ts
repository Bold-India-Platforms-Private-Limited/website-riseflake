/**
 * Which URLs the browser-side 404 fallback can render.
 *
 * The site is a static export: only the pages in the build manifest exist as files, and
 * Cloudflare Pages answers every other URL with the real HTTP 404 page (404.html) — which is
 * what search engines should see. But people also follow links to pages that simply were not
 * pre-rendered: a job posted an hour ago (the site rebuilds on a schedule), one of 68,000 colleges,
 * a profile outside the SEO budget, a registry company. For those the 404 page fetches the record
 * from the public API and renders the normal page in the browser (see NotFoundFallback.tsx).
 *
 * Pure and dependency-free: it is also stringified into an inline script that runs before first
 * paint, so the 404 UI never flashes for a URL the fallback is about to render.
 */

export type FallbackRoute =
  | { kind: 'job'; slug: string }
  | { kind: 'internship'; slug: string }
  | { kind: 'company'; slug: string }
  | { kind: 'college'; slug: string }
  | { kind: 'profile'; slug: string }
  | { kind: 'india-company'; slug: string }

const SEG = '([^/]+)'

/** Order matters only for readability — the patterns are mutually exclusive. */
const ROUTES: { kind: FallbackRoute['kind']; re: RegExp }[] = [
  { kind: 'job', re: new RegExp(`^/jobs/${SEG}/?$`) },
  { kind: 'internship', re: new RegExp(`^/internships/${SEG}/?$`) },
  { kind: 'company', re: new RegExp(`^/companies/${SEG}/?$`) },
  { kind: 'college', re: new RegExp(`^/colleges/${SEG}/?$`) },
  // /in/people is a real page; /in/people/<x> has two segments and never matches this.
  { kind: 'profile', re: new RegExp(`^/in/${SEG}/?$`) },
  // /discover/companies/india/<cin>/<name> — the CIN (first segment) identifies the company.
  { kind: 'india-company', re: new RegExp(`^/discover/companies/india/${SEG}/[^/]+/?$`) },
]

// Slugs that belong to real, static hub pages and so are never fallback candidates.
const RESERVED: Record<string, Set<string>> = {
  job: new Set(['browse']),
  internship: new Set(['browse', 'work-from-home']),
  company: new Set(['browse']),
  college: new Set(['browse']),
  profile: new Set(['people']),
}

export function matchFallbackRoute(pathname: string): FallbackRoute | null {
  for (const { kind, re } of ROUTES) {
    const m = re.exec(pathname)
    if (!m) continue
    let slug = m[1]
    try {
      slug = decodeURIComponent(slug)
    } catch {
      /* keep raw */
    }
    if (RESERVED[kind]?.has(slug)) return null
    return { kind, slug } as FallbackRoute
  }
  return null
}

/** One regex source covering every fallback URL — used by the pre-paint inline script. */
export const FALLBACK_PATTERN_SOURCE = ROUTES.map((r) => r.re.source).join('|')
