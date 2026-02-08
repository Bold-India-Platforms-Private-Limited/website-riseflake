import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

type PaginationProps = {
  currentPage: number
  totalPages: number
  baseQuery: URLSearchParams
}

const getPageNumbers = (current: number, total: number) => {
  const delta = 2
  const range = []
  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)

  for (let i = start; i <= end; i += 1) {
    range.push(i)
  }

  return range
}

export default function Pagination({ currentPage, totalPages, baseQuery }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  const buildHref = (page: number) => {
    const query = new URLSearchParams(baseQuery)
    query.set('page', String(page))
    return `/companies?${query.toString()}`
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 && (
        <a
          href={buildHref(currentPage - 1)}
          aria-label="Previous page"
          className="h-9 w-9 rounded-full border border-slate-200 text-sm text-slate-600 flex items-center justify-center hover:border-indigo-300 hover:text-indigo-700"
        >
          <FiChevronLeft className="h-4 w-4" />
        </a>
      )}

      {pages.map((page) => (
        <a
          key={page}
          href={buildHref(page)}
          className={`h-9 w-9 rounded-full text-sm font-semibold flex items-center justify-center ${
            page === currentPage
              ? 'bg-[#414FEA] text-white'
              : 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
          }`}
        >
          {page}
        </a>
      ))}

      {currentPage < totalPages && (
        <a
          href={buildHref(currentPage + 1)}
          aria-label="Next page"
          className="h-9 w-9 rounded-full border border-slate-200 text-sm text-slate-600 flex items-center justify-center hover:border-indigo-300 hover:text-indigo-700"
        >
          <FiChevronRight className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}
