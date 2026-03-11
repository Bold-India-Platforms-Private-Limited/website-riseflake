'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CompanyList from './components/CompanyList'
import Pagination from '../components/Pagination'
import type { CompanyListItem } from './components/CompanyCard'
import { API_BASE_URL } from '../../lib/config'
import { FiSearch } from 'react-icons/fi'
import { FiFilter } from 'react-icons/fi'

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
  const url = `${API_BASE_URL}/companies?${params.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch companies')
  }

  return (await response.json()) as CompaniesResponse
}

const LAST_UPDATED_KEY = 'companies_last_updated_ts'
const ONE_HOUR = 60 * 60 * 1000

/**
 * Returns the persisted timestamp from localStorage if it exists and is less
 * than 1 hour old. Otherwise stamps "now", persists it, and returns it.
 */
const getOrInitTimestamp = (): Date => {
  try {
    const stored = localStorage.getItem(LAST_UPDATED_KEY)
    if (stored) {
      const parsed = new Date(stored)
      if (!isNaN(parsed.getTime()) && Date.now() - parsed.getTime() < ONE_HOUR) {
        return parsed
      }
    }
  } catch {
    // localStorage unavailable (SSR guard, private browsing, etc.)
  }

  const now = new Date()
  try {
    localStorage.setItem(LAST_UPDATED_KEY, now.toISOString())
  } catch {
    // ignore write failure
  }
  return now
}

const persistTimestamp = (date: Date) => {
  try {
    localStorage.setItem(LAST_UPDATED_KEY, date.toISOString())
  } catch {
    // ignore
  }
}

const CompaniesSkeleton = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-200/70 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-slate-200/70 animate-pulse"></div>
              <div className="h-3 w-28 rounded bg-slate-200/70 animate-pulse"></div>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
)

export default function CompaniesClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<CompaniesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('company_name') ?? '')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // null on first render to avoid SSR/client mismatch — hydrated in useEffect
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Hydrate the timestamp on the client after first mount
  useEffect(() => {
    setLastUpdated(getOrInitTimestamp())
  }, [])

  const queryParams = useMemo(() => {
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })
    return params
  }, [searchParams])

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    setHasError(false)

    fetchCompanies(queryParams)
      .then((result) => {
        if (!isActive) return
        setData(result)
      })
      .catch(() => {
        if (!isActive) return
        setHasError(true)
        setData(null)
      })
      .finally(() => {
        if (!isActive) return
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [queryParams])

  // Tick every minute to check whether 1 hour has elapsed since the stored
  // timestamp. If so, stamp a fresh time and persist it.
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
    }, 60 * 1000) // check every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isFilterOpen) {
      document.body.classList.remove('body-scroll-lock')
      return
    }

    document.body.classList.add('body-scroll-lock')
    return () => {
      document.body.classList.remove('body-scroll-lock')
    }
  }, [isFilterOpen])

  const companies = data?.result ?? []
  const currentPage = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1
  const totalCompanies = data?.total ?? 0
  const pageSize = data?.limit ?? Number.parseInt(searchParams.get('limit') ?? '20', 10)

  const organizationTypes = ['Startup', 'Enterprise', 'Public', 'Non-profit', 'Agency']

  const formatTimestamp = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = date.toLocaleString('en-GB', { month: 'short' })
    const year = String(date.getFullYear()).slice(-2)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day} ${month} ${year}, ${hours}:${minutes}`
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside className="order-2 hidden rounded-3xl border border-slate-200 bg-white p-5 pt-4 shadow-sm lg:order-1 lg:block lg:sticky lg:self-start lg:mt-0 lg:pt-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mt-2 mb-2">Filters</p>
            <h2 className="text-base font-semibold text-slate-900">Organization Type</h2>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">Select an organization type to refine results.</p>
        <div className="mt-4 space-y-3">
          {organizationTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                disabled
              />
              {type}
            </label>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">Filters update is coming soon.</p>
      </aside>

      <div className="order-1 space-y-6 lg:order-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm"
          >
            <FiFilter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <form
            className="flex-1"
            onSubmit={(e) => {
              e.preventDefault()
              const params = new URLSearchParams(searchParams.toString())

              const trimmed = searchTerm.trim()
              if (trimmed) {
                params.set('company_name', trimmed)
              } else {
                params.delete('company_name')
              }

              params.delete('page')
              router.push(`/companies?${params.toString()}`)
            }}
          >
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="company_name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search companies by name"
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 pl-11 text-sm text-slate-700 shadow-sm"
              />
            </div>
          </form>
        </div>

        {isLoading ? (
          <CompaniesSkeleton />
        ) : hasError ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Unable to load companies</h3>
            <p className="mt-2 text-sm text-slate-600">Please refresh the page or try again in a few moments.</p>
          </div>
        ) : (
          <CompanyList companies={companies} />
        )}
      </div>

      <aside className="order-3 hidden space-y-4 lg:block lg:sticky lg:self-start lg:mt-0 lg:pt-0">
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Grow your brand</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">List your company on Riseflake</h3>
          <p className="mt-2 text-sm text-slate-600">
            Reach high-intent talent and showcase your culture to our professional community.
          </p>
          <a
            href="https://app.riseflake.com/home"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Get started
          </a>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Talent alerts</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Stay ahead of hiring trends</h3>
          <p className="mt-2 text-sm text-slate-600">
            Weekly insights on hiring velocity, roles in demand, and applicant supply.
          </p>
          <a
            href="https://app.riseflake.com/home"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Subscribe
          </a>
        </div>
      </aside>

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

      <footer className="order-5 lg:col-span-3 rounded-2xl px-6 py-4 text-center text-xs text-slate-600">
        <p className="font-semibold text-slate-900">
          Updated On: {lastUpdated ? formatTimestamp(lastUpdated) : '—'} IST
        </p>
        <p className="mt-1 text-slate-500">The data on this page gets updated every 1 hour.</p>
        <p className="mt-1 text-slate-500">
          Designed for all modern browsers.
        </p>
      </footer>

      <div
        className={`fixed inset-0 z-50 transition ${isFilterOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          }`}
        aria-hidden={!isFilterOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${isFilterOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsFilterOpen(false)}
        ></div>
        <div
          className={`absolute left-0 top-0 h-dvh w-full bg-white transition-transform duration-200 lg:hidden ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filters</p>
              <h2 className="text-base font-semibold text-slate-900">Organization Type</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 shadow-sm"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          <div className="flex h-[calc(100dvh-73px)] flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <p className="text-xs text-slate-500">Select an organization type to refine results.</p>
              <div className="mt-4 space-y-3">
                {organizationTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                      disabled
                    />
                    {type}
                  </label>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400">Filters update is coming soon.</p>
            </div>
            <div className="border-t border-slate-200 bg-white px-5 py-4">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-full bg-indigo-600 py-2.5 text-sm font-semibold text-white"
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
