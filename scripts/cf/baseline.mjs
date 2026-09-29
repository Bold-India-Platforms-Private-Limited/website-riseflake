/**
 * The "previous deployment" that incremental builds (scripts/cf/incremental.mjs) reuse pages from — for
 * builders that start every run on a blank disk, which is exactly what a Vercel build is.
 *
 * A build that finishes and passes the post-build gates PUBLISHES its own state inside the deployment:
 *
 *   /_rf/state.json               per-page { m: record lastmod, t: render time } + the code fingerprint
 *                                 (buildId) + a list of the bundles below, each with a sha1
 *   /_rf/pages-<kind>-<n>.tgz     every page file of the deployment, packed (a handful of files — the Pages
 *                                 20,000-file limit counts files, not bytes, and a page-per-file mirror
 *                                 would double the deployment)
 *
 * and the NEXT build restores them into .cache/ before it decides what to render:
 *
 *   restoreBaseline()   GET <live site>/_rf/state.json → if the code fingerprint still matches, download +
 *                       verify + unpack the bundles into .cache/site
 *   publishBaseline()   (postbuild) write state.json + the bundles into ./out/_rf
 *
 * Bundles are used instead of fetching each page from the live site because a static host may rewrite the
 * HTML it serves (analytics beacon injection, email obfuscation, …); a .tgz is served byte-for-byte, so a
 * reused page is exactly the file that was built.
 *
 * Everything here fails SAFE: any problem (site unreachable, no state yet, bad checksum, unpack error,
 * different code) just means "no baseline" and the build renders what it has to — it never breaks a build.
 * A runner that already persists .cache/ (GitHub Actions cache) skips the download entirely.
 *
 * Tunables: CF_BASELINE_URL (where to look; default: the Vercel project's production URL, then
 * https://riseflake.com), CF_BASELINE=off (never use a baseline).
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import {
  BASELINE_PUBLIC_DIR, CACHE_DIR, OUT_DIR, PAGE_KINDS, PREV_SITE_DIR, SITE_ORIGIN, STATE_PATH, STATE_VERSION,
  envInt, listOf, loadState, log, sha1, warn,
} from './lib.mjs'

const BUNDLE_MAX_RAW_BYTES = envInt('CF_BUNDLE_MAX_MB', 40) * 1024 * 1024 // raw bytes per bundle before gzip
const BUNDLE_MAX_FILES = 1500
const BUNDLE_MAX_GZ_BYTES = 24 * 1024 * 1024 // keep bundles well under 25 MiB per file
const BUNDLE_NAME_RE = /^[A-Za-z0-9._-]+\.tgz$/

// ── publish ──────────────────────────────────────────────────────────────────────────────────

/**
 * Packs the deployment's page files into ./out/_rf and writes ./out/_rf/state.json. Call after the
 * audit/trim steps (so the bundles hold exactly what is being published) and before the file-count check
 * (so the bundles are counted). Returns { files, bytes } for the report.
 */
export function publishBaseline(finalManifest, state) {
  const dir = path.join(OUT_DIR, BASELINE_PUBLIC_DIR)
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })

  const bundles = []
  for (const kind of PAGE_KINDS) {
    const exts = kind.leaf ? ['html'] : ['html', 'txt'] // leaf pages have no .txt (trimmed in postbuild)
    let chunk = []
    let bytes = 0
    const flush = () => {
      if (!chunk.length) return
      const file = `pages-${kind.id.replace(/\./g, '-')}-${bundles.filter((b) => b.kind === kind.id).length}.tgz`
      const listFile = path.join(dir, `.${file}.list`)
      fs.writeFileSync(listFile, chunk.map((c) => c.rel).join('\n') + '\n')
      const dest = path.join(dir, file)
      const r = spawnSync('tar', ['-czf', dest, '-C', OUT_DIR, '-T', listFile], {
        env: { ...process.env, COPYFILE_DISABLE: '1' }, // macOS: no AppleDouble ._ entries
        encoding: 'utf8',
      })
      fs.rmSync(listFile, { force: true })
      if (r.status !== 0) throw new Error(`tar failed while bundling ${file}: ${r.stderr || r.error?.message}`)
      const buf = fs.readFileSync(dest)
      if (buf.length > BUNDLE_MAX_GZ_BYTES) {
        throw new Error(`${file} is ${(buf.length / 1048576).toFixed(1)} MiB — over the 25 MiB file limit. Lower CF_BUNDLE_MAX_MB.`)
      }
      bundles.push({ file, kind: kind.id, count: chunk.length, bytes: buf.length, sha1: sha1(buf) })
      chunk = []
      bytes = 0
    }
    for (const e of listOf(finalManifest, kind)) {
      for (const ext of exts) {
        const rel = `${kind.dir}/${e.s}.${ext}`
        let size
        try {
          size = fs.statSync(path.join(OUT_DIR, rel)).size
        } catch {
          continue // dropped by the audit — not part of the deployment
        }
        if (chunk.length && (chunk.length >= BUNDLE_MAX_FILES || bytes + size > BUNDLE_MAX_RAW_BYTES)) flush()
        chunk.push({ rel })
        bytes += size
      }
    }
    flush()
  }

  fs.writeFileSync(path.join(dir, 'state.json'), JSON.stringify({ ...state, bundles }))
  const total = bundles.reduce((n, b) => n + b.bytes, 0)
  log(`baseline: published ${bundles.length} bundle(s), ${(total / 1048576).toFixed(1)} MiB, for the next build to reuse`)
  return { files: bundles.length + 1, bytes: total }
}

