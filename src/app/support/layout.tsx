import type { Metadata } from 'next'
import { hreflangAlternates } from '../../lib/config'

export const metadata: Metadata = {
  title: 'Help & Support Center',
  description: 'Find answers to your questions about Riseflake — India\'s job portal. Get help with your account, job applications, internships, and more from our support team.',
  openGraph: {
    locale: 'en_IN',
    url: 'https://riseflake.com/support',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://riseflake.com/support', ...hreflangAlternates('https://riseflake.com/support') },
  robots: { index: true, follow: true },
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
