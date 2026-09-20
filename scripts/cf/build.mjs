#!/usr/bin/env node
/**
 * `npm run build` — the full static-site build for Cloudflare Pages.
 *
 *   1. resume sub-app  → public/resume        (scripts/build-resume.sh, fault tolerant)
 *   2. build manifest  → .build/manifest.json (which pages exist — scripts/cf/build-manifest.mjs)
 *   3. next build      → ./out                (with the hardened build-time fetch preloaded)
 *   4. post-build      → audit, trim, sitemaps, _redirects, _headers, file budget
 *
 * Set SKIP_RESUME_BUILD=1 to reuse the committed public/resume instead of rebuilding it.
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { BUILD_DIR, FAILURE_LOG, OUT_DIR, ROOT, log } from './lib.mjs'
import { computeCodeState } from './routes.mjs'

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

run('build manifest', process.execPath, ['scripts/cf/build-manifest.mjs'])

const preload = path.join(ROOT, 'scripts', 'cf', 'preload.cjs')
run('next build', path.join(ROOT, 'node_modules', '.bin', 'next'), ['build'], {
  NEXT_TELEMETRY_DISABLED: '1',
  NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --require ${preload}`.trim(),
  CF_BUILD_ID: codeState.buildId,
})

run('post-build', process.execPath, ['scripts/cf/postbuild.mjs'])
log('Static site ready in ./out — deploy with: npx wrangler pages deploy out --project-name <project>')
