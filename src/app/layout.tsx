import './globals.css'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import ClientOnly from './components/ClientOnly'
import { hreflangAlternates, WEBSITE_BASE_URL } from '../lib/config'
import { currentYear } from '../lib/facets'

// Rendered at build time; the site rebuilds every few hours, so it rolls over to the new year on its own.
const YEAR = currentYear()
const SITE_TITLE = `Riseflake Jobportal – Internships & Jobs in India ${YEAR}`
const SITE_DESCRIPTION = `Find internships and fresher jobs in India for ${YEAR}: paid, work-from-home and summer internships for students across Bangalore, Mumbai, Delhi, Hyderabad, Pune and Chennai. Apply free on Riseflake Jobportal.`

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(WEBSITE_BASE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Riseflake Jobportal',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'riseflake jobportal', 'riseflake', 'internships in india', `internships ${YEAR}`,
    'paid internships india', 'work from home internships', 'summer internships india',
    'riseflake jobs', 'riseflake job portal',
    'job portal india', 'jobs in india', 'find jobs', 'professional networking india',
    'jobs in bangalore', 'jobs in mumbai', 'jobs in delhi', 'jobs in hyderabad', 'jobs in pune',
    'fresher jobs india', 'software engineer jobs india', 'internships india',
    'career opportunities india', 'job search india', 'hiring platform india',
    'job marketplace india', 'linkedin alternative india', 'professional development india',
    'campus placements', 'it jobs india', 'startup jobs india', 'remote jobs india',
  ],
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
    locale: 'en_IN',
    url: WEBSITE_BASE_URL,
    siteName: 'Riseflake Jobportal',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: '@riseflake',
    creator: '@riseflake',
    images: ['/og-image.webp'],
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
    canonical: WEBSITE_BASE_URL,
    ...hreflangAlternates(WEBSITE_BASE_URL),
  },
  // verification: { google: 'YOUR_TOKEN', other: { 'msvalidate.01': 'YOUR_BING_TOKEN' } },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN">
      <head>
        <Script id="gtm-platform-tag" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ platform_source: 'jobportal' });`}
        </Script>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TQ2SSCRW');`}
        </Script>

        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <meta name="google-adsense-account" content="ca-pub-7464304182231148" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* India geo targeting */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="ICBM" content="20.5937, 78.9629" />

        <link rel="icon" href="/favicon.ico" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Riseflake',
              url: WEBSITE_BASE_URL,
              logo: 'https://assets.riseflake.com/logo.webp',
              description: 'India\'s job portal and professional networking platform for career growth',
              sameAs: [
                'https://twitter.com/riseflake',
                'https://linkedin.com/company/riseflake',
                'https://instagram.com/riseflake',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'support@riseflake.com',
                areaServed: 'IN',
                availableLanguage: ['English', 'Hindi'],
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'IN',
              },
              foundingLocation: {
                '@type': 'Place',
                name: 'India',
              },
            }),
          }}
        />

        {/* Structured Data - JobPosting site search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Riseflake Jobportal',
              url: WEBSITE_BASE_URL,
              description: 'India\'s job portal and professional networking platform',
              potentialAction: [
                {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${WEBSITE_BASE_URL}/jobs?position={search_term_string}`,
                  },
                  'query-input': 'required name=search_term_string',
                },
                {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${WEBSITE_BASE_URL}/internships?position={search_term_string}`,
                  },
                  'query-input': 'required name=search_term_string',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-gradient-subtle text-slate-900 antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TQ2SSCRW"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ClientOnly />
        {children}
      </body>
    </html>
  )
}
