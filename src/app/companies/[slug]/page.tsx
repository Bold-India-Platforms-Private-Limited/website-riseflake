import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { API_BASE_URL } from '../../../lib/config'

// Enable on-demand page generation for new companies
export const dynamicParams = true
// Revalidate pages every 1 hour (3600 seconds)
export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

type CompanyDetail = {
  company_name: string
  company_logo: string | null
  organization_type: string | null
  slug: string
  banner_logo: string | null
}

type CompanyResponse = {
  status: boolean
  result: CompanyDetail
}

type CompaniesListResponse = {
  status: boolean
  result: Array<{ slug: string }>
  page: number
  totalPages: number
  hasMore: boolean
}

const COMPANIES_PAGE_SIZE = 1000

const fetchCompany = async (slug: string) => {
  const response = await fetch(`${API_BASE_URL}/companies/${slug}`, { cache: 'force-cache' })
  if (!response.ok) return null
  return (await response.json()) as CompanyResponse
}

const fetchCompaniesPage = async (page: number) => {
  const response = await fetch(
    `${API_BASE_URL}/companies?page=${page}&limit=${COMPANIES_PAGE_SIZE}`,
    { cache: 'force-cache' }
  )
  if (!response.ok) return null
  return (await response.json()) as CompaniesListResponse
}

export async function generateStaticParams() {
  try {
    const firstPage = await fetchCompaniesPage(1)
    if (!firstPage?.status || !firstPage.result?.length) return []

    const slugs = new Set<string>()
    firstPage.result
      .filter((company) => company.slug)
      .forEach((company) => slugs.add(company.slug))

    const totalPages = Math.max(firstPage.totalPages ?? 1, 1)
    for (let page = 2; page <= totalPages; page += 1) {
      const data = await fetchCompaniesPage(page)
      if (!data?.status || !data.result?.length) continue

      data.result
        .filter((company) => company.slug)
        .forEach((company) => slugs.add(company.slug))
    }

    return Array.from(slugs).map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchCompany(slug)
  const company = data?.result

  if (!company) {
    return {
      title: 'Company Profile | Riseflake',
      description: 'Explore verified company profiles on Riseflake.',
    }
  }

  return {
    title: `${company.company_name} | Riseflake`,
    description: `View company details for ${company.company_name} on Riseflake.`,
  }
}

export default async function CompanyDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const data = await fetchCompany(slug)

  if (!data?.status || !data.result) {
    notFound()
  }

  const company = data.result

  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-12 bg-slate-100">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <a href="/companies" className="hover:text-indigo-600">Companies</a>
            <span>/</span>
            <span>{company.company_name}</span>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                  {company.company_logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={company.company_logo}
                      alt={`${company.company_name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-semibold text-slate-500">
                      {company.company_name.slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">{company.company_name}</h1>
                  <p className="mt-1 text-sm text-slate-600">{company.organization_type ?? 'Organization'}</p>
                </div>
              </div>

              <a
                href="https://app.riseflake.com"
                className="inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700"
              >
                View on Riseflake
              </a>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">Company details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Organization type</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {company.organization_type ?? 'Not specified'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Company slug</p>
                    <p className="text-sm font-semibold text-slate-900">{company.slug}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">About</h2>
                <p className="text-sm text-slate-600">
                  This company profile is maintained by Riseflake. Visit the Riseflake platform to learn about current
                  openings, culture, and growth opportunities.
                </p>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick actions</h3>
              <p className="mt-2 text-sm text-slate-600">
                Explore current openings and connect with the hiring team.
              </p>
              <a
                href="https://app.riseflake.com"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#414FEA] py-3 text-sm font-semibold text-white"
              >
                Explore jobs
              </a>
            </aside>
          </section>
        </div>
      </main>
    </>
  )
}
