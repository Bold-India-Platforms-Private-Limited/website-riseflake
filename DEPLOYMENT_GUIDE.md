# Deployment guide — Vercel (static export)

Riseflake Jobportal (**jobportal.riseflake.com**) is a **fully static Next.js export served by Vercel**. There is no Node server, no Vercel
Function and no ISR — every request is a static file from Vercel's CDN.

> Scope: this covers the Riseflake Jobportal (`website-riseflake` repo) only. The backend API, the web app and the admin panel are unchanged.

## How it works

```
Vercel build (every push to main · every 3 h via deploy hook · on demand)
  │
  └─ npm run build
       1. resume sub-app      → public/resume                     (scripts/build-resume.sh)
       2. build manifest      → .build/manifest.json              (scripts/cf/build-manifest.mjs)
       3. next build          → ./out   (output: 'export')        (next.config.js)
       4. post-build audit    → sitemaps, file-budget + quality   (scripts/cf/postbuild.mjs)
                                 gates, then .vercel/output with   (scripts/cf/vercel.mjs)
                                 redirects, headers, clean URLs
```

**Why a manifest?** The build keeps the deployment under a file budget (`CF_MAX_FILES`), and a static
export writes two files per page (`.html` + a `.txt` RSC payload). More importantly, every pre-rendered page is
a backend call at build time, so *what* gets pre-rendered decides how long a build takes. `build-manifest.mjs`
asks the backend what exists and writes the list:

| Pre-rendered (a static file) | Not pre-rendered (rendered on demand in the browser) |
|---|---|
| **active** jobs and internships (~1,000 + ~55) | expired / closed jobs |
| companies that have **an active job or internship** (~750) — backend `hiring-companies-sitemap.xml` | the other ~5,500 companies of the registry |
| SEO landing pages: job / internship / company facets, skills, blog, hackathons, static pages (~700) | colleges (68,000), profile pages (`CF_COLLEGES_MAX` / `CF_EXTRA_PROFILES_MAX` opt in) |

**Every dynamic route's `generateStaticParams()` and every sitemap read that one list**, so a URL is either a
real file *and* in the sitemap, or neither. Leaf pages (job / internship / company) drop their `.txt` payload
after the build (links to them are plain navigations), so each costs one file. The whole site is ~2,400 pages
≈ 4,000 files — a fifth of the limit.

**What about pages that are not pre-rendered?** Vercel answers with the real HTTP `404` (correct for
search engines). The 404 page (`src/app/components/NotFoundFallback.tsx`) then looks at the URL and, if it is a
job / internship / company / college / profile / registry-company URL, fetches the record from the public API
and renders the normal page **in the browser** — so a job posted after the last build, or one of the 68,000
colleges, still opens for real visitors. It only shows the 404 page (and reports it to the 404 tracker) when
the API confirms the record doesn't exist.

## Incremental builds

Re-rendering every page on every build would be slow and would hammer the backend for no reason — almost
nothing changes between two builds a few hours apart. So each build sorts every page in the manifest into one
of these, and **only renders `new`, `changed` and `stale` ones**:

| State | Meaning | What the build does |
|---|---|---|
| **reuse** | same record `lastmod`, younger than its kind's max age | copies last deployment's file byte-for-byte — zero backend calls |
| **new** | no previous copy | renders it |
| **changed** | the record's `lastmod` moved (job edited; a company's listings changed) | renders it |
| **stale** | unchanged, but older than its kind's max age (`scripts/cf/lib.mjs` `PAGE_KINDS`: 12–72 h) — keeps "26 days left" style text and related lists honest | renders it (spread out per page so a kind doesn't expire all at once) |
| **deferred** | wants rendering but the build's render budget is spent (see *Render budget*) | keeps its old copy, or — if it has none — is left for the next build |
| *(gone)* | no longer in the manifest (job expired, company stopped hiring) | not copied → removed from the site and the sitemaps |

```
scripts/cf/routes.mjs          hashes the CODE (every route's import graph + shared config/env) → `buildId`
scripts/cf/baseline.mjs        restores the previous deployment (state + pages) into .cache/ — see below
scripts/cf/build-manifest.mjs  asks the backend what pages exist NOW, then (incremental.mjs) plans each page as above
                                • buildId changed since the last deploy → every page is `new` (pages from two
                                  code versions can't be mixed: their JS/CSS asset names differ)
next build                     renders only the pages flagged in the manifest (dynamicParams=false + src/lib/manifest.ts)
scripts/cf/postbuild.mjs       copies the reused pages back in, THEN audits/sitemaps/budget-checks the WHOLE site,
                                THEN — only if every gate passes — publishes the new baseline
```

