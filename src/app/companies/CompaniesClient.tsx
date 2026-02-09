'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CompanyList from './components/CompanyList'
import Pagination from '../components/Pagination'
import type { CompanyListItem } from './components/CompanyCard'
import { API_BASE_URL } from '../../lib/config'
import { FiSearch } from 'react-icons/fi'

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

export default function CompaniesClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<CompaniesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('company_name') ?? '')

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
  const pageSize = data?.limit ?? Number.parseInt(searchParams.get('limit') ?? '20', 10)

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
        <span>{totalCompanies} companies available</span>
        <span>Showing page {currentPage} of {totalPages}</span>
      </div>

      <form
        className="flex w-full flex-wrap items-center justify-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          const params = new URLSearchParams(searchParams.toString())

          const trimmed = searchTerm.trim()
          if (trimmed) {
            params.set('company_name', trimmed)
          } else {
            params.delete('company_name')
          }

          params.delete('page') // reset pagination on new search
          router.push(`/companies?${params.toString()}`)
        }}
      >
        <div className="relative w-full md:w-[30%]">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="company_name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies by name"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm text-slate-700"
          />
        </div>
      </form>

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
          {totalCompanies > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCompanies}
              pageSize={Number.isNaN(pageSize) ? 20 : pageSize}
              baseQuery={queryParams}
              limitOptionPreset={[20, 30, 50, 100, 200, 500, 1000]}
            />
          )}
        </>
      )}
    </section>
  )
}
