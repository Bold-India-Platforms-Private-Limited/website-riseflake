import { NextResponse } from 'next/server';
import { API_BASE_URL } from '../../../lib/config';

export const dynamic = 'force-dynamic';



export async function GET() {
  // Use API_BASE_URL from config for environment flexibility
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
        // Rewrite <loc> URLs to use /sitemap.xml/companies-{batch} routes
        xml = xml.replace(/<loc>https?:\/\/[^<]*\/companies-sitemap-(\d+)\.xml<\/loc>/g, (_, batch) => {
          return `<loc>https://riseflake.com/sitemap.xml/companies/${batch}</loc>`;
      });
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
