import type { Metadata } from 'next'
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config'

export const metadata: Metadata = {
  title: { default: 'Careers - Join Our Team in India', template: '%s | Riseflake Jobportal' },
  description: 'Explore career opportunities at Riseflake. Join our team and help build India\'s leading job portal and professional networking platform. We\'re hiring engineers, designers, marketers and more.',
  openGraph: {
    locale: 'en_IN',
    url: `${WEBSITE_BASE_URL}/careers`,
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: `${WEBSITE_BASE_URL}/careers`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/careers`) },
  robots: { index: true, follow: true },
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
