/**
 * Backend API base URL.
 * Set NEXT_PUBLIC_API_BASE_URL in .env (or .env.local) to override.
 * Falls back to the production URL so local dev works even without a local .env.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://backend.riseflake.com/api/v1/website'

/**
 * Blog-specific API base (no /website suffix).
 * Blog routes are mounted at /api/v1/blogs, NOT /api/v1/website/blogs.
 */
export const BLOG_API_URL =
  process.env.NEXT_PUBLIC_BLOG_API_URL ??
  'https://backend.riseflake.com/api/v1'

export const WEBSITE_BASE_URL = 'https://riseflake.com'
export const BASE_ASSETS_URL = 'https://assets.riseflake.com/images'

/**
 * Self-referencing hreflang for a given canonical URL — riseflake.com only ever
 * serves English/India content, so 'en-IN' and 'x-default' both point at the same URL.
 * Spread into `alternates` alongside `canonical` on every indexable page.
 */
export function hreflangAlternates(url: string) {
  return {
    languages: {
      'en-IN': url,
      'x-default': url,
    },
  }
}