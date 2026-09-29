import type { Metadata } from 'next'
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config'

export const metadata: Metadata = {
  title: { default: 'Help & Support Center', template: '%s | Riseflake Jobportal' },
  description: 'Find answers to your questions about Riseflake — India\'s job portal. Get help with your account, job applications, internships, and more from our support team.',
  openGraph: {
    locale: 'en_IN',
    url: `${WEBSITE_BASE_URL}/support`,
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: `${WEBSITE_BASE_URL}/support`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/support`) },
  robots: { index: true, follow: true },
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
