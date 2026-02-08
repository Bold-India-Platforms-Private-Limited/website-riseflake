'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  baseQuery: URLSearchParams
}

const getPageNumbers = (current: number, total: number, maxPages: number) => {
  if (total <= 0) return []
  if (total <= maxPages) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const half = Math.floor(maxPages / 2)
  let start = Math.max(current - half, 1)
  let end = start + maxPages - 1

  if (end > total) {
    end = total
    start = Math.max(end - maxPages + 1, 1)
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

const getLimitOptions = (totalItems: number, currentLimit: number) => {
  const baseOptions = [10, 20, 30, 40, 50, 100]
  const maxLimit = totalItems > 0 ? Math.min(totalItems, 100) : 20
  const options = new Set<number>()

  baseOptions.forEach((value) => {
    if (value <= maxLimit) options.add(value)
  })

  if (totalItems > 0) {
    options.add(maxLimit)
  }

  options.add(Math.min(currentLimit, 100))

  return Array.from(options).sort((a, b) => a - b)
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  baseQuery,
}: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [jumpValue, setJumpValue] = useState(String(currentPage))
  const [maxPages, setMaxPages] = useState(6)

  useEffect(() => {
    setJumpValue(String(currentPage))
  }, [currentPage])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateMaxPages = () => setMaxPages(mediaQuery.matches ? 4 : 6)
    updateMaxPages()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMaxPages)
      return () => mediaQuery.removeEventListener('change', updateMaxPages)
    }

    mediaQuery.addListener(updateMaxPages)
    return () => mediaQuery.removeListener(updateMaxPages)
  }, [])

  const pages = useMemo(
    () => getPageNumbers(currentPage, totalPages, maxPages),
    [currentPage, totalPages, maxPages]
  )
  const limitOptions = useMemo(() => getLimitOptions(totalItems, pageSize), [totalItems, pageSize])

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems)

  const pushQuery = (nextPage: number, nextLimit = pageSize) => {
    const query = new URLSearchParams(baseQuery)
    query.set('page', String(nextPage))
    query.set('limit', String(nextLimit))
    router.push(`${pathname}?${query.toString()}`)
  }

  const handleJumpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = Number.parseInt(jumpValue, 10)
    if (Number.isNaN(parsed) || parsed <= 0) return

    const nextPage = Math.min(parsed, totalPages)
    setJumpValue(String(nextPage))
    pushQuery(nextPage)
  }

  if (totalItems <= 0) return null

  return (
    <div className="mt-8 max-w-[1200px] mr-auto ml-auto rounded-2xl border border-none bg-none px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="hidden items-center text-sm font-medium text-slate-600 md:flex">
          {start} - {end} / {totalItems}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 md:flex-1">
          <button
            type="button"
            onClick={() => pushQuery(1)}
            disabled={currentPage === 1}
            aria-label="First page"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronsLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => pushQuery(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => pushQuery(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-semibold ${
                page === currentPage
                  ? 'border-[#414FEA] bg-[#0B2C6D] text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => pushQuery(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => pushQuery(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronsRight className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden flex-wrap items-center justify-end gap-3 text-sm text-slate-600 md:flex md:flex-nowrap">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Per page</span>
            <select
              value={pageSize}
              onChange={(event) => {
                const nextLimit = Number.parseInt(event.target.value, 10)
                if (!Number.isNaN(nextLimit)) {
                  pushQuery(1, nextLimit)
                }
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Jump To</span>
            <input
              type="number"
              min={1}
              value={jumpValue}
              onChange={(event) => {
                const value = event.target.value
                if (value === '') {
                  setJumpValue('')
                  return
                }
                const numericValue = Number.parseInt(value, 10)
                if (Number.isNaN(numericValue) || numericValue <= 0) return
                setJumpValue(value)
              }}
              className="h-9 w-20 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
