'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CompanyList from './components/CompanyList'
import type { CompanyListItem } from './components/CompanyCard'
import { API_BASE_URL } from '../../lib/config'
import Pagination from '../components/Pagination'

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
  const pathname = usePathname()
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
  const pageSize = data?.limit ?? 20

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const companyName = String(formData.get('company_name') ?? '').trim()
    const params = new URLSearchParams(searchParams.toString())

    if (companyName) {
      params.set('company_name', companyName)
    } else {
      params.delete('company_name')
    }

    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <section className="space-y-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sticky top-20 z-10"
      >
        <input
          type="text"
          name="company_name"
          defaultValue={searchParams.get('company_name') ?? ''}
          placeholder="Search companies by name"
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
        <CompaniesSkeleton />
      ) : hasError ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <h3 className="text-xl font-semibold text-slate-900">Unable to load companies</h3>
          <p className="mt-2 text-sm text-slate-600">
            Please refresh the page or try again in a few moments.
          </p>
        </div>
      ) : (
        <CompanyList companies={companies} />
      )}

      {!isLoading && !hasError && totalCompanies > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCompanies}
          pageSize={pageSize}
          baseQuery={queryParams}
        />
      )}
    </section>
  )
}
