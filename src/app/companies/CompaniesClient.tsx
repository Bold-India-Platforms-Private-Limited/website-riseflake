'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X, Building2, Loader2 } from 'lucide-react'
import CompanyList from './components/CompanyList'
import Pagination from '../components/Pagination'
import type { CompanyListItem } from './components/CompanyCard'
import { API_BASE_URL } from '../../lib/config'

type CompaniesResponse = {
  status: boolean
  result: CompanyListItem[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

const fetchCompanies = async (params: URLSearchParams) => {
  const response = await fetch(`${API_BASE_URL}/companies?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch companies')
  return (await response.json()) as CompaniesResponse
}

const LAST_UPDATED_KEY = 'companies_last_updated_ts'
const ONE_HOUR = 60 * 60 * 1000

const getOrInitTimestamp = (): Date => {
  try {
    const stored = localStorage.getItem(LAST_UPDATED_KEY)
    if (stored) {
      const parsed = new Date(stored)
      if (!isNaN(parsed.getTime()) && Date.now() - parsed.getTime() < ONE_HOUR) return parsed
    }
  } catch { /* ignore */ }
  const now = new Date()
  try { localStorage.setItem(LAST_UPDATED_KEY, now.toISOString()) } catch { /* ignore */ }
  return now
}

const persistTimestamp = (date: Date) => {
  try { localStorage.setItem(LAST_UPDATED_KEY, date.toISOString()) } catch { /* ignore */ }
}

const formatTimestamp = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-GB', { month: 'short' })
  const year = String(date.getFullYear()).slice(-2)
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year}, ${hh}:${mm}`
}

const CompaniesSkeleton = () => (
  <div className="space-y-3">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-slate-200/70 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-36 rounded-full bg-slate-200/70 animate-pulse" />
              <div className="h-3 w-24 rounded-full bg-slate-200/70 animate-pulse" />
            </div>
          </div>
          <div className="h-7 w-16 rounded-full bg-slate-200/70 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
)

const ORGANIZATION_TYPES = ['Startup', 'Enterprise', 'Public', 'Non-profit', 'Agency']

export default function CompaniesClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [data, setData] = useState<CompaniesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('company_name') ?? '')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => { setLastUpdated(getOrInitTimestamp()) }, [])

  const queryParams = useMemo(() => {
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => params.append(key, value))
    return params
  }, [searchParams])

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setHasError(false)
    fetchCompanies(queryParams)
      .then((result) => { if (active) setData(result) })
      .catch(() => { if (active) { setHasError(true); setData(null) } })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [queryParams])

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated((prev) => {
        if (!prev) return prev
        if (Date.now() - prev.getTime() >= ONE_HOUR) {
          const next = new Date()
          persistTimestamp(next)
          return next
        }
        return prev
      })
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('body-scroll-lock', isFilterOpen)
    return () => { document.body.classList.remove('body-scroll-lock') }
  }, [isFilterOpen])

  const companies = useMemo(
    () => (data?.result ?? []).filter((c) => c.slug && c.slug !== 'null' && c.company_name),
    [data]
  )

  const currentPage = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1
  const totalCompanies = data?.total ?? 0
  const pageSize = data?.limit ?? Number.parseInt(searchParams.get('limit') ?? '20', 10)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    const trimmed = searchTerm.trim()
    if (trimmed) params.set('company_name', trimmed)
    else params.delete('company_name')
    params.delete('page')
    router.push(`/companies?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchTerm('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('company_name')
    params.delete('page')
    router.push(`/companies?${params.toString()}`)
    inputRef.current?.focus()
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">

      {/* ── Left sidebar ── */}
      <aside className="order-2 hidden lg:order-1 lg:block lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Organization Type</p>
          <div className="space-y-2">
            {ORGANIZATION_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2.5 text-sm text-slate-600 cursor-not-allowed opacity-60">
                <span className="h-4 w-4 rounded border border-slate-300 bg-slate-50 flex-shrink-0" />
                {type}
              </label>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
            Advanced filters coming soon
          </p>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="order-1 lg:order-2 space-y-4">

        {/* Search bar */}
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2">
            {/* Mobile filter button */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {/* Search input */}
            <div className="relative flex-1 group">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                {isLoading
                  ? <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                  : <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                }
              </div>
              <input
                ref={inputRef}
                type="search"
                name="company_name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search companies by name…"
                className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3 text-slate-600" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="flex-shrink-0 h-11 px-4 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results count */}
        {!isLoading && !hasError && (
          <p className="text-xs text-slate-500">
            {totalCompanies > 0
              ? <><span className="font-semibold text-slate-700">{totalCompanies.toLocaleString()}</span> {totalCompanies === 1 ? 'company' : 'companies'} found</>
              : 'No companies match your search'
            }
          </p>
        )}

        {/* List */}
        {isLoading ? (
          <CompaniesSkeleton />
        ) : hasError ? (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-100 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-rose-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Unable to load companies</h3>
            <p className="mt-1 text-sm text-slate-500">Please refresh the page or try again shortly.</p>
          </div>
        ) : (
          <CompanyList companies={companies} />
        )}
      </div>

      {/* ── Right sidebar ── */}
      <aside className="order-3 hidden lg:block lg:sticky lg:top-20 lg:self-start space-y-4">
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">For Employers</span>
          <h3 className="mt-2 text-base font-semibold text-slate-900 leading-snug">List your company on Riseflake</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Reach high-intent talent and showcase your culture to thousands of professionals.
          </p>
          <a
            href="https://app.riseflake.com/home"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Get started free
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Talent Alerts</span>
          <h3 className="mt-2 text-base font-semibold text-slate-900 leading-snug">Stay ahead of hiring trends</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Weekly insights on roles in demand and hiring velocity across industries.
          </p>
          <a
            href="https://app.riseflake.com/home"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            Subscribe
          </a>
        </div>

        {lastUpdated && (
          <p className="text-[11px] text-slate-400 text-center px-2">
            Updated {formatTimestamp(lastUpdated)} IST · refreshes hourly
          </p>
        )}
      </aside>

      {/* Pagination */}
      {!isLoading && !hasError && totalCompanies > 0 && (
        <div className="order-4 lg:col-span-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCompanies}
            pageSize={Number.isNaN(pageSize) ? 20 : pageSize}
            baseQuery={queryParams}
            limitOptionPreset={[20, 30, 50, 100, 200, 500, 1000]}
          />
        </div>
      )}

      {/* Footer note */}
      <footer className="order-5 lg:col-span-3 text-center text-xs text-slate-400 pb-4">
        Data refreshes every hour · Designed for all modern browsers
      </footer>

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${isFilterOpen ? 'visible' : 'invisible pointer-events-none'}`}
        aria-hidden={!isFilterOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsFilterOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-dvh w-[85vw] max-w-xs bg-white shadow-2xl transition-transform duration-200 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800"
              aria-label="Close filters"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex h-[calc(100dvh-65px)] flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Organization Type</p>
              <div className="space-y-3">
                {ORGANIZATION_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2.5 text-sm text-slate-600 cursor-not-allowed opacity-60">
                    <span className="h-4 w-4 rounded border border-slate-300 bg-slate-50 flex-shrink-0" />
                    {type}
                  </label>
                ))}
              </div>
              <p className="mt-5 text-[11px] text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
                Advanced filters coming soon
              </p>
            </div>
            <div className="border-t border-slate-100 bg-white px-5 py-4">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
