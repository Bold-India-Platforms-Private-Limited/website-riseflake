import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const staticPages = [
  '',
  'jobs',
  'internships',
  'colleges',
  'companies',
  'cookie-policy',
  'terms-of-service',
  'privacy-policy',
];

export async function GET() {
  const urls = staticPages.map(
    (page) => `  <url>\n    <loc>https://riseflake.com/${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  ).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
