import fs from 'node:fs'
import path from 'node:path'

/**
 * Build manifest reader — server/build-time only (never import from a client component).
 *
 * The site is a static export on Cloudflare Pages, so every dynamic route must list
 * the exact params it wants pre-rendered (`dynamicParams = false`). Those lists come
 * from `.build/manifest.json`, written by `npm run build:manifest`
 * (scripts/cf/build-manifest.mjs), which also applies the 20,000-file deployment budget
 * and feeds the sitemaps — so a URL is either a real file AND in the sitemap, or neither.
 */

type Entry = { s: string; m?: string; /** render this page in THIS build (incremental builds only) */ r?: 1 }

export type Manifest = {
  generatedAt: string
  /**
   * Incremental build: `generateStaticParams()` returns only entries flagged `r` (new / changed / due for a
   * refresh / affected by a code change). Every other page is reused as-is from the previous deployment —
   * see scripts/cf/build-manifest.mjs for the rules.
   */
  incremental: boolean
  jobs: Entry[]
  internships: Entry[]
  companies: Entry[]
  colleges: Entry[]
  people: Entry[]
  extraProfiles: Entry[]
  skills: Entry[]
  blogs: Entry[]
  hackathons: Entry[]
  facets: {
    jobs: Entry[]
    internships: Entry[]
    companies: Entry[]
    colleges: Entry[]
    people: Entry[]
  }
}

const EMPTY: Manifest = {
  generatedAt: '',
  incremental: false,
  jobs: [], internships: [], companies: [], colleges: [], people: [], extraProfiles: [],
  skills: [], blogs: [], hackathons: [],
  facets: { jobs: [], internships: [], companies: [], colleges: [], people: [] },
}

let cached: Manifest | null = null

export function getManifest(): Manifest {
  if (cached) return cached
  const file = path.join(process.cwd(), '.build', 'manifest.json')
  if (!fs.existsSync(file)) {
    // `next dev` should still boot without a manifest (routes just have no
    // pre-rendered params). A production build must never proceed without one.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing .build/manifest.json — run "npm run build:manifest" (or "npm run build") first.')
    }
    return EMPTY
  }
  cached = JSON.parse(fs.readFileSync(file, 'utf8')) as Manifest
  return cached
}

/**
 * Next refuses `output: 'export'` for a dynamic route whose generateStaticParams() is empty
 * ("is missing generateStaticParams()"). A perfectly normal build can have an empty list
 * (e.g. no hackathons right now), so an empty list yields ONE placeholder param instead.
 * That page renders as a not-found shell (or, under a loading.tsx, a skeleton), which
 * scripts/cf/postbuild.mjs deletes on sight — so it never ships, and the route simply has no pages.
 * (An INCREMENTAL build hits this constantly: when every page of a kind is reused there is nothing to render.)
 */
const PLACEHOLDER = '__no-pages__' // keep identical to PLACEHOLDER_SLUG in scripts/cf/lib.mjs
/** True for the stand-in param above — a route's data fetch should skip the backend call for it. */
export const isPlaceholderSlug = (slug: string): boolean => slug === PLACEHOLDER
const slugs = (...lists: Entry[][]): string[] => {
  const incremental = getManifest().incremental
  const all = [...new Set(lists.flatMap((l) => l.filter((e) => !incremental || e.r).map((e) => e.s)))]
  return all.length ? all : [PLACEHOLDER]
}

export const jobSlugs = () => slugs(getManifest().jobs)
export const internshipSlugs = () => slugs(getManifest().internships)
export const companySlugs = () => slugs(getManifest().companies)
export const collegeSlugs = () => slugs(getManifest().colleges)
/** Curated (indexable) profiles first, then the budget-permitting extras. */
export const profileSlugs = () => slugs(getManifest().people, getManifest().extraProfiles)
export const skillSlugs = () => slugs(getManifest().skills)
export const blogSlugs = () => slugs(getManifest().blogs)
export const hackathonSlugs = () => slugs(getManifest().hackathons)
export const facetSlugs = (kind: keyof Manifest['facets']) => slugs(getManifest().facets[kind])
