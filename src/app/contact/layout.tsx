import type { Metadata } from 'next'
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config'

export const metadata: Metadata = {
  title: { default: 'Contact Us - Support, Partnerships & Inquiries', template: '%s | Riseflake Jobportal' },
  description: 'Get in touch with the Riseflake team for support, business partnerships, or general inquiries. We\'re here to help job seekers and employers across India.',
  openGraph: {
    locale: 'en_IN',
    url: `${WEBSITE_BASE_URL}/contact`,
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: `${WEBSITE_BASE_URL}/contact`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/contact`) },
  robots: { index: true, follow: true },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
