import type { Metadata } from 'next'
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config'

export const metadata: Metadata = {
  title: { default: 'About Us - India\'s Job Portal & Professional Networking Platform', template: '%s | Riseflake Jobportal' },
  description: 'Learn about Riseflake — India\'s job portal and professional networking platform helping students, freshers and professionals find their next career opportunity. Our mission is to connect talent with opportunity across India.',
  openGraph: {
    locale: 'en_IN',
    url: `${WEBSITE_BASE_URL}/about`,
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: `${WEBSITE_BASE_URL}/about`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/about`) },
  robots: { index: true, follow: true },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
