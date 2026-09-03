import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

export const revalidate = 3600

// This endpoint returns a <sitemapindex> (→ sitemap-internships-1.xml, …).
// On backend failure serve a valid-but-empty index, never an error string.
const EMPTY_URLSET = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>`

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/internships-sitemap.xml`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      console.error(`[sitemap-internships] backend returned ${res.status}`)
      return new NextResponse(EMPTY_URLSET, {
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
    console.error('[sitemap-internships] fetch failed:', err)
    return new NextResponse(EMPTY_URLSET, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}
