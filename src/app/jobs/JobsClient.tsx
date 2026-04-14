'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import FiltersPanel from './components/FiltersPanel'
import JobList from './components/JobList'
import RightSidebar from './components/RightSidebar'
import type { JobListItem } from './components/JobCard'
import { API_BASE_URL } from '../../lib/config'
import Pagination from '../components/Pagination'

type JobsResponse = {
  status: boolean
  result: JobListItem[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

// ---------------------------------------------------------------------------
// Skills resolver — the /jobs list API returns numeric skill IDs instead of
// names. We resolve them by fetching the individual job detail (which always
// returns string names) and cache results for 15 minutes to avoid hammering
// the backend on every re-render / filter change.
// ---------------------------------------------------------------------------
const SKILL_CACHE_TTL = 15 * 60 * 1000 // 15 minutes

// slug → resolved string[] names
const _skillCache = new Map<string, string[]>()
const _skillCacheAt = new Map<string, number>()

// In-flight promises so concurrent renders don't duplicate requests
const _skillFlight = new Map<string, Promise<string[]>>()

async function fetchSkillsForSlug(slug: string): Promise<string[]> {
  const now = Date.now()
  const cached = _skillCache.get(slug)
  if (cached && now - (_skillCacheAt.get(slug) ?? 0) < SKILL_CACHE_TTL) {
    return cached
  }

  const inflight = _skillFlight.get(slug)
  if (inflight) return inflight

  const promise = fetch(`${API_BASE_URL}/jobs/${slug}`)
    .then(r => r.ok ? r.json() : null)
    .then((data) => {
      const skills: string[] = (data?.result?.job_skills ?? []).filter(
        (s: unknown) => typeof s === 'string'
      )
      _skillCache.set(slug, skills)
      _skillCacheAt.set(slug, Date.now())
      return skills
    })
    .catch(() => {
      return [] as string[]
    })
    .finally(() => {
      _skillFlight.delete(slug)
    })

  _skillFlight.set(slug, promise)
  return promise
}

/**
 * For any job whose job_skills are numeric IDs, fetch the detail and replace
 * them with real string names. Returns a new array (jobs with IDs already
 * containing strings are passed through unchanged).
 */
async function resolveSkillIds(jobs: JobListItem[]): Promise<JobListItem[]> {
  const needsResolution = jobs.filter(
    j => j.job_skills?.length > 0 && typeof j.job_skills[0] === 'number'
  )
  if (needsResolution.length === 0) return jobs

  const resolved = await Promise.all(
    needsResolution.map(j => fetchSkillsForSlug(j.slug).then(skills => ({ slug: j.slug, skills })))
  )
  const skillMap = new Map(resolved.map(r => [r.slug, r.skills]))

  return jobs.map(j =>
    typeof j.job_skills?.[0] === 'number'
      ? { ...j, job_skills: skillMap.get(j.slug) ?? [] }
      : j
  )
}

const fetchJobs = async (params: URLSearchParams) => {
  const url = `${API_BASE_URL}/jobs?${params.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch jobs')
  }

  return (await response.json()) as JobsResponse
}

const LAST_UPDATED_KEY = 'jobs_last_updated_ts'
const FIFTEEN_MINUTES = 15 * 60 * 1000

/**
 * Returns the persisted timestamp from localStorage if it exists and is less
 * than 15 minutes old. Otherwise stamps "now", persists it, and returns it.
 */
const getOrInitTimestamp = (): Date => {
  try {
    const stored = localStorage.getItem(LAST_UPDATED_KEY)
    if (stored) {
      const parsed = new Date(stored)
      if (!isNaN(parsed.getTime()) && Date.now() - parsed.getTime() < FIFTEEN_MINUTES) {
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

const JobsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-slate-200/70 animate-pulse"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 w-2/3 rounded-lg bg-slate-200/70 animate-pulse"></div>
            <div className="h-3 w-1/3 rounded-lg bg-slate-200/70 animate-pulse"></div>
            <div className="h-3 w-1/2 rounded-lg bg-slate-200/70 animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default function JobsClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [data, setData] = useState<JobsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Initialise from localStorage so the timestamp survives page reloads.
  // We use a lazy initialiser via useState(() => ...) but localStorage is
  // only available on the client, so we guard with a null default and set
  // the real value inside useEffect to avoid SSR mismatches.
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
    // If the user hasn't manually selected job types, default to
    // non-internship types so internship listings don't bleed into this page.
    if (!params.has('job_type')) {
      params.append('job_type', 'full-time')
      params.append('job_type', 'part-time')
      params.append('job_type', 'contract')
    }
    return params
  }, [searchParams])

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    setHasError(false)

    fetchJobs(queryParams)
      .then(async (result) => {
        if (!isActive) return
        // Resolve numeric skill IDs → real skill names via cached detail fetch
        const resolvedJobs = await resolveSkillIds(result.result)
        if (!isActive) return
        setData({ ...result, result: resolvedJobs })
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

  // Tick every minute to check whether 15 minutes have elapsed since the
  // stored timestamp. If so, stamp a fresh time and persist it.
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated((prev) => {
        if (!prev) return prev
        if (Date.now() - prev.getTime() >= FIFTEEN_MINUTES) {
          const next = new Date()
          persistTimestamp(next)
          return next
        }
        return prev
      })
    }, 60 * 1000) // check every minute

    return () => clearInterval(interval)
  }, [])

  // Only show jobs with visibility_status 2 or 3 and exclude internship type
  // (job_type is also filtered at the API level by default, this is a safety guard)
  const jobs = (data?.result ?? []).filter(
    job =>
      (job.visibility_status === 2 || job.visibility_status === 3) &&
      job.job_type !== 'internship'
  )
  const currentPage = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1
  const totalJobs = data?.total ?? 0
  const pageSize = data?.limit ?? 20

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const position = String(formData.get('position') ?? '').trim()
    const params = new URLSearchParams(searchParams.toString())

    if (position) {
      params.set('position', position)
    } else {
      params.delete('position')
    }

    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const currentFilters = {
    companyName: searchParams.get('company_name') ?? '',
    location: searchParams.get('location') ?? '',
    categories: searchParams.get('categories') ?? '',
    jobTypes: searchParams.getAll('job_type'),
    workplaceTypes: searchParams.getAll('workplace_type'),
  }

  const formatTimestamp = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = date.toLocaleString('en-GB', { month: 'short' })
    const year = String(date.getFullYear()).slice(-2)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day} ${month} ${year}, ${hours}:${minutes}`
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_240px] gap-6 items-start">
        <div className="hidden lg:block">
          <FiltersPanel currentFilters={currentFilters} />
        </div>

        <section className="space-y-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"
          >
            <input
              type="text"
              name="position"
              defaultValue={searchParams.get('position') ?? ''}
              placeholder="Search jobs by position"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#414FEA] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Search
            </button>
          </form>

          {isLoading ? (
            <JobsSkeleton />
          ) : hasError ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <h3 className="text-xl font-semibold text-slate-900">Unable to load jobs</h3>
              <p className="mt-2 text-sm text-slate-600">
                Please refresh the page or try again in a few moments.
              </p>
            </div>
          ) : (
            <JobList jobs={jobs} />
          )}
        </section>

        <RightSidebar />
      </div>

      {!isLoading && !hasError && totalJobs > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalJobs}
          pageSize={pageSize}
          baseQuery={queryParams}
        />
      )}

      <footer className="mt-6 rounded-2xl px-6 py-4 text-center text-xs text-slate-600">
        <p className="font-semibold text-slate-900">
          Updated On: {lastUpdated ? formatTimestamp(lastUpdated) : '—'} IST
        </p>
        <p className="mt-1 text-slate-500">The data on this page gets updated every 15 minutes.</p>
        <p className="mt-1 text-slate-500">
          Best Viewed in Chrome, Opera, Mozilla, EDGE & Safari.
        </p>
      </footer>
    </div>
  )
}
