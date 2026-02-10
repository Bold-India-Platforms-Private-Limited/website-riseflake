import Link from 'next/link'

export type CompanyListItem = {
  company_name: string
  company_logo: string | null
  organization_type: string | null
  slug: string
}

const placeholderPalette = [
  'from-sky-200 to-blue-100 text-slate-700',
  'from-emerald-200 to-teal-100 text-slate-700',
  'from-amber-200 to-orange-100 text-slate-700',
  'from-rose-200 to-pink-100 text-slate-700',
  'from-violet-200 to-purple-100 text-slate-700',
  'from-lime-200 to-green-100 text-slate-700',
]

const getPlaceholderStyle = (name: string) => {
  const normalized = name.trim().toLowerCase()
  let hash = 0
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) % placeholderPalette.length
  }
  return placeholderPalette[hash] ?? placeholderPalette[0]
}

export default function CompanyCard({ company }: { company: CompanyListItem }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md lg:p-7"
    >
      <div className="flex items-center gap-4 lg:gap-5">
        <div
          className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl lg:h-16 lg:w-16 ${
            company.company_logo ? 'bg-slate-100' : `bg-gradient-to-br ${getPlaceholderStyle(company.company_name)}`
          }`}
        >
          {company.company_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.company_logo} alt={`${company.company_name} logo`} className="h-16 w-16 object-cover" />
          ) : (
            <span className="text-sm font-semibold uppercase lg:text-base">
              {company.company_name.slice(0, 2)}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 lg:text-lg">
            {company.company_name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 lg:text-sm">
            {company.organization_type ?? 'Organization'}
          </p>
        </div>
      </div>

      <span className="text-slate-400 transition group-hover:text-indigo-600">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 lg:h-8 lg:w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </span>
    </Link>
  )
}
