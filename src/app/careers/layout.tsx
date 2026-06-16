import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers at Riseflake - Join Our Team in India',
  description: 'Explore career opportunities at Riseflake. Join our team and help build India\'s leading job portal and professional networking platform. We\'re hiring engineers, designers, marketers and more.',
  openGraph: {
    locale: 'en_IN',
    url: 'https://riseflake.com/careers',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://riseflake.com/careers' },
  robots: { index: true, follow: true },
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
