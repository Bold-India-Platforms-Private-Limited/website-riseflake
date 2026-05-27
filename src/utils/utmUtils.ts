/**
 * UTM / Attribution Utilities — riseflake.com (Next.js website)
 *
 * WHY THIS EXISTS
 * ───────────────
 * Users land on riseflake.com with UTM params (e.g. ?utm_source=linkedin).
 * They then click Login / Sign-up and are sent to app.riseflake.com.
 * Because those are different origins, localStorage is NOT shared.
 * We must carry the UTMs forward by appending them to the outbound URL.
 *
 * FLOW
 * ────
 * 1. User lands on riseflake.com/?utm_source=linkedin&utm_medium=social
 * 2. UTMCapture component (client-side) reads params → stores in localStorage
 * 3. Every link to app.riseflake.com gets ?utm_source=linkedin&utm_medium=social
 *    injected before the user clicks it
 * 4. app.riseflake.com receives the UTMs in the URL → usePageTracking captures them
 *    into its own localStorage → sent with the registration payload → stored in DB
 */

export const UTM_PARAMS  = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'] as const
export type UTMKey       = typeof UTM_PARAMS[number]
export const STORAGE_KEY = 'rf_attribution'

export type Attribution = Partial<Record<UTMKey | 'landing_page' | 'referrer' | 'captured_at', string>>

/** Read UTM params from the current URL and persist to localStorage. */
export function captureUTMs(): Attribution | null {
  try {
    const params  = new URLSearchParams(window.location.search)
    const hasUTMs = UTM_PARAMS.some(p => params.has(p))
    if (!hasUTMs) return getStoredUTMs()

    const attr: Attribution = {}
    UTM_PARAMS.forEach(p => {
      const v = params.get(p)
      if (v) attr[p] = v
    })
    attr.landing_page = window.location.pathname
    attr.referrer     = document.referrer || undefined
    attr.captured_at  = new Date().toISOString()

    localStorage.setItem(STORAGE_KEY, JSON.stringify(attr))
    return attr
  } catch {
    return null
  }
}

/** Return the previously captured attribution, or null. */
export function getStoredUTMs(): Attribution | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    return null
  }
}

/**
 * Append stored UTM params to a URL string.
 * Only adds params that are not already present in the URL.
 * Returns the original URL unchanged if nothing is stored.
 */
export function appendUTMsToUrl(url: string, attr?: Attribution | null): string {
  const source = attr ?? getStoredUTMs()
  if (!source) return url
  try {
    const u = new URL(url)
    UTM_PARAMS.forEach(p => {
      if (source[p] && !u.searchParams.has(p)) {
        u.searchParams.set(p, source[p] as string)
      }
    })
    return u.toString()
  } catch {
    return url
  }
}
