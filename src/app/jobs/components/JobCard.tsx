import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const WEBSITE_BASE_URL='https://app.riseflake.com'

export type JobListItem = {
  slug: string
  position: string
  company_name: string
  company_logo: string | null
  job_type: string
  created_at: string
  location_name: string | null
  job_skills: string[]
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date)
}

export default function JobCard({ job }: { job: JobListItem }) {
  const location = job.location_name ?? 'Remote'

  return (
    <a
      href={`${WEBSITE_BASE_URL}/jobs/${job.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
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
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700">
              {job.position}
            </h3>
            <p className="text-sm text-slate-600 mt-1">{job.company_name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>{location}</span>
              <span>•</span>
              <span>Posted {formatDate(job.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
            {job.job_type}
          </span>
          <Link
            href={`/jobs/${job.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center rounded-full bg-slate-100 p-2 transition hover:bg-indigo-100 hover:text-indigo-700"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {job.job_skills?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.job_skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-600"
            >
              {skill}
            </span>
          ))}
          {job.job_skills.length > 5 && (
            <span className="text-xs text-slate-500">+{job.job_skills.length - 5} more</span>
          )}
        </div>
      ) : null}
    </a>
  )
}
