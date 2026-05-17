import Link from 'next/link'
import { Building2, Factory, ArrowRight } from 'lucide-react'

export type CompanyListItem = {
  company_name: string
  company_logo: string | null
  organization_type: string | null
  industry_type?: string | null
  slug: string
}

const placeholderGradients = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-violet-500 to-purple-500',
  'from-cyan-500 to-sky-500',
  'from-lime-500 to-green-500',
]

const getGradient = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % placeholderGradients.length
  }
  return placeholderGradients[hash] ?? placeholderGradients[0]
}

export default function CompanyCard({ company }: { company: CompanyListItem }) {
  const gradient = getGradient(company.company_name)
  const initials = company.company_name.slice(0, 2).toUpperCase()

  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Logo / Initials */}
        <div
          className={`flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden flex items-center justify-center ${
            company.company_logo ? 'bg-slate-100 border border-slate-200' : `bg-gradient-to-br ${gradient}`
          }`}
        >
          {company.company_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.company_logo}
              alt={`${company.company_name} logo`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-sm font-bold text-white select-none">{initials}</span>
          )}
        </div>

        {/* Text */}
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
            {company.company_name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            {company.organization_type && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Building2 className="h-3 w-3 text-slate-400 flex-shrink-0" />
                {company.organization_type}
              </span>
            )}
            {company.industry_type && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Factory className="h-3 w-3 text-slate-400 flex-shrink-0" />
                {company.industry_type}
              </span>
            )}
            {!company.organization_type && !company.industry_type && (
              <span className="text-xs text-slate-400">Organization</span>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <span className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-all whitespace-nowrap">
        View <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  )
}
