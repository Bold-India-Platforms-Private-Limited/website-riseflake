import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

// 6-hour ISR cache — company count changes slowly
export const revalidate = 21600

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/companies-sitemap.xml`, {
      next: { revalidate: 21600 },
    })

    if (!res.ok) {
      return new NextResponse('Failed to fetch companies sitemap index', { status: 502 })
    }

    const xml = await res.text()

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse('Failed to fetch companies sitemap index', { status: 500 })
  }
}
