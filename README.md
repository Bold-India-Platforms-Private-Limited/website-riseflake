# Riseflake website

The public site at **riseflake.com** — jobs, internships, companies, colleges, people directory, skills,
hackathons and blog. Built for search: every indexable page is pre-rendered HTML with its own metadata and
structured data.

It is a **static Next.js export hosted on Cloudflare Pages** — no server, no Workers, $0 hosting. The data
comes from the RiseflakeBackend public API **at build time**; the site rebuilds every few hours.

➡️ **How it works, setup, cutover and operations: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

## Stack

- Next.js 15 (App Router) with `output: 'export'`, React 19, TypeScript, Tailwind CSS
- Cloudflare Pages (Direct Upload via GitHub Actions) — static assets only
- `resume/` — the separate resume-builder app, built into `public/resume`

## Project layout

```
src/app/                 routes (pages, layouts, components)
src/lib/                 API config, facets, manifest reader, fallback route matcher
scripts/cf/              static-build tooling (manifest, post-build audit, sitemaps, smoke + SEO checks)
public/                  static assets, robots.txt, _redirects (hand-written rules)
resume/                  resume-builder sub-app
.github/workflows/       deploy-cloudflare-pages.yml
```

## Local development

```bash
npm ci
npm run dev            # http://localhost:3000 — uses .env (a local backend by default)
```

## Production-like build

A deployable build talks to the production API and must not use a local backend:

```bash
export NEXT_PUBLIC_API_BASE_URL=https://backend.riseflake.com/api/v2/website \
       NEXT_PUBLIC_BLOG_API_URL=https://backend.riseflake.com/api/v2 \
       NEXT_PUBLIC_APP_BASE_URL=https://app.riseflake.com \
       NEXT_PUBLIC_TRACK_404_URL=https://backend.riseflake.com/api/v2/track-404

SKIP_RESUME_BUILD=1 CF_LIMIT_PER_ROUTE=25 npm run build   # small, fast, gentle on the API
npm run preview                                           # serves ./out with Cloudflare's runtime
npm run smoke -- http://localhost:8788 --all              # every sitemap URL is a real page
npm run seo-diff -- http://localhost:8788                 # <head> + JSON-LD vs the live site
```

Drop `CF_LIMIT_PER_ROUTE` for the real thing (`npm run build` — about 17k files; CI does this).

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next dev server |
| `npm run build` | resume app → manifest → `next build` → post-build audit → `./out` |
| `npm run build:manifest` | just refresh `.build/manifest.json` |
| `npm run preview` | `wrangler pages dev ./out` |
| `npm run smoke -- <url> [--all]` | post-deploy check of a deployment |
| `npm run seo-diff -- <url>` | compare SEO tags with the live site |

## Notes for contributors

- **Dynamic routes must set `dynamicParams = false`** and read their slugs from `src/lib/manifest.ts`.
  Anything not in the manifest is not a page (the 404 fallback renders it in the browser instead).
- **No server-only features**: no `middleware`, `next.config` `redirects()/rewrites()/headers()`, ISR,
  `searchParams` in server components, or route handlers that read the request. Redirects go in
  `scripts/cf/redirects.mjs`; headers in `scripts/cf/postbuild.mjs`.
- `useSearchParams()` must sit inside `<Suspense>` — otherwise the whole page falls back to client
  rendering and the build's audit fails ("no server-rendered `<h1>`").
- SEO surfaces (`generateMetadata`, JSON-LD, canonicals, robots) are unchanged by the static migration; run
  `npm run seo-diff` after touching them.
