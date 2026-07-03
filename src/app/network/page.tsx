import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { WEBSITE_BASE_URL } from '../../lib/config'

export const revalidate = 3600

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Professional Network',
  description:
    'Discover students, freshers, and early-career professionals on Riseflake — India\'s professional network. Browse profiles by name, company, or college.',
  keywords: [
    'professional network India',
    'student profiles',
    'fresher network',
    'early career professionals',
    'Riseflake network',
    'find professionals India',
    'college student network',
  ],
  openGraph: {
    title: 'Professional Network | Riseflake',
    description:
      'Discover students, freshers, and early-career professionals on Riseflake — India\'s professional network.',
    url: `${WEBSITE_BASE_URL}/network`,
    siteName: 'Riseflake',
    images: [{ url: `${WEBSITE_BASE_URL}/api/og`, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Network | Riseflake',
    description: 'Discover professionals on Riseflake — India\'s student & early-career network.',
    images: [`${WEBSITE_BASE_URL}/api/og`],
  },
  alternates: { canonical: `${WEBSITE_BASE_URL}/network` },
  robots: { index: true, follow: true },
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Professional Network | Riseflake',
  description:
    'Discover students, freshers, and early-career professionals on Riseflake — India\'s professional network.',
  url: `${WEBSITE_BASE_URL}/network`,
  isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: 'https://riseflake.com' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NetworkPage() {
  return (
    <>
      <Navbar bgTransparent />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-slate-50 pt-20">

        {/* Hero */}
        <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-violet-100/50 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-4">
              Professional Network
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Discover Professionals on Riseflake
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Connect with students, freshers, and early-career professionals across India.
              Browse profiles, discover talent, and grow your network.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.riseflake.com/network"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
              >
                Browse all profiles
              </a>
              <a
                href="https://app.riseflake.com/register"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Create your profile
              </a>
            </div>
          </div>
        </section>

        {/* Why join */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Why join Riseflake&apos;s Professional Network?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '🔍',
                title: 'Get Discovered',
                body: 'Your profile appears on Google search results — recruiters and connections find you by name, headline, or company.',
              },
              {
                icon: '🤝',
                title: 'Build Connections',
                body: 'Connect with peers, seniors, and professionals across colleges, companies, and cities.',
              },
              {
                icon: '🚀',
                title: 'Grow Your Career',
                body: 'Discover jobs, internships, and mentors. Get noticed by top companies hiring on Riseflake.',
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO text block — helps Google understand the page intent */}
        <section className="max-w-3xl mx-auto px-4 pb-16 text-center text-sm text-slate-400 leading-relaxed">
          <p>
            Riseflake is India&apos;s professional network for students and early-career professionals.
            Create a public profile to appear on Google, connect with peers, and get discovered
            by recruiters. Browse individual profiles at{' '}
            <Link href="https://riseflake.com/in" className="underline underline-offset-2 hover:text-slate-600">
              riseflake.com/in/[username]
            </Link>
            .
          </p>
        </section>

      </main>
    </>
  )
}
