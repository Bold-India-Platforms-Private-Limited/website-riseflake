import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

// 6-hour ISR cache — company pages change infrequently
export const revalidate = 21600

interface RouteContext {
  params: Promise<{ sitemap: string[] }>
}

export async function GET(_req: Request, context: RouteContext): Promise<Response> {
  const { sitemap: sitemapArr } = await context.params

  if (!sitemapArr || sitemapArr.length !== 1) {
    return new NextResponse(null, { status: 404 })
  }

  const match = sitemapArr[0].match(/^sitemap-companies-(\d+)\.xml$/)
  if (!match) {
    return new NextResponse(null, { status: 404 })
  }

  const batch = match[1]

  try {
    const res = await fetch(`${API_BASE_URL}/companies-sitemap-${batch}.xml`, {
      next: { revalidate: 21600 },
    })

    if (res.status === 404) return new NextResponse(null, { status: 404 })
    if (!res.ok) return new NextResponse('Failed to fetch companies sitemap batch', { status: 502 })

    const xml = await res.text()

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse('Failed to fetch companies sitemap batch', { status: 500 })
  }
}
