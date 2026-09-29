#!/usr/bin/env node
/**
 * SEO parity check: compares the SEO-relevant <head> of pages on the currently live site
 * with the same paths on a preview of the static build.
 *
 *   node scripts/cf/seo-diff.mjs <preview-base-url> [--live=https://jobportal.riseflake.com] [--sample=40] [path ...]
 *   npm run seo-diff -- http://localhost:8788
 *
 * For every path it extracts <title>, meta description / robots / keywords, canonical,
 * hreflang alternates, Open Graph + Twitter tags and every JSON-LD block, and prints what
 * differs. Run it before switching DNS: the goal is "no unexpected differences" — the known,
 * intended ones are listed in docs/CLOUDFLARE_PAGES.md (og:image, ?page=N canonicals, …).
 *
 * Volatile fields (dates that change per render) are ignored.
 */
import { locsOf } from './lib.mjs'

const args = process.argv.slice(2)
const preview = (args.find((a) => /^https?:\/\//.test(a)) ?? '').replace(/\/+$/, '')
const live = (args.find((a) => a.startsWith('--live='))?.split('=')[1] ?? 'https://jobportal.riseflake.com').replace(/\/+$/, '')
const SAMPLE = Number(args.find((a) => a.startsWith('--sample='))?.split('=')[1] ?? 40)
let paths = args.filter((a) => a.startsWith('/'))
if (!preview) {
  console.error('usage: node scripts/cf/seo-diff.mjs <preview-base-url> [--live=…] [--sample=40] [/path …]')
  process.exit(2)
}

const UA = { 'user-agent': 'RiseflakeSeoDiff/1.0 (+internal parity check)' }
const VOLATILE = /^(datePublished|dateModified|validThrough)$/

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

function extract(html) {
  // Next 15 streams page metadata into <body> for non-crawler user-agents, so scan the whole document.
  const head = html
  const out = {}
  out.title = decode(/<title>([\s\S]*?)<\/title>/.exec(head)?.[1] ?? '')
  const metas = {}
  for (const m of head.matchAll(/<meta\s+([^>]*?)\/?>/g)) {
    const attrs = Object.fromEntries([...m[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((a) => [a[1], decode(a[2])]))
    const key = attrs.name ?? attrs.property
    if (key && /^(description|robots|keywords|googlebot|og:|twitter:)/.test(key)) {
      ;(metas[key] ??= []).push(attrs.content ?? '')
    }
  }
  out.meta = metas
  out.canonical = decode(/<link rel="canonical" href="([^"]*)"/.exec(head)?.[1] ?? '')
  out.hreflang = [...head.matchAll(/<link rel="alternate" hrefLang="([^"]*)" href="([^"]*)"/gi)].map((m) => `${m[1]}=${decode(m[2])}`).sort()
  out.jsonld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1])
    } catch {
      return { __unparseable: m[1].slice(0, 80) }
    }
  })
  return out
}

const strip = (v) =>
  Array.isArray(v) ? v.map(strip) : v && typeof v === 'object'
    ? Object.fromEntries(Object.entries(v).filter(([k]) => !VOLATILE.test(k)).map(([k, x]) => [k, strip(x)]))
    : v

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

function diff(a, b) {
  const lines = []
  if (a.title !== b.title) lines.push(`title\n      live:    ${a.title}\n      preview: ${b.title}`)
  if (a.canonical !== b.canonical) lines.push(`canonical\n      live:    ${a.canonical}\n      preview: ${b.canonical}`)
  if (!same(a.hreflang, b.hreflang)) lines.push(`hreflang\n      live:    ${a.hreflang}\n      preview: ${b.hreflang}`)
  for (const k of new Set([...Object.keys(a.meta), ...Object.keys(b.meta)])) {
    if (!same(a.meta[k], b.meta[k])) lines.push(`meta ${k}\n      live:    ${JSON.stringify(a.meta[k])}\n      preview: ${JSON.stringify(b.meta[k])}`)
  }
  const ja = strip(a.jsonld), jb = strip(b.jsonld)
  if (ja.length !== jb.length) lines.push(`JSON-LD block count: live ${ja.length}, preview ${jb.length}`)
  ja.forEach((blk, i) => {
    if (jb[i] && !same(blk, jb[i])) lines.push(`JSON-LD block ${i} (${blk['@type'] ?? '?'}) differs`)
  })
  return lines
}

async function fetchHtml(base, p) {
  const res = await fetch(base + p, { headers: UA, redirect: 'follow' })
  return { status: res.status, html: res.status === 200 ? await res.text() : '' }
}

if (!paths.length) {
  // Sample from the preview's own sitemap so every path is known to exist there.
  const idx = await (await fetch(preview + '/sitemap.xml')).text()
  const all = []
  for (const child of locsOf(idx)) {
    const x = await (await fetch(preview + new URL(child).pathname)).text()
    const kids = /<sitemapindex/.test(x) ? locsOf(x) : [child]
    for (const k of kids) {
      const body = k === child ? x : await (await fetch(preview + new URL(k).pathname)).text()
      const urls = locsOf(body)
      // a few from each sitemap so every page type is represented
      all.push(...urls.slice(0, 3).map((u) => decodeURI(new URL(u).pathname)))
    }
  }
  paths = [...new Set(all)].slice(0, SAMPLE)
}

let clean = 0
let differing = 0
let skipped = 0
for (const p of paths) {
  const [a, b] = await Promise.all([fetchHtml(live, encodeURI(p)), fetchHtml(preview, encodeURI(p))])
  if (a.status !== 200 || b.status !== 200) {
    skipped++
    console.log(`? ${p}  (live ${a.status}, preview ${b.status})`)
    continue
  }
  const d = diff(extract(a.html), extract(b.html))
  if (!d.length) {
    clean++
    console.log(`= ${p}`)
  } else {
    differing++
    console.log(`≠ ${p}`)
    for (const l of d) console.log(`    · ${l}`)
  }
}
console.log(`\n${clean} identical, ${differing} with differences, ${skipped} not comparable (of ${paths.length})`)
