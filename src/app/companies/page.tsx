import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import CompaniesClient from './CompaniesClient'
import LoginPromptModal from '../components/LoginPromptModalLoader'

export const metadata: Metadata = {
  title: 'Top Companies Hiring | Riseflake',
  description:
    'Browse verified company profiles on Riseflake. Discover startups, enterprises, and top employers across India — explore their culture, open roles, and hiring teams.',
  keywords: [
    'companies hiring in India',
    'top employers',
    'company profiles',
    'startups hiring',
    'enterprise jobs',
    'riseflake companies',
  ],
  openGraph: {
    title: 'Top Companies Hiring | Riseflake',
    description:
      'Discover top employers on Riseflake. Browse verified company profiles and explore open positions across India.',
    url: 'https://riseflake.com/companies',
    siteName: 'Riseflake',
    images: [{ url: 'https://riseflake.com/api/og', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Companies Hiring | Riseflake',
    description: 'Browse verified company profiles and explore open positions across India.',
    images: ['https://riseflake.com/api/og'],
  },
  alternates: { canonical: 'https://riseflake.com/companies' },
}

export default function CompaniesPage() {
  return (
    <>
      <Navbar bgTransparent />
      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-violet-100/50 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-4">
              Company Directory
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Discover Where You&apos;ll<br className="hidden sm:block" /> Do Your Best Work
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
              Explore verified employer profiles — from fast-growing startups to industry-leading enterprises across India.
            </p>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                Loading companies…
              </div>
            }
          >
            <CompaniesClient />
          </Suspense>
        </div>
      </main>

      <LoginPromptModal />
    </>
  )
}
