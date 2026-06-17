import React from 'react'

const DOMAINS = [
  'Software Development',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Marketing',
  'Design',
  'Finance',
  'Human Resources',
  'Content Writing',
  'Sales',
  'Operations',
  'Engineering',
]

const STIPEND_OPTIONS = [
  { label: 'Any stipend', value: '' },
  { label: '₹2,000+/mo', value: '2000' },
  { label: '₹5,000+/mo', value: '5000' },
  { label: '₹10,000+/mo', value: '10000' },
  { label: '₹15,000+/mo', value: '15000' },
  { label: '₹20,000+/mo', value: '20000' },
]

type FiltersPanelProps = {
  currentFilters: {
    companyName?: string
    location?: string
    categories?: string
    jobTypes: string[]
    workplaceTypes: string[]
    experience?: string
    minStipend?: string
  }
}

export default function FiltersPanel({ currentFilters }: FiltersPanelProps) {
  const isWFH = currentFilters.workplaceTypes.includes('1')

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <h2 className="text-base font-semibold text-slate-900">Filter internships</h2>
        <a href="/internships" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
          Reset all
        </a>
      </div>

      <form className="space-y-5" method="get">
        {/* Work from home toggle */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-2">
            Work Mode
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="workplace_type"
              value="1"
              defaultChecked={isWFH}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
              Work from home / Remote only
            </span>
          </label>
        </div>

        {/* Min stipend */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-2">
            Minimum Stipend
          </label>
          <select
            name="min_stipend"
            defaultValue={currentFilters.minStipend ?? ''}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STIPEND_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Domain / Category */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-2">
            Domain
          </label>
          <select
            name="categories"
            defaultValue={currentFilters.categories ?? ''}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All domains</option>
            {DOMAINS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            defaultValue={currentFilters.location}
            placeholder="City or state"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Company */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 block mb-2">
            Company
          </label>
          <input
            type="text"
            name="company_name"
            defaultValue={currentFilters.companyName}
            placeholder="Search by company"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-sm transition-colors"
        >
          Apply filters
        </button>
      </form>

      {/* Quick domain links */}
      <div className="mt-5 pt-5 border-t border-slate-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Browse by domain</p>
        <div className="flex flex-col gap-1">
          <a href="/internships/work-from-home" className="text-sm text-slate-600 hover:text-indigo-600 hover:underline py-0.5">
            🏠 Work from Home
          </a>
          {['software-development', 'marketing', 'data-science', 'design', 'finance'].map(slug => (
            <a
              key={slug}
              href={`/internships/${slug}`}
              className="text-sm text-slate-600 hover:text-indigo-600 hover:underline py-0.5 capitalize"
            >
              {slug.replace(/-/g, ' ')}
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}
