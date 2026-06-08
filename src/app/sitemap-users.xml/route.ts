import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

export const revalidate = 3600

// Empty sitemapindex — returned on error so Google gets valid XML, not an error string
const EMPTY_SITEMAPINDEX = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>`

/**
 * Proxies the backend users sitemap INDEX.
 * The index lists all batch files: sitemap-users-1.xml, sitemap-users-2.xml, …
 * Each batch is served by the [...sitemap]/route.ts catch-all handler.
 */
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/users-sitemap.xml`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      console.error(`[sitemap-users] backend returned ${res.status}`)
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
    console.error('[sitemap-users] fetch failed:', err)
    return new NextResponse(EMPTY_SITEMAPINDEX, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}
