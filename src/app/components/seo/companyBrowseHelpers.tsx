import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CompanyBrowseHub, CompanyBrowseFacet } from './CompanyBrowseView'
import { fetchCompanyDirectory, fetchCompanyLanding } from '../../../lib/companyBrowseData'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import { facetSlugs } from '../../../lib/manifest'
import {
  buildCompanyTitle, buildCompanyDescription, buildCompanyKeywords,
  currentMonthYear, currentYear,
  type CompanyFacetKind, type CompanyFacetLabels,
} from '../../../lib/companyFacets'

type Params = { slug?: string[] }

// Static export: only page 1 of each landing is pre-rendered (see BrowseAllCta).
const PAGE = 1

export async function buildCompanyBrowseMetadata(params: Params): Promise<Metadata> {
  const slugArr = params.slug ?? []

  if (slugArr.length === 0) {
    const url = `${WEBSITE_BASE_URL}/companies/browse`
    const title = `Browse Companies in India ${currentYear()} — By Industry, Size & Hiring`
    const description = `Explore verified companies on Riseflake by industry, type, size, and the roles & cities they are hiring in. Updated ${currentMonthYear()}.`
    return {
      title, description,
      alternates: { canonical: url, ...hreflangAlternates(url) },
      openGraph: { title, description, url, siteName: 'Riseflake Jobportal', type: 'website' },
      twitter: { card: 'summary', title, description },
      robots: { index: true, follow: true },
    }
  }
  if (slugArr.length > 1) return { title: 'Companies', robots: { index: false, follow: false } }

  const slug = slugArr[0]
  const landing = await fetchCompanyLanding(slug, PAGE)
  if (!landing || landing.status === false) {
    return { title: 'Companies', robots: { index: false, follow: false } }
  }

  const kind = landing.kind as CompanyFacetKind
  const labels = (landing.labels ?? {}) as CompanyFacetLabels
  const count = landing.count ?? landing.total
  const cleanUrl = `${WEBSITE_BASE_URL}/companies/browse/${slug}`
  const canonical = cleanUrl
  const title = buildCompanyTitle(kind, labels, PAGE, count)
  const description = buildCompanyDescription(kind, labels, count)
  const indexable = (count ?? 0) >= 3

  return {
    title, description,
    keywords: buildCompanyKeywords(kind, labels),
    alternates: { canonical, ...hreflangAlternates(canonical) },
    openGraph: { title, description, url: canonical, siteName: 'Riseflake Jobportal', type: 'website' },
    twitter: { card: 'summary', title, description },
    robots: { index: indexable, follow: true },
  }
}

export async function renderCompanyBrowsePage(params: Params) {
  const slugArr = params.slug ?? []

  if (slugArr.length === 0) {
    const directory = await fetchCompanyDirectory()
    if (!directory || directory.status === false) notFound()
    return <CompanyBrowseHub directory={directory} />
  }
  if (slugArr.length > 1) notFound()

  const slug = slugArr[0]
  const landing = await fetchCompanyLanding(slug, PAGE)
  if (!landing || landing.status === false) notFound()
  if (!landing.result) notFound()

  return <CompanyBrowseFacet slug={slug} page={PAGE} landing={landing} />
}

export function companyBrowseStaticParams(): { slug: string[] }[] {
  return [{ slug: [] }, ...facetSlugs('companies').map((s) => ({ slug: [s] }))]
}
