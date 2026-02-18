import { NextResponse } from 'next/server';
import { API_BASE_URL } from '../../lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!API_BASE_URL) {
    return new NextResponse('API_BASE_URL not set', { status: 500 });
  }
  const url = `${API_BASE_URL}/companies-sitemap.xml`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new NextResponse('Failed to fetch companies sitemap index', { status: 500 });
    }
    let xml = await res.text();
    // Rewrite <loc> URLs to use /sitemap-companies-{batch}.xml routes
    xml = xml.replace(/<loc>https?:\/\/[^<]*\/companies-sitemap-(\d+)\.xml<\/loc>/g, (_, batch) => {
      return `<loc>https://riseflake.com/sitemap-companies-${batch}.xml</loc>`;
    });
    // Ensure <lastmod> exists after every <loc> in <sitemap> (if not present)
    const today = new Date().toISOString().slice(0, 10);
    xml = xml.replace(/(<loc>[^<]+<\/loc>)(?!\s*<lastmod>)/g, `$1\n    <lastmod>${today}</lastmod>`);
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    return new NextResponse('Failed to fetch companies sitemap index', { status: 500 });
  }
}
