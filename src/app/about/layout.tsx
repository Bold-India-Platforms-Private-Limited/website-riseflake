import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - India\'s Job Portal & Professional Networking Platform',
  description: 'Learn about Riseflake — India\'s job portal and professional networking platform helping students, freshers and professionals find their next career opportunity. Our mission is to connect talent with opportunity across India.',
  openGraph: {
    locale: 'en_IN',
    url: 'https://riseflake.com/about',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://riseflake.com/about' },
  robots: { index: true, follow: true },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
