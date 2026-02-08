import JobCard, { JobListItem } from './JobCard'

export default function JobList({ jobs }: { jobs: JobListItem[] }) {
  if (!jobs.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <h3 className="text-xl font-semibold text-slate-900">No jobs found</h3>
        <p className="mt-2 text-sm text-slate-600">
          Try adjusting your filters or check back soon for new opportunities.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <JobCard key={job.slug} job={job} />
      ))}
    </div>
  )
}
