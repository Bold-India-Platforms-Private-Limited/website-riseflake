export const metadata = {
  title: 'Internships | Riseflake - Find Your Next Internship',
  description: 'Browse internship opportunities with companies and growing teams. Find your next internship on Riseflake.',
  keywords: 'internships, internship search, hiring, career, employment, riseflake internships',
};
import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import InternshipsClient from './InternshipsClient';
import MobileFilters from './components/MobileFilters';
import LoginPromptModal from '../components/LoginPromptModalLoader'

export default function InternshipsPage() {
  return (
    <>
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-12 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <MobileFilters />
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Riseflake Internships</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-semibold text-slate-900">Find your next internship</h1>
            <p className="mt-2 text-slate-600">
              Opportunities with companies and growing teams.
            </p>
          </div>
          <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading internships...</div>}>
            <InternshipsClient />
          </Suspense>
          {/* Pagination is handled inside InternshipsClient, just like JobsClient */}
        </div>
      </main>

      {/* Login prompt modal — client-only, SEO safe */}
      <LoginPromptModal />
    </>
  );
}