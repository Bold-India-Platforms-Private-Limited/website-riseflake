import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

export const revalidate = 3600

const EMPTY_URLSET = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`

/**
 * Proxies the backend company directory sitemap — one <urlset> of every
 * /companies/browse/{slug} page (industry, type, size, hiring, hiring-role,
 * hiring-city, role×city) with enough companies to index. Regenerated hourly.
 */
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/companies-directory-sitemap.xml`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) {
      console.error(`[sitemap-companies-facets] backend returned ${res.status}`)
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
    console.error('[sitemap-companies-facets] fetch failed:', err)
    return new NextResponse(EMPTY_URLSET, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}
