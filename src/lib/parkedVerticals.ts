/**
 * Verticals temporarily taken out of public use.
 *
 * Flipping a flag to `true` here, and only here, removes that vertical everywhere at once:
 *   - not fetched or included in .build/manifest.json (scripts/cf/build-manifest.mjs)
 *   - not pre-rendered as static pages (src/lib/manifest.ts returns an empty slug list,
 *     which every generateStaticParams() in that vertical already treats as "no pages")
 *   - not in any sitemap or the sitemap index (scripts/cf/sitemaps.mjs already skips writing
 *     a sitemap file for an empty entry list)
 *   - its top-level hub/browse/detail/facet URLs redirect to `/` instead of 404ing or falling
 *     back to a live client-side render (scripts/cf/redirects.mjs, src/lib/fallbackRoutes.ts)
 *   - hidden from navigation (Navbar, MobileBottomNav, Footer) and from the human /sitemap page
 *
 * Nothing about the feature is deleted — every route, component and build-script branch for a
 * parked vertical stays in the codebase and starts working again the moment its flag flips back
 * to `false` (and the site redeploys).
 *
 * scripts/cf/*.mjs import this file directly via Node's native TypeScript stripping (the same
 * pattern already used for src/lib/staticBlogPosts.ts) — there is exactly one copy of this
 * decision, not one per build script.
 */
export const PARKED_VERTICALS = {
  colleges: true,
  people: true,
} as const

export type ParkedVertical = keyof typeof PARKED_VERTICALS
