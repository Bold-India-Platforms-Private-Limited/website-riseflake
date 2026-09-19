import Link from 'next/link'

/**
 * Shown under the first page of results on the SEO landing pages (city, skill, and
 * faceted browse pages).
 *
 * These pages used to paginate on the server via `?page=N`. The site is now a static
 * export, so a server never sees the query string and only page 1 exists as HTML.
 * Rather than re-implementing paging in every landing page, we hand the visitor over to
 * the interactive listing (/jobs, /internships, /companies, /colleges), which is
 * already client-driven, filterable and paginated. Individual listings all stay
 * pre-rendered and in the sitemaps, so nothing is lost for crawlers.
 */
export default function BrowseAllCta({
  href,
  label,
  total,
  shown,
  noun,
}: {
  href: string
  label: string
  /** Total matching results. */
  total: number
  /** How many are rendered on this page. */
  shown: number
  /** Plural noun for the count line, e.g. "jobs". */
  noun: string
}) {
  if (!total || total <= shown) return null
  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
      <p className="text-sm text-slate-500">
        Showing {shown.toLocaleString('en-IN')} of {total.toLocaleString('en-IN')} {noun}
      </p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        {label} →
      </Link>
    </div>
  )
}
