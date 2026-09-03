export type Faq = { question: string; answer: string }

/** FAQPage JSON-LD + a visible <section> — both from the same source list. */
export default function FaqBlock({ faqs, heading = 'Frequently asked questions' }: { faqs: Faq[]; heading?: string }) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h2 className="text-lg font-bold text-slate-900 mb-4">{heading}</h2>
      <div className="divide-y divide-slate-100">
        {faqs.map((f) => (
          <details key={f.question} className="group py-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 flex items-start justify-between gap-3">
              {f.question}
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
