import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

// Rebuild every hour — new users join constantly
export const revalidate = 3600

/**
 * Proxies the backend users sitemap INDEX.
 * The index lists all batch files: sitemap-users-1.xml, sitemap-users-2.xml, …
 * Each batch is served by the [...sitemap]/route.ts catch-all handler.
 *
 * Google flow:
 *   sitemap.xml (index)
 *     → sitemap-users.xml (sitemapindex, this file)
 *       → sitemap-users-1.xml  (urlset, newest users, via [...sitemap])
 *       → sitemap-users-2.xml  (urlset)
 *       → …
 */
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/users-sitemap.xml`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return new NextResponse('Failed to fetch users sitemap index', { status: 502 })
    }

    const xml = await res.text()

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse('Failed to generate users sitemap', { status: 500 })
  }
}
