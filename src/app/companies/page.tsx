import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import CompaniesClient from './CompaniesClient'

export default function CompaniesPage() {
  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-2 bg-slate-100">
        <div className="max-w-[1200px] mx-auto">
          <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading companies...</div>}>
            <CompaniesClient />
          </Suspense>
        </div>
      </main>
    </>
  )
}
