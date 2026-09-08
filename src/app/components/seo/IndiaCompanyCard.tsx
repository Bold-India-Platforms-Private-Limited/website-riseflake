import Link from 'next/link'
import { Building2, MapPin } from 'lucide-react'
import type { IndiaCompanyCard as IndiaCompanyCardType } from '../../../lib/indiaCompanyDirectory'

const STATE_LABEL: Record<string, string> = {}

function titleCase(v: string): string {
  return v.replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function IndiaCompanyCard({ company }: { company: IndiaCompanyCardType }) {
  const stateLabel = company.company_state_code
    ? STATE_LABEL[company.company_state_code] ?? titleCase(company.company_state_code)
    : null
  const initials = company.company_name.slice(0, 2).toUpperCase()
  const isActive = (company.company_status || '').toLowerCase() === 'active'

  return (
    <Link
      href={`/discover/companies/india/${encodeURIComponent(company.cin)}/${company.name_slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-slate-500">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {company.company_name}
          </h3>
          {company.company_category && <p className="text-xs text-slate-500 mt-0.5">{company.company_category}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-auto">
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
            isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {company.company_status || 'Unknown'}
        </span>
        {stateLabel && (
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <MapPin className="h-3 w-3" />{stateLabel}
          </span>
        )}
        {company.registration_date && (
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Building2 className="h-3 w-3" />Since {company.registration_date.slice(0, 4)}
          </span>
        )}
      </div>
    </Link>
  )
}
