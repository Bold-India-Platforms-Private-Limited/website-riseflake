'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import FiltersPanel from './components/FiltersPanel'
import JobList from './components/JobList'
import Pagination from './components/Pagination'
import RightSidebar from './components/RightSidebar'
import type { JobListItem } from './components/JobCard'
import { API_BASE_URL } from '../../lib/config'

export const dynamic = 'force-dynamic'

type JobsResponse = {
  status: boolean
  result: JobListItem[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

const fetchJobs = async (params: URLSearchParams) => {
  const url = `${API_BASE_URL}/jobs?${params.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch jobs')
  }

  return (await response.json()) as JobsResponse
}

const JobsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_240px] gap-6 items-start">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="h-9 rounded-lg bg-slate-200/70 animate-pulse"></div>
      ))}
    </div>
    <div className="space-y-4">
      <div className="h-12 rounded-2xl bg-white border border-slate-200 animate-pulse"></div>
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
    <div className="hidden lg:block h-[70vh] space-y-4">
      <div className="h-full rounded-2xl border border-slate-200 bg-white animate-pulse"></div>
    </div>
  </div>
)

export default function JobsPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<JobsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

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

    fetchJobs(queryParams)
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

  const jobs = data?.result ?? []
  const currentPage = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1
  const totalJobs = data?.total ?? 0

  const currentFilters = {
    companyName: searchParams.get('company_name') ?? '',
    location: searchParams.get('location') ?? '',
    categories: searchParams.get('categories') ?? '',
    jobTypes: searchParams.getAll('job_type'),
    workplaceTypes: searchParams.getAll('workplace_type'),
  }

  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-12 bg-slate-100">
        <div className="max-w-[1200px] mx-auto">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Riseflake Jobs</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold text-slate-900">Find your next role</h1>
          <p className="mt-2 text-slate-600">
            Verified opportunities with top companies and growing teams.
          </p>
        </div>

        {isLoading ? (
          <JobsSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_240px] gap-6 items-start">
            <FiltersPanel currentFilters={currentFilters} />

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                <span>{totalJobs} roles available</span>
                <span>Showing page {currentPage} of {totalPages}</span>
              </div>

              {hasError ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                  <h3 className="text-xl font-semibold text-slate-900">Unable to load jobs</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Please refresh the page or try again in a few moments.
                  </p>
                </div>
              ) : (
                <>
                  <JobList jobs={jobs} />
                  {totalJobs > 20 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      baseQuery={queryParams}
                    />
                  )}
                </>
              )}
            </section>

            <RightSidebar />
          </div>
        )}
        </div>
      </main>
    </>
  )
}
