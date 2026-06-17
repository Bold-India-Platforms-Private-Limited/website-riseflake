import { NextResponse } from 'next/server'
import { BLOG_API_URL, WEBSITE_BASE_URL } from '../../lib/config'

export const revalidate = 3600

const EMPTY_URLSET = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`

export async function GET() {
  try {
    const res = await fetch(`${BLOG_API_URL}/hackathons?limit=500&sort=newest`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      console.error(`[sitemap-hackathons] backend returned ${res.status}`)
      return new NextResponse(EMPTY_URLSET, {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
      })
    }

    const data = await res.json()
    const hackathons: { slug: string; updated_at?: string; hackathon_start_date?: string }[] = data.hackathons ?? []

    if (!hackathons.length) {
      return new NextResponse(EMPTY_URLSET, {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      })
    }

    const urls = hackathons.map(h => {
      const lastmod = h.updated_at
        ? new Date(h.updated_at).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
      return `  <url>\n    <loc>${WEBSITE_BASE_URL}/hackathons/${h.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

    return new NextResponse(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch (err) {
    console.error('[sitemap-hackathons] fetch failed:', err)
    return new NextResponse(EMPTY_URLSET, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    })
  }
}
