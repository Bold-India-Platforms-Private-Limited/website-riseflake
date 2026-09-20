/**
 * Incremental static builds — decide which pages actually need to be re-rendered, reuse the
 * rest as-is from the previous deployment, and record what happened for next time.
 *
 * Why this is safe: a static export's shared JS/CSS chunks are content-hashed and identical
 * across builds as long as the CODE hasn't changed, but a page's HTML also embeds Next's
 * global `buildId` (used to find `_next/static/<buildId>/_buildManifest.js` for client-side
 * navigation). Mixing pages from two different buildIds in one deployment would leave some
 * pages pointing at a manifest file that was never generated this build. So reuse is an
 * all-or-nothing decision per build: scripts/cf/routes.mjs hashes every route's code (and
 * everything shared/global), and `buildId` is a hash of ALL of those combined — if it is
 * identical to the last successful build's buildId, NOTHING in src/ changed, so any page
 * whose DATA also hasn't changed can be safely reused byte-for-byte. If it differs, a full
 * rebuild happens automatically (every entry gets `r`) rather than trying to reconcile two
 * different asset trees. Code changes are comparatively rare next to data changes (new jobs,
 * companies, profiles…) on this site, so that trade favors simplicity and correctness.
 *
 * State lives in .cache/ (see lib.mjs): state.json (per-page {m: lastmod, t: last-rendered-at}
 * + the buildId it was built from) and site/ (the full previous ./out, captured after a build
 * that actually made it to production — see postbuild.mjs and the deploy workflow). Both are
 * restored/saved across CI runs via actions/cache (.github/workflows/deploy-cloudflare-pages.yml).
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  CACHE_DIR, OUT_DIR, PAGE_KINDS, PREV_SITE_DIR, STATE_PATH, STATE_VERSION,
  hash01, listOf, loadState, log, pageKey,
} from './lib.mjs'

/**
 * Mutates `manifest`: sets `manifest.incremental` and, on every entry, `.r = 1` when that
 * page must be (re)rendered this build. Returns a summary for logging.
 */
export function decideIncrementalBuild(manifest, codeState) {
  const prev = loadState()
  const canReuse =
    process.env.CF_FORCE_FULL_BUILD !== '1' &&
    !!prev && prev.buildId === codeState.buildId && fs.existsSync(PREV_SITE_DIR)
  manifest.incremental = canReuse

  const stats = { canReuse, reused: 0, rendered: 0, new: 0, changed: 0, stale: 0 }
  if (!canReuse) {
    for (const kind of PAGE_KINDS) for (const e of listOf(manifest, kind)) e.r = 1
    for (const kind of PAGE_KINDS) stats.rendered += listOf(manifest, kind).length
    return stats
  }

  for (const kind of PAGE_KINDS) {
    for (const e of listOf(manifest, kind)) {
      const key = pageKey(kind, e.s)
      const prevPage = prev.pages[key]
      const stillOnDisk = fs.existsSync(path.join(PREV_SITE_DIR, kind.dir, `${e.s}.html`))

      if (!prevPage || !stillOnDisk) {
        e.r = 1
        stats.rendered++
        stats.new++
        continue
      }
      if (kind.entity && prevPage.m !== (e.m ?? null)) {
        e.r = 1
        stats.rendered++
        stats.changed++
        continue
      }
      // Jitter ±15% off maxAgeH (seeded by the page's own key) so a kind's refreshes spread
      // across the schedule instead of every page in it going stale on the same run.
      const ageH = (Date.now() - prevPage.t) / 3_600_000
      const jitteredMaxAgeH = kind.maxAgeH * (0.85 + 0.3 * hash01(key))
      if (ageH >= jitteredMaxAgeH) {
        e.r = 1
        stats.rendered++
        stats.stale++
        continue
      }
      stats.reused++
    }
  }
  return stats
}

/**
 * Copies every reused page's previously-built file(s) from .cache/site into ./out, so the
 * export ends up with the full site (freshly-rendered + carried-forward) before postbuild's
 * audit/sitemap/budget steps run. A page whose file is unexpectedly missing is left alone —
 * postbuild's own "manifest page missing from export" check catches it (and it will simply
 * render fresh again next build, since decideIncrementalBuild's stillOnDisk check will no
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
 * Call once, at the very end of a build that postbuild.mjs has verified is safe to publish.
 * `finalManifest` should be the post-audit manifest (some pages the build asked for may have
 * been dropped as soft-404/degraded) so the recorded state never claims a page exists when it
 * doesn't. Reused pages keep their ORIGINAL render timestamp (copying a page forward must not
 * reset its own staleness clock); freshly-rendered pages get `t = now`.
 */
export function finalizeIncrementalState(finalManifest, codeState) {
  const prev = loadState()
  const pages = {}
  const now = Date.now()
  for (const kind of PAGE_KINDS) {
    for (const e of listOf(finalManifest, kind)) {
      const key = pageKey(kind, e.s)
      pages[key] = e.r || !prev?.pages?.[key] ? { m: e.m ?? null, t: now } : prev.pages[key]
    }
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.writeFileSync(
    STATE_PATH,
    JSON.stringify({ version: STATE_VERSION, buildId: codeState.buildId, builtAt: new Date().toISOString(), pages }),
  )
  fs.rmSync(PREV_SITE_DIR, { recursive: true, force: true })
  fs.cpSync(OUT_DIR, PREV_SITE_DIR, { recursive: true })
  log(`incremental: state saved (${Object.keys(pages).length} pages tracked, buildId ${codeState.buildId})`)
}
