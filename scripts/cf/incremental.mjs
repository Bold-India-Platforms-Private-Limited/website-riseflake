/**
 * Incremental static builds — decide which pages actually need to be (re)rendered, reuse the
 * rest as-is from the previous deployment, and record what happened for next time.
 *
 * Every page in the manifest ends a build in exactly one of these states:
 *
 *   reuse     unchanged since the last deployment (same record `lastmod`, younger than its kind's max age)
 *             → copied forward byte-for-byte, never re-rendered, costs the backend nothing
 *   new       no previous copy exists → rendered
 *   changed   the record's `lastmod` moved (job edited, company got a new listing, …) → rendered
 *   stale     unchanged but older than its kind's max age (time-derived text such as "26 days left",
 *             related lists) → rendered, on a per-page jittered schedule so a kind doesn't all expire at once
 *   deferred  wanted rendering but the build's render budget (CF_RENDER_BUDGET) is spent. A page that has an
 *             older copy keeps it; a page that has none is left out of THIS build (not in the manifest, not in
 *             the sitemaps — the browser-side 404 fallback still opens it for visitors) and is picked up by a
 *             following build. Progress is never lost, a build just can't take longer than it can afford.
 *
 * Why reuse is safe: a static export's shared JS/CSS chunks are content-hashed and identical
 * across builds as long as the CODE hasn't changed, but a page's HTML also embeds Next's
 * global `buildId` (used to find `_next/static/<buildId>/_buildManifest.js` for client-side
 * navigation). Mixing pages from two different buildIds in one deployment would leave some
 * pages pointing at a manifest file that was never generated this build. So reuse is an
 * all-or-nothing decision per build: scripts/cf/routes.mjs hashes every route's code (and
 * everything shared/global), and `buildId` is a hash of ALL of those combined — if it is
 * identical to the last successful build's buildId, NOTHING in src/ changed, so any page
 * whose DATA also hasn't changed can be safely reused byte-for-byte. If it differs, a full
 * rebuild happens automatically (every entry is `new`) rather than trying to reconcile two
 * different asset trees. Code changes are comparatively rare next to data changes (new jobs,
 * companies, profiles…) on this site, so that trade favors simplicity and correctness.
 *
 * Where the previous deployment comes from (scripts/cf/baseline.mjs):
 *   .cache/state.json  what the LAST successful build rendered (per page: record version, render time)
 *                      + the code fingerprint it was built from.
 *   .cache/site        the last deployed tree while a build is running.
 * A CI runner that persists .cache (GitHub Actions cache) has both already; a Vercel build has
 * a blank disk, so baseline.mjs downloads them from the live site, where every deployment publishes them
 * under /_rf/.
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  BASELINE_PUBLIC_DIR, BUDGET_ORDER, CACHE_DIR, OUT_DIR, PAGE_KINDS, PREV_SITE_DIR, STATE_PATH, STATE_VERSION,
  hash01, listOf, loadState, log, pageKey, setList,
} from './lib.mjs'

const WHY_RANK = { new: 0, changed: 1, stale: 2 }
const budgetRank = (id) => {
  const n = BUDGET_ORDER.indexOf(id)
  return n < 0 ? BUDGET_ORDER.length : n
}

/**
 * Mutates `manifest`: sets `manifest.incremental`; flags `.r = 1` on every entry that must be rendered
 * this build; removes entries that need rendering but cannot be afforded and have no previous copy.
 *
 * @param {{ budget?: number }} opts  `budget` = most GUARDED pages (see PAGE_KINDS) to render; 0 = unlimited
 * @returns summary for logging + the shrink guard in build-manifest.mjs
 */
export function decideIncrementalBuild(manifest, codeState, { budget = 0 } = {}) {
  const prev = loadState()
  const canReuse =
    process.env.CF_FORCE_FULL_BUILD !== '1' &&
    !!prev && prev.buildId === codeState.buildId && fs.existsSync(PREV_SITE_DIR)
  manifest.incremental = canReuse

  const stats = {
    canReuse, budget,
    prevPages: prev ? Object.keys(prev.pages).length : 0,
    reused: 0, rendered: 0, new: 0, changed: 0, stale: 0, deferred: 0, dropped: 0,
    kinds: {},
  }

  // ── 1. classify every page ────────────────────────────────────────────────────────────────
  const wants = [] // pages that want rendering: { kind, e, why, hasCopy, i }
  for (const kind of PAGE_KINDS) {
    const ks = (stats.kinds[kind.id] = { total: 0, reuse: 0, new: 0, changed: 0, stale: 0, deferred: 0, dropped: 0 })
    listOf(manifest, kind).forEach((e, i) => {
      ks.total++
      let why = 'new'
      let hasCopy = false
      if (canReuse) {
        const key = pageKey(kind, e.s)
        const prevPage = prev.pages[key]
        hasCopy = !!prevPage && fs.existsSync(path.join(PREV_SITE_DIR, kind.dir, `${e.s}.html`))
        if (!prevPage || !hasCopy) why = 'new'
        else if (kind.entity && prevPage.m !== (e.m ?? null)) why = 'changed'
        else {
          // Jitter ±15% off maxAgeH (seeded by the page's own key) so a kind's refreshes spread
          // across the schedule instead of every page in it going stale on the same run.
          const ageH = (Date.now() - prevPage.t) / 3_600_000
          why = ageH >= kind.maxAgeH * (0.85 + 0.3 * hash01(key)) ? 'stale' : null
        }
      }
      if (why) wants.push({ kind, e, why, hasCopy, i })
      else ks.reuse++
    })
  }

  // ── 2. spend the render budget (guarded pages only — see PAGE_KINDS.guarded) ──────────────
  const deferred = new Set()
  const guarded = wants.filter((w) => w.kind.guarded)
  if (budget > 0 && guarded.length > budget) {
    // A page that doesn't exist yet beats a refresh of one that does; then the fixed kind priority; then
    // manifest order (the backend lists the most recently updated records first).
    const ranked = [...guarded].sort(
      (a, b) => WHY_RANK[a.why] - WHY_RANK[b.why] || budgetRank(a.kind.id) - budgetRank(b.kind.id) || a.i - b.i,
    )
    for (const w of ranked.slice(budget)) deferred.add(w)
  }

  // ── 3. apply ──────────────────────────────────────────────────────────────────────────────
  const dropped = new Map() // kind.id → Set<entry>
  for (const w of wants) {
    const ks = stats.kinds[w.kind.id]
    if (deferred.has(w)) {
      if (w.hasCopy) {
        ks.deferred++
        stats.deferred++
      } else {
        if (!dropped.has(w.kind.id)) dropped.set(w.kind.id, new Set())
        dropped.get(w.kind.id).add(w.e)
        ks.dropped++
        stats.dropped++
      }
      continue
    }
    w.e.r = 1
    ks[w.why]++
    stats[w.why]++
    stats.rendered++
  }
  for (const kind of PAGE_KINDS) {
    const drop = dropped.get(kind.id)
    if (drop) setList(manifest, kind, listOf(manifest, kind).filter((e) => !drop.has(e)))
  }
  stats.reused = PAGE_KINDS.reduce((n, k) => n + stats.kinds[k.id].reuse + stats.kinds[k.id].deferred, 0)
  return stats
}

