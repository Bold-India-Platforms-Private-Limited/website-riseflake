/**
 * Backend API base URL.
 * Set NEXT_PUBLIC_API_BASE_URL in .env (or .env.local) to override.
 * Falls back to the production URL so local dev works even without a local .env.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://backend.riseflake.com/api/v1/website'

export const WEBSITE_BASE_URL = 'https://riseflake.com'
export const BASE_ASSETS_URL = 'https://assets.riseflake.com/images'