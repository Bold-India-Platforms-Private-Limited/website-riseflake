/**
 * Code fingerprints — which routes does a code change actually affect?
 *
 * A page's HTML is a function of (its data) and (the code that renders it). Data changes are
 * detected per record (see build-manifest.mjs). This module covers the second half: it builds
 * the import graph of src/ and hashes, for every route, the exact set of files that route's
 * render depends on — its page, every ancestor layout / loading / error / not-found / template,
 * and everything those import, transitively.
 *
 *   commit touches src/app/jobs/[slug]/JobHeader.tsx   → only /jobs/[slug] pages re-render
 *   commit touches src/app/components/Navbar.tsx        → every route imports it → all re-render
 *   commit touches README.md / .github / docs / smoke   → nothing re-renders
 *
 * Correct-by-construction for static imports. Where the analysis could be wrong it fails SAFE
 * (a full rebuild), never stale:
 *   - `import(<non-literal>)` (can't be resolved statically) → every route hash covers all of src/
 *   - a source file that no route reaches ("orphan") is folded into the global hash
 *   - package-lock.json, next.config.js, tailwind/postcss/tsconfig, NEXT_PUBLIC_* env, the Node
 *     version and the calendar month (titles embed month/year) are in the global hash, which every
 *     route hash includes
 *
 * Build scripts (scripts/**), docs and public/ assets are deliberately NOT inputs: they don't change
 * page HTML (public/ files are copied into every build anyway).
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, sha1 } from './lib.mjs'

const SRC = path.join(ROOT, 'src')
const APP = path.join(SRC, 'app')
const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.css']
const SOURCE_RE = /\.(tsx?|jsx?|mjs|css|json)$/
const SPECIAL_RE = /^(layout|template|loading|error|not-found|global-error|default)\.(tsx?|jsx?)$/
const PAGE_RE = /^(page|route)\.(tsx?|jsx?)$/
// Error-boundary files are attached to every route, but what they import is NOT part of a page's rendered
// HTML: not-found.tsx pulls in the browser-side fallback (and through it every detail view), which only runs
// if a client-side navigation lands on a missing URL — a real 404 is served by 404.html, which is rebuilt on
// every build anyway. Their own file content counts; their imports do not propagate.
const BOUNDARY_RE = /^(not-found|error|global-error)\.(tsx?|jsx?)$/

const IMPORT_RE =
  /(?:\bimport|\bexport)\s+(?:type\s+)?(?:[^'"()]*?\s+from\s+)?['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)|\brequire\(\s*['"]([^'"]+)['"]\s*\)/g
const DYNAMIC_UNRESOLVABLE_RE = /\bimport\(\s*[^'"\s)]/

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/')

function resolveImport(from, spec) {
  let base
  if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec)
  else if (spec.startsWith('@/')) base = path.join(SRC, spec.slice(2)) // tsconfig paths: "@/*" → "./src/*"
  else return null // a package — covered by package-lock.json in the global hash
  const candidates = [
    base,
    ...EXTS.map((x) => base + x),
    ...EXTS.map((x) => path.join(base, 'index' + x)),
  ]
  for (const c of candidates) {
    try {
      if (fs.statSync(c).isFile()) return c
    } catch {
      /* try next */
    }
  }
  return null
}

/** `NEXT_PUBLIC_*` values are inlined into the bundles, so they are part of "the code". */
function publicEnv() {
  return Object.keys(process.env)
    .filter((k) => k.startsWith('NEXT_PUBLIC_'))
    .sort()
    .map((k) => `${k}=${process.env[k]}`)
    .join('\n')
}

