import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import CompaniesClient from './CompaniesClient'
import LoginPromptModal from '../components/LoginPromptModalLoader'
import { hreflangAlternates, OG_FALLBACK_IMAGE } from '../../lib/config'

export const metadata: Metadata = {
  title: 'Top Companies Hiring',
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
    title: 'Top Companies Hiring | Riseflake Jobportal',
    description:
      'Discover top employers on Riseflake. Browse verified company profiles and explore open positions across India.',
    url: 'https://jobportal.riseflake.com/companies',
    siteName: 'Riseflake Jobportal',
    images: [{ url: OG_FALLBACK_IMAGE, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Companies Hiring | Riseflake Jobportal',
    description: 'Browse verified company profiles and explore open positions across India.',
    images: [OG_FALLBACK_IMAGE],
  },
  alternates: { canonical: 'https://jobportal.riseflake.com/companies', ...hreflangAlternates('https://jobportal.riseflake.com/companies') },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobportal.riseflake.com' },
    { '@type': 'ListItem', position: 2, name: 'Companies', item: 'https://jobportal.riseflake.com/companies' },
  ],
}

export default function CompaniesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar bgTransparent />
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
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
