import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { BrowseHub, BrowseFacet } from './BrowseView'
import { fetchDirectory, fetchLanding, type Vertical } from '../../../lib/browseData'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import {
  buildFacetTitle, buildFacetDescription, buildFacetKeywords,
  currentMonthYear, currentYear, INTERNSHIP_DOMAIN_SLUGS,
  type FacetKind, type FacetLabels,
} from '../../../lib/facets'

type Params = { slug?: string[] }
type SearchParams = { [k: string]: string | string[] | undefined }

const MAX_INDEXED_PAGE = 20

function parsePage(sp: SearchParams): number {
  const raw = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const n = parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? Math.min(n, 100) : 1
}

// ── generateMetadata ──────────────────────────────────────────────────────

export async function buildBrowseMetadata(
  vertical: Vertical,
  params: Params,
  searchParams: SearchParams,
): Promise<Metadata> {
  const slugArr = params.slug ?? []
  const label = vertical === 'internships' ? 'Internships' : 'Jobs'

  if (slugArr.length === 0) {
    const url = `${WEBSITE_BASE_URL}/${vertical}/browse`
    const title = `Browse ${label} in India ${currentYear()} — By Role, City, Company & Salary | Riseflake`
    const description = `Explore verified ${label.toLowerCase()} on Riseflake by role, city, company, ${vertical === 'internships' ? 'stipend' : 'salary'}, month and workplace type. Updated ${currentMonthYear()}. Free to apply.`
    return {
      title, description,
      alternates: { canonical: url, ...hreflangAlternates(url) },
      openGraph: { title, description, url, siteName: 'Riseflake', type: 'website' },
      twitter: { card: 'summary', title, description },
      robots: { index: true, follow: true },
    }
  }

  if (slugArr.length > 1) return { title: `${label} | Riseflake`, robots: { index: false, follow: false } }

  const slug = slugArr[0]
  const page = parsePage(searchParams)
  const landing = await fetchLanding(vertical, slug, page)

  if (!landing || landing.status === false) {
    return { title: `${label} | Riseflake`, robots: { index: false, follow: false } }
  }
  // Redirect here (in generateMetadata, before the page body streams behind the
  // /internships loading.tsx boundary) so crawlers get a real HTTP 308.
  if (landing.redirectPath) permanentRedirect(landing.redirectPath)

  const v = vertical === 'internships' ? 'internship' : 'job'
  const kind = landing.kind as FacetKind
  const labels = (landing.labels ?? {}) as FacetLabels
  const count = landing.count ?? landing.total
  const cleanUrl = `${WEBSITE_BASE_URL}/${vertical}/browse/${slug}`
  const canonical = page > 1 ? `${cleanUrl}?page=${page}` : cleanUrl

  const title = buildFacetTitle(v, kind, labels, page, count)
  const description = buildFacetDescription(v, kind, labels, count)
  const indexable = (count ?? 0) >= 3 && page <= MAX_INDEXED_PAGE

  return {
    title,
    description,
    keywords: buildFacetKeywords(v, kind, labels),
    alternates: { canonical, ...hreflangAlternates(canonical) },
    openGraph: { title, description, url: canonical, siteName: 'Riseflake', type: 'website' },
    twitter: { card: 'summary', title, description },
    robots: { index: indexable, follow: true },
  }
}

// ── page body ─────────────────────────────────────────────────────────────

export async function renderBrowsePage(
  vertical: Vertical,
  params: Params,
  searchParams: SearchParams,
) {
  const slugArr = params.slug ?? []

  if (slugArr.length === 0) {
    const directory = await fetchDirectory(vertical)
    if (!directory || directory.status === false) notFound()
    return <BrowseHub vertical={vertical} directory={directory} />
  }
  if (slugArr.length > 1) notFound()

  const slug = slugArr[0]
  const page = parsePage(searchParams)
  const landing = await fetchLanding(vertical, slug, page)

  if (!landing || landing.status === false) notFound()
  if (landing.redirectPath) permanentRedirect(landing.redirectPath)
  if (!landing.result || (landing.result.length === 0 && page > 1)) notFound()

  return <BrowseFacet vertical={vertical} slug={slug} page={page} landing={landing} />
}

// ── generateStaticParams — top slugs by inventory ─────────────────────────

export async function browseStaticParams(vertical: Vertical): Promise<{ slug: string[] }[]> {
  const dir = await fetchDirectory(vertical)
  if (!dir) return []
  const isInt = vertical === 'internships'
  const slugs = [
    ...dir.roles, ...dir.combos, ...dir.workplace_types,
    ...dir.employment_types, ...dir.stipend_buckets, ...dir.companies.slice(0, 20),
  ]
    .map((t) => t.slug)
    .filter(Boolean)
    // Drop slugs that 308-redirect (internship DOMAIN_MAP roles, WFH, bare cities)
    // — no point prerendering a redirect.
    .filter((s) => {
      if (isInt && s === 'work-from-home-internships') return false
      if (isInt && INTERNSHIP_DOMAIN_SLUGS.has(s.replace(/-internships$/, ''))) return false
      if (new RegExp(`^${vertical}-in-[a-z-]+$`).test(s) && !/-\d{4}$/.test(s)) return false
      return true
    })
    .slice(0, 120)
  return slugs.map((s) => ({ slug: [s] }))
}
