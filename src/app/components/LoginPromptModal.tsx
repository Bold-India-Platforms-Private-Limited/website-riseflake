'use client'

/**
 * LoginPromptModal
 *
 * SEO SAFETY NOTES:
 * - This component is always imported via next/dynamic with { ssr: false }.
 *   It never appears in the server-rendered HTML, so Google/Bing crawlers
 *   never see it and page content is never hidden from them.
 * - It fires only after a 15-30 s client-side timer, well beyond any crawler
 *   rendering budget.
 * - The modal uses role="dialog" + aria-modal for accessibility.
 * - No actual page content is moved or hidden from the DOM; only a portal
 *   overlay is layered on top.
 *
 * CLOSE RULE:
 * - Users may dismiss the modal up to 2 times per browser (tracked in localStorage).
 * - On the 3rd+ appearance the close button is removed; they must click Login.
 */

import { useEffect, useRef, useState } from 'react'
import { appendUTMsToUrl } from '../../utils/utmUtils'

const APP_LOGIN_BASE = 'https://app.riseflake.com/home'
const STORAGE_KEY    = 'rf_modal_close_count'
const MAX_CLOSABLE = 2          // close button visible for first N dismissals
const DELAY_MIN_MS = 15_000     // 15 seconds
const DELAY_MAX_MS = 30_000     // 30 seconds

const AUTH_CHECK_URL = (() => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
  // Convert /api/v1/website → /api/v1/auth/me
  return base.replace(/\/website$/, '') + '/auth/me'
})()

async function isUserLoggedIn(): Promise<boolean> {
  try {
    const res = await fetch(AUTH_CHECK_URL, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

function getCloseCount(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10) || 0
  } catch {
    return 0
  }
}

function incrementCloseCount(): number {
  try {
    const next = getCloseCount() + 1
    localStorage.setItem(STORAGE_KEY, String(next))
    return next
  } catch {
    return MAX_CLOSABLE + 1
  }
}

export default function LoginPromptModal() {
  const [visible,    setVisible]    = useState(false)
  const [closesUsed, setClosesUsed] = useState(0)
  const [loginUrl,   setLoginUrl]   = useState(APP_LOGIN_BASE)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const count = getCloseCount()
    setClosesUsed(count)

    // Build login URL with any captured UTMs so attribution flows through
    setLoginUrl(appendUTMsToUrl(APP_LOGIN_BASE))

    let cancelled = false

    isUserLoggedIn().then((loggedIn) => {
      if (cancelled || loggedIn) return

      const delay =
        DELAY_MIN_MS + Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS)

      timerRef.current = setTimeout(() => {
        setVisible(true)
      }, delay)
    })

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClose = () => {
    const next = incrementCloseCount()
    setClosesUsed(next)
    setVisible(false)
  }

  const canClose = closesUsed < MAX_CLOSABLE

  if (!visible) return null

  return (
    // Portal-style fixed overlay — never in server HTML (ssr:false import)
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rf-modal-title"
      aria-describedby="rf-modal-desc"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={canClose ? handleClose : undefined}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Close button — hidden after MAX_CLOSABLE dismissals */}
        {canClose && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}

        <div className="px-7 py-8 text-center">
          {/* Logo mark */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="#6366f1" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <h2
            id="rf-modal-title"
            className="text-xl font-bold text-slate-900"
          >
            Keep browsing on Riseflake
          </h2>

          <p
            id="rf-modal-desc"
            className="mt-2 text-sm text-slate-500 leading-relaxed"
          >
            Log in to save jobs, track applications, and get personalised
            recommendations — all in one place.
          </p>

          <a
            href={loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Login to keep browsing
          </a>

          {canClose && (
            <button
              onClick={handleClose}
              className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition underline underline-offset-2"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
