'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiFilter, FiX } from 'react-icons/fi'

type TabKey = 'company' | 'location' | 'job-type' | 'workplace' | 'categories'

const jobTypeOptions = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
]

const workplaceOptions = [
  { label: 'Remote', value: '1' },
  { label: 'Hybrid', value: '2' },
  { label: 'On-site', value: '3' },
]

export default function MobileFilters() {
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('company')

  const currentFilters = useMemo(
    () => ({
      companyName: searchParams.get('company_name') ?? '',
      position: searchParams.get('position') ?? '',
      location: searchParams.get('location') ?? '',
      categories: searchParams.get('categories') ?? '',
      limit: searchParams.get('limit') ?? '',
      jobTypes: searchParams.getAll('job_type'),
      workplaceTypes: searchParams.getAll('workplace_type'),
    }),
    [searchParams]
  )

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('body-scroll-lock')
      return
    }

    document.body.classList.add('body-scroll-lock')
    return () => {
      document.body.classList.remove('body-scroll-lock')
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-[26px] border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
        >
          <FiFilter className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 transition ${
          isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        ></div>
        <div
          className={`absolute left-0 top-0 flex h-dvh w-full flex-col bg-white transition-transform duration-200 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Find roles</p>
              <h2 className="text-base font-semibold text-slate-900">Filter jobs</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 shadow-sm"
              aria-label="Close filters"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div className="border-b border-slate-100 px-5">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3">
              <button
                type="button"
                onClick={() => setActiveTab('company')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  activeTab === 'company'
                    ? 'bg-[#414FEA] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Company
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  activeTab === 'location'
                    ? 'bg-[#414FEA] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Location
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('job-type')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  activeTab === 'job-type'
                    ? 'bg-[#414FEA] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Job Type
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('workplace')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  activeTab === 'workplace'
                    ? 'bg-[#414FEA] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Workplace type
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  activeTab === 'categories'
                    ? 'bg-[#414FEA] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Categories
              </button>
            </div>
          </div>

          <form action="/jobs" method="get" className="flex flex-1 flex-col">
            {currentFilters.position ? (
              <input type="hidden" name="position" value={currentFilters.position} />
            ) : null}
            {currentFilters.limit ? (
              <input type="hidden" name="limit" value={currentFilters.limit} />
            ) : null}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className={activeTab === 'company' ? 'space-y-4' : 'hidden'}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company</label>
                <input
                  type="text"
                  name="company_name"
                  defaultValue={currentFilters.companyName}
                  placeholder="Search by company"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                />
              </div>

              <div className={activeTab === 'location' ? 'space-y-4' : 'hidden'}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={currentFilters.location}
                  placeholder="City, state, country, or Remote"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                />
              </div>

              <div className={activeTab === 'job-type' ? 'space-y-4' : 'hidden'}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Job type</p>
                <div className="grid grid-cols-2 gap-2">
                  {jobTypeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                    >
                      <input
                        type="checkbox"
                        name="job_type"
                        value={option.value}
                        defaultChecked={currentFilters.jobTypes.includes(option.value)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className={activeTab === 'workplace' ? 'space-y-4' : 'hidden'}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Workplace type</p>
                <div className="grid grid-cols-2 gap-2">
                  {workplaceOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                    >
                      <input
                        type="checkbox"
                        name="workplace_type"
                        value={option.value}
                        defaultChecked={currentFilters.workplaceTypes.includes(option.value)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className={activeTab === 'categories' ? 'space-y-4' : 'hidden'}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categories</label>
                <input
                  type="text"
                  name="categories"
                  defaultValue={currentFilters.categories}
                  placeholder="Comma-separated categories"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
              <div className="flex items-center gap-3">
                <a
                  href="/jobs"
                  className="flex-1 rounded-none border border-slate-200 bg-white py-2.5 text-center text-base font-semibold text-slate-700"
                >
                  Reset all
                </a>
                <button
                  type="submit"
                  className="flex-1 rounded-none bg-[#414FEA] py-2.5 text-base font-semibold text-white shadow-sm"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
