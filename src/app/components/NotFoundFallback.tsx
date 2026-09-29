'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Track404Beacon from './Track404Beacon'
import { API_BASE_URL } from '../../lib/config'
import { FALLBACK_PATTERN_SOURCE, matchFallbackRoute, type FallbackRoute } from '../../lib/fallbackRoutes'

/**
 * Browser-side fallback for URLs that were not pre-rendered.
 *
 * On Vercel every URL without a file gets the real HTTP 404 page — correct for search
 * engines, and exactly what we want for typos. But some of those URLs are perfectly valid records
 * that just are not part of the static build: a job posted after the last (scheduled) build, one of
 * the ~68,000 colleges, a registry company, a profile outside the SEO budget. For those, this
 * component (mounted inside 404.html) looks at the URL, fetches the record from the public API and
 * renders the normal page in the browser — the visitor never sees a 404. Crawlers still get the 404
 * status, and pick the page up properly at the next build (it enters the manifest → static + sitemap).
 *
 * Only a record the API says does not exist (404 / 410) shows the 404 page and reports it to the
 * 404 tracker. A network / API error shows the 404 UI too, but is NOT reported (it isn't a broken link).
 */

type Phase = { kind: 'checking' } | { kind: 'view'; node: ReactNode } | { kind: 'missing' } | { kind: 'error' }

// ── API helpers (browser) ────────────────────────────────────────────────────────────────────
class Missing extends Error {}

async function api<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`)
  if (res.status === 404 || res.status === 410) throw new Missing(path)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`)
  return (await res.json()) as T
}
const enc = encodeURIComponent

type ListingResponse = { status: boolean; result?: import('../jobs/[slug]/components/types').JobDetail }

/** Deadline passed or recruiter closed it — same rule as the pre-rendered job / internship pages. */
function isExpiredListing(job: import('../jobs/[slug]/components/types').JobDetail): boolean {
  if (job.job_status === 'closed') return true
  if (job.job_deadline) {
    const deadline = new Date(job.job_deadline)
    deadline.setHours(23, 59, 59, 999)
    if (deadline < new Date()) return true
  }
  return false
}

