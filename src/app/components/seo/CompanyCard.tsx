import Link from 'next/link'
import { Building2, Briefcase } from 'lucide-react'
import type { CompanyRow } from '../../../lib/companyBrowseData'

export default function CompanyCard({ company, trackingSuffix = '' }: { company: CompanyRow; trackingSuffix?: string }) {
  const initials = company.company_name.slice(0, 2).toUpperCase()
  return (
    <Link
      href={`/companies/${company.slug}${trackingSuffix}`}
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {company.company_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.company_logo} alt={company.company_name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-slate-500">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {company.company_name}
          </h3>
          {company.industry_type && <p className="text-xs text-slate-500 mt-0.5">{company.industry_type}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-auto">
        {company.organization_type && (
          <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
            {company.organization_type}
          </span>
        )}
        {company.team_size && (
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Building2 className="h-3 w-3" />{company.team_size}
          </span>
        )}
        {typeof company.active_jobs === 'number' && company.active_jobs > 0 && (
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Briefcase className="h-3 w-3" />{company.active_jobs} open role{company.active_jobs === 1 ? '' : 's'}
          </span>
        )}
      </div>
    </Link>
  )
}
