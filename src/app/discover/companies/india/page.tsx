import type { Metadata } from 'next'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import IndiaCompanyCard from '../../../components/seo/IndiaCompanyCard'
import CrawlablePagination from '../../../components/seo/CrawlablePagination'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../../../lib/config'
import {
  fetchIndiaCompanyList,
  fetchIndiaCompanyFacets,
  fetchIndiaCompanyCount,
} from '../../../../lib/indiaCompanyDirectory'

export const revalidate = 3600

const PAGE_SIZE = 24
const MAX_INDEXED_PAGE = 20

type SearchParams = { [k: string]: string | string[] | undefined }

function firstParam(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

function titleCase(v: string): string {
  return v.replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseSearch(searchParams: SearchParams) {
  const page = Math.max(parseInt(firstParam(searchParams.page) || '1', 10) || 1, 1)
  const state = firstParam(searchParams.state)?.trim() || undefined
  const status = firstParam(searchParams.status)?.trim() || undefined
  const q = firstParam(searchParams.q)?.trim().slice(0, 80) || undefined
  return { page, state, status, q }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const { page, state, status, q } = parseSearch(await searchParams)
  const qs = new URLSearchParams()
  if (state) qs.set('state', state)
  if (status) qs.set('status', status)
  if (page > 1) qs.set('page', String(page))
  const qsStr = qs.toString()
  const canonicalUrl = `${WEBSITE_BASE_URL}/discover/companies/india${qsStr ? `?${qsStr}` : ''}`

  const parts = ['India Company Registry']
  if (state) parts.push(`in ${titleCase(state)}`)
  if (status) parts.push(`(${titleCase(status)})`)
  const title = `${parts.join(' ')} — ${new Date().getFullYear()} Directory`
  const description = q
    ? `Search "${q}" across 3.6M+ registered Indian companies (MCA/ROC data) — CIN, incorporation date, status, address, and more, free on Riseflake.`
    : `Browse 3.6M+ officially registered Indian companies from MCA/ROC records — CIN, category, status, state, incorporation date, and registered address, free on Riseflake.`

  // Free-text search result pages create unbounded thin variants — never index those.
  // Plain state/status filters (bounded, finite set) are indexable within the page cap.
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    robots: { index: !q && page <= MAX_INDEXED_PAGE, follow: true },
  }
}

export default async function IndiaCompanyDirectoryHub({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { page, state, status, q } = await parseSearch(await searchParams)

  const [list, facets, total] = await Promise.all([
    fetchIndiaCompanyList({ page, limit: PAGE_SIZE, state, status, q }),
    fetchIndiaCompanyFacets(),
    fetchIndiaCompanyCount({ state, status, q }),
  ])

  const companies = list?.result ?? []
  const totalCount = total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const canonicalUrl = `${WEBSITE_BASE_URL}/discover/companies/india`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Discover', item: `${WEBSITE_BASE_URL}/discover` },
      { '@type': 'ListItem', position: 3, name: 'India Company Registry', item: canonicalUrl },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'India Company Registry — Riseflake Discover',
    description: 'Browse officially registered Indian companies from MCA/ROC records.',
    url: canonicalUrl,
    isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: WEBSITE_BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalCount,
      itemListElement: companies.slice(0, 25).map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${WEBSITE_BASE_URL}/discover/companies/india/${encodeURIComponent(c.cin)}/${c.name_slug}`,
        name: c.company_name,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-24 pb-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
          </div>
          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4" aria-label="Breadcrumb">
              <a href="/" className="hover:text-indigo-600 transition-colors">Home</a>
              <span>/</span>
              <span className="text-slate-600 font-medium">Discover · India Company Registry</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              India Company Registry
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl">
              Browse {totalCount.toLocaleString('en-IN')} officially registered Indian companies from public
              MCA/ROC records — CIN, incorporation date, status, category, and registered address.
            </p>

            <form action="/discover/companies/india" method="get" className="mt-6 flex flex-wrap gap-2 max-w-2xl">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search company name…"
                className="flex-1 min-w-[200px] rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <select
                name="state"
                defaultValue={state || ''}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
              >
                <option value="">All states</option>
                {(facets?.result.states ?? []).map((s) => (
                  <option key={s.value} value={s.value}>
                    {titleCase(s.value)} ({s.count.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
              <select
                name="status"
                defaultValue={status || ''}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
              >
                <option value="">All statuses</option>
                {(facets?.result.statuses ?? []).slice(0, 15).map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.value} ({s.count.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {companies.length === 0 ? (
            <p className="text-center text-slate-500 py-16">No companies matched your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((c) => (
                <IndiaCompanyCard key={c.cin} company={c} />
              ))}
            </div>
          )}

          <CrawlablePagination
            basePath="/discover/companies/india"
            currentPage={page}
            totalPages={totalPages}
            extraParams={{ state, status, q }}
          />
        </div>
      </main>

      <Footer />
    </>
  )
}
