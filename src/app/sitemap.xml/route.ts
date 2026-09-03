import { NextResponse } from 'next/server'

// Rebuild daily — sub-sitemaps handle their own freshness
export const revalidate = 86400

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)

  const sitemaps = [
    'https://riseflake.com/sitemap-static.xml',
    'https://riseflake.com/sitemap-blogs.xml',
    'https://riseflake.com/sitemap-jobs.xml',
    'https://riseflake.com/sitemap-internships.xml',
    'https://riseflake.com/sitemap-jobs-facets.xml',
    'https://riseflake.com/sitemap-internships-facets.xml',
    'https://riseflake.com/sitemap-companies.xml',
    'https://riseflake.com/sitemap-companies-facets.xml',
    'https://riseflake.com/sitemap-hackathons.xml',
    'https://riseflake.com/sitemap-colleges.xml',
    'https://riseflake.com/sitemap-colleges-facets.xml',
    'https://riseflake.com/sitemap-users.xml',
    'https://riseflake.com/sitemap-people.xml',
    'https://riseflake.com/sitemap-people-directory.xml',
  ]

  const entries = sitemaps
    .map(loc => `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
    },
  })
}
