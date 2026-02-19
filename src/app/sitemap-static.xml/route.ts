import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const staticPages = [
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
  // Assign changefreq/priority based on type
  const urlEntries = staticPages.map((url) => {
    let changefreq = 'monthly';
    let priority = '0.3';
    if (url === 'https://riseflake.com/') {
      changefreq = 'daily';
      priority = '1.0';
    } else if (url === 'https://riseflake.com/jobs') {
      changefreq = 'daily';
      priority = '0.8';
    } else if (url === 'https://riseflake.com/internships') {
      changefreq = 'daily';
      priority = '0.7';
    } else if (url === 'https://riseflake.com/companies') {
      changefreq = 'weekly';
      priority = '0.6';
    }
    return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }).join('\n');
  const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${urlEntries}\n</urlset>`;
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
