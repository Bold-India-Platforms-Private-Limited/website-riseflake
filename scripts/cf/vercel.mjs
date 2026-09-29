/**
 * Packages the finished static export (./out) for Vercel with the Build Output API
 * (https://vercel.com/docs/build-output-api/v3): files → .vercel/output/static, and redirects, headers,
 * clean URLs and real 404s → .vercel/output/config.json. Fully static — no Functions, no ISR, nothing
 * runs per request. Called at the end of postbuild.mjs.
 */
import fs from 'node:fs'
import path from 'node:path'
import { BASELINE_PUBLIC_DIR, OUT_DIR, ROOT, log, walkFiles } from './lib.mjs'

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** @param {string[]} redirectRules lines in `_redirects` form: "<source> <destination> <status>" */
export function writeVercelOutput(redirectRules) {
  const outputDir = path.join(ROOT, '.vercel', 'output')
  const staticDir = path.join(outputDir, 'static')
  fs.rmSync(outputDir, { recursive: true, force: true })
  fs.mkdirSync(outputDir, { recursive: true })
  fs.cpSync(OUT_DIR, staticDir, { recursive: true })

  const redirects = redirectRules.map((line) => {
    const [source, destination, status = '301'] = line.split(/\s+/)
    return { src: `^${esc(source)}/?$`, status: Number(status), headers: { Location: destination } }
  })

  // Clean URLs: `jobs/foo.html` is served at `/jobs/foo` . 404.html stays a file.
  const overrides = {}
  for (const f of walkFiles(staticDir)) {
    const rel = path.relative(staticDir, f).split(path.sep).join('/')
    // index.html files are already served at their directory (`/`, `/resume/`); `/resume` itself is resume.html.
    if (!rel.endsWith('.html') || rel === '404.html' || rel.endsWith('index.html')) continue
    overrides[rel] = { path: rel.slice(0, -'.html'.length) }
  }

  const config = {
    version: 3,
    routes: [
      ...redirects,
      // `/foo.html` → `/foo`.
      { src: '^/(.+)\\.html$', status: 308, headers: { Location: '/$1' } },
      {
        src: '^/_next/static/(.*)$',
        headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
        continue: true,
      },
      {
        src: `^/${esc(BASELINE_PUBLIC_DIR)}/(.*)$`,
        headers: { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'public, max-age=0, must-revalidate' },
        continue: true,
      },
      {
        src: '^/(.*)$',
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'Referrer-Policy': 'same-origin',
        },
        continue: true,
      },
      { handle: 'filesystem' },
      // Anything not on disk is a real 404 (the 404 page renders unbuilt records client-side).
      { src: '^/(.*)$', status: 404, dest: '/404.html' },
    ],
    overrides,
  }
  fs.writeFileSync(path.join(outputDir, 'config.json'), JSON.stringify(config))
  log(`vercel: .vercel/output ready — ${redirects.length} redirects, ${Object.keys(overrides).length} clean URLs`)
}
