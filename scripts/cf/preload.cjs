'use strict'
/**
 * Build-time fetch hardening for the static (Cloudflare Pages) build.
 *
 * Loaded into every Node process of the build with `--require` (see
 * scripts/cf/build.mjs) — the Next.js static-generation workers as well as our
 * own scripts — so the page code keeps calling plain `fetch()` unchanged.
 *
 * What it does, for requests to the RiseFlake backend only:
 *   1. Adds the `x-riseflake-internal-key` header (WEBSITE_ISR_SECRET) so the
 *      backend's rate limiter / anti-scrape guard can tell "our own site build"
 *      from a scraper. (This replaces src/instrumentation.ts, which only ever ran
 *      inside the long-lived Node server that no longer exists.)
 *   2. Caps concurrent requests per process (CF_FETCH_CONCURRENCY, default 4).
 *   3. Retries transient failures — network errors, timeouts, 429 and 5xx — with
 *      exponential backoff. 404 / 410 are real answers and are never retried.
 *   4. Records every request that STILL failed after all retries in
 *      .build/fetch-failures.log. On a live server a transient blip heals on the
 *      next revalidate; in a static build it would be frozen into the HTML until
 *      the next deploy, so scripts/cf/postbuild.mjs fails the build when too many
 *      of these are recorded rather than publishing a degraded site.
 */

const fs = require('node:fs')
const path = require('node:path')

const origFetch = globalThis.fetch
if (typeof origFetch !== 'function' || origFetch.__rfBuildPatched) return

const ROOT = path.resolve(__dirname, '..', '..')
const FAILURE_LOG = path.join(ROOT, '.build', 'fetch-failures.log')

const secret = process.env.WEBSITE_ISR_SECRET || ''
// With the internal key the backend doesn't throttle us; without it the backend allows 600 requests/min per IP,
// so go gently (2 render workers × 1 request each) instead of provoking a 429 retry storm.
const MAX_CONCURRENT = Math.max(1, Number(process.env.CF_FETCH_CONCURRENCY) || (secret ? 4 : 1))
const RETRIES = Math.max(0, Number(process.env.CF_FETCH_RETRIES ?? 4))
const ATTEMPT_TIMEOUT_MS = Math.max(1000, Number(process.env.CF_FETCH_TIMEOUT_MS) || 30_000)
const RETRY_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 520, 521, 522, 523, 524])

const backendHosts = new Set()
for (const v of [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  process.env.NEXT_PUBLIC_BLOG_API_URL,
  'https://backend.riseflake.com',
]) {
  try {
    if (v) backendHosts.add(new URL(v).host)
  } catch {
    /* ignore malformed env */
  }
}

// ── tiny semaphore ──────────────────────────────────────────────────────────
let active = 0
const waiters = []
async function acquire() {
  if (active < MAX_CONCURRENT) {
    active++
    return
  }
  await new Promise((resolve) => waiters.push(resolve)) // slot handed over by release()
}
function release() {
  const next = waiters.shift()
  if (next) next()
  else active--
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function backoffMs(attempt, retryAfterHeader) {
  const ra = Number(retryAfterHeader)
  if (Number.isFinite(ra) && ra > 0) return Math.min(ra * 1000, 20_000)
  return Math.min(500 * 2 ** attempt, 8_000) + Math.floor(Math.random() * 250)
}

function recordFailure(method, url, reason) {
  try {
    fs.mkdirSync(path.dirname(FAILURE_LOG), { recursive: true })
    fs.appendFileSync(FAILURE_LOG, `${new Date().toISOString()}\t${method}\t${url}\t${reason}\n`)
  } catch {
    /* logging must never break the build */
  }
}

const stats = { requests: 0, retries: 0, failed: 0 }
process.on('exit', () => {
  if (stats.requests > 0 && process.env.CF_FETCH_VERBOSE === '1') {
    console.error(
      `[cf-fetch pid ${process.pid}] requests=${stats.requests} retries=${stats.retries} failed=${stats.failed}`,
    )
  }
})

function patchedFetch(input, init) {
  let url
  try {
    url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (!backendHosts.has(new URL(url).host)) return origFetch(input, init)
  } catch {
    return origFetch(input, init)
  }
  return backendFetch(url, input, init)
}

async function backendFetch(url, input, init) {
  const method = String(init?.method || (typeof input === 'object' && input.method) || 'GET').toUpperCase()
  const headers = new Headers(init?.headers || (typeof input === 'object' && 'headers' in input ? input.headers : undefined))
  if (secret) headers.set('x-riseflake-internal-key', secret)
  stats.requests++

  // Non-idempotent requests are passed through once, unretried.
  if (method !== 'GET' && method !== 'HEAD') {
    return origFetch(url, { ...init, headers })
  }

  // The callers' own `signal: AbortSignal.timeout(8000)` was tuned for a live
  // server that should fail fast and serve a fallback. At build time patience
  // + retry is the better trade, and a spent signal can't be reused on retry —
  // so each attempt gets a fresh, more generous timeout instead.
  const { signal: _ignored, ...rest } = init || {}
  let lastReason = 'unknown'

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    let retryAfter
    await acquire()
    try {
      const res = await origFetch(url, {
        ...rest,
        method,
        headers,
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      })
      if (!RETRY_STATUS.has(res.status)) return res
      lastReason = `HTTP ${res.status}`
      retryAfter = res.headers.get('retry-after')
      if (attempt === RETRIES) {
        // Out of retries: hand the (bad) response back so page code keeps its
        // existing handling — but it is logged, so the build can be failed.
        stats.failed++
        recordFailure(method, url, lastReason)
        return res
      }
      try {
        await res.body?.cancel()
      } catch {
        /* ignore */
      }
    } catch (err) {
      lastReason = (err && (err.cause?.code || err.name || err.message)) || 'network error'
      if (attempt === RETRIES) {
        stats.failed++
        recordFailure(method, url, String(lastReason))
        throw err
      }
    } finally {
      release()
    }
    stats.retries++
    await sleep(backoffMs(attempt, retryAfter))
  }
  // Unreachable — the loop always returns or throws on its last iteration.
  throw new Error(`[cf-fetch] exhausted retries for ${url} (${lastReason})`)
}

patchedFetch.__rfBuildPatched = true
globalThis.fetch = patchedFetch
