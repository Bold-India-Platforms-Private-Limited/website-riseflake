'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Gift, ChevronDown, ChevronUp } from 'lucide-react'
import type { JobDetail } from './types'
import { WEBSITE_BASE_URL, APP_BASE_URL, resolveAppBaseUrl } from '../../../../lib/config'
import { formatSalaryInfo } from '../../../../lib/salary'

// Literal gradient classes (keep here, not in lib/salary.ts — Tailwind only scans
// pages/components/app for class names, so classes written in lib/ get purged).
const SALARY_TONE_GRADIENT = {
  pay: 'from-emerald-600 to-teal-600',
  incentive: 'from-amber-500 to-orange-500',
  unpaid: 'from-slate-500 to-slate-600',
  negotiable: 'from-indigo-500 to-violet-600',
} as const

// ─── Deadline badge ────────────────────────────────────────────────────────────
function DeadlineBadge({ deadline }: { deadline: string }) {
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000)
  if (Number.isNaN(diff) || diff < 0) return null

  const urgent   = diff <= 7
  const moderate = diff > 7 && diff <= 30

  const colors = urgent
    ? 'bg-rose-50 border-rose-200 text-rose-700'
    : moderate
    ? 'bg-amber-50 border-amber-200 text-amber-700'
    : 'bg-slate-50 border-slate-200 text-slate-600'

  const dot = urgent
    ? 'bg-rose-500 animate-pulse'
    : moderate
    ? 'bg-amber-500'
    : 'bg-slate-400'

  const label = diff === 0
    ? 'Closes today'
    : diff === 1
    ? '1 day left'
    : `${diff} days left`

  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${colors}`}>
      <span className={`h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
      <div>
        <span className="text-sm font-semibold">{label}</span>
        <span className="ml-1.5 text-xs opacity-70">to apply</span>
      </div>
    </div>
  )
}

// ─── Share row ─────────────────────────────────────────────────────────────────
function ShareRow({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)
  const enc     = encodeURIComponent(url)
  const encText = encodeURIComponent(`${title} — Apply on Riseflake`)

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url) } catch { /* noop */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Share</p>
      <div className="flex gap-2">
        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`}
          target="_blank" rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0A66C2] py-2 text-[11px] font-semibold text-white hover:bg-[#004182] transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encText}%20${enc}`}
          target="_blank" rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] py-2 text-[11px] font-semibold text-white hover:bg-[#1aab52] transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>

        {/* Copy */}
        <button
          onClick={copyLink}
          className={`flex items-center justify-center rounded-lg border px-3 py-2 transition-colors ${
            copied ? 'border-emerald-300 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
          }`}
          title="Copy link"
        >
          {copied ? (
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function ApplyCard({ job }: { job: JobDetail }) {
  const pathname = usePathname()
  const [incentivesOpen, setIncentivesOpen] = useState(false)

  // Hand off to the web app's job page with ?apply=1 — it opens the apply flow
  // (sign in + phone capture, or straight to confirm if already signed in).
  // Starts from the SSR-safe base, then swaps to the local dev app on localhost.
  const [appBase, setAppBase] = useState(APP_BASE_URL)
  useEffect(() => { setAppBase(resolveAppBaseUrl()) }, [])
  const applyHref = useMemo(() => `${appBase}${pathname}?apply=1`, [appBase, pathname])

  const shareUrl   = `${WEBSITE_BASE_URL}${pathname}`
  const salaryInfo = formatSalaryInfo(job)

  // Openings display
  const _v = Number(job.job_vacancy)
  const openings = job.job_vacancy != null && job.job_vacancy !== '' && !isNaN(_v) ? _v : null

  return (
    <>
      {/* ── Desktop sidebar card ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col gap-4">

        {/* Apply card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          {/* Salary / header strip */}
          {salaryInfo ? (
            <div className={`bg-gradient-to-br ${SALARY_TONE_GRADIENT[salaryInfo.tone]} px-5 pt-5 pb-4`}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">{salaryInfo.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{salaryInfo.display}</p>
              {salaryInfo.hasIncentives && (
                <button
                  type="button"
                  onClick={() => setIncentivesOpen(v => !v)}
                  className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-white/20 hover:bg-white/30 px-3 py-1 text-xs font-semibold text-white transition-colors"
                >
                  <Gift className="h-3 w-3" />
                  + Incentives
                  {incentivesOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-5 pt-5 pb-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-200">Ready to apply?</p>
              <p className="mt-1 text-xl font-bold text-white">Submit your application</p>
            </div>
          )}

          {/* Incentives detail */}
          {salaryInfo?.hasIncentives && incentivesOpen && (
            <div className="border-b border-amber-100 bg-amber-50 px-5 py-3 space-y-1.5">
              {salaryInfo.incentiveItems.map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-amber-800">
                  <Gift className="h-3 w-3 flex-shrink-0 text-amber-500" />
                  {item}
                </div>
              ))}
            </div>
          )}

          <div className="p-5 space-y-3">

            {/* Apply CTA */}
            <a
              href={applyHref}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 hover:bg-indigo-700 hover:shadow-indigo-300/60 active:scale-[0.98] transition-all"
            >
              Apply Now
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </a>

            {/* Deadline */}
            {job.job_deadline && <DeadlineBadge deadline={job.job_deadline} />}

            {/* Compact meta row */}
            {openings !== null && (
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-2.5">
                <svg className="h-4 w-4 flex-shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{openings}</span>
                  {' '}open {openings === 1 ? 'role' : 'roles'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Share card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <ShareRow title={job.position} url={shareUrl} />
        </div>

        {/* Trust line */}
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          Secured &amp; verified by Riseflake
        </p>
      </aside>

      {/* ── Mobile sticky bottom bar ─────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 max-w-lg mx-auto">

          {/* Deadline pill — small screens */}
          {job.job_deadline && (() => {
            const diff = Math.ceil((new Date(job.job_deadline).getTime() - Date.now()) / 86_400_000)
            if (diff < 0 || Number.isNaN(diff)) return null
            const urgent = diff <= 7
            return (
              <div className={`hidden sm:flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold flex-shrink-0 ${
                urgent ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${urgent ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                {diff === 0 ? 'Closes today' : `${diff}d left`}
              </div>
            )
          })()}

          {/* Salary snippet */}
          {salaryInfo && (
            <div className="hidden sm:block flex-shrink-0 min-w-0">
              <p className="text-[10px] text-slate-400 font-medium leading-none">{salaryInfo.label}</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{salaryInfo.display}</p>
            </div>
          )}

          {/* Apply button */}
          <a
            href={applyHref}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 active:scale-[0.97] transition-all"
          >
            Apply Now
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </a>
        </div>

        <p className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-1.5">
          <svg className="h-2.5 w-2.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          Secured by Riseflake
        </p>
      </div>

      {/* Spacer so content clears mobile bar */}
      <div className="lg:hidden h-24" />
    </>
  )
}
