'use client'

/**
 * UTMCapture — invisible client component, mounted once in the root layout.
 *
 * On every page load it:
 *   1. Reads UTM params from the current URL and saves them to localStorage.
 *   2. Patches every existing <a href="…app.riseflake.com…"> on the page
 *      to carry the UTM params forward.
 *   3. Installs a click interceptor that injects UTMs into any link to
 *      app.riseflake.com at click-time (catches dynamic / dropdown links that
 *      weren't in the DOM when step 2 ran).
 *
 * Nothing is rendered — this returns null.
 */

import { useEffect } from 'react'
import { captureUTMs, getStoredUTMs, appendUTMsToUrl } from '../../utils/utmUtils'

const APP_HOSTS = ['app.riseflake.com']

function isAppLink(href: string): boolean {
  try {
    return APP_HOSTS.includes(new URL(href).hostname)
  } catch {
    return false
  }
}

export default function UTMCapture() {
  useEffect(() => {
    // ── 1. Capture UTMs from the current page URL ──────────────────────────
    captureUTMs()

    // ── 2. Patch all existing links to app.riseflake.com ──────────────────
    function patchStaticLinks() {
      const attr = getStoredUTMs()
      if (!attr) return
      document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
        if (isAppLink(a.href)) {
          a.href = appendUTMsToUrl(a.href, attr)
        }
      })
    }

    patchStaticLinks()
    // Run a second pass after a short delay to catch client-hydrated links
    const t = setTimeout(patchStaticLinks, 400)

    // ── 3. Click interceptor for dynamic links (dropdowns, modals, etc.) ──
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!anchor) return

      try {
        if (!isAppLink(anchor.href)) return

        const attr = getStoredUTMs()
        if (!attr) return

        const patched = appendUTMsToUrl(anchor.href, attr)
        if (patched === anchor.href) return   // nothing to add

        e.preventDefault()
        // Preserve target="_blank" / rel="noopener" behaviour
        const target = anchor.target || '_self'
        if (target === '_blank') {
          window.open(patched, '_blank', 'noopener,noreferrer')
        } else {
          window.location.href = patched
        }
      } catch {
        // If anything fails, let the original click proceed
      }
    }

    document.addEventListener('click', handleClick, true)   // capture phase

    return () => {
      clearTimeout(t)
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  return null
}
