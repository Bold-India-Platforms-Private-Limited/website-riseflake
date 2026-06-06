import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jobs in India - Find Full-Time & Part-Time Jobs | Riseflake',
  description: 'Browse thousands of jobs across India on Riseflake. Find software engineer, data analyst, product manager, marketing, finance and more jobs in Bangalore, Mumbai, Delhi, Hyderabad, Pune, Chennai. Apply now.',
  keywords: [
    'jobs in india', 'find jobs india', 'software engineer jobs india', 'it jobs india',
    'jobs in bangalore', 'jobs in mumbai', 'jobs in hyderabad', 'jobs in delhi',
    'jobs in pune', 'jobs in chennai', 'fresher jobs india', 'remote jobs india',
    'full time jobs india', 'job openings india', 'apply jobs online india',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://riseflake.com/jobs',
    siteName: 'Riseflake',
    title: 'Jobs in India - Browse & Apply on Riseflake',
    description: 'Discover thousands of job openings across India. Filter by city, role, salary and experience. Apply directly on Riseflake.',
    images: [{ url: '/og-image.webp', width: 1200, height: 630, alt: 'Jobs in India - Riseflake Job Portal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobs in India - Browse & Apply on Riseflake',
    description: 'Thousands of job openings across India. Find your next role on Riseflake.',
    site: '@riseflake',
    images: ['/og-image.webp'],
  },
  alternates: {
    canonical: 'https://riseflake.com/jobs',
  },
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
