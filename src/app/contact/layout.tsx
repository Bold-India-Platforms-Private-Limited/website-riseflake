import type { Metadata } from 'next'
import { hreflangAlternates } from '../../lib/config'

export const metadata: Metadata = {
  title: 'Contact Us - Support, Partnerships & Inquiries',
  description: 'Get in touch with the Riseflake team for support, business partnerships, or general inquiries. We\'re here to help job seekers and employers across India.',
  openGraph: {
    locale: 'en_IN',
    url: 'https://riseflake.com/contact',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://riseflake.com/contact', ...hreflangAlternates('https://riseflake.com/contact') },
  robots: { index: true, follow: true },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
