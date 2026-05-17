import type { JobDetail } from './types'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  live: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  screening: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  interview: 'bg-violet-50 text-violet-700 border-violet-100',
  assessment: 'bg-sky-50 text-sky-700 border-sky-100',
  offer_made: 'bg-blue-50 text-blue-700 border-blue-100',
  hired: 'bg-green-50 text-green-700 border-green-100',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
  expired: 'bg-rose-50 text-rose-700 border-rose-100',
  on_hold: 'bg-orange-50 text-orange-700 border-orange-100',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
}

const ACTIVE_STATUSES = new Set(['live', 'screening', 'interview', 'assessment'])

const formatStatus = (s: string) =>
  s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

const formatDate = (v?: string | null) => {
  if (!v) return null
  const d = new Date(v)
  if (isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(d)
}

const formatDeadlineDays = (v?: string | null) => {
  if (!v) return null
  const diff = Math.ceil((new Date(v).getTime() - Date.now()) / 86400000)
  if (diff < 0) return 'Expired'
  if (diff === 0) return 'Closes today'
  if (diff === 1) return '1 day left'
  return `${diff} days left`
}

const formatWorkplace = (v?: number | null) => {
  if (v === 1) return 'Remote'
  if (v === 2) return 'Hybrid'
  if (v === 3) return 'On-site'
  return null
}

const formatLakh = (val: string | null | undefined): string => {
  const n = parseFloat(val ?? '')
  if (isNaN(n)) return String(val ?? '')
  if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
  return String(n)
}

const formatStipend = (job: JobDetail): string => {
  if (job.is_salary_hidden) return 'Confidential'
  const currency = job.currency ?? '₹'
  const rawPeriod = job.salary_period?.toLowerCase() ?? ''
  const period = rawPeriod
    ? '/' + rawPeriod.replace('monthly', 'mo').replace('yearly', 'yr').replace('annually', 'yr').replace('hourly', 'hr')
    : ''
  if (job.salary_type === 'FIXED' && job.fixed_amount) return `${currency}${formatLakh(job.fixed_amount)}${period}`
  if (job.min_amount && job.max_amount) return `${currency}${formatLakh(job.min_amount)}–${formatLakh(job.max_amount)}${period}`
  if (job.is_negotiable) return 'Negotiable'
  return 'Not disclosed'
}

const formatExp = (min?: number | null, max?: number | null): string | null => {
  if (min == null && max == null) return null
  if (min === 0 && max == null) return 'Fresher / 0 yrs'
  if (min === 0) return `0–${max} years`
  if (max == null) return `${min}+ years`
  return `${min}–${max} years`
}

export default function JobHeader({ job }: { job: JobDetail }) {
  const statusStyle = STATUS_STYLES[job.job_status] ?? 'bg-slate-100 text-slate-600 border-slate-200'
  const isActive = ACTIVE_STATUSES.has(job.job_status)
  const workplace = formatWorkplace(job.workplace_type)
  const location = job.location_name ?? 'Remote'
  const stipend = formatStipend(job)
  const exp = formatExp(job.experience_min, job.experience_max)
  const postedDate = formatDate(job.created_at)
  const deadlineDate = formatDate(job.job_deadline)
  const deadlineDays = formatDeadlineDays(job.job_deadline)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Top accent bar for active internships */}
      {isActive && (
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-indigo-500" />
      )}

      <div className="p-6 sm:p-8">
        {/* Company + title row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
              {job.company_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.company_logo}
                  alt={`${job.company_name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-slate-500 select-none">
                  {job.company_name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {job.position}
              </h1>
              <p className="mt-1 text-base font-medium text-slate-500">{job.company_name}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 self-start">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle}`}>
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80 animate-pulse" />}
              {formatStatus(job.job_status)}
            </span>
            <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
              Internship
            </span>
            {workplace && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {workplace}
              </span>
            )}
          </div>
        </div>

        {/* Key info strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoCell
            icon={
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            label="Location"
            value={location}
          />
          <InfoCell
            icon={
              <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Stipend"
            value={stipend}
            valueClass={stipend !== 'Not disclosed' && stipend !== 'Confidential' ? 'text-emerald-700 font-bold' : undefined}
          />
          <InfoCell
            icon={
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            label="Experience"
            value={exp ?? 'Any'}
          />
          <InfoCell
            icon={
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="Posted on"
            value={postedDate ?? '—'}
          />
        </div>

        {/* Deadline banner */}
        {job.job_deadline && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-2.5 text-sm">
            <svg className="h-4 w-4 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-amber-800">
              <span className="font-semibold">Apply by {deadlineDate}</span>
              {deadlineDays && <span className="ml-2 text-amber-600">({deadlineDays})</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoCell({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      </div>
      <p className={`text-sm font-semibold text-slate-800 ${valueClass ?? ''}`}>{value}</p>
    </div>
  )
}
