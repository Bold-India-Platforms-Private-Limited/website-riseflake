import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Only reference the static sitemap and other sitemaps
  const today = new Date().toISOString().slice(0, 10);
  const sitemapEntries = [
    `  <sitemap>\n    <loc>https://riseflake.com/sitemap.xml/static</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`,
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
