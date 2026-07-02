import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campus Ambassador Program – Riseflake | Earn ₹15,000/Month & Rewards',
  description:
    'Join the Riseflake Campus Ambassador Program. Represent Riseflake at your college, grow your network, and earn up to ₹15,000 per month — plus your official CA ID Card, verified certificates and premium gifts.',
  keywords: [
    'campus ambassador',
    'riseflake campus ambassador',
    'student program',
    'earn rewards college',
    'campus referral program',
    'certificate student program',
    'earn money as a student',
    'campus ambassador ID card',
  ],
  openGraph: {
    title: 'Campus Ambassador Program – Riseflake',
    description: 'Represent Riseflake at your college & earn real rewards.',
    url: 'https://riseflake.com/campus-ambassador',
    siteName: 'Riseflake',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function CampusAmbassadorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
