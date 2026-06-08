import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campus Ambassador Program – Riseflake | Earn Rewards & Certificates',
  description:
    'Join the Riseflake Campus Ambassador Program. Represent Riseflake at your college, grow your network, and earn real rewards — badges, verified certificates, cash and premium gifts.',
  keywords: [
    'campus ambassador',
    'riseflake campus ambassador',
    'student program',
    'earn rewards college',
    'campus referral program',
    'certificate student program',
  ],
  openGraph: {
    title: 'Campus Ambassador Program – Riseflake',
    description: 'Represent Riseflake at your college & earn real rewards.',
    url: 'https://riseflake.com/campus-ambassador',
    siteName: 'Riseflake',
    type: 'website',
  },
}

export default function CampusAmbassadorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
