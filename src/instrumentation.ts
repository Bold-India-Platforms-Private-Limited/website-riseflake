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
/**
 * Size-bounded LRU pruning for this app's on-disk ISR/fetch cache — keeps
 * whatever's actively getting traffic cached, and only evicts entries nobody
 * has touched in a while once the budget fills up. Not a blanket periodic
 * wipe: a page that's still popular survives indefinitely; a page nobody has
 * revisited is what gets cleared to make room.
 *
 * Why this exists: this app ISR-revalidates thousands of distinct job/
 * internship/company/college/skill pages, each caching a rendered copy (plus
 * its backend fetch() responses) to disk. Next has no built-in size cap or
 * eviction for the default filesystem cache handler, so left alone this
 * grows without bound — it went from a clean ~20MB to 1.3GB+ in about a day
 * and filled the box's disk (see the 2026-09-12/13 production incidents).
 * The box's disk was sized up specifically to give this cache its own 5GB
 * budget (CACHE_CAP_BYTES below) — this enforces that budget in code so nice
 * of the app can quietly eat all of it.
 *
 * Scope, deliberately conservative: only prunes directories PROVEN to hold
 * zero build-time-baked content —
 *   - .next/cache (Next's fetch-cache; always pure runtime cache, never the
 *     only copy of anything)
 *   - .next/server/app/jobs and .../internships (flat <slug>.html/.meta/.rsc
 *     triplets — confirmed by reading both page.tsx files: both explicitly
 *     `generateStaticParams() { return [] }`, so NOTHING under these two
 *     routes is prerendered at build time; every file there is 100%
 *     runtime-generated ISR output). The sibling `[slug]/` directory in each
 *     (containing page.js — the actual route handler code) is explicitly
 *     skipped: anything named like a route segment (`[...]`) is code, not
 *     cached data, and must never be touched.
 *
 * Explicitly NOT pruned: colleges/companies/skills and other faceted-listing
 * routes. Those mix real build-time-generated facet pages with whatever ISR
 * adds on top, and telling the two apart reliably (without a stale facet
 * page staying broken until the next deploy) needs cross-referencing
 * prerender-manifest.json, not just a file walk — worth doing properly as a
 * follow-up, not worth guessing at here. They currently account for the
 * *majority* of this app's on-disk cache, so this alone won't fully solve
 * disk growth — see the memory note on this incident for the full picture.
 */
function startCachePruning() {
  const CACHE_CAP_BYTES = 5 * 1024 * 1024 * 1024 // 5GB — the headroom added for this specifically
  const PRUNE_TARGET_RATIO = 0.8 // evict down to 80% of cap, not right to the edge
  const CHECK_INTERVAL_MS = 15 * 60 * 1000 // every 15 min — cheap (one directory walk), and growth here has been fast

  // Dynamic imports, not static ones: this file is bundled for both the edge
  // and nodejs runtimes, and a static top-level `import 'fs'` fails to build
  // even behind a runtime guard, since webpack resolves static imports at
  // build time regardless of the branch they're used in. A dynamic import()
  // only resolves when actually called, i.e. only on the nodejs runtime path.
  const prune = async () => {
    try {
      const [{ default: path }, { default: fs }] = await Promise.all([import('path'), import('fs')])
      const root = process.cwd()

      // path -> { files: [{ path, size }], size, mtimeMs }. Grouped by the
      // shared basename (without extension) for the .html/.meta/.rsc
      // triplets, so eviction removes a whole entry together rather than
      // leaving an orphaned partial cache hit; .next/cache entries (no such
      // triplet — arbitrary hashed filenames) are just grouped one-per-file.
      const groups = new Map<string, { files: string[]; size: number; mtimeMs: number }>()

      async function walk(dir: string, groupByBasename: boolean) {
        let entries
        try {
          entries = await fs.promises.readdir(dir, { withFileTypes: true })
        } catch {
          return // doesn't exist yet — nothing to do
        }
        for (const entry of entries) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) {
            if (entry.name.startsWith('[')) continue // route code, e.g. "[slug]" — never data
            await walk(full, groupByBasename)
            continue
          }
          let stat
          try {
            stat = await fs.promises.stat(full)
          } catch {
            continue // removed concurrently — skip
          }
          const key = groupByBasename ? full.slice(0, -path.extname(full).length) : full
          const existing = groups.get(key)
          if (existing) {
            existing.files.push(full)
            existing.size += stat.size
            existing.mtimeMs = Math.max(existing.mtimeMs, stat.mtimeMs)
          } else {
            groups.set(key, { files: [full], size: stat.size, mtimeMs: stat.mtimeMs })
          }
        }
      }

      await walk(path.join(root, '.next', 'cache'), false)
      await walk(path.join(root, '.next', 'server', 'app', 'jobs'), true)
      await walk(path.join(root, '.next', 'server', 'app', 'internships'), true)

      const totalSize = [...groups.values()].reduce((sum, g) => sum + g.size, 0)
      const totalGB = (totalSize / 1e9).toFixed(2)

      if (totalSize <= CACHE_CAP_BYTES) {
        console.log(`[cache-prune] ${totalGB}GB / 5GB cap — within budget, no eviction`)
        return
      }

      // Over budget: evict least-recently-touched entries first (cold pages)
      // until back down to the target — whatever's still getting real
      // traffic (recently re-rendered, so a recent mtime) survives.
      const ordered = [...groups.values()].sort((a, b) => a.mtimeMs - b.mtimeMs)
      const targetSize = CACHE_CAP_BYTES * PRUNE_TARGET_RATIO
      let remaining = totalSize
      let evictedEntries = 0
      let evictedBytes = 0
      for (const group of ordered) {
        if (remaining <= targetSize) break
        await Promise.all(group.files.map((f) => fs.promises.unlink(f).catch(() => {})))
        remaining -= group.size
        evictedBytes += group.size
        evictedEntries++
      }
      console.log(
        `[cache-prune] was ${totalGB}GB, evicted ${evictedEntries} cold entries ` +
          `(${(evictedBytes / 1e9).toFixed(2)}GB), now ~${(remaining / 1e9).toFixed(2)}GB`
      )
    } catch (err) {
      console.error('[cache-prune] failed:', (err as Error).message)
    }
  }

  setInterval(prune, CHECK_INTERVAL_MS)
  prune() // also run once at startup rather than waiting a full interval
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  startCachePruning()

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
