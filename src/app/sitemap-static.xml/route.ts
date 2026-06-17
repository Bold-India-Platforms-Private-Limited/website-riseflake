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
  { url: 'https://riseflake.com/campus-ambassador',   changefreq: 'monthly', priority: '0.5' },
  // Profile network page — crawlable landing, links out to individual /in/* pages
  { url: 'https://riseflake.com/network',             changefreq: 'daily',   priority: '0.7' },
  // Hackathons listing
  { url: 'https://riseflake.com/hackathons',          changefreq: 'daily',   priority: '0.8' },
  // Internship SEO pages
  { url: 'https://riseflake.com/internships/work-from-home',      changefreq: 'daily',   priority: '0.9' },
  { url: 'https://riseflake.com/internships/software-development', changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/internships/web-development',     changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/internships/marketing',           changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/internships/data-science',        changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/internships/design',              changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/internships/finance',             changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/internships/content-writing',     changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/internships/human-resources',     changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/internships/sales',               changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/internships/operations',          changefreq: 'daily',   priority: '0.7' },
  // Programmatic SEO — Jobs in [City]
  { url: 'https://riseflake.com/jobs-in/bangalore',   changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/jobs-in/mumbai',      changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/jobs-in/delhi',       changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/jobs-in/hyderabad',   changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/jobs-in/pune',        changefreq: 'daily',   priority: '0.8' },
  { url: 'https://riseflake.com/jobs-in/chennai',     changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/jobs-in/kolkata',     changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/jobs-in/ahmedabad',   changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/jobs-in/jaipur',      changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/jobs-in/noida',       changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/jobs-in/gurgaon',     changefreq: 'daily',   priority: '0.7' },
  { url: 'https://riseflake.com/jobs-in/remote',      changefreq: 'daily',   priority: '0.8' },
  // Programmatic SEO — Internships in [City]
  { url: 'https://riseflake.com/internships-in/bangalore', changefreq: 'daily', priority: '0.8' },
  { url: 'https://riseflake.com/internships-in/mumbai',    changefreq: 'daily', priority: '0.8' },
  { url: 'https://riseflake.com/internships-in/delhi',     changefreq: 'daily', priority: '0.8' },
  { url: 'https://riseflake.com/internships-in/hyderabad', changefreq: 'daily', priority: '0.7' },
  { url: 'https://riseflake.com/internships-in/pune',      changefreq: 'daily', priority: '0.7' },
  { url: 'https://riseflake.com/internships-in/chennai',   changefreq: 'daily', priority: '0.7' },
  { url: 'https://riseflake.com/internships-in/noida',     changefreq: 'daily', priority: '0.7' },
  { url: 'https://riseflake.com/internships-in/remote',    changefreq: 'daily', priority: '0.8' },
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
