import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

// Rebuild every hour
export const revalidate = 3600

export async function GET() {
  try {
    // Use the dedicated backend sitemap endpoint — no row-count limit
    const res = await fetch(`${API_BASE_URL}/internships-sitemap.xml`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return new NextResponse('Failed to fetch internships sitemap', { status: 502 })
    }

    const xml = await res.text()

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse('Failed to generate internships sitemap', { status: 500 })
  }
}
