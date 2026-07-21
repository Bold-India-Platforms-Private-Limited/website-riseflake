import { NextResponse } from 'next/server'
import { BLOG_API_URL, WEBSITE_BASE_URL } from '../../lib/config'

export const revalidate = 3600 // rebuild hourly

export async function GET() {
  let slugs: { slug: string; updated_at: string }[] = []

  try {
    const res = await fetch(`${BLOG_API_URL}/blogs/public/slugs`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10_000),
    })
    if (res.ok) {
      const data = await res.json()
      slugs = data.slugs ?? []
    }
  } catch {
    // return empty sitemap on error
  }

  const today = new Date().toISOString().slice(0, 10)
  const entries = slugs.map(({ slug, updated_at }) => {
    const d = updated_at ? new Date(updated_at) : null
    const lastmod = d && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : today
    return `  <url>\n    <loc>${WEBSITE_BASE_URL}/blog/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  })

  // Also include the blog index page
  const indexEntry = `  <url>\n    <loc>${WEBSITE_BASE_URL}/blog</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexEntry}\n${entries.join('\n')}\n</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  })
}
