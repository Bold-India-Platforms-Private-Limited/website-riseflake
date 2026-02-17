import InternshipCard, { JobListItem } from './InternshipCard'

export default function InternshipList({ internships }: { internships: JobListItem[] }) {
  if (!internships.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <h3 className="text-xl font-semibold text-slate-900">No internships found</h3>
        <p className="mt-2 text-sm text-slate-600">
          Try adjusting your filters or check back soon for new opportunities.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ul aria-label="Internship Listings" style={{ listStyle: "none", padding: 0 }}>
        {internships.map((internship) => (
          <li key={internship.slug} style={{ marginBottom: "12px" }}>
            <InternshipCard job={internship} />
          </li>
        ))}
      </ul>
    </div>
  )
}
