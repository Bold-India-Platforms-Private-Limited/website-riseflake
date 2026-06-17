'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import FiltersPanel from './components/FiltersPanel'
import MobileFilters from './components/MobileFilters'
import InternshipList from './components/InternshipList'
import RightSidebar from './components/RightSidebar'
import type { JobListItem } from './components/InternshipCard'
import { API_BASE_URL } from '../../lib/config'
import Pagination from '../components/Pagination'

type InternshipsResponse = {
  status: boolean
  result: JobListItem[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

const fetchInternships = async (params: URLSearchParams) => {
  const url = `${API_BASE_URL}/internships?${params.toString()}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch internships')
  }
  return (await response.json()) as InternshipsResponse
}

export default function InternshipsClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<InternshipsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const params = useMemo(() => {
    const p = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      p.append(key, value)
    }
    return p
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchInternships(params)
      .then((res) => {
        setData(res);
      })
      .catch(() => setError('Failed to load internships'))
      .finally(() => setLoading(false))
  }, [params])

  const currentFilters = useMemo(() => ({
    companyName: searchParams.get('company_name') ?? '',
    location: searchParams.get('location') ?? '',
    categories: searchParams.get('categories') ?? '',
    jobTypes: searchParams.getAll('job_type'),
    workplaceTypes: searchParams.getAll('workplace_type'),
    experience: searchParams.get('experience') ?? '',
    minStipend: searchParams.get('min_stipend') ?? '',
  }), [searchParams])

  const currentPage = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.total ?? 0;
  const pageSize = data?.limit ?? 20;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_240px] gap-6">

        {/* Left — Filters panel: always visible immediately */}
        <div className="hidden lg:block">
          <FiltersPanel currentFilters={currentFilters} />
        </div>

        {/* Centre — search bar always visible; cards shimmer while loading */}
        <section className="space-y-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const position = String(formData.get('position') ?? '').trim();
              const p = new URLSearchParams(searchParams.toString());
              if (position) { p.set('position', position); } else { p.delete('position'); }
              p.set('page', '1');
              router.push(`/internships?${p.toString()}`);
            }}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"
          >
            <input
              type="text"
              name="position"
              defaultValue={searchParams.get('position') ?? ''}
              placeholder="Search internships by position"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#414FEA] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Search
            </button>
          </form>

          {/* Shimmer while loading */}
          {loading && (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-200/70 animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-2/3 rounded-lg bg-slate-200/70 animate-pulse" />
                      <div className="h-3 w-1/3 rounded-lg bg-slate-200/70 animate-pulse" />
                      <div className="h-3 w-1/2 rounded-lg bg-slate-200/70 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loaded list */}
          {!loading && !error && data && (
            <InternshipList internships={data.result} />
          )}
        </section>

        {/* Right sidebar: always visible immediately */}
        <RightSidebar />
      </div>

      {/* Pagination */}
      {!loading && !error && totalItems > 0 && (
        <div className="w-full max-w-[1200px] mx-auto mt-8 lg:mt-20">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            baseQuery={params}
          />
        </div>
      )}

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <MobileFilters />
      </div>
    </div>
  );
}
