import { NextResponse } from 'next/server'
import { API_BASE_URL, WEBSITE_BASE_URL } from '../../lib/config'

export const revalidate = 86400

const EMPTY_URLSET = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/colleges?limit=2000&sort=a-z`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      console.error(`[sitemap-colleges] backend returned ${res.status}`)
      return new NextResponse(EMPTY_URLSET, {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
      })
    }

    const data = await res.json()
    const colleges: { slug: string; updated_at?: string }[] = data.result ?? data.colleges ?? []

    if (!colleges.length) {
      return new NextResponse(EMPTY_URLSET, {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800' },
      })
    }

    const urls = colleges.map(c => {
      const lastmod = c.updated_at
        ? new Date(c.updated_at).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
      return `  <url>\n    <loc>${WEBSITE_BASE_URL}/colleges/${c.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

    return new NextResponse(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800' },
    })
  } catch (err) {
    console.error('[sitemap-colleges] fetch failed:', err)
    return new NextResponse(EMPTY_URLSET, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    })
  }
}
