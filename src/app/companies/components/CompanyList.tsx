import CompanyCard, { CompanyListItem } from './CompanyCard'

export default function CompanyList({ companies }: { companies: CompanyListItem[] }) {
  if (!companies.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <h3 className="text-xl font-semibold text-slate-900">No companies found</h3>
        <p className="mt-2 text-sm text-slate-600">
          Please check back later for new company profiles.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {companies.map((company) => (
        <CompanyCard key={company.slug} company={company} />
      ))}
    </div>
  )
}
