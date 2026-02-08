type FiltersPanelProps = {
  currentFilters: {
    companyName?: string
    location?: string
    categories?: string
    jobTypes: string[]
    workplaceTypes: string[]
  }
}

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

export default function FiltersPanel({ currentFilters }: FiltersPanelProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <h2 className="text-base font-semibold text-slate-900">Filter jobs</h2>
        <a href="/jobs" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
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
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</label>
          <input
            type="text"
            name="location"
            defaultValue={currentFilters.location}
            placeholder="City, state, country, or Remote"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Job type</p>
          <div className="space-y-2">
            {jobTypeOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="job_type"
                  value={option.value}
                  defaultChecked={currentFilters.jobTypes.includes(option.value)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Workplace type</p>
          <div className="space-y-2">
            {workplaceOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="workplace_type"
                  value={option.value}
                  defaultChecked={currentFilters.workplaceTypes.includes(option.value)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categories</label>
          <input
            type="text"
            name="categories"
            defaultValue={currentFilters.categories}
            placeholder="Comma-separated categories"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#414FEA] py-2.5 text-sm font-semibold text-white hover:shadow-lg"
        >
          Apply filters
        </button>
      </form>
    </aside>
  )
}
