import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Serve a urlset with static URLs only
  const staticPages = [
    'https://app.riseflake.com/',
    'https://riseflake.com/',
    'https://riseflake.com/jobs',
    'https://riseflake.com/internships',
    'https://riseflake.com/colleges',
    'https://riseflake.com/companies',
    'https://riseflake.com/about',
    'https://riseflake.com/contact',
    'https://riseflake.com/privacy-policy',
  ];
  const today = new Date().toISOString().slice(0, 10);
  const urlEntries = staticPages.map(
    (url) =>
      `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  ).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