// ── restore ──────────────────────────────────────────────────────────────────────────────────

/** Where a previous deployment might be reachable, most specific first. */
function candidateBases() {
  const out = []
  const add = (u) => {
    if (!u) return
    const base = String(u).trim().replace(/\/+$/, '')
    if (base && !out.includes(base)) out.push(base)
  }
  add(process.env.CF_BASELINE_URL)
  // Vercel exposes the project's production domain (without scheme) at build time.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  add(SITE_ORIGIN)
  return out
}

async function fetchBytes(url, { timeoutMs = 90_000, retries = 2 } = {}) {
  let lastErr
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers: { 'cache-control': 'no-cache' } })
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (err) {
      lastErr = err
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt))
    }
  }
  throw new Error(`${url}: ${lastErr?.message ?? lastErr}`)
}

function parseRemoteState(buf) {
  try {
    const st = JSON.parse(buf.toString('utf8'))
    const ok =
      st && st.version === STATE_VERSION && typeof st.buildId === 'string' && st.pages && typeof st.pages === 'object' &&
      Array.isArray(st.bundles) && st.bundles.every((b) => BUNDLE_NAME_RE.test(b?.file ?? '') && typeof b.sha1 === 'string')
    return ok ? st : null
  } catch {
    return null // e.g. an HTML 404 page served with 200
  }
}

/**
 * Makes .cache/state.json + .cache/site available, from the live site if this runner doesn't have them.
 * Never throws.
 */
export async function restoreBaseline(codeState) {
  if (process.env.CF_FORCE_FULL_BUILD === '1') return log('baseline: skipped (CF_FORCE_FULL_BUILD=1) — full build')
  if (process.env.CF_BASELINE === 'off') return log('baseline: skipped (CF_BASELINE=off) — full build')
  if (loadState() && fs.existsSync(PREV_SITE_DIR)) return log('baseline: using the local .cache from the previous run')

  for (const base of candidateBases()) {
    let stateBuf
    try {
      stateBuf = await fetchBytes(`${base}/${BASELINE_PUBLIC_DIR}/state.json`, { timeoutMs: 20_000, retries: 1 })
    } catch (err) {
      warn(`baseline: ${base} unreachable (${err.message})`)
      continue
    }
    const state = stateBuf && parseRemoteState(stateBuf)
    if (!state) {
      log(`baseline: ${base} has no build state (first deployment, or not a static build yet)`)
      continue
    }
    const pageCount = Object.keys(state.pages).length

    fs.rmSync(CACHE_DIR, { recursive: true, force: true })
    fs.mkdirSync(CACHE_DIR, { recursive: true })
    // Kept even when the code changed: it tells the build how big the site it is replacing was (shrink guard).
    fs.writeFileSync(STATE_PATH, JSON.stringify({ version: state.version, buildId: state.buildId, builtAt: state.builtAt, pages: state.pages }))

    if (state.buildId !== codeState.buildId) {
      log(
        `baseline: ${base} is code ${state.buildId}, this build is ${codeState.buildId} — pages can't be mixed across ` +
          `code versions, so every page is re-rendered (previous site: ${pageCount} pages)`,
      )
      return
    }

    try {
      fs.mkdirSync(PREV_SITE_DIR, { recursive: true })
      const t = Date.now()
      let bytes = 0
      for (const b of state.bundles) {
        const buf = await fetchBytes(`${base}/${BASELINE_PUBLIC_DIR}/${b.file}`)
        if (!buf) throw new Error(`${b.file} is missing`)
        if (sha1(buf) !== b.sha1) throw new Error(`${b.file} failed its checksum`)
        const tmp = path.join(CACHE_DIR, b.file)
        fs.writeFileSync(tmp, buf)
        const r = spawnSync('tar', ['-xzf', tmp, '-C', PREV_SITE_DIR], { encoding: 'utf8' })
        fs.rmSync(tmp, { force: true })
        if (r.status !== 0) throw new Error(`unpacking ${b.file} failed: ${r.stderr || r.error?.message}`)
        bytes += buf.length
      }
      log(
        `baseline: restored ${pageCount} page(s) from ${base} in ${((Date.now() - t) / 1000).toFixed(0)}s ` +
          `(${state.bundles.length} bundle(s), ${(bytes / 1048576).toFixed(1)} MiB) — only new/changed/stale pages will be rendered`,
      )
      return
    } catch (err) {
      warn(`baseline: could not restore from ${base}: ${err.message} — doing a full build instead`)
      fs.rmSync(PREV_SITE_DIR, { recursive: true, force: true }) // no site tree → decideIncrementalBuild renders everything
      return
    }
  }
  log('baseline: no previous deployment found — this is a full build')
}
