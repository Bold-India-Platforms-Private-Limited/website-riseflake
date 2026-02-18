import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Serve a single urlset with static URLs and sitemaps for jobs/internships
  const staticPages = [
    'https://app.riseflake.com/',
    '',
    'jobs',
    'internships',
    'colleges',
    'companies',
    'about',
    'contact',
    'privacy-policy',
  ];
  const today = new Date().toISOString().slice(0, 10);
  // Google recommends using <sitemapindex> for all entries if mixing static and dynamic sitemaps
  const sitemapEntries = [
    // If the page is a full URL (starts with http), use as-is, else prefix with https://riseflake.com/
    ...staticPages.map(
      (page) =>
        page.startsWith('http')
          ? `  <sitemap>\n    <loc>${page}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </sitemap>`
          : `  <sitemap>\n    <loc>https://riseflake.com/${page}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </sitemap>`
    ),
    `  <sitemap>\n    <loc>https://riseflake.com/sitemap.xml/jobs</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`,
    `  <sitemap>\n    <loc>https://riseflake.com/sitemap.xml/internships</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`,
    `  <sitemap>\n    <loc>https://riseflake.com/sitemap.xml/companies</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`
  ].join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</sitemapindex>`;
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
