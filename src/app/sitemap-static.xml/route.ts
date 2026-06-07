import { NextResponse } from 'next/server'

// Static pages rarely change — rebuild once per day
export const revalidate = 86400

type StaticPage = {
  url: string
  changefreq: string
  priority: string
  lastmod?: string
}

const STATIC_PAGES: StaticPage[] = [
  { url: 'https://riseflake.com/',                    changefreq: 'daily',   priority: '1.0' },
  { url: 'https://riseflake.com/jobs',                changefreq: 'hourly',  priority: '0.9' },
  { url: 'https://riseflake.com/internships',         changefreq: 'hourly',  priority: '0.9' },
  { url: 'https://riseflake.com/companies',           changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/colleges',            changefreq: 'weekly',  priority: '0.6' },
  { url: 'https://riseflake.com/indexed-jobs',        changefreq: 'daily',   priority: '0.6' },
  { url: 'https://riseflake.com/about',               changefreq: 'monthly', priority: '0.5' },
  { url: 'https://riseflake.com/contact',             changefreq: 'monthly', priority: '0.5' },
  { url: 'https://riseflake.com/careers',             changefreq: 'monthly', priority: '0.4' },
  { url: 'https://riseflake.com/support',             changefreq: 'monthly', priority: '0.4' },
  { url: 'https://riseflake.com/privacy-policy',      changefreq: 'yearly',  priority: '0.3', lastmod: '2026-01-08' },
  { url: 'https://riseflake.com/terms-of-service',    changefreq: 'yearly',  priority: '0.3', lastmod: '2026-01-08' },
  { url: 'https://riseflake.com/refund-policy',       changefreq: 'yearly',  priority: '0.3', lastmod: '2026-01-08' },
  { url: 'https://riseflake.com/trust-and-safety',    changefreq: 'yearly',  priority: '0.3', lastmod: '2026-01-08' },
  { url: 'https://riseflake.com/disclaimer',          changefreq: 'yearly',  priority: '0.3', lastmod: '2026-01-08' },
  { url: 'https://riseflake.com/cookie-policy',       changefreq: 'yearly',  priority: '0.3', lastmod: '2026-01-08' },
  { url: 'https://riseflake.com/delete-account',      changefreq: 'monthly', priority: '0.3' },
  { url: 'https://riseflake.com/sitemap.html',        changefreq: 'daily',   priority: '0.4' },
  // Profile network page — crawlable landing, links out to individual /in/* pages
  { url: 'https://riseflake.com/network',             changefreq: 'daily',   priority: '0.7' },
]

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)

  const urlEntries = STATIC_PAGES.map(({ url, changefreq, priority, lastmod }) =>
    [
      '  <url>',
      `    <loc>${url}</loc>`,
      `    <lastmod>${lastmod ?? today}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n')
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
    },
  })
}
