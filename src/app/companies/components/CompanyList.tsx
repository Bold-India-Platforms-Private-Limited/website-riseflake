import { Building2 } from 'lucide-react'
import CompanyCard, { CompanyListItem } from './CompanyCard'

export default function CompanyList({ companies }: { companies: CompanyListItem[] }) {
  if (!companies.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-sm">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No companies found</h3>
        <p className="mt-1 text-sm text-slate-500">Try adjusting your search or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {companies.map((company) => (
        <CompanyCard key={company.slug} company={company} />
      ))}
    </div>
  )
}
