import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CompanyDetailView, { type CompanyDetail } from './CompanyDetailView'
import type { SeoListingItem } from '../../components/seo/SeoListingCard'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates, OG_FALLBACK_IMAGE } from '../../../lib/config'
import { companySlugs } from '../../../lib/manifest'

export const dynamicParams = false

type PageProps = {
  params: Promise<{ slug: string }>
}

type CompanyResponse = {
  status: boolean
  result: CompanyDetail
}

const fetchCompany = async (slug: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/companies/${slug}`, {
      next: { revalidate: 3600 },
    })
    if (response.status === 404) return null
    if (response.status === 410) return { gone: true } as const
    if (!response.ok) {
      console.error(`[companies] fetch failed for "${slug}": HTTP ${response.status}`)
      return null
    }
    return (await response.json()) as CompanyResponse
  } catch (err) {
    console.error(`[companies] fetch error for "${slug}":`, err)
    return null
  }
}

async function fetchCompanyJobs(companyName: string): Promise<{ jobs: SeoListingItem[]; total: number }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/jobs?company_name=${encodeURIComponent(companyName)}&limit=6`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8_000) },
    )
    if (!res.ok) return { jobs: [], total: 0 }
    const data = await res.json()
    return { jobs: data.result ?? [], total: data.total ?? (data.result?.length ?? 0) }
  } catch {
    return { jobs: [], total: 0 }
  }
}

export async function generateStaticParams() {
  return companySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchCompany(slug)
  const company = data && 'result' in data ? data.result : undefined

  if (!company) {
    return {
      title: 'Company Not Found',
      description: 'This company profile could not be found on Riseflake.',
      robots: { index: false, follow: false },
    }
  }

  const title = `${company.company_name} — Jobs, Profile & Culture`
  const description = [
    `Explore ${company.company_name} on Riseflake.`,
    company.organization_type && `A ${company.organization_type}`,
    company.industry_type && `in the ${company.industry_type} sector.`,
    'View open roles, company culture, and connect with the hiring team.',
  ]
    .filter(Boolean)
    .join(' ')

  const ogImageUrl = OG_FALLBACK_IMAGE

  return {
    title,
    description,
    keywords: [
      `${company.company_name} jobs`,
      `${company.company_name} careers`,
      `${company.company_name} hiring`,
      company.industry_type ?? '',
      company.organization_type ?? '',
      'company profile riseflake',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `${WEBSITE_BASE_URL}/companies/${slug}`,
      siteName: 'Riseflake Jobportal',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${company.company_name} on Riseflake` }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: { canonical: `${WEBSITE_BASE_URL}/companies/${slug}`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/companies/${slug}`) },
  }
}

export default async function CompanyDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const data = await fetchCompany(slug)

  const companyData = data && 'result' in data ? data : null

  if (!companyData?.status || !companyData.result) {
    notFound()
  }

  const company = companyData.result
  const canonicalUrl = `${WEBSITE_BASE_URL}/companies/${company.slug}`
  const { jobs: companyJobs, total: companyJobsTotal } = await fetchCompanyJobs(company.company_name)

  const orgSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: company.company_name,
    url: canonicalUrl,
    ...(company.company_logo ? { logo: company.company_logo } : {}),
    ...(company.website ? { sameAs: [company.website, `https://app.riseflake.com/companies/${company.slug}`] } : { sameAs: [`https://app.riseflake.com/companies/${company.slug}`] }),
    description: [
      company.organization_type && `${company.organization_type}`,
      company.industry_type && `operating in ${company.industry_type}`,
    ]
      .filter(Boolean)
      .join(', '),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Companies', item: `${WEBSITE_BASE_URL}/companies` },
      { '@type': 'ListItem', position: 3, name: company.company_name, item: canonicalUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <CompanyDetailView company={company} companyJobs={companyJobs} companyJobsTotal={companyJobsTotal} />
    </>
  )
}
