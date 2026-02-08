import Link from 'next/link'
import { FiArrowUpRight } from 'react-icons/fi'

export type CompanyListItem = {
  company_name: string
  company_logo: string | null
  organization_type: string | null
  slug: string
}

export default function CompanyCard({ company }: { company: CompanyListItem }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
          {company.company_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.company_logo} alt={`${company.company_name} logo`} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-slate-500">{company.company_name.slice(0, 2)}</span>
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700">
            {company.company_name}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{company.organization_type ?? 'Organization'}</p>
        </div>
      </div>

      <div className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 text-slate-500 group-hover:text-indigo-600 group-hover:border-indigo-200">
        <FiArrowUpRight className="h-4 w-4" />
      </div>
    </Link>
  )
}
