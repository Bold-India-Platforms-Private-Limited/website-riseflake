import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FAQ_TOPICS } from '../../lib/faqs'

type Crumb = { name: string; href?: string }

/** Page frame shared by /faq and /faq/[topic]: navbar, breadcrumb, header, topic sidebar, footer. */
export default function FaqShell({
  crumbs,
  title,
  intro,
  activeSlug,
  children,
}: {
  crumbs: Crumb[]
  title: string
  intro: string
  activeSlug?: string
  children: ReactNode
}) {
  return (
    <>
      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-100 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <header className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10">
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              {crumbs.map((c, i) => (
                <span key={c.name} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={12} className="text-slate-400" aria-hidden="true" />}
                  {c.href ? (
                    <Link href={c.href} className="font-medium hover:text-indigo-600">{c.name}</Link>
                  ) : (
                    <span className="font-semibold text-indigo-600" aria-current="page">{c.name}</span>
                  )}
                </span>
              ))}
            </nav>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-600 sm:text-base">{intro}</p>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
            <div className="min-w-0">{children}</div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">FAQ topics</h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/faq"
                    className={`block rounded-lg px-3 py-2 text-sm ${!activeSlug ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    All FAQs
                  </Link>
                </li>
                {FAQ_TOPICS.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/faq/${t.slug}`}
                      aria-current={activeSlug === t.slug ? 'page' : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm ${activeSlug === t.slug ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                Still need help? Email{' '}
                <a href="mailto:support@riseflake.com" className="font-medium text-indigo-600 hover:underline">support@riseflake.com</a>{' '}
                or visit <Link href="/support" className="font-medium text-indigo-600 hover:underline">Support</Link>.
              </p>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
