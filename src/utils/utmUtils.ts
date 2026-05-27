/**
 * UTM / Attribution Utilities — riseflake.com (Next.js website)
 *
 * WHY THIS EXISTS
 * ───────────────
 * Users land on riseflake.com from LinkedIn, Google, Instagram, etc.
 * They click Login / Sign-up → sent to app.riseflake.com.
 * Because those are different origins, localStorage is NOT shared.
 * We must carry attribution forward by appending it to every outbound URL.
 *
 * FOUR-LAYER CAPTURE (priority order)
 * ─────────────────────────────────────
 *  1. Explicit UTM params   ?utm_source=linkedin&utm_medium=social
 *  2. Already-stored        From a prior page visit this session
 *  3. Click-ID params       fbclid, gclid, trk, li_fat_id, igshid …
 *  4. Referrer auto-detect  document.referrer → LinkedIn / Google / Instagram
 *
 * CROSS-DOMAIN FLOW
 * ─────────────────
 *  riseflake.com/?utm_source=linkedin  →  UTMCapture stores it
 *  User clicks any app.riseflake.com link  →  appendUTMsToUrl injects params
 *  app.riseflake.com/?utm_source=linkedin  →  React app captures + saves to DB
 */

export const UTM_PARAMS  = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'] as const
export type  UTMKey      = typeof UTM_PARAMS[number]
export const STORAGE_KEY = 'rf_attribution'

export type Attribution = Partial<
  Record<UTMKey | 'landing_page' | 'referrer' | 'captured_at', string>
> & { auto_detected?: boolean }

// ── Layer 3: Ad-platform click-ID params ─────────────────────────────────────
const CLICK_ID_MAP: Array<{ param: string; utm_source: string; utm_medium: string }> = [
  { param: 'fbclid',    utm_source: 'facebook',  utm_medium: 'paid_social' },
  { param: 'gclid',     utm_source: 'google',    utm_medium: 'cpc'         },
  { param: 'msclkid',   utm_source: 'bing',       utm_medium: 'cpc'         },
  { param: 'twclid',    utm_source: 'twitter',   utm_medium: 'paid_social' },
  { param: 'li_fat_id', utm_source: 'linkedin',  utm_medium: 'paid_social' },
  { param: 'trk',       utm_source: 'linkedin',  utm_medium: 'social'      },
  { param: 'igshid',    utm_source: 'instagram', utm_medium: 'social'      },
  { param: 'mc_cid',    utm_source: 'mailchimp', utm_medium: 'email'       },
]

// ── Layer 4: Referrer hostname patterns ──────────────────────────────────────
const REFERRER_MAP: Array<{ match: RegExp; utm_source: string; utm_medium: string }> = [
  { match: /linkedin\.com/i,                            utm_source: 'linkedin',          utm_medium: 'social'    },
  { match: /l\.instagram\.com|instagram\.com/i,         utm_source: 'instagram',         utm_medium: 'social'    },
  { match: /l\.facebook\.com|facebook\.com|fb\.com/i,   utm_source: 'facebook',          utm_medium: 'social'    },
  { match: /t\.co$|twitter\.com|x\.com/i,               utm_source: 'twitter',           utm_medium: 'social'    },
  { match: /wa\.me|whatsapp\.com/i,                     utm_source: 'whatsapp',          utm_medium: 'messaging' },
  { match: /t\.me$|telegram\.org/i,                     utm_source: 'telegram',          utm_medium: 'messaging' },
  { match: /bing\.com/i,                                utm_source: 'bing',              utm_medium: 'organic'   },
  { match: /yahoo\.com/i,                               utm_source: 'yahoo',             utm_medium: 'organic'   },
  { match: /duckduckgo\.com/i,                          utm_source: 'duckduckgo',        utm_medium: 'organic'   },
  { match: /naukri\.com/i,                              utm_source: 'naukri',            utm_medium: 'job_board' },
  { match: /indeed\.com/i,                              utm_source: 'indeed',            utm_medium: 'job_board' },
  { match: /shine\.com/i,                               utm_source: 'shine',             utm_medium: 'job_board' },
]

function _detectFromReferrer(referrer: string): Pick<Attribution, 'utm_source' | 'utm_medium'> | null {
  if (!referrer) return null
  try {
    const url  = new URL(referrer)
    const host = url.hostname.toLowerCase()

    // Google: distinguish Jobs vs organic search
    if (/google\./i.test(host)) {
      const ibp = url.searchParams.get('ibp') ?? ''
      const udm = url.searchParams.get('udm') ?? ''
      if (ibp.toLowerCase().includes('jobs') || udm === '8') {
        return { utm_source: 'google_jobs', utm_medium: 'job_board' }
      }
      return { utm_source: 'google', utm_medium: 'organic' }
    }

    for (const { match, utm_source, utm_medium } of REFERRER_MAP) {
      if (match.test(host)) return { utm_source, utm_medium }
    }

    // Catch-all external referrer
    return { utm_source: host.replace(/^www\./, ''), utm_medium: 'referral' }
  } catch {
    return null
  }
}

function _save(attr: Attribution): Attribution {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attr))
  } catch { /* ignore */ }
  return attr
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main capture function — four-layer attribution waterfall.
 * Called by UTMCapture on every page navigation.
 */
export function captureUTMs(): Attribution | null {
  try {
    const params = new URLSearchParams(window.location.search)
    const meta: Pick<Attribution, 'landing_page' | 'referrer' | 'captured_at'> = {
      landing_page: window.location.pathname,
      referrer:     document.referrer || undefined,
      captured_at:  new Date().toISOString(),
    }

    // ── 1. Explicit UTM params ────────────────────────────────────────────────
    const hasUTMs = UTM_PARAMS.some(p => params.has(p))
    if (hasUTMs) {
      const attr: Attribution = { ...meta }
      UTM_PARAMS.forEach(p => {
        const v = params.get(p)
        if (v) attr[p] = v
      })
      return _save(attr)
    }

    // ── 2. Already-stored attribution ─────────────────────────────────────────
    const stored = getStoredUTMs()
    if (stored) return stored

    // ── 3. Click-ID params ───────────────────────────────────────────────────
    for (const { param, utm_source, utm_medium } of CLICK_ID_MAP) {
      if (params.has(param)) {
        return _save({ utm_source, utm_medium, ...meta, auto_detected: true })
      }
    }

    // ── 4. Referrer-based auto-detection ─────────────────────────────────────
    const inferred = _detectFromReferrer(document.referrer)
    if (inferred) {
      return _save({ ...inferred, ...meta, auto_detected: true })
    }

    return null
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
 * Append stored UTM params (from any of the 4 layers) to a URL string.
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
