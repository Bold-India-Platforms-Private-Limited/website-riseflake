import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import JobsClient from './JobsClient'
import MobileFilters from './components/MobileFilters'
import LoginPromptModal from '../components/LoginPromptModalLoader'
import { WEBSITE_BASE_URL } from '../../lib/config'

export const metadata: Metadata = {
  title: 'Jobs in India — Full-time, Part-time & Contract | Riseflake',
  description:
    'Browse thousands of full-time, part-time and contract jobs across India. Filter by role, location, salary and skills. Apply free on Riseflake — India\'s job portal for students, freshers & professionals.',
  alternates: { canonical: `${WEBSITE_BASE_URL}/jobs` },
  openGraph: {
    title: 'Jobs in India | Riseflake',
    description: 'Find verified job openings across India. Filter by location, salary, experience and skills. Apply on Riseflake.',
    url: `${WEBSITE_BASE_URL}/jobs`,
    siteName: 'Riseflake',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Jobs in India | Riseflake',
    description: 'Find verified job openings across India. Filter by location, salary and skills. Apply free on Riseflake.',
  },
  keywords: 'jobs in india, job search, hiring, freshers jobs, full time jobs, part time jobs, contract jobs, riseflake, job portal india',
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${WEBSITE_BASE_URL}/jobs` },
  ],
}

export default function JobsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar bgTransparent />

      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-12 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <MobileFilters />

          {/* Page header */}
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
              <a href="/" className="hover:text-indigo-600 font-medium">Home</a>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-slate-700 font-medium">Jobs</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Riseflake Jobs</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Find your next role</h1>
            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-2xl">
              Verified job openings from companies across India — full-time, part-time and contract. Filter by role, location, salary and skills.
            </p>
          </div>

          <Suspense fallback={
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center text-slate-500 text-sm">
              Loading jobs…
            </div>
          }>
            <JobsClient />
          </Suspense>
        </div>
      </main>

      <LoginPromptModal />
    </>
  )
}
