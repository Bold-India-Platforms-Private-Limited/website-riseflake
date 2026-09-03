import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import InternshipsClient from './InternshipsClient'
import MobileFilters from './components/MobileFilters'
import LoginPromptModal from '../components/LoginPromptModalLoader'
import { hreflangAlternates } from '../../lib/config'
import { currentPeriod } from '../../lib/period'

export function generateMetadata(): Metadata {
  const { monthYear } = currentPeriod()
  return {
    title: `Internships in India ${monthYear} — Find Verified Internships`,
    description: `Browse 1000s of internship opportunities across India (updated ${monthYear}). Filter by location, domain, and stipend. Apply directly on Riseflake.`,
    keywords: 'internships, internship search, internship in India, paid internships, work from home internship, summer internship, IT internship, MBA internship, engineering internship, riseflake',
    alternates: {
      canonical: 'https://riseflake.com/internships',
      ...hreflangAlternates('https://riseflake.com/internships'),
    },
    openGraph: {
      type: 'website',
      url: 'https://riseflake.com/internships',
      siteName: 'Riseflake',
      title: `Internships in India ${monthYear} | Riseflake`,
      description: 'Browse verified internship opportunities across India. Filter by location, domain, and stipend on Riseflake.',
      images: [{ url: 'https://riseflake.com/og-image.webp', width: 1200, height: 630, alt: 'Riseflake Internships' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Internships in India ${monthYear} | Riseflake`,
      description: 'Browse verified internship opportunities across India on Riseflake.',
      site: '@riseflake',
      creator: '@riseflake',
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://riseflake.com' },
    { '@type': 'ListItem', position: 2, name: 'Internships', item: 'https://riseflake.com/internships' },
  ],
}

export default function InternshipsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-12 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 font-medium">Internships</span>
          </nav>

          <MobileFilters />

          <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Riseflake Internships</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-semibold text-slate-900">Find your next internship</h1>
            <p className="mt-2 text-slate-600">
              Verified internship opportunities across India — filter by location, domain, stipend & more.
            </p>
          </div>

          <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading internships...</div>}>
            <InternshipsClient />
          </Suspense>
        </div>
      </main>

      <LoginPromptModal />
    </>
  )
}
