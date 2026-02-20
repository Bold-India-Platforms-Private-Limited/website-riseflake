import type { JobDetail } from './types'
import JobReportWrapper from '../../../components/JobReportWrapper'

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date)
}

const formatWorkplace = (value?: number | null) => {
  switch (value) {
    case 1:
      return 'Remote'
    case 2:
      return 'Hybrid'
    case 3:
      return 'On-site'
    default:
      return 'Not specified'
  }
}

export default function JobHeader({ job }: { job: JobDetail }) {
  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* Report button: top-right for both mobile and desktop */}
      <div className="absolute right-4 top-4">
        <JobReportWrapper jobSlug={job.slug} />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden relative">
              {job.company_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.company_logo} alt={`${job.company_name} logo`} className="h-full w-full object-cover" />
              ) : (
                <span className="text-base font-semibold text-slate-500">{job.company_name.slice(0, 2)}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">{job.position}</h1>
              <p className="text-slate-600 mt-1">{job.company_name}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold uppercase tracking-wide text-indigo-700">
              {job.job_type}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{formatWorkplace(job.workplace_type)}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Posted {formatDate(job.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
