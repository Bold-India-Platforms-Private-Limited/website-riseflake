/**
 * instrumentation.ts — Next.js server startup hook (stable in Next 15, no
 * config flag needed). Runs once per server instance, before any request.
 *
 * Patches the global `fetch` so every server-side request this app makes to
 * the backend's public website API (API_BASE_URL) carries a shared-secret
 * header, and — when the website and backend are co-located on the same box
 * (WEBSITE_INTERNAL_ORIGIN set) — gets rewritten to hit the backend directly
 * over loopback instead of round-tripping out through Cloudflare and back.
 *
 * Why the header: the backend's websiteApiHardening middleware (rate limiter
 * + anti-scrape "distinct detail paths per IP" guard) exists to stop bots
 * mirroring the dataset — but riseflake.com's own ISR revalidation of every
 * job/internship/company/college/skill page has the exact same shape as that
 * traffic (this used to run on Vercel's shared outbound IPs specifically, but
 * even from one dedicated IP it still looks like "one caller hitting
 * thousands of distinct detail pages"). This header lets the backend tell
 * "our own site rebuilding its cache" apart from "a scraper," regardless of
 * which IP/origin the request arrives from.
 *
 * Why the rewrite: with both apps on the same EC2 instance, the public-URL
 * path (this box -> Cloudflare -> back to this box's nginx -> backend) counts
 * as EC2 NetworkOut *and* NetworkIn twice over for traffic that never needed
 * to leave the machine — directly the data-transfer cost this deploy is
 * trying to cut, on top of the added latency of two extra network hops per
 * SSR render. Loopback has none of that. Client-side (browser) fetches never
 * go through this file at all — instrumentation only runs in the Node
 * server, and the browser has no route to the server's own loopback address
 * anyway — so they're untouched and keep hitting the public domain.
 *
 * WEBSITE_ISR_SECRET must be set (same value) in both this app's server
 * environment and the backend's environment; WEBSITE_INTERNAL_ORIGIN
 * (e.g. "http://127.0.0.1:3000") is optional and only makes sense when both
 * apps share a box. Either being unset falls back to today's behavior.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const secret = process.env.WEBSITE_ISR_SECRET
  const internalOrigin = process.env.WEBSITE_INTERNAL_ORIGIN
  if (!secret && !internalOrigin) return

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend.riseflake.com/api/v2/website'
  const publicOrigin = new URL(apiBaseUrl).origin

  const originalFetch = globalThis.fetch

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (!url.startsWith(publicOrigin)) return originalFetch(input, init)

    const headers = new Headers(init?.headers ?? (typeof input === 'object' && 'headers' in input ? input.headers : undefined))
    if (secret) headers.set('x-riseflake-internal-key', secret)

    let target: RequestInfo | URL = input
    if (internalOrigin) {
      const rewritten = internalOrigin + url.slice(publicOrigin.length)
      // Preserve method/body/etc. when the caller passed a Request object —
      // only the URL and headers change.
      target = input instanceof Request ? new Request(rewritten, input) : rewritten
    }
    return originalFetch(target, { ...init, headers })
  }) as typeof fetch
}
