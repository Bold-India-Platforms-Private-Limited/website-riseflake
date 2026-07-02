'use client'

/**
 * UTMCapture — invisible client component, mounted once in the root layout.
 *
 * On every page load it:
 *   1. Reads UTM params from the current URL and saves them to localStorage.
 *   2. Installs a click interceptor that injects UTMs into any link to
 *      app.riseflake.com at click-time.
 *
 * UTMs are injected only at click-time, never by mutating rendered <a href>
 * attributes ahead of time — doing that used to fight React's hydration
 * (server HTML has no localStorage access, so a client-side patch of the
 * same DOM nodes React manages produces a hydration mismatch on any
 * subsequent render of that tree). Click-time injection carries the exact
 * same attribution forward with none of that risk.
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

    // ── 2. Click interceptor — injects UTMs into any app.riseflake.com link
    //      at the moment it's clicked (nav links, dropdowns, modals, etc.) ──
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
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  return null
}
