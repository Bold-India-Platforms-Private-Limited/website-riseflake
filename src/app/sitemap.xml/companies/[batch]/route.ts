
import { NextResponse } from 'next/server';
import { API_BASE_URL } from '../../../../lib/config';
// Removed invalid import of RouteContext

export const dynamic = 'force-dynamic';

// This route proxies companies-sitemap-{batch}.xml as /sitemap.xml/companies-{batch}
interface RouteParams {
    batch: string;
}

interface RouteContext {
    params: Promise<RouteParams>;
}

export async function GET(
    _req: Request,
    context: RouteContext
): Promise<NextResponse> {
    if (!API_BASE_URL) {
        return new NextResponse('API_BASE_URL not set', { status: 500 });
    }
    const { batch } = await context.params;
    const url = `${API_BASE_URL}/companies-sitemap-${batch}.xml`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            return new NextResponse('Failed to fetch companies sitemap batch', { status: 500 });
        }
        const xml = await res.text();
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
