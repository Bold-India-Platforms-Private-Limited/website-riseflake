import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

export const revalidate = 21600

const EMPTY = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`

// Proxies the backend college-directory (facet landing pages) sitemap.
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/colleges-directory-sitemap.xml`, {
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      return new NextResponse(EMPTY, {
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
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse(EMPTY, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}
