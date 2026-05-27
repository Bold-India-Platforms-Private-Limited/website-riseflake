import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import dynamic from 'next/dynamic'

// UTM capture: client-only, no SSR — invisible to crawlers
const UTMCapture = dynamic(() => import('./components/UTMCapture'), { ssr: false })

export const metadata: Metadata = {
  metadataBase: new URL('https://riseflake.com'),
  title: 'Riseflake - Job Portal & Professional Networking Platform',
  description: 'A platform for job seekers and professional networking. Discover curated job opportunities, connect with industry leaders, and accelerate your career growth.',
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
    title: 'Riseflake - Job Portals & Professional Networking',
    description: 'Discover your next opportunity. Connect with companies and industry professionals on our job portal for career growth.',
    images: [
      {
        url: 'https://riseflake.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Riseflake - Job Portal & Professional Networking Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Riseflake - Job Portal for Career Growth',
    description: 'A job portal connecting professionals with career opportunities',
    site: '@riseflake',
    creator: '@riseflake',
    images: ['https://riseflake.com/api/og'],
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
  // Add Google Search Console & Bing verification tokens here once obtained
  // verification: { google: 'YOUR_TOKEN', other: { 'msvalidate.01': 'YOUR_BING_TOKEN' } },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager - must be as high in head as possible */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TQ2SSCRW');`}
        </Script>
        {/* End Google Tag Manager */}

        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <meta name="google-adsense-account" content="ca-pub-7464304182231148" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="icon" href="/favicon.ico" />
        
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
              description: 'A job portal and professional networking platform for career growth',
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
                addressCountry: 'IN',
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
                  urlTemplate: 'https://riseflake.com/jobs?position={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
    <body className="bg-gradient-subtle text-slate-900 antialiased">
  {/* Google Tag Manager (noscript) - immediately after opening body tag */}
  <noscript>
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-TQ2SSCRW"
      height="0"
      width="0"
      style={{ display: 'none', visibility: 'hidden' }}
    />
  </noscript>
  {/* End Google Tag Manager (noscript) */}
  {/* UTM attribution capture — client-only, zero SSR impact */}
  <UTMCapture />
  {children}
</body>
    </html>
  )
}
