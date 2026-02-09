import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://riseflake.com'),
  title: 'Riseflake - #1 Job Portal & Professional Networking Platform 2024-2026',
  description: 'The fastest growing job portal and professional networking platform. Discover curated job opportunities, connect with industry leaders, and accelerate your career growth. Join 50K+ professionals today.',
  keywords: 'job portal, professional networking, career growth, find jobs, job search, hiring platform, job marketplace, LinkedIn alternative, career opportunities, professional development',
  authors: [{ name: 'Riseflake Team' }],
  creator: 'Riseflake',
  publisher: 'Riseflake',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://riseflake.com',
    siteName: 'Riseflake - Job Portal & Professional Networking',
    title: 'Riseflake - The Future of Job Portals & Professional Networking',
    description: 'Discover your next opportunity. Connect with top companies and industry professionals on the #1 job portal for career growth.',
    images: [
      {
        url: 'https://riseflake.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Riseflake - Job Portal & Professional Networking Platform',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Riseflake - #1 Job Portal for Career Growth',
    description: 'The fastest growing job portal connecting professionals with dream companies',
    site: '@riseflake',
    creator: '@riseflake',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://riseflake.com',
  },
  verification: {
    google: 'your-google-site-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="canonical" href="https://riseflake.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Riseflake',
              url: 'https://riseflake.com',
              logo: 'https://riseflake.com/logo.png',
              description: 'The leading job portal and professional networking platform for career growth',
              aggregateRating: {
                '@type': 'AggregateRating',
                bestRating: 5,
                worstRating: 1,
                ratingValue: 4.8,
                ratingCount: 5000,
              },
              sameAs: [
                'https://twitter.com/riseflake',
                'https://linkedin.com/company/riseflake',
                'https://github.com/riseflake',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'support@riseflake.com',
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'US',
              },
            }),
          }}
        />

        {/* Structured Data - Job Portal */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'JobPortal',
              name: 'Riseflake',
              url: 'https://riseflake.com',
              description: 'Job portal and professional networking platform with AI-powered recommendations',
              image: 'https://riseflake.com/og-image.png',
            }),
          }}
        />

        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Riseflake',
              url: 'https://riseflake.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://app.riseflake.com/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
    <body className="bg-gradient-subtle text-slate-900 antialiased">
  {children}

  {/* Google Analytics – Global */}
  <Script
    src="https://www.googletagmanager.com/gtag/js?id=G-E3TXB0F389"
    strategy="afterInteractive"
  />
  <Script id="ga-init" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-E3TXB0F389', {
        anonymize_ip: true,
      });
    `}
  </Script>
</body>
    </html>
  )
}
