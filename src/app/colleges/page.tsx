import type { Metadata } from 'next';
import { Suspense } from 'react';
import { hreflangAlternates } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Top Colleges & Universities in India',
  description: 'Browse top colleges, universities, and educational institutions across India on Riseflake. Explore IITs, NITs, IIMs, engineering, management and arts colleges. Discover campus placement records and hiring partners.',
  keywords: [
    'colleges in india', 'universities in india', 'top colleges india', 'iit', 'nit', 'iim',
    'engineering colleges india', 'management colleges india', 'campus placements india',
    'college placement records', 'riseflake colleges',
  ],
  openGraph: {
    locale: 'en_IN',
    url: 'https://riseflake.com/colleges',
    title: 'Top Colleges & Universities in India | Riseflake',
    description: 'Explore top colleges and universities across India with placement records and hiring partners.',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://riseflake.com/colleges', ...hreflangAlternates('https://riseflake.com/colleges') },
  robots: { index: true, follow: true },
};
import Navbar from '../components/Navbar';
import CollegesClient from './CollegesClient';
import LoginPromptModal from '../components/LoginPromptModalLoader'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://riseflake.com' },
    { '@type': 'ListItem', position: 2, name: 'Colleges', item: 'https://riseflake.com/colleges' },
  ],
};

export default function CollegesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-12 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading colleges...</div>}>
            <CollegesClient />
          </Suspense>
        </div>
      </main>

      {/* Login prompt modal — client-only, SEO safe */}
      <LoginPromptModal />
    </>
  );
}