**Where "the previous deployment" comes from.** A Vercel build starts on a blank disk, so nothing can
be cached between builds. Instead **every deployment publishes its own build state inside itself**:

```
/_rf/state.json               per-page {lastmod, rendered-at} + the code fingerprint + checksums of the bundles
/_rf/pages-<kind>-<n>.tgz     the site's page files, packed (≈ 10 files — so they barely touch the file limit)
```

The next build downloads those from the live site (`https://riseflake.com`, or `CF_BASELINE_URL`; on Vercel
it also tries the project's production domain), verifies the checksums and unpacks them
into `.cache/site`. Bundles rather than per-page downloads because a static host may rewrite the HTML it serves;
a `.tgz` comes back byte-for-byte. `/_rf/*` is `noindex` and not in any sitemap. A GitHub Actions runner that
already restores `.cache/` (the workflow does) skips the download.

Everything fails safe: no baseline (first deploy), different code, unreachable site, bad checksum → that build
is simply a full one. It never makes a build *fail*, and it never changes *what* is published, only how much
work it takes. `npm run smoke` and `npm run seo-diff` verify the output either way.

### Render budget (why a build can't time out any more)

The backend's anti-scrape guard lets one IP open only **600 distinct detail URLs per 5 minutes** — about 100
pages a minute — unless the request carries the `WEBSITE_ISR_SECRET` header. A build without
that variable hit exactly this wall: thousands of `429`s, retry storms, and the build timing out mid-way. Now:

- **`WEBSITE_ISR_SECRET` set** (the fix): no throttling, no budget — every new/changed/stale page renders in one build.
- **not set**: the build renders at most `CF_RENDER_BUDGET` (default 450) job / internship / company / skill pages
  per run — new pages first (internships → jobs → hiring companies), then changed, then stale. The remainder
  simply wait for the next build (each keeps its old copy if it has one; a page that has never been built is
  not in the sitemap yet, but its URL still opens via the browser fallback). The site converges over a few builds.
- **Shrink guard**: a code change forces a full re-render. If the budget can't cover at least 70 % of the
  pages the live site has (`CF_MIN_COVERAGE`), the build **fails instead of replacing a full site with a partial
  one** — the previous deployment stays live. Set the secret (or raise the budget) and re-run.

## Vercel setup (one time)

1. Vercel → **Add New → Project** → import this GitHub repo. `vercel.json` already sets the install and build
   commands; the build writes `.vercel/output` (Build Output API), so no output directory needs configuring.
2. **Settings → Build & Deployment → Node.js Version**: `24.x` (the build scripts need ≥ 22.18).
3. **Settings → Environment Variables → Production**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://backend.riseflake.com/api/v2/website` |
| `NEXT_PUBLIC_BLOG_API_URL` | `https://backend.riseflake.com/api/v2` |
| `NEXT_PUBLIC_APP_BASE_URL` | `https://app.riseflake.com` |
| `NEXT_PUBLIC_TRACK_404_URL` | `https://backend.riseflake.com/api/v2/track-404` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAADR3vt6rRrmI-T-k` (public key) |
| **`WEBSITE_ISR_SECRET`** | the backend's own `WEBSITE_ISR_SECRET` value — **this is what makes builds fast and reliable** |
| `SKIP_RESUME_BUILD` | `1` — reuses the committed `public/resume` instead of rebuilding that sub-app (saves ~2 min) |

4. **Scheduled refresh**: Vercel rebuilds on every push to `main`. For new jobs to appear between pushes,
   create a Deploy Hook (Settings → Git → Deploy Hooks, branch `main`) and store its URL as the GitHub secret
   `VERCEL_DEPLOY_HOOK`; `.github/workflows/refresh-vercel.yml` then triggers a build every 3 hours.
5. **Domain**: Settings → Domains → `jobportal.riseflake.com` (Cloudflare DNS CNAME to Vercel, proxied, with a
   Configuration Rule setting SSL to Full (strict) for that hostname only — the zone default stays Flexible).
   The site origin comes from `NEXT_PUBLIC_SITE_URL` (default `https://jobportal.riseflake.com`).

Vercel caps a build at 45 minutes. A cold build (first deploy, or after a code change) renders every page, so
keep `WEBSITE_ISR_SECRET` set; later builds reuse unchanged pages from the live site (`/_rf`, see
*Incremental builds*).

## Day-to-day

- **Content freshness**: a new job / company / blog post appears in the static site at the next build (every
  3 h, on every push to `main`, or immediately via *Run workflow*). Until then a new job **URL still works**
  for visitors through the browser fallback; it just isn't in the sitemap yet.
- **Build time**: a scheduled run (no code changes) only re-renders new/changed/stale-by-age pages — see
  *Incremental builds* above — so it stays fast regardless of how large the site grows. A build after a code
  push re-renders everything (~2,400 pages; minutes with `WEBSITE_ISR_SECRET`, see *Render budget* without).
- **Deploying the backend before the website**: the website build uses the backend's
  `GET /api/v2/website/hiring-companies-sitemap.xml`. Until that is deployed the build falls back to the 1,500
  most recently updated companies (with a warning in the log) — nothing breaks, it just isn't as precise.
- **Cost**: static files only — no Functions or ISR usage. Each scheduled build counts against Vercel build minutes.
- **Tuning the page budget** (environment variables, all optional; defaults in `scripts/cf/build-manifest.mjs`):

  | Variable | Default | Meaning |
  |---|---|---|
  | `CF_MAX_FILES` | 19000 | hard budget for the deployment (platform limit 20,000) |
  | `CF_COLLEGES_MAX` | 0 | most college pages to pre-render (opt-in; colleges are parked anyway) |
  | `CF_EXTRA_PROFILES_MAX` | 0 | most non-curated profiles to pre-render (opt-in) |
  | `CF_RENDER_BUDGET` | 450 without `WEBSITE_ISR_SECRET`, unlimited with it | most job/internship/company/skill pages rendered per build (see *Render budget*) |
  | `CF_MIN_COVERAGE` / `CF_ALLOW_SHRINK` | 0.7 / – | shrink guard: fail if a budget-limited build would keep < 70 % of the live site's pages (`CF_ALLOW_SHRINK=1` accepts it) |
  | `CF_COMPANIES_FALLBACK_MAX` | 1500 | companies to pre-render if the backend has no `hiring-companies-sitemap.xml` yet (newest first) |
  | `CF_BASELINE_URL` / `CF_BASELINE` | riseflake.com | where to fetch the previous deployment from / `off` = never reuse |
  | `CF_MAX_BROKEN_RATIO` / `CF_MAX_BROKEN_MIN` | 0.02 / 30 | how many soft-404 pages the audit tolerates |
  | `CF_MAX_FETCH_FAILURES` | 25 | backend requests allowed to fail after all retries |
  | `CF_FETCH_CONCURRENCY` / `CF_BUILD_CPUS` | 4 / 4 with `WEBSITE_ISR_SECRET`; 1 / 2 without, for page rendering only (the manifest step always uses 4) | how hard the build hits the backend |
  | `CF_LIMIT_PER_ROUTE` | – | **local only**: truncate every list to N for a fast test build |
  | `CF_FORCE_FULL_BUILD` | – | ignore the incremental cache and re-render every page (also a checkbox on *Run workflow*) |

- **If the site outgrows 20,000 files** the build fails with a clear message rather than deploying a partial
  site. At ~4,000 files today that is far away; the levers are the facet lists in the backend, or a paid Pages
  plan (100,000 files; raise `CF_MAX_FILES`).
- **Parked verticals**: `src/lib/parkedVerticals.ts` currently has `colleges` and `people` (the `/in/*` public
  profile directory) both set to `true`. While parked, neither is fetched during the build, pre-rendered, or
  present in any sitemap; their nav links are hidden; and `/colleges`, `/colleges/browse`, `/in/people` redirect
  to `/` (a direct hit on a detail/facet URL like `/colleges/some-college` or `/in/someone` is a plain 404 —
  the browser-side fallback for those two kinds is also disabled while parked). Nothing was deleted — flip
  either flag back to `false` and redeploy to bring it back exactly as it was.

## Local development

```bash
npm ci
npm run dev                # next dev (creates a tiny .build/manifest.json on first run)
```
`.env` for dev points at a local backend. A **deployable** build refuses to run against one (it would bake
`localhost` URLs into the client bundles). To test a production-like build locally:

```bash
export NEXT_PUBLIC_API_BASE_URL=https://backend.riseflake.com/api/v2/website \
       NEXT_PUBLIC_BLOG_API_URL=https://backend.riseflake.com/api/v2 \
       NEXT_PUBLIC_APP_BASE_URL=https://app.riseflake.com \
       NEXT_PUBLIC_TRACK_404_URL=https://backend.riseflake.com/api/v2/track-404
SKIP_RESUME_BUILD=1 CF_LIMIT_PER_ROUTE=25 npm run build   # small + fast
npx vercel build && npx vercel dev --prebuilt           # or: vercel deploy --prebuilt for a preview URL
```
Redirects, clean URLs and the 404 behaviour come from `.vercel/output/config.json` (scripts/cf/vercel.mjs).

## Behaviour changes vs the old server-rendered site

These are inherent to a static host and are the only intended differences (everything else — titles,
descriptions, canonicals, hreflang, robots, Open Graph text, JSON-LD — is byte-identical; verify with `seo-diff`):

| Area | Before (EC2, ISR) | Now (static) |
|---|---|---|
| `?page=N` on city / skill / facet landing pages | server-rendered, self-canonical, indexable to page 20 | page 1 only; a "Browse all results" button leads to the interactive `/jobs`, `/internships`, `/companies`, `/colleges` list. Individual listings are all still pre-rendered + in the sitemaps |
| `/jobs?…`, `/internships?…` (filters, search, page) | `X-Robots-Tag: noindex, follow` from middleware | same HTML for every query string; `canonical` → the clean URL (Google's recommended mechanism) |
| Blog `?category= / ?tag= / ?search= / ?page=` | server-side | every post in the HTML; filters applied in the browser |
| Social-share image | per-page card from `/api/og` | the branded `/og-image.webp` (a static host has no image renderer; one PNG per page would also blow the file limit) |
| Sitemaps | proxied from the backend at request time | generated at build from the manifest, so they list only pages that exist. `sitemap.html` → `/sitemap` (301). The college sitemap is fixed (it listed `/colleges/undefined` ×100) |
| Pages outside the budget | rendered on demand | real 404 for crawlers; browser fallback for people |
| India Company Registry list | server-rendered | static shell + client-side search |
| Freshness | 15–60 min ISR | build cadence (≤ 3 h) |

## Rollback

- **Bad deploy**: Vercel → project → Deployments → pick a previous one → *Promote to Production* (instant).
- **Back to EC2**: the branch `legacy-ec2-deploy` keeps the pre-migration code and the old `deploy.yml`.
  Point DNS back at the EC2 origin (or remove the Vercel domain).

## Troubleshooting a failed build

The post-build step prints every failed gate. Common ones:

| Message | Meaning / fix |
|---|---|
| `N pages rendered as not-found/degraded` | the backend was unhealthy during the build — re-run; nothing was deployed |
| `N backend requests failed after retries` | same, or the rate limiter blocked the build — check `WEBSITE_ISR_SECRET` is set (and equals the backend's) |
| `WEBSITE_ISR_SECRET is not set: the backend will throttle this build` | add it as a build variable (see *Vercel setup*). Until then each build renders only `CF_RENDER_BUDGET` pages |
| `This build could only afford N of the M pages the live site has` | the shrink guard: code changed, so every page must be re-rendered, and the render budget can't cover it. Set `WEBSITE_ISR_SECRET`, or raise `CF_RENDER_BUDGET` |
| `baseline: … no build state` / `full build … no matching previous deployment` | first deployment, or the code changed since the last one — a full render is expected. If it repeats on every build, the live site isn't serving `/_rf/state.json` (check `CF_BASELINE_URL`) |
| `[cf-fetch] attempt N/M failed … GET <url>` / `manifest build FAILED: GET <url> failed after 5 attempts` | that backend endpoint is slow or unreachable from the build machine (the URL is named). Re-run; if it repeats, check the backend/EC2 health |
| `hiring-companies-sitemap.xml returned 404` | the backend hasn't been deployed with that endpoint yet — the build falls back to the newest 1,500 companies |
| Build hits the platform's build-time limit | check the log's `plan:` line — a cold build with `WEBSITE_ISR_SECRET` should be minutes; without it, budget-limited by design |
| `N page(s) have no server-rendered <h1>` | something pushed a page into client-side rendering (usually `useSearchParams()` outside `<Suspense>`) |
| `… files exceeds the budget` | see *If the site outgrows 20,000 files* |
| `Refusing to build … against a local backend` | `NEXT_PUBLIC_API_BASE_URL` points at localhost |
| A page looks stale and its data clearly changed | its `lastmod` didn't move and it's within its kind's max-age window (`scripts/cf/lib.mjs` `PAGE_KINDS`) — re-run with the *Run workflow* "force full build" checkbox, or wait for the max-age refresh |
