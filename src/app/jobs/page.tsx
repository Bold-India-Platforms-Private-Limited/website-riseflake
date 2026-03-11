export const metadata = {
  title: 'Jobs | Riseflake - Find Your Next Role',
  description: 'Browse job opportunities with companies and growing teams. Find your next role on Riseflake.',
  keywords: 'jobs, job search, hiring, career, employment, riseflake jobs',
};
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import JobsClient from './JobsClient'
import MobileFilters from './components/MobileFilters'

export default function JobsPage() {
  return (
    <>
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 py-2 bg-slate-100">
        <div className="max-w-[1200px] mx-auto">
          <MobileFilters />
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Riseflake Jobs</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-semibold text-slate-900">Find your next role</h1>
            <p className="mt-2 text-slate-600">
              Opportunities with companies and growing teams.
            </p>
          </div>

          <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading jobs...</div>}>
            <JobsClient />
          </Suspense>

          {/* Pagination full width below all content */}
          <div className="w-full max-w-[1200px] mx-auto mt-8">
            {/* Pagination will be rendered here, see JobsClient for data/props */}
          </div>
        </div>
      </main>
    </>
  )
}
