import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help & Support Center | Riseflake',
  description: 'Find answers to your questions about Riseflake — India\'s job portal. Get help with your account, job applications, internships, and more from our support team.',
  openGraph: {
    locale: 'en_IN',
    url: 'https://riseflake.com/support',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://riseflake.com/support' },
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
