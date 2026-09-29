import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Static export deployed on Vercel (no Functions, no ISR).
 *
 * `next build` writes a fully static site to ./out; scripts/cf/postbuild.mjs packages it as
 * .vercel/output (Build Output API). Because nothing runs at request time:
 *   - which dynamic pages exist is decided at build time by .build/manifest.json
 *     (see scripts/cf/build-manifest.mjs and src/lib/manifest.ts);
 *   - redirects, headers and clean URLs are emitted into .vercel/output/config.json by
 *     scripts/cf/vercel.mjs — Next's own `redirects()` / `rewrites()` / `headers()` and
 *     middleware are not supported with `output: 'export'`;
 *   - the site refreshes by rebuilding + redeploying (scheduled, see .github/workflows).
 *
 * Do not use `npm run build:next` directly for a release — `npm run build` also builds
 * the manifest, hardens backend fetches, and audits the output.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  // Canonical URLs have no trailing slash (`/jobs/foo`); Vercel serves
  // `jobs/foo.html` at exactly that path (see scripts/cf/vercel.mjs).
  trailingSlash: false,
  // Incremental builds re-render only some pages and reuse the rest from the previous deployment, so the
  // client assets (chunks, CSS) must have the SAME names whenever the code is the same. scripts/cf/build.mjs
  // passes a hash of the code as CF_BUILD_ID: identical for data-only builds, new whenever a route's code
  // changes. (null → Next's default random id, e.g. for a bare `next build`.)
  generateBuildId: async () => process.env.CF_BUILD_ID || null,
  // Pin tracing to this app — the repo has a nested resume/ project with its own lockfile.
  outputFileTracingRoot: __dirname,
  images: {
    // No image-optimization server in a static export .
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.riseflake.com', pathname: '/**' },
      // Blog cover images can be hosted on various CDNs via admin upload
      { protocol: 'https', hostname: '**.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.riseflake.com', pathname: '/**' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Thousands of pages are rendered against the backend API; bound the number of
  // parallel render workers so a build doesn't hammer it (each worker also caps its
  // own concurrent requests — see scripts/cf/preload.cjs).
  // Without WEBSITE_ISR_SECRET the backend throttles the build (600 requests/min per IP), so use fewer workers.
  experimental: {
    cpus: Math.max(1, Number(process.env.CF_BUILD_CPUS) || (process.env.WEBSITE_ISR_SECRET ? 4 : 2)),
  },
  // A page whose backend calls are being retried can legitimately take a while.
  staticPageGenerationTimeout: 180,
}

export default nextConfig
