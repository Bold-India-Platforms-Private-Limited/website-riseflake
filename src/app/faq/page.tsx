import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import FaqShell from './FaqShell'
import { FAQ_TOPICS, faqAnchor } from '../../lib/faqs'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../lib/config'

const URL = `${WEBSITE_BASE_URL}/faq`
const TITLE = 'FAQ — Job Portal, Networking & Hiring Help'
const DESCRIPTION =
  'Answers to common questions about RiseFlake: finding verified jobs and internships, professional networking, free job posting and employer branding, the College Operating System, and account privacy.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL, ...hreflangAlternates(URL) },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

// The hub only links to questions; FAQPage markup lives on each topic page so no question is
// marked up twice.
const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${URL}#page`,
  url: URL,
  name: 'RiseFlake FAQ',
  description: DESCRIPTION,
  inLanguage: 'en-IN',
  hasPart: FAQ_TOPICS.map((t) => ({
    '@type': 'FAQPage',
    '@id': `${URL}/${t.slug}#faq`,
    url: `${URL}/${t.slug}`,
    name: t.h1,
  })),
}
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: URL },
  ],
}

export default function FaqHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <FaqShell
        crumbs={[{ name: 'Home', href: '/' }, { name: 'FAQ' }]}
        title="RiseFlake FAQ — Help for Job Seekers, Employers & Colleges"
        intro="RiseFlake is an Indian job portal and professional networking platform with thousands of verified jobs and internships, free job posting and employer branding for companies, and a College Operating System for placement cells. Pick a topic below to find your answer."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQ_TOPICS.map((t) => (
            <section key={t.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                <Link href={`/faq/${t.slug}`} className="hover:text-indigo-600">{t.label}</Link>
              </h2>
              <p className="mt-1 text-sm text-slate-500">{t.faqs.length} questions</p>
              <ul className="mt-3 flex-1 space-y-2">
                {t.faqs.slice(0, 3).map((f) => (
                  <li key={f.q}>
                    <Link href={`/faq/${t.slug}#${faqAnchor(f.q)}`} className="text-sm text-slate-700 hover:text-indigo-600 hover:underline">
                      {f.q}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/faq/${t.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
              >
                All {t.label} FAQs <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </section>
          ))}
        </div>
      </FaqShell>
    </>
  )
}
