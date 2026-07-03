import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Building2, Factory, Globe, Users, ExternalLink, ChevronRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import ShareCard from './ShareCard'
import { API_BASE_URL, WEBSITE_BASE_URL } from '../../../lib/config'

export const dynamicParams = true
export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

type CompanyDetail = {
  company_name: string
  company_logo: string | null
  organization_type: string | null
  industry_type: string | null
  website: string | null
  slug: string
  banner_logo: string | null
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

export async function generateStaticParams() {
  return []
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

  const ogImageUrl =
    `${WEBSITE_BASE_URL}/api/og?type=company` +
    `&company=${encodeURIComponent(company.company_name)}` +
    `&logo=${encodeURIComponent(company.company_logo ?? '')}` +
    (company.organization_type ? `&subtitle=${encodeURIComponent(company.organization_type)}` : '')

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
      siteName: 'Riseflake',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${company.company_name} on Riseflake` }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: { canonical: `${WEBSITE_BASE_URL}/companies/${slug}` },
  }
}

function DetailCell({
  icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  iconBg: string
  iconColor: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-slate-900 leading-snug">{value}</p>
      </div>
    </div>
  )
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

  const initials = company.company_name.slice(0, 2).toUpperCase()

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

      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-50">
        {/* Hero header */}
        <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-20 pb-0">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-violet-100/40 blur-3xl" />
          </div>

          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 pt-4" aria-label="Breadcrumb">
              <a href="/companies" className="hover:text-indigo-600 transition-colors">Companies</a>
              <ChevronRight className="h-3 w-3 opacity-40" />
              <span className="text-slate-600 font-medium">{company.company_name}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Logo */}
              <div className="flex-shrink-0 h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shadow-md">
                {company.company_logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={company.company_logo}
                    alt={`${company.company_name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-slate-600 select-none">{initials}</span>
                )}
              </div>

              {/* Name + badges */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                  {company.company_name}
                </h1>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {company.organization_type && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      <Building2 className="h-3 w-3" />
                      {company.organization_type}
                    </span>
                  )}
                  {company.industry_type && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                      <Factory className="h-3 w-3" />
                      {company.industry_type}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition-colors"
                    >
                      <Globe className="h-3 w-3" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
                <a
                  href={`https://app.riseflake.com/companies/${company.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:text-indigo-700 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors shadow-sm"
                >
                  <Globe className="h-4 w-4" />
                  View Profile
                </a>
                <a
                  href={`https://app.riseflake.com/companies/${company.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm"
                >
                  <Users className="h-4 w-4" />
                  Claim Profile
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">

            {/* Left column */}
            <div className="space-y-6">

              {/* Company details */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">Company details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailCell
                    icon={<Building2 className="h-4 w-4" />}
                    label="Organization type"
                    value={company.organization_type ?? 'Not specified'}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                  />
                  <DetailCell
                    icon={<Factory className="h-4 w-4" />}
                    label="Industry type"
                    value={company.industry_type ?? 'Not specified'}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                  />
                  {company.website && (
                    <div className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                      <div className="flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center bg-sky-50">
                        <Globe className="h-4 w-4 text-sky-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">Website</p>
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-sky-600 hover:text-sky-800 hover:underline break-all"
                        >
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* About */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">About {company.company_name}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong>{company.company_name}</strong>
                  {company.organization_type ? ` is a ${company.organization_type}` : ' is a company'}
                  {company.industry_type ? ` operating in the ${company.industry_type} sector` : ''}.
                  {' '}This profile is listed on Riseflake — India&apos;s job portal and professional networking platform.
                  {' '}Visit the platform to explore current job openings, internships, company culture, and hiring opportunities at {company.company_name}.
                </p>
                {company.website && (
                  <p className="mt-2 text-sm text-slate-500">
                    Official website:{' '}
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:underline break-all"
                    >
                      {company.website}
                    </a>
                  </p>
                )}
                <a
                  href={`https://app.riseflake.com/companies/${company.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  View full profile on Riseflake <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Right sidebar */}
            <aside className="space-y-4">
              {/* Quick actions */}
              <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Explore opportunities</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Connect with the hiring team and browse open roles at {company.company_name}.
                </p>
                <a
                  href={`https://app.riseflake.com/companies/${company.slug}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  View open jobs
                </a>
                <a
                  href={`https://app.riseflake.com/companies/${company.slug}`}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                >
                  Claim your company profile
                </a>
              </div>

              <ShareCard slug={company.slug} companyName={company.company_name} />
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
