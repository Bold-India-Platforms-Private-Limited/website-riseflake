/**
 * dataLayer events for Google Tag Manager (GTM-TQ2SSCRW → GA4 web stream G-93EEGM5820).
 *
 * Event names and parameters are shared with riseflake.com and app.riseflake.com so GA4 shows one
 * funnel: view_job → apply_click (hand-off to the web app) → apply_job. GTM maps each event to a GA4
 * event tag and adds rf_surface ("Jobportal") from the hostname, so nothing here hardcodes the site.
 * Page views and site search (?position=) come from GA4 enhanced measurement, not from this file.
 */
type Params = Record<string, string | number | boolean | null | undefined>

export function track(event: string, params: Params = {}): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
}

export type JobKind = 'job' | 'internship'

type TrackableJob = {
  job_id?: number | null
  slug: string
  position: string
  company_name: string
  job_type?: string | null
  location_name?: string | null
}

/** The job parameters every job event carries (same keys as the web app's apply_job). */
export function jobParams(job: TrackableJob, kind: JobKind): Params {
  return {
    job_id: job.job_id != null ? String(job.job_id) : job.slug,
    job_title: job.position,
    company_name: job.company_name,
    job_kind: kind,
    job_type: job.job_type ?? undefined,
    job_location: job.location_name ?? undefined,
  }
}

/**
 * Query string that hands the visitor's stored attribution to the web app. Uses att_* instead of
 * utm_*: UTM parameters on a link between our own sites would start a new GA4 session credited to
 * that (possibly weeks-old) campaign, while the GA cookie already carries the session across
 * *.riseflake.com. The web app maps att_* back onto its signup attribution (utmUtils.js there).
 */
export function attributionHandoffQuery(): string {
  try {
    const raw = localStorage.getItem('rf_attribution')
    if (!raw) return ''
    const a = JSON.parse(raw) as Record<string, string>
    const p = new URLSearchParams()
    const map: Record<string, string> = {
      utm_source: 'att_source', utm_medium: 'att_medium', utm_campaign: 'att_campaign',
      utm_content: 'att_content', utm_term: 'att_term', ref: 'att_ref',
    }
    for (const [from, to] of Object.entries(map)) if (a[from]) p.set(to, a[from])
    return p.toString()
  } catch {
    return '' // localStorage unavailable
  }
}
