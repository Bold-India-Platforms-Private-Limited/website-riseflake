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
 * Base URL of the React web app (app.riseflake.com).
 * Used for "Apply" hand-off links — the app owns auth + the application flow.
 *
 * Precedence:
 *   1. NEXT_PUBLIC_APP_BASE_URL (explicit override, any environment)
 *   2. production URL
 * This is the SSR-safe value. On the client, call `resolveAppBaseUrl()` from an
 * effect so a plain `localhost` visit hands off to the local web app dev server.
 */
export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL ?? 'https://app.riseflake.com'

/** Local web app dev server — used when browsing the site on localhost with no override. */
export const APP_BASE_URL_LOCAL = 'http://localhost:5174'

/**
 * Client-side app base URL. Falls back to the local dev server when the page is
 * served from localhost and no explicit override is set. Safe to call only in the
 * browser (guard with `typeof window`).
 */
export function resolveAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_BASE_URL) return process.env.NEXT_PUBLIC_APP_BASE_URL
  if (
    typeof window !== 'undefined' &&
    /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)
  ) {
    return APP_BASE_URL_LOCAL
  }
  return APP_BASE_URL
}

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