'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import CompanyList from './components/CompanyList'
import Pagination from './components/Pagination'
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
  const url = `${API_BASE_URL}/companies?${params.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch companies')
  }

  return (await response.json()) as CompaniesResponse
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

export default function CompaniesPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<CompaniesResponse | null>(null)
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

  const companies = data?.result ?? []
  const currentPage = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1
  const totalCompanies = data?.total ?? 0

  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-12 bg-slate-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Riseflake Companies</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-semibold text-slate-900">Explore verified companies</h1>
            <p className="mt-2 text-slate-600">
              Discover organizations hiring across industries and roles.
            </p>
          </div>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <span>{totalCompanies} companies available</span>
              <span>Showing page {currentPage} of {totalPages}</span>
            </div>

            {isLoading ? (
              <CompaniesSkeleton />
            ) : hasError ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                <h3 className="text-xl font-semibold text-slate-900">Unable to load companies</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Please refresh the page or try again in a few moments.
                </p>
              </div>
            ) : (
              <>
                <CompanyList companies={companies} />
                {totalCompanies > 20 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} baseQuery={queryParams} />
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
