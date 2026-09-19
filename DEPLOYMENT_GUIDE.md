# Deployment guide — Cloudflare Pages (static export)

riseflake.com is a **fully static Next.js export served from Cloudflare Pages**. There is no Node server, no
Cloudflare Worker / Pages Function, and no per-request compute anywhere. Static requests on Pages are free
and unlimited, so hosting costs **$0** and pages are served from Cloudflare's edge in every region.

> Scope: this covers `website-riseflake` only. The backend API, the web app and the admin panel are unchanged.

## How it works

```
GitHub Actions (every push to main · every 3 h · on demand)
  │
  ├─ npm run build
  │    1. resume sub-app      → public/resume                     (scripts/build-resume.sh)
  │    2. build manifest      → .build/manifest.json              (scripts/cf/build-manifest.mjs)
  │    3. next build          → ./out   (output: 'export')        (next.config.js)
  │    4. post-build audit    → sitemaps, _redirects, _headers,   (scripts/cf/postbuild.mjs)
  │                              file-budget + quality gates
  ├─ deploy ./out → Pages "staging" alias  ──▶ smoke test (scripts/cf/smoke.mjs)
  └─ deploy ./out → Pages production
```

**Why a manifest?** Cloudflare Pages (free) accepts at most **20,000 files per deployment**, and a static
export writes two files per page (`.html` + a `.txt` RSC payload). The backend has ~1,000 jobs, ~6,200
companies, 68,000 colleges, 27,000 profiles … so not everything can be a file. `build-manifest.mjs` asks the
backend what exists, applies a budget (priority order: SEO landing pages → jobs & internships → curated
profiles → companies → colleges linked from pre-rendered pages → extra profiles) and writes the list. **Every
dynamic route's `generateStaticParams()` and every sitemap read that one list**, so a URL is either a real
file *and* in the sitemap, or neither. Leaf pages (job / internship / company / college / profile) drop their
`.txt` payload after the build (links to them are plain navigations), so each costs one file.

**What about pages that are not pre-rendered?** Cloudflare answers with the real HTTP `404` (correct for
search engines). The 404 page (`src/app/components/NotFoundFallback.tsx`) then looks at the URL and, if it is a
job / internship / company / college / profile / registry-company URL, fetches the record from the public API
and renders the normal page **in the browser** — so a job posted after the last build, or one of the 68,000
colleges, still opens for real visitors. It only shows the 404 page (and reports it to the 404 tracker) when
the API confirms the record doesn't exist.

## One-time setup

1. **Create the Pages project** (Direct Upload — GitHub Actions does the build, not Cloudflare):
   ```bash
   npx wrangler login
   npx wrangler pages project create riseflake-website --production-branch=main
   ```
2. **Create an API token**: Cloudflare dashboard → My Profile → API Tokens → *Create Token* → template
   *Edit Cloudflare Workers* is too broad — use a custom token with **Account → Cloudflare Pages → Edit**.
   Also note your **Account ID** (dashboard → Workers & Pages → right sidebar).
3. **GitHub repository secrets** (Settings → Secrets and variables → Actions):

   | Secret | Value |
   |---|---|
   | `CLOUDFLARE_API_TOKEN` | the token from step 2 |
   | `CLOUDFLARE_ACCOUNT_ID` | your account ID |
   | `WEBSITE_ISR_SECRET` | same value the backend already uses for `x-riseflake-internal-key` (lets the build bypass the API rate limiter — see `scripts/cf/preload.cjs`) |

   Optional repository **variable** `CF_PAGES_PROJECT` if the project isn't named `riseflake-website`.
4. **Run the workflow once** (Actions → *Deploy to Cloudflare Pages* → Run workflow). The result is live at
   `https://riseflake-website.pages.dev` — the real domain is untouched until step 2 of the cutover below.

## Cutover checklist (do these in order; the old EC2 site keeps serving until step 3)

1. **Verify the preview** at `https://riseflake-website.pages.dev`:
   ```bash
   npm run smoke -- https://riseflake-website.pages.dev --all        # every sitemap URL is a real page
   npm run seo-diff -- https://riseflake-website.pages.dev --sample=60   # <head>/JSON-LD vs the live site
   ```
   `seo-diff` should show only the differences listed under *Behaviour changes* below.
   *(Client-side lists and the browser fallback call the API from the browser; the backend's CORS only allows
   the real site origins, so on `*.pages.dev` those parts show empty/404 states. That is expected and resolves
   on riseflake.com.)*
