import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

// India Company Registry — batches change slowly (MCA/ROC data), long TTL.
export const dynamic = 'force-dynamic'

const EMPTY_INDEX = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>`

/**
 * Proxies the backend's India Company Registry sitemap index — a
 * <sitemapindex> pointing at ~82 batch files (45k companies each, covering
 * all ~3.67M rows). Each batch is served by [...sitemap]/route.ts under the
 * `india-companies` type.
 */
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/discover/companies-india-sitemap.xml`, {
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      console.error(`[sitemap-india-companies] backend returned ${res.status}`)
      return new NextResponse(EMPTY_INDEX, {
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
  } catch (err) {
    console.error('[sitemap-india-companies] fetch failed:', err)
    return new NextResponse(EMPTY_INDEX, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}
