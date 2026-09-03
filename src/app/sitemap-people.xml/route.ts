import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

export const revalidate = 3600

// Empty sitemapindex — returned on error so Google gets valid XML, not an error string
const EMPTY_SITEMAPINDEX = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>`

/**
 * Proxies the backend people-directory sitemap INDEX — the curated set of
 * indexable public profiles (public_profile_index, quality_score >= 50).
 * The index lists batch files sitemap-people-1.xml, sitemap-people-2.xml, …
 * each served by the [...sitemap]/route.ts catch-all handler.
 */
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/people-sitemap.xml`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      console.error(`[sitemap-people] backend returned ${res.status}`)
      return new NextResponse(EMPTY_SITEMAPINDEX, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      })
    }

    const xml = await res.text()
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('[sitemap-people] fetch failed:', err)
    return new NextResponse(EMPTY_SITEMAPINDEX, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}
