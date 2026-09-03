import Link from 'next/link'
import { ArrowRight, Building2 } from 'lucide-react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import CompanyCard from './CompanyCard'
import CrawlablePagination from './CrawlablePagination'
import FacetChips from './FacetChips'
import FaqBlock from './FaqJsonLd'
import { WEBSITE_BASE_URL } from '../../../lib/config'
import {
  buildCompanyH1, buildCompanyFaq, companyPhraseLower, companyTrackingParams, currentMonthYear,
  type CompanyFacetKind, type CompanyFacetLabels,
} from '../../../lib/companyFacets'
import type { CompanyDirectoryIndex, CompanyLanding } from '../../../lib/companyBrowseData'

const HUB = '/companies/browse'

function Shell({ crumbTail, children }: { crumbTail: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-16 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            {crumbTail}
          </nav>
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
const Sep = () => <span aria-hidden="true">/</span>

export function CompanyBrowseHub({ directory }: { directory: CompanyDirectoryIndex }) {
  const hubUrl = `${WEBSITE_BASE_URL}${HUB}`
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Companies', item: `${WEBSITE_BASE_URL}/companies` },
      { '@type': 'ListItem', position: 3, name: 'Browse', item: hubUrl },
    ],
  }
  const faqs = [
    {
      question: 'How is the Riseflake company directory organised?',
      answer: `You can browse companies by industry, organisation type, size, whether they are hiring now, the roles they are hiring for, and the cities they are hiring in — plus role-in-city combinations. Updated ${currentMonthYear()}.`,
    },
    {
      question: 'Does the directory only show companies that are hiring?',
      answer: 'No — it lists all verified company profiles. The "hiring" sections are filtered to companies with at least one open job right now.',
    },
  ]
  return (
    <Shell
      crumbTail={
        <>
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <Sep />
          <Link href="/companies" className="hover:text-indigo-600">Companies</Link>
          <Sep />
          <span className="text-slate-700 font-medium">Browse</span>
        </>
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Riseflake Companies</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Browse Companies in India</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Explore verified companies on Riseflake — by industry, type, size, and the roles &amp; cities
          they are hiring in. Updated {currentMonthYear()}.
        </p>
      </div>
      <FacetChips title="Companies hiring now" chips={directory.hiring} hrefBase={HUB} />
      <FacetChips title="Companies by industry" chips={directory.industries} hrefBase={HUB} seeAllHref="/companies" />
      <FacetChips title="Companies by type" chips={directory.org_types} hrefBase={HUB} />
      <FacetChips title="Companies by size" chips={directory.sizes} hrefBase={HUB} />
      <FacetChips title="Companies hiring by role" chips={directory.hiring_roles} hrefBase={HUB} />
      <FacetChips title="Companies hiring by city" chips={directory.hiring_cities} hrefBase={HUB} />
      <FacetChips title="Companies hiring — role + city" chips={directory.combos} hrefBase={HUB} />
      <FaqBlock faqs={faqs} />
    </Shell>
  )
}

export function CompanyBrowseFacet({ slug, page, landing }: { slug: string; page: number; landing: CompanyLanding }) {
  const kind = landing.kind as CompanyFacetKind
  const labels = (landing.labels ?? {}) as CompanyFacetLabels
  const companies = landing.result ?? []
  const total = landing.total ?? landing.count ?? companies.length
  const totalPages = landing.totalPages ?? 1
  const related = landing.related
  const cleanPath = `${HUB}/${slug}`
  const canonicalUrl = `${WEBSITE_BASE_URL}${cleanPath}${page > 1 ? `?page=${page}` : ''}`
  const h1 = buildCompanyH1(kind, labels)
  // grammatical lower-case phrase for mid-sentence use
  const phrase = companyPhraseLower(kind, labels)
  const faqs = buildCompanyFaq(kind, labels, landing.count)
  const tracking = companyTrackingParams(slug)
  const now = new Date().toISOString()

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Companies', item: `${WEBSITE_BASE_URL}/companies` },
      { '@type': 'ListItem', position: 3, name: 'Browse', item: `${WEBSITE_BASE_URL}${HUB}` },
      { '@type': 'ListItem', position: 4, name: h1, item: `${WEBSITE_BASE_URL}${cleanPath}` },
    ],
  }
  const collection = companies.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${h1} — Riseflake`,
    description: `${total.toLocaleString('en-IN')} ${phrase} on Riseflake, updated ${currentMonthYear()}.`,
    url: canonicalUrl,
    datePublished: now,
    dateModified: now,
    isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: WEBSITE_BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total,
      itemListElement: companies.slice(0, 25).map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${WEBSITE_BASE_URL}/companies/${c.slug}`,
        name: c.company_name,
      })),
    },
  } : null

  return (
    <Shell
      crumbTail={
        <>
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <Sep />
          <Link href="/companies" className="hover:text-indigo-600">Companies</Link>
          <Sep />
          <Link href={HUB} className="hover:text-indigo-600">Browse</Link>
          <Sep />
          <span className="text-slate-700 font-medium">{h1}</span>
        </>
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {collection && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />}

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {h1}
          {page > 1 && <span className="text-slate-400 font-normal"> — Page {page}</span>}
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          {total.toLocaleString('en-IN')} {phrase} on Riseflake, updated {currentMonthYear()}. Open any
          company for its profile, industry, size and current openings.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 text-sm">No {phrase} to show right now.</p>
          <Link href="/companies" className="mt-4 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline font-medium">
            Browse all companies <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => <CompanyCard key={c.slug} company={c} trackingSuffix={tracking} />)}
        </div>
      )}

      <CrawlablePagination basePath={cleanPath} currentPage={page} totalPages={totalPages} />

      {related && (
        <>
          {related.combos.length > 0 && (
            <FacetChips title="Related company searches" chips={related.combos} hrefBase={HUB} />
          )}
          <FacetChips title="Companies by industry" chips={related.industries} hrefBase={HUB} seeAllHref="/companies/browse" />
          <FacetChips title="Companies hiring by role" chips={related.hiring_roles} hrefBase={HUB} />
          <FacetChips title="Companies hiring by city" chips={related.hiring_cities} hrefBase={HUB} />
        </>
      )}

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-3">{h1} on Riseflake</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Riseflake is India&rsquo;s job and internship platform. This page lists verified {phrase},
          refreshed continuously. Each company page shows the real name, industry, size and current
          openings — open one to explore roles and apply free.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link href="/companies" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
            All companies <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/companies/browse" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
            Browse all company filters <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/jobs/browse" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
            Browse jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <FaqBlock faqs={faqs} />
    </Shell>
  )
}
