// Copy of jobs/[slug]/components/ApplyCard.tsx, but for internships
'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import type { JobDetail } from './types'
import { WEBSITE_BASE_URL } from '../../../../lib/config'

const formatSalary = (job: JobDetail) => {
  if (job.is_salary_hidden) return 'Confidential'
  const currency = job.currency ?? ''
  const period = job.salary_period ? ` / ${job.salary_period.toLowerCase()}` : ''
  if (job.salary_type === 'FIXED' && job.fixed_amount) {
    return `${currency} ${job.fixed_amount}${period}`
  }
  if (job.min_amount && job.max_amount) {
    return `${currency} ${job.min_amount} - ${currency} ${job.max_amount}${period}`
  }
  return job.is_negotiable ? 'Negotiable' : 'Not specified'
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Not specified'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date)
}

export default function ApplyCard({ job }: { job: JobDetail }) {
  const pathname = usePathname()
  const applyHref = useMemo(() => {
    const appBase = WEBSITE_BASE_URL.replace('://', '://app.')
    return `${appBase}${pathname}`
  }, [pathname])
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5 h-fit shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Apply on Riseflake</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">Submit your application</h3>
      </div>
      <a
        href={applyHref}
        className="block w-full rounded-xl bg-[#414FEA] py-3 text-center text-sm font-semibold text-white hover:shadow-lg"
      >
        Apply Now
      </a>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-500">Salary</p>
          <p className="text-base font-semibold text-slate-900">{formatSalary(job)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Open roles</p>
          <p className="text-base font-semibold text-slate-900">{job.job_vacancy ?? 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Deadline</p>
          <p className="text-base font-semibold text-slate-900">{formatDate(job.job_deadline)}</p>
        </div>
      </div>
    </aside>
  )
}
