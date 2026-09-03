import Link from 'next/link'

/**
 * Server-rendered, crawlable pagination — real <a href> links with rel=prev/next
 * so Googlebot / LinkedInBot can follow past page 1. Mirrors the blog pattern.
 * Never links past `totalPages` or an absurd depth.
 */
export default function CrawlablePagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string
  currentPage: number
  totalPages: number
}) {
  if (totalPages <= 1) return null
  const maxPage = Math.min(totalPages, 100)
  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`)

  // window of page numbers around the current page
  const nums: number[] = []
  const from = Math.max(1, currentPage - 2)
  const to = Math.min(maxPage, currentPage + 2)
  for (let i = from; i <= to; i++) nums.push(i)

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap justify-center items-center gap-2">
      {currentPage > 1 && (
        <Link
          href={href(currentPage - 1)}
          rel="prev"
          className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          ← Previous
        </Link>
      )}

      {from > 1 && (
        <>
          <Link href={href(1)} className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-indigo-300">1</Link>
          {from > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}

      {nums.map((n) => (
        <Link
          key={n}
          href={href(n)}
          aria-current={n === currentPage ? 'page' : undefined}
          className={`h-9 min-w-9 px-2 flex items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
            n === currentPage
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {n}
        </Link>
      ))}

      {to < maxPage && (
        <>
          {to < maxPage - 1 && <span className="px-1 text-slate-400">…</span>}
          <Link href={href(maxPage)} className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:border-indigo-300">{maxPage}</Link>
        </>
      )}

      {currentPage < maxPage && (
        <Link
          href={href(currentPage + 1)}
          rel="next"
          className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          Next →
        </Link>
      )}

      <span className="w-full text-center text-xs text-slate-400 mt-1">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  )
}
