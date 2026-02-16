export const metadata = {
  title: 'Colleges | Riseflake - Explore Educational Institutions',
  description: 'Browse and discover colleges, universities, and educational institutions. Find the right place for your academic journey on Riseflake.',
  keywords: 'colleges, universities, education, academic institutions, riseflake',
};
import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import CollegesClient from './CollegesClient';

export default function CollegesPage() {
  return (
    <>
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 py-2 bg-slate-100">
        <div className="max-w-[1200px] mx-auto">
          <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading colleges...</div>}>
            <CollegesClient />
          </Suspense>
        </div>
      </main>
    </>
  );
}
