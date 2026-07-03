import type { Metadata } from 'next'
import { hreflangAlternates } from '../../lib/config'

export const metadata: Metadata = {
  title: 'Internships in India - Find Paid & Unpaid Internships',
  description: 'Browse internships across India on Riseflake. Find software development, data science, marketing, design, finance and more internships in Bangalore, Mumbai, Delhi, Hyderabad. Ideal for college students and freshers.',
  keywords: [
    'internships in india', 'internship india', 'student internships india', 'fresher internship',
    'software development internship india', 'data science internship india',
    'marketing internship india', 'design internship india', 'finance internship india',
    'internships in bangalore', 'internships in mumbai', 'internships in delhi',
    'internships in hyderabad', 'paid internships india', 'summer internship india',
    'college internships india', 'campus internship india',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://riseflake.com/internships',
    siteName: 'Riseflake',
    title: 'Internships in India - Browse & Apply on Riseflake',
    description: 'Find internships across India for students and freshers. Filter by domain, city and stipend. Apply directly on Riseflake.',
    images: [{ url: '/og-image.webp', width: 1200, height: 630, alt: 'Internships in India - Riseflake' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Internships in India - Browse & Apply on Riseflake',
    description: 'Find paid and unpaid internships across India for students and freshers.',
    site: '@riseflake',
    images: ['/og-image.webp'],
  },
  alternates: {
    canonical: 'https://riseflake.com/internships',
    ...hreflangAlternates('https://riseflake.com/internships'),
  },
}

export default function InternshipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