/** One human-readable table of what this build will do with each kind of page. */
export function describePlan(stats) {
  const rows = PAGE_KINDS.filter((k) => stats.kinds[k.id].total > 0).map((k) => {
    const s = stats.kinds[k.id]
    return (
      `  ${k.id.padEnd(20)} total ${String(s.total).padStart(5)}   render ${String(s.new + s.changed + s.stale).padStart(5)} ` +
      `(new ${s.new}, changed ${s.changed}, stale ${s.stale})   reuse ${String(s.reuse).padStart(5)}` +
      (s.deferred ? `   deferred(kept old) ${s.deferred}` : '') +
      (s.dropped ? `   deferred(not built yet) ${s.dropped}` : '')
    )
  })
  return rows.join('\n')
}

/**
 * Copies every reused page's previously-built file(s) from .cache/site into ./out, so the
 * export ends up with the full site (freshly-rendered + carried-forward) before postbuild's
 * audit/sitemap/budget steps run. A page whose file is unexpectedly missing is left alone —
 * postbuild's own "manifest page missing from export" check catches it (and it will simply
 * render fresh again next build, since decideIncrementalBuild's hasCopy check will no
 * longer find a copy to reuse).
 */
export function copyForwardReusedPages(manifest) {
  if (!manifest.incremental) return { copied: 0 }
  let copied = 0
  for (const kind of PAGE_KINDS) {
    for (const e of listOf(manifest, kind)) {
      if (e.r) continue
      const rel = path.join(kind.dir, `${e.s}.html`)
      const src = path.join(PREV_SITE_DIR, rel)
      if (!fs.existsSync(src)) continue
      const dst = path.join(OUT_DIR, rel)
      fs.mkdirSync(path.dirname(dst), { recursive: true })
      fs.copyFileSync(src, dst)
      copied++
      if (!kind.leaf) {
        const srcTxt = src.replace(/\.html$/, '.txt')
        if (fs.existsSync(srcTxt)) fs.copyFileSync(srcTxt, path.join(OUT_DIR, rel.replace(/\.html$/, '.txt')))
      }
    }
  }
  log(`incremental: copied ${copied} reused page(s) forward from the previous deployment`)
  return { copied }
}

/**
 * The state of the deployment about to be published. `finalManifest` should be the post-audit manifest
 * (some pages the build asked for may have been dropped as soft-404/degraded) so the recorded state
 * never claims a page exists when it doesn't. Reused pages keep their ORIGINAL render timestamp (copying
 * a page forward must not reset its own staleness clock); freshly-rendered pages get `t = now`.
 */
export function buildState(finalManifest, codeState) {
  const prev = loadState()
  const pages = {}
  const now = Date.now()
  for (const kind of PAGE_KINDS) {
    for (const e of listOf(finalManifest, kind)) {
      const key = pageKey(kind, e.s)
      pages[key] = e.r || !prev?.pages?.[key] ? { m: e.m ?? null, t: now } : prev.pages[key]
    }
  }
  return { version: STATE_VERSION, buildId: codeState.buildId, builtAt: new Date().toISOString(), pages }
}

/**
 * Call once, at the very end of a build that postbuild.mjs has verified is safe to publish: records
 * `state` and a copy of ./out as "last known good" for a CI runner that persists .cache/ between runs.
 * (The same state is also published inside the deployment itself — scripts/cf/baseline.mjs.)
 */
export function saveState(state) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.writeFileSync(STATE_PATH, JSON.stringify(state))
  fs.rmSync(PREV_SITE_DIR, { recursive: true, force: true })
  // The published baseline bundles are derived from these very files — don't cache them twice.
  const skip = path.join(OUT_DIR, BASELINE_PUBLIC_DIR)
  fs.cpSync(OUT_DIR, PREV_SITE_DIR, { recursive: true, filter: (src) => src !== skip })
  log(`incremental: state saved (${Object.keys(state.pages).length} pages tracked, buildId ${state.buildId})`)
}
