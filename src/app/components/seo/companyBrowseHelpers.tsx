import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CompanyBrowseHub, CompanyBrowseFacet } from './CompanyBrowseView'
import { fetchCompanyDirectory, fetchCompanyLanding } from '../../../lib/companyBrowseData'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import {
  buildCompanyTitle, buildCompanyDescription, buildCompanyKeywords,
  currentMonthYear, currentYear,
  type CompanyFacetKind, type CompanyFacetLabels,
} from '../../../lib/companyFacets'

type Params = { slug?: string[] }
type SearchParams = { [k: string]: string | string[] | undefined }

const MAX_INDEXED_PAGE = 20

function parsePage(sp: SearchParams): number {
  const raw = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const n = parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? Math.min(n, 100) : 1
}

export async function buildCompanyBrowseMetadata(params: Params, searchParams: SearchParams): Promise<Metadata> {
  const slugArr = params.slug ?? []

  if (slugArr.length === 0) {
    const url = `${WEBSITE_BASE_URL}/companies/browse`
    const title = `Browse Companies in India ${currentYear()} — By Industry, Size & Hiring`
    const description = `Explore verified companies on Riseflake by industry, type, size, and the roles & cities they are hiring in. Updated ${currentMonthYear()}.`
    return {
      title, description,
      alternates: { canonical: url, ...hreflangAlternates(url) },
      openGraph: { title, description, url, siteName: 'Riseflake', type: 'website' },
      twitter: { card: 'summary', title, description },
      robots: { index: true, follow: true },
    }
  }
  if (slugArr.length > 1) return { title: 'Companies', robots: { index: false, follow: false } }

  const slug = slugArr[0]
  const page = parsePage(searchParams)
  const landing = await fetchCompanyLanding(slug, page)
  if (!landing || landing.status === false) {
    return { title: 'Companies', robots: { index: false, follow: false } }
  }

  const kind = landing.kind as CompanyFacetKind
  const labels = (landing.labels ?? {}) as CompanyFacetLabels
  const count = landing.count ?? landing.total
  const cleanUrl = `${WEBSITE_BASE_URL}/companies/browse/${slug}`
  const canonical = page > 1 ? `${cleanUrl}?page=${page}` : cleanUrl
  const title = buildCompanyTitle(kind, labels, page, count)
  const description = buildCompanyDescription(kind, labels, count)
  const indexable = (count ?? 0) >= 3 && page <= MAX_INDEXED_PAGE

  return {
    title, description,
    keywords: buildCompanyKeywords(kind, labels),
    alternates: { canonical, ...hreflangAlternates(canonical) },
    openGraph: { title, description, url: canonical, siteName: 'Riseflake', type: 'website' },
    twitter: { card: 'summary', title, description },
    robots: { index: indexable, follow: true },
  }
}

export async function renderCompanyBrowsePage(params: Params, searchParams: SearchParams) {
  const slugArr = params.slug ?? []

  if (slugArr.length === 0) {
    const directory = await fetchCompanyDirectory()
    if (!directory || directory.status === false) notFound()
    return <CompanyBrowseHub directory={directory} />
  }
  if (slugArr.length > 1) notFound()

  const slug = slugArr[0]
  const page = parsePage(searchParams)
  const landing = await fetchCompanyLanding(slug, page)
  if (!landing || landing.status === false) notFound()
  if (!landing.result || (landing.result.length === 0 && page > 1)) notFound()

  return <CompanyBrowseFacet slug={slug} page={page} landing={landing} />
}

export async function companyBrowseStaticParams(): Promise<{ slug: string[] }[]> {
  const dir = await fetchCompanyDirectory()
  if (!dir) return []
  const slugs = [
    ...dir.hiring, ...dir.industries, ...dir.org_types, ...dir.sizes,
    ...dir.hiring_roles, ...dir.hiring_cities, ...dir.combos.slice(0, 30),
  ].map((t) => t.slug).filter(Boolean).slice(0, 120)
  return slugs.map((s) => ({ slug: [s] }))
}
