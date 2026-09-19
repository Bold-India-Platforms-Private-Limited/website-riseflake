import React from 'react'
import { Users, Briefcase, Globe, Home, Building2, BadgeCheck, GraduationCap, Calendar, MapPin, Banknote } from 'lucide-react'
import Navbar from '../../components/Navbar'
import ApplyCard from './components/ApplyCard'
import JobDescription from './components/JobDescription'
import JobHeader from './components/JobHeader'
import TagsSection from './components/TagsSection'
import DownloadAppCard from './components/DownloadAppCard'
import JobReportWrapper from '../../components/JobReportWrapper'
import type { JobDetail } from './components/types'
import { formatSalaryChip } from '../../../lib/salary'

/**
 * The visible job page. Shared by the pre-rendered page (page.tsx) and by the browser-side
 * fallback for jobs that aren't in the static build yet (src/app/components/NotFoundFallback.tsx),
 * so both render identically.
 *
 * `similar` is a slot because "similar listings" is an async server component: the pre-rendered
 * page passes it in, the client fallback simply omits it.
 */
export default function JobDetailView({
  job,
  isExpired,
  similar = null,
}: {
  job: JobDetail
  isExpired: boolean
  similar?: React.ReactNode
}) {
  return (
    <>
      <Navbar bgTransparent />

      <main className="px-4 sm:px-6 lg:px-8 py-8 bg-slate-100 min-h-screen pt-20">
        <div className="max-w-[1200px] mx-auto space-y-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
            <a href="/" className="hover:text-indigo-600 font-medium">Home</a>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <a href="/jobs" className="hover:text-indigo-600 font-medium">Jobs</a>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-700 font-medium truncate max-w-[200px]">{job.position}</span>
          </nav>

          <JobHeader job={job} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            {/* Main content */}
            <div className="space-y-6">

              {/* Role highlights */}
              <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                  <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h2 className="text-sm font-semibold text-slate-700">Role at a glance</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-slate-100">
                  <HighlightCell icon={<Users className="h-4 w-4" />} label="Openings" accent="bg-blue-50" iconColor="text-blue-500"
                    value={job.job_vacancy != null ? String(job.job_vacancy) : 'Not specified'} />
                  <HighlightCell icon={<Briefcase className="h-4 w-4" />} label="Experience" accent="bg-indigo-50" iconColor="text-indigo-500"
                    value={
                      job.experience_min != null || job.experience_max != null
                        ? `${job.experience_min ?? 0}–${job.experience_max ?? ''}${job.experience_max ? '' : '+'} yrs`
                        : 'Any level'
                    }
                  />
                  <HighlightCell icon={<Banknote className="h-4 w-4" />} label="Salary" accent="bg-emerald-50" iconColor="text-emerald-500"
                    value={
                      job.is_salary_hidden
                        ? 'Confidential'
                        : formatSalaryChip(job) ?? 'Not disclosed'
                    }
                  />
                  <HighlightCell
                    icon={job.workplace_type === 1 ? <Globe className="h-4 w-4" /> : job.workplace_type === 2 ? <Home className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                    label="Workplace" accent="bg-violet-50" iconColor="text-violet-500"
                    value={job.workplace_type === 1 ? 'Remote' : job.workplace_type === 2 ? 'Hybrid' : job.workplace_type === 3 ? 'On-site' : 'Not specified'}
                  />
                  <HighlightCell icon={<BadgeCheck className="h-4 w-4" />} label="Eligibility" accent="bg-emerald-50" iconColor="text-emerald-500"
                    value={job.eligibility === 1 ? 'Eligible' : job.eligibility === 0 ? 'Not eligible' : 'Open to all'}
                  />
                  <HighlightCell icon={<GraduationCap className="h-4 w-4" />} label="Student status" accent="bg-amber-50" iconColor="text-amber-500"
                    value={job.student_currently_studying === true ? 'Studying OK' : job.student_currently_studying === false ? 'Pass-out only' : 'Not specified'}
                  />
                  {(() => {
                    const ys = Array.isArray(job.year_selection)
                      ? job.year_selection
                      : (() => { try { return JSON.parse(job.year_selection as unknown as string) } catch { return [] } })()
                    return ys?.length ? (
                      <HighlightCell icon={<Calendar className="h-4 w-4" />} label="Year of study" accent="bg-pink-50" iconColor="text-pink-500"
                        value={(ys as number[]).map(y => `${y}th`).join(', ')} />
                    ) : (
                      <HighlightCell icon={<MapPin className="h-4 w-4" />} label="Location" accent="bg-rose-50" iconColor="text-rose-500"
                        value={job.location_name ?? 'Remote'} />
                    )
                  })()}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TagsSection title="Categories" tags={job.categories} />
                <TagsSection title="Skills required" tags={job.job_skills} />
              </div>

              {job.job_facilities?.length > 0 && (
                <TagsSection title="Benefits & Facilities" tags={job.job_facilities} />
              )}

              <JobDescription html={job.job_description} />

              <JobReportWrapper jobSlug={job.slug} />
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <ApplyCard job={job} isExpired={isExpired} />
              <DownloadAppCard />
              {similar}
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-[1200px] mx-auto px-4 pb-10">
        <p className="text-xs text-gray-500 text-center mt-8">
          BIPPL has taken all reasonable steps to ensure that information on this site is authentic. Applicants are advised to research bonafides of advertisers independently. BIPPL shall not have any responsibility in this regard. Please note that RiseFlake will not be responsible for any information you share on the company platform.
        </p>
      </div>
    </>
  )
}

function HighlightCell({ icon, label, value, accent, iconColor }: { icon: React.ReactNode; label: string; value: string; accent?: string; iconColor?: string }) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${accent ?? 'bg-slate-100'}`}>
        <span className={iconColor ?? 'text-slate-500'}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800 leading-snug">{value}</p>
      </div>
    </div>
  )
}
