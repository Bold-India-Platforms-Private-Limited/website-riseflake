import { NextResponse } from 'next/server';
import { API_BASE_URL } from '../../lib/config';

export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ sitemap: string[] }>;
}

export async function GET(_req: Request, context: RouteContext): Promise<NextResponse> {
    if (!API_BASE_URL) {
        return new NextResponse('API_BASE_URL not set', { status: 500 });
    }
    // Await params for dynamic route compliance
    const { sitemap: sitemapArr } = await context.params;
    if (!sitemapArr || sitemapArr.length !== 1) {
        return new NextResponse('Invalid sitemap path', { status: 404 });
    }
    const match = sitemapArr[0].match(/^sitemap-companies-(\d+)\.xml$/);
    if (!match) {
        return new NextResponse('Invalid companies sitemap batch path', { status: 404 });
    }
    const batch = match[1];
    const url = `${API_BASE_URL}/companies-sitemap-${batch}.xml`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            return new NextResponse('Failed to fetch companies sitemap batch', { status: 500 });
        }
        let xml = await res.text();
        // Remove <changefreq> and <priority> tags if present
        xml = xml.replace(/<changefreq>.*?<\/changefreq>/g, '');
        xml = xml.replace(/<priority>.*?<\/priority>/g, '');
        // Ensure <lastmod> exists after every <loc> in <url> (if not present)
        const today = new Date().toISOString().slice(0, 10);
        xml = xml.replace(/(<loc>[^<]+<\/loc>)(?!\s*<lastmod>)/g, `$1\n    <lastmod>${today}</lastmod>`);
        return new NextResponse(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    } catch (e) {
        return new NextResponse('Failed to fetch companies sitemap batch', { status: 500 });
    }
}
