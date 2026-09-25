import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import FaqShell from '../FaqShell'
import { FAQ_LAST_UPDATED_LABEL, FAQ_TOPICS, faqAnchor, getFaqTopic } from '../../../lib/faqs'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'

// Static export: only the topics listed in src/lib/faqs.ts exist.
export const dynamicParams = false

type Props = { params: Promise<{ topic: string }> }

export function generateStaticParams() {
  return FAQ_TOPICS.map((t) => ({ topic: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getFaqTopic((await params).topic)
  if (!topic) return {}
  const url = `${WEBSITE_BASE_URL}/faq/${topic.slug}`
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    alternates: { canonical: url, ...hreflangAlternates(url) },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url,
      title: topic.metaTitle,
      description: topic.metaDescription,
      images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
  }
}

export default async function FaqTopicPage({ params }: Props) {
  const topic = getFaqTopic((await params).topic)
  if (!topic) notFound()

  const url = `${WEBSITE_BASE_URL}/faq/${topic.slug}`
  const others = FAQ_TOPICS.filter((t) => t.slug !== topic.slug)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    name: topic.h1,
    inLanguage: 'en-IN',
    mainEntity: topic.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      url: `${url}#${faqAnchor(f.q)}`,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${WEBSITE_BASE_URL}/faq` },
      { '@type': 'ListItem', position: 3, name: topic.label, item: url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <FaqShell
        crumbs={[{ name: 'Home', href: '/' }, { name: 'FAQ', href: '/faq' }, { name: topic.label }]}
        title={topic.h1}
        intro={topic.intro}
        activeSlug={topic.slug}
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs text-slate-500">Last updated: {FAQ_LAST_UPDATED_LABEL}</p>
          <div className="mt-2 divide-y divide-slate-100">
            {topic.faqs.map((f) => (
              <article key={f.q} id={faqAnchor(f.q)} className="scroll-mt-24 py-5">
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{f.q}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
              </article>
            ))}
          </div>
        </section>

        {topic.links.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Useful links</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {topic.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
                  >
                    {l.label} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">More RiseFlake FAQs</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {others.map((t) => (
              <li key={t.slug}>
                <Link href={`/faq/${t.slug}`} className="text-sm font-medium text-indigo-600 hover:underline">
                  {t.label} FAQs
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </FaqShell>
    </>
  )
}
