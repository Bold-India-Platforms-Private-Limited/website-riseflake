#!/usr/bin/env node
/**
 * `npm run build` — the full static-site build for Cloudflare Pages.
 *
 *   1. resume sub-app  → public/resume        (scripts/build-resume.sh, fault tolerant)
 *   2. baseline        → .cache/              (the previous deployment's pages, so unchanged ones are skipped —
 *                                              scripts/cf/baseline.mjs; a no-op when there is none)
 *   3. build manifest  → .build/manifest.json (which pages exist, and which of them to render this build —
 *                                              scripts/cf/build-manifest.mjs)
 *   4. next build      → ./out                (renders ONLY the pages flagged in the manifest, with the
 *                                              hardened build-time fetch preloaded)
 *   5. post-build      → reuse carried-forward pages, audit, trim, sitemaps, _redirects, _headers, file budget,
 *                        publish the baseline for the next build
 *
 * Set SKIP_RESUME_BUILD=1 to reuse the committed public/resume instead of rebuilding it.
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { BUILD_DIR, FAILURE_LOG, HAS_INTERNAL_KEY, OUT_DIR, ROOT, log } from './lib.mjs'
import { computeCodeState } from './routes.mjs'
import { restoreBaseline } from './baseline.mjs'

// Computed once and reused everywhere it's needed (next.config.js's generateBuildId, and
// build-manifest.mjs / postbuild.mjs independently recompute the same deterministic value from
// the same source tree rather than threading it through env vars — see scripts/cf/incremental.mjs).
const codeState = computeCodeState()

const run = (label, cmd, args, env = {}) => {
  log(`── ${label}`)
  const t = Date.now()
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env } })
  if (r.status !== 0) {
    console.error(`[cf] "${label}" failed (exit ${r.status ?? r.signal}).`)
    process.exit(r.status ?? 1)
  }
  log(`   ${label} done in ${((Date.now() - t) / 1000).toFixed(0)}s`)
}

fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(BUILD_DIR, { recursive: true })
fs.rmSync(FAILURE_LOG, { force: true })

if (process.env.SKIP_RESUME_BUILD === '1') log('── resume sub-app: skipped (SKIP_RESUME_BUILD=1, using committed public/resume)')
else run('resume sub-app', 'bash', ['scripts/build-resume.sh'])

log('── baseline (previous deployment)')
await restoreBaseline(codeState)

run('build manifest', process.execPath, ['scripts/cf/build-manifest.mjs'])

const preload = path.join(ROOT, 'scripts', 'cf', 'preload.cjs')
run('next build', path.join(ROOT, 'node_modules', '.bin', 'next'), ['build'], {
  NEXT_TELEMETRY_DISABLED: '1',
  // Without WEBSITE_ISR_SECRET the backend allows 600 requests/min per IP: render gently (see next.config.js
  // for the matching worker count) rather than provoke a 429 retry storm. The manifest step is unaffected.
  ...(HAS_INTERNAL_KEY || process.env.CF_FETCH_CONCURRENCY ? {} : { CF_FETCH_CONCURRENCY: '1' }),
  NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --require ${preload}`.trim(),
  CF_BUILD_ID: codeState.buildId,
})

run('post-build', process.execPath, ['scripts/cf/postbuild.mjs'])
log('Static site ready in ./out — deploy with: npx wrangler pages deploy out --project-name <project>')
