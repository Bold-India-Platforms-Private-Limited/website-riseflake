import React from 'react'

type FiltersPanelProps = {
  currentFilters: {
    companyName?: string
    location?: string
    categories?: string
    jobTypes: string[]
    workplaceTypes: string[]
    experience?: string
  }
  onApply?: (filters: any) => void
  onClear?: () => void
}

export default function FiltersPanel({ currentFilters }: FiltersPanelProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <h2 className="text-base font-semibold text-slate-900">Filter internships</h2>
        <a href="/internships" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
          Reset all
        </a>
      </div>
      <form className="space-y-5" method="get">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company</label>
          <input
            type="text"
            name="company_name"
            defaultValue={currentFilters.companyName}
            placeholder="Search by company"
            className="mt-2 w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</label>
          <input
            type="text"
            name="location"
            defaultValue={currentFilters.location}
            placeholder="City, state, country, or Remote"
            className="mt-2 w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Add more filters as needed */}
      </form>
    </aside>
  )
}
