import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const WEBSITE_BASE_URL = 'https://app.riseflake.com'

const JOB_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  live: 'bg-emerald-50 text-emerald-700',
  screening: 'bg-cyan-50 text-cyan-700',
  interview: 'bg-violet-50 text-violet-700',
  assessment: 'bg-sky-50 text-sky-700',
  offer_made: 'bg-blue-50 text-blue-700',
  hired: 'bg-green-50 text-green-700',
  closed: 'bg-slate-100 text-slate-700',
  expired: 'bg-rose-50 text-rose-700',
  on_hold: 'bg-orange-50 text-orange-700',
  cancelled: 'bg-red-50 text-red-700',
}

export type JobListItem = {
  slug: string
  position: string
  company_name: string
  company_logo: string | null
  job_type: string
  created_at: string
  location_name: string | null
  job_skills: string[]
  job_status: string
  visibility_status: number
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date)
}

const formatStatusLabel = (status: string) =>
  status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

export default function InternshipCard({ job }: { job: JobListItem }) {
  const location = job.location_name ?? 'Remote'
  const statusStyle = JOB_STATUS_STYLES[job.job_status] ?? 'bg-slate-100 text-slate-700'

  return (
    <div className="relative group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      {/* Internal arrow link */}
      <Link
        href={`${WEBSITE_BASE_URL}/internships/${job.slug}`}
        className="absolute top-4 right-4 flex items-center justify-center rounded-full bg-slate-100 p-2 transition hover:bg-indigo-100 hover:text-indigo-700 z-10"
        aria-label={`View details for ${job.position} at ${job.company_name}`}
        tabIndex={0}
        onClick={e => e.stopPropagation()}
      >
        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* Entire card is external link */}
      <a
        href={`/internships/${job.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none"
        aria-label={`View and apply for ${job.position} at ${job.company_name} (external link)`}
        tabIndex={-1}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
              {job.company_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.company_logo} alt={`${job.company_name} logo`} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-slate-500">{job.company_name.slice(0, 2)}</span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{job.position}</h2>
              <p className="text-slate-600 mt-1">{job.company_name}</p>
              <p className="text-xs text-slate-500 mt-1">{location}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`rounded-full hidden md:block px-3 mr-10 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyle}`}>
              {formatStatusLabel(job.job_status)}
            </span>
            <span className="rounded-full hidden md:block bg-indigo-50 px-3 mr-10 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {job.job_type}
            </span>
            <span className="rounded-full hidden md:block bg-slate-100 px-3 mr-10 py-1 text-xs">{formatDate(job.created_at)}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 md:hidden">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyle}`}>
            {formatStatusLabel(job.job_status)}
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            {job.job_type}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{formatDate(job.created_at)}</span>
        </div>
      </a>
    </div>
  )
}