2. **Remove the old Cloudflare Cache Rule** for riseflake.com (the one caching `/` and `/jobs` for up to a year).
   It made sense in front of the EC2 origin; in front of Pages it would pin stale HTML. Pages already
   revalidates at the edge and is purged automatically on every deploy.
3. **Attach the custom domain**: Workers & Pages → riseflake-website → Custom domains → add `riseflake.com`
   (and `www.riseflake.com` if used). The zone is already on Cloudflare, so DNS is switched for you.
4. **Re-run the smoke test against `https://riseflake.com`** and spot-check a few pages in a browser.
5. **Search Console**: nothing to resubmit — `sitemap.xml` keeps its URL and structure. Watch *Pages* and
   *Sitemaps* for a week. (The old `sitemap-india-companies.xml` is gone on purpose: that registry API is
   currently unavailable and 3.6 M pages can't be static.)
6. **Decommission**: once happy, stop the `riseflake-website` PM2 app on the EC2 box (the backend and other apps
   there are unaffected). Rollback path until then: see *Rollback*.

## Day-to-day

- **Content freshness**: a new job / company / blog post appears in the static site at the next build (every
  3 h, on every push to `main`, or immediately via *Run workflow*). Until then a new job **URL still works**
  for visitors through the browser fallback; it just isn't in the sitemap yet.
- **Cost**: Cloudflare Pages $0. GitHub Actions: private repos get 2,000 free minutes/month; see the
  *build time* note in the workflow before tightening the schedule.
- **Tuning the page budget** (environment variables, all optional; defaults in `scripts/cf/build-manifest.mjs`):

  | Variable | Default | Meaning |
  |---|---|---|
  | `CF_MAX_FILES` | 19000 | hard budget for the deployment (platform limit 20,000) |
  | `CF_COLLEGES_MAX` | 3000 | most college pages to pre-render (only colleges linked from pre-rendered pages) |
  | `CF_EXTRA_PROFILES_MAX` | 2000 | most non-curated profiles to pre-render |
  | `CF_MAX_BROKEN_RATIO` / `CF_MAX_BROKEN_MIN` | 0.02 / 30 | how many soft-404 pages the audit tolerates |
  | `CF_MAX_FETCH_FAILURES` | 25 | backend requests allowed to fail after all retries |
  | `CF_FETCH_CONCURRENCY` / `CF_BUILD_CPUS` | 4 / 4 | how hard the build hits the backend |
  | `CF_LIMIT_PER_ROUTE` | – | **local only**: truncate every list to N for a fast test build |

- **If the site outgrows 20,000 files** the build fails with a clear message rather than deploying a partial
  site. Options: lower `CF_COLLEGES_MAX` / `CF_EXTRA_PROFILES_MAX`, or move the Pages project to a paid plan
  (100,000 files; raise `CF_MAX_FILES`).

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
       NEXT_PUBLIC_TRACK_404_URL=https://backend.riseflake.com/api/v1/track-404
SKIP_RESUME_BUILD=1 CF_LIMIT_PER_ROUTE=25 npm run build   # small + fast
npm run preview                                           # wrangler pages dev ./out on :8788
```
`npm run preview` uses Cloudflare's own runtime, so `_redirects`, clean URLs and 404 behaviour match production.

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

- **Bad deploy**: Cloudflare dashboard → Workers & Pages → riseflake-website → Deployments → *Rollback* on a
  previous deployment (instant), and/or re-run the workflow.
- **Back to EC2**: the branch `legacy-ec2-deploy` keeps the pre-migration code and the old `deploy.yml`.
  Point DNS back at the EC2 origin (or remove the Pages custom domain) and re-add the old Cloudflare Cache Rule.

## Troubleshooting a failed build

The post-build step prints every failed gate. Common ones:

| Message | Meaning / fix |
|---|---|
| `N pages rendered as not-found/degraded` | the backend was unhealthy during the build — re-run; nothing was deployed |
| `N backend requests failed after retries` | same, or the rate limiter blocked the build — check `WEBSITE_ISR_SECRET` is set |
| `N page(s) have no server-rendered <h1>` | something pushed a page into client-side rendering (usually `useSearchParams()` outside `<Suspense>`) |
| `… files exceeds the budget` | see *If the site outgrows 20,000 files* |
| `Refusing to build … against a local backend` | `NEXT_PUBLIC_API_BASE_URL` points at localhost |
