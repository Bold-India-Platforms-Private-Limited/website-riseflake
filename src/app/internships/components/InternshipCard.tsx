import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatSalaryChip } from '../../../lib/salary'

export type JobListItem = {
  slug: string
  position: string
  company_name: string
  company_logo: string | null
  job_type: string
  created_at: string
  updated_at?: string
  location_name: string | null
  location_city?: string | null
  location_state?: string | null
  location_country?: string | null
  job_skills: (string | number)[]
  job_status: string
  visibility_status: number
  job_deadline?: string | null
  experience_min?: number | null
  experience_max?: number | null
  salary_type?: string | null
  fixed_amount?: string | null
  min_amount?: string | null
  max_amount?: string | null
  is_salary_hidden?: boolean | null
  is_negotiable?: boolean | null
  currency?: string | null
  salary_period?: string | null
  workplace_type?: number | null
}

const ACTIVE_STATUSES = new Set(['live', 'screening', 'interview', 'assessment'])


const formatExperience = (min?: number | null, max?: number | null): string | null => {
  if (min == null && max == null) return null
  if (min === 0 && max == null) return 'Fresher'
  if (min === 0) return `0–${max} yrs`
  if (max == null) return `${min}+ yrs`
  return `${min}–${max} yrs`
}

const formatDeadline = (val?: string | null): string | null => {
  if (!val) return null
  const date = new Date(val)
  if (isNaN(date.getTime())) return null
  const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return null
  if (diff === 0) return 'Closes today'
  if (diff <= 3) return `${diff}d left`
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date)
}

const formatPostedDate = (value: string) => {
  const date = new Date(value)
  if (isNaN(date.getTime())) return ''
  const diff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d ago'
  if (diff < 30) return `${diff}d ago`
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date)
}

const workplaceLabel = (val?: number | null) => {
  if (val === 1) return 'Remote'
  if (val === 2) return 'Hybrid'
  if (val === 3) return 'On-site'
  return null
}

export default function InternshipCard({ job }: { job: JobListItem }) {
  const location = job.location_name ?? 'Remote'
  const stipendDisplay = formatSalaryChip(job)
  const expDisplay = formatExperience(job.experience_min, job.experience_max)
  const deadlineDisplay = formatDeadline(job.job_deadline)
  const postedDisplay = formatPostedDate(job.created_at)
  const workplace = workplaceLabel(job.workplace_type)
  const isActive = ACTIVE_STATUSES.has(job.job_status)
  const skillNames = (job.job_skills ?? []).filter((s): s is string => typeof s === 'string')

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-indigo-300 hover:shadow-md">
      <a
        href={`/internships/${job.slug}`}
        className="block p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-t-2xl"
        aria-label={`${job.position} at ${job.company_name} — ${location}`}
      >
        {/* Top row: logo + title + job-type chip */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
            {job.company_logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.company_logo}
                alt={`${job.company_name} logo`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-sm font-bold text-slate-500 select-none">
                {job.company_name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight">
                {job.position}
              </h2>
              {isActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 border border-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Hiring
                </span>
              )}
              {deadlineDisplay && (
                <span className="rounded-full bg-rose-50 border border-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                  {deadlineDisplay}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium text-slate-500">{job.company_name}</p>
          </div>

          <span className="hidden sm:block flex-shrink-0 self-start rounded-full bg-violet-50 border border-violet-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700">
            Internship
          </span>
        </div>

        {/* Key meta row — location, workplace, exp, stipend, posted */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </span>

          {workplace && workplace !== location && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {workplace}
            </span>
          )}

          {expDisplay && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {expDisplay} exp
            </span>
          )}

          {stipendDisplay && (
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {stipendDisplay}
            </span>
          )}

          <span className="ml-auto text-[11px] text-slate-400">{postedDisplay}</span>
        </div>

        {/* Skills */}
        {skillNames.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skillNames.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-600"
              >
                {skill}
              </span>
            ))}
            {skillNames.length > 6 && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-500">
                +{skillNames.length - 6} more
              </span>
            )}
          </div>
        )}
      </a>

      {/* Card footer */}
      <div className="border-t border-slate-100 px-5 py-2.5 flex items-center justify-between">
        <span className="text-xs text-slate-400 sm:hidden capitalize">Internship</span>
        <span className="hidden sm:block" />
        <Link
          href={`/internships/${job.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          aria-label={`View full details for ${job.position} at ${job.company_name}`}
        >
          View details <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  )
}
