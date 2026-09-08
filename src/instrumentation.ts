/**
 * instrumentation.ts — Next.js server startup hook (stable in Next 15, no
 * config flag needed). Runs once per server instance, before any request.
 *
 * Patches the global `fetch` so every server-side request this app makes to
 * the backend's public website API (API_BASE_URL) carries a shared-secret
 * header. The backend's websiteApiHardening middleware (rate limiter +
 * anti-scrape "distinct detail paths per IP" guard) exists to stop bots
 * mirroring the dataset — but riseflake.com's own ISR revalidation of every
 * job/internship/company/college/skill page, from Vercel's shared outbound
 * IPs, has the exact same shape as that traffic and was tripping the same
 * guard, causing live pages to intermittently 404. This header lets the
 * backend tell "our own site rebuilding its cache" apart from "a scraper."
 *
 * WEBSITE_ISR_SECRET must be set (same value) in both this app's server
 * environment and the backend's environment. If unset, this is a no-op and
 * requests behave exactly as before (still subject to the public limits).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const secret = process.env.WEBSITE_ISR_SECRET
  if (!secret) return

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend.riseflake.com/api/v1/website'

  const originalFetch = globalThis.fetch

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (url.startsWith(apiBaseUrl)) {
      const headers = new Headers(init?.headers ?? (typeof input === 'object' && 'headers' in input ? input.headers : undefined))
      headers.set('x-riseflake-internal-key', secret)
      return originalFetch(input, { ...init, headers })
    }
    return originalFetch(input, init)
  }) as typeof fetch
}