export function computeCodeState() {
  const files = walk(SRC).filter((f) => SOURCE_RE.test(f))
  const content = new Map() // abs path → text
  const fileHash = new Map()
  for (const f of files) {
    const buf = fs.readFileSync(f)
    fileHash.set(f, sha1(buf))
    content.set(f, buf.toString('utf8'))
  }

  // ── import graph ──────────────────────────────────────────────────────────────────────────
  let unresolvableDynamic = false
  const deps = new Map()
  for (const f of files) {
    const text = content.get(f)
    if (/\.(tsx?|jsx?|mjs)$/.test(f)) {
      if (DYNAMIC_UNRESOLVABLE_RE.test(text)) unresolvableDynamic = true
      const found = new Set()
      for (const m of text.matchAll(IMPORT_RE)) {
        const target = resolveImport(f, m[1] ?? m[2] ?? m[3])
        if (target && fileHash.has(target)) found.add(target)
      }
      deps.set(f, [...found])
    } else {
      deps.set(f, [])
    }
  }
  const closure = (entries) => {
    const seen = new Set()
    const stack = [...entries]
    while (stack.length) {
      const f = stack.pop()
      if (seen.has(f)) continue
      seen.add(f)
      if (BOUNDARY_RE.test(path.basename(f))) continue // shallow: own content only (see BOUNDARY_RE)
      for (const d of deps.get(f) ?? []) stack.push(d)
    }
    return seen
  }

  const closureFull = (entries) => {
    const seen = new Set()
    const stack = [...entries]
    while (stack.length) {
      const f = stack.pop()
      if (seen.has(f)) continue
      seen.add(f)
      for (const d of deps.get(f) ?? []) stack.push(d)
    }
    return seen
  }

  // ── routes: a folder with page.* / route.*, plus every special file on its path from src/app ──
  const routes = new Map() // routeKey → entry files
  const appFiles = walk(APP)
  const folders = new Set(appFiles.map((f) => path.dirname(f)))
  for (const dir of folders) {
    const here = fs.readdirSync(dir)
    if (!here.some((n) => PAGE_RE.test(n))) continue
    const segs = path.relative(APP, dir).split(path.sep).filter((s) => s && !/^\(.*\)$/.test(s))
    const key = '/' + segs.join('/')
    const entries = []
    for (let d = dir; ; d = path.dirname(d)) {
      for (const n of fs.readdirSync(d)) if (PAGE_RE.test(n) && d === dir || SPECIAL_RE.test(n)) entries.push(path.join(d, n))
      if (d === APP) break
    }
    routes.set(key, entries)
  }

  // ── global hash ───────────────────────────────────────────────────────────────────────────
  const reachable = new Set()
  const routeClosures = new Map()
  for (const [key, entries] of routes) {
    const c = closure(entries)
    routeClosures.set(key, c)
    for (const f of c) reachable.add(f)
  }
  // Files reachable only THROUGH a boundary file (the 404 fallback and its views) are not orphans: they are
  // rendered by 404.html, which every build regenerates.
  const boundaryReach = new Set()
  for (const f of files) if (BOUNDARY_RE.test(path.basename(f)) && f.startsWith(APP)) for (const x of closureFull([f])) boundaryReach.add(x)
  for (const x of boundaryReach) reachable.add(x)
  const orphans = files.filter((f) => !reachable.has(f)).map((f) => `${rel(f)}:${fileHash.get(f)}`).sort()

  const rootFile = (n) => {
    const f = path.join(ROOT, n)
    return fs.existsSync(f) ? `${n}:${sha1(fs.readFileSync(f))}` : `${n}:-`
  }
  const now = new Date()
  const period = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
  const global = sha1(
    [
      'v1',
      process.env.CF_HASH_SALT ?? '',
      `node:${process.versions.node.split('.')[0]}`,
      `period:${period}`,
      ...['package-lock.json', 'next.config.js', 'tailwind.config.ts', 'postcss.config.js', 'tsconfig.json'].map(rootFile),
      publicEnv(),
      `orphans:${orphans.join('|')}`,
      unresolvableDynamic ? `unsafe:${[...fileHash.values()].sort().join('')}` : 'safe',
    ].join('\n'),
  )

  // ── per-route hash ────────────────────────────────────────────────────────────────────────
  const routeHashes = {}
  for (const [key, c] of routeClosures) {
    routeHashes[key] = sha1(
      `${key}\n${global}\n` +
        [...c].map((f) => `${rel(f)}:${fileHash.get(f)}`).sort().join('\n'),
    )
  }
  // Identity of "the code that produced this build's assets": stable across data-only builds,
  // different whenever ANY route's code changed. Used as Next's buildId and as the asset generation key.
  const buildId = sha1(global + Object.keys(routeHashes).sort().map((k) => routeHashes[k]).join('')).slice(0, 16)

  return { global, routes: routeHashes, buildId, unsafe: unresolvableDynamic, routeCount: routes.size, orphans: orphans.length }
}

// `node scripts/cf/routes.mjs` prints the fingerprint (used by the workflow's cache key and for debugging).
if (import.meta.url === `file://${process.argv[1]}`) {
  const c = computeCodeState()
  if (process.argv.includes('--json')) console.log(JSON.stringify(c, null, 2))
  else console.log(c.buildId)
}
