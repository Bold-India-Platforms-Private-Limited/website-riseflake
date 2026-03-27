export const metadata = {
  title: 'Companies | Riseflake - Discover Employers',
  description: 'Connect with companies, discover their profiles, and explore open positions. Find your employer on Riseflake.',
  keywords: 'companies, employers, company profiles, hiring, riseflake',
};
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import CompaniesClient from './CompaniesClient'

export default function CompaniesPage() {
  return (
    <>
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-12 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading companies...</div>}>
            <CompaniesClient />
          </Suspense>
        </div>
      </main>
    </>
  )
}