// ── one loader per route kind; each dynamic-imports its view so the 404 page stays light ────────
async function load(route: FallbackRoute): Promise<{ node: ReactNode; title?: string } | 'redirected'> {
  switch (route.kind) {
    case 'job': {
      const [{ default: View }, data] = await Promise.all([
        import('../jobs/[slug]/JobDetailView'),
        api<ListingResponse>(`/jobs/${enc(route.slug)}`),
      ])
      if (!data.status || !data.result) throw new Missing(route.slug)
      const job = data.result
      return { node: <View job={job} isExpired={isExpiredListing(job)} />, title: `${job.position} at ${job.company_name}` }
    }
    case 'internship': {
      const [{ default: View }, data] = await Promise.all([
        import('../internships/[slug]/InternshipDetailView'),
        api<ListingResponse>(`/internships/${enc(route.slug)}`),
      ])
      if (!data.status || !data.result) throw new Missing(route.slug)
      const internship = data.result
      return {
        node: <View internship={internship} isExpired={isExpiredListing(internship)} />,
        title: `${internship.position} Internship at ${internship.company_name}`,
      }
    }
    case 'company': {
      const [{ default: View }, data] = await Promise.all([
        import('../companies/[slug]/CompanyDetailView'),
        api<{ status: boolean; result?: import('../companies/[slug]/CompanyDetailView').CompanyDetail }>(`/companies/${enc(route.slug)}`),
      ])
      if (!data.status || !data.result) throw new Missing(route.slug)
      const company = data.result
      // The company's open roles are a nice-to-have — never fail the page over them.
      const jobs = await api<{ result?: never[]; total?: number }>(
        `/jobs?company_name=${enc(company.company_name)}&limit=6`,
      ).catch(() => ({ result: [] as never[], total: 0 }))
      return {
        node: <View company={company} companyJobs={jobs.result ?? []} companyJobsTotal={jobs.total ?? jobs.result?.length ?? 0} />,
        title: company.company_name,
      }
    }
    case 'college': {
      const [{ default: View }, data] = await Promise.all([
        import('../colleges/[slug]/CollegeDetailClient'),
        api<{ result?: import('../colleges/[slug]/CollegeDetailClient').CollegeDetail }>(`/colleges/${enc(route.slug)}`),
      ])
      if (!data.result) throw new Missing(route.slug)
      return { node: <View college={data.result} />, title: data.result.college_name }
    }
    case 'profile': {
      const [{ default: View }, profileRes] = await Promise.all([
        import('../in/[slug]/ProfileView'),
        api<{ status: boolean; result?: import('../in/[slug]/ProfileView').PublicProfile }>(`/users/${enc(route.slug)}`),
      ])
      const profile = profileRes.status ? profileRes.result : undefined
      if (!profile) throw new Missing(route.slug)
      // Old / stale slug → the canonical name-slug URL (the pre-rendered page does this with a redirect).
      if (route.slug !== profile.profile_slug) {
        window.location.replace(`/in/${enc(profile.profile_slug)}`)
        return 'redirected'
      }
      const [rich, disc] = await Promise.all([
        api<{ status?: boolean; result?: import('../in/[slug]/ProfileView').RichProfile }>(`/people/${enc(profile.profile_slug)}`)
          .then((d) => (d.status ? d.result ?? null : null))
          .catch(() => null),
        api<{ discovery?: import('../in/[slug]/ProfileView').Discovery }>(`/people/${enc(profile.profile_slug)}/similar`)
          .then((d) => d.discovery ?? null)
          .catch(() => null),
      ])
      return { node: <View profile={profile} rich={rich} discovery={disc} />, title: profile.full_name }
    }
    case 'india-company': {
      const [{ default: View }, { fetchIndiaCompanyDetail }] = await Promise.all([
        import('../discover/companies/india/IndiaCompanyDetailView'),
        import('../../lib/indiaCompanyDirectory'),
      ])
      const company = await fetchIndiaCompanyDetail(route.slug)
      if (company === null) throw new Missing(route.slug)
      if (company === undefined) throw new Error('registry unavailable')
      return { node: <View company={company} />, title: company.company_name }
    }
  }
}

// ── pre-paint guard ─────────────────────────────────────────────────────────────────────────
// Runs while the HTML is still being parsed, before first paint: if the URL is one the fallback can
// render, hide the 404 UI (and show a loader) so the visitor never sees a flash of "404" first.
const PRE_PAINT_SCRIPT = `(function(){try{if(new RegExp(${JSON.stringify(FALLBACK_PATTERN_SOURCE)}).test(location.pathname))document.documentElement.classList.add('rf-fallback')}catch(e){}})()`
const PRE_PAINT_CSS = '#rf-loader{display:none}.rf-fallback #rf-404{display:none}.rf-fallback #rf-loader{display:flex}'
const reveal404 = () => document.documentElement.classList.remove('rf-fallback')

/**
 * Wraps the 404 UI. Renders the 404 UI (server HTML, so unknown URLs and crawlers get it
 * immediately) unless the URL is a fallback candidate, in which case it renders the record.
 */
export default function NotFoundFallback({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>({ kind: 'checking' })

  useEffect(() => {
    const route = matchFallbackRoute(window.location.pathname)
    if (!route) {
      reveal404()
      setPhase({ kind: 'missing' })
      return
    }
    let live = true
    load(route)
      .then((res) => {
        if (!live || res === 'redirected') return
        if (res.title) document.title = `${res.title} | Riseflake Jobportal`
        document.documentElement.classList.remove('rf-fallback')
        setPhase({ kind: 'view', node: res.node })
      })
      .catch((err) => {
        if (!live) return
        reveal404()
        setPhase(err instanceof Missing ? { kind: 'missing' } : { kind: 'error' })
      })
    return () => {
      live = false
    }
  }, [])

  if (phase.kind === 'view') return <>{phase.node}</>

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRE_PAINT_CSS }} />
      <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
      <div id="rf-404">{children}</div>
      <div id="rf-loader" className="min-h-screen items-center justify-center bg-slate-50" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
      {/* Only a record the API confirms does not exist is a broken link worth reporting. */}
      {phase.kind === 'missing' && <Track404Beacon />}
    </>
  )
}
