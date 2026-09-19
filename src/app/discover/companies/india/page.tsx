import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../../../lib/config'
import { IndiaResults, IndiaSearchForm } from './IndiaDirectoryClient'

// Static export: this URL is one static page; search, state/status filters and paging run in
// the browser (see IndiaDirectoryClient). All `?q= / ?state= / ?status= / ?page=` variants
// therefore share this HTML and its canonical.
const canonicalUrl = `${WEBSITE_BASE_URL}/discover/companies/india`

export function generateMetadata(): Metadata {
  return {
    title: `India Company Registry — ${new Date().getFullYear()} Directory`,
    description:
      'Browse 3.6M+ officially registered Indian companies from MCA/ROC records — CIN, category, status, state, incorporation date, and registered address, free on Riseflake.',
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    robots: { index: true, follow: true },
  }
}

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
}

export default function IndiaCompanyDirectoryHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-50">
        {/* Heading + intro copy are static HTML (what crawlers see). Only the parts that read the
            query string are client components, each inside its own Suspense boundary — unsuspended,
            useSearchParams would push the whole page into client-side rendering. */}
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
              Browse 3.6M+ officially registered Indian companies from public MCA/ROC records — CIN,
              incorporation date, status, category, and registered address.
            </p>
            <Suspense fallback={null}>
              <IndiaSearchForm />
            </Suspense>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<p className="text-center text-slate-500 py-16">Loading companies…</p>}>
            <IndiaResults />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  )
}
