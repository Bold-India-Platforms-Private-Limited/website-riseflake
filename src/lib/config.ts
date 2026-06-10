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