import { NextResponse } from 'next/server'
import { API_BASE_URL } from '../../lib/config'

// Shortest TTL wins — users/jobs refresh hourly
export const revalidate = 3600

interface RouteContext {
  params: Promise<{ sitemap: string[] }>
}

type SitemapType = {
  backendPath: (batch: string) => string
  cacheSeconds: number
}

/**
 * Catch-all handler for all batched sitemap files:
 *   /sitemap-jobs-{N}.xml          → backend /jobs-sitemap-{N}.xml
 *   /sitemap-internships-{N}.xml   → backend /internships-sitemap-{N}.xml
 *   /sitemap-companies-{N}.xml     → backend /companies-sitemap-{N}.xml
 *   /sitemap-users-{N}.xml         → backend /users-sitemap-{N}.xml
 *
 * Adding new types: just add an entry to SITEMAP_TYPES below — no other changes needed.
 */
const SITEMAP_TYPES: Record<string, SitemapType> = {
  jobs: {
    backendPath: (batch) => `${API_BASE_URL}/jobs-sitemap-${batch}.xml`,
    cacheSeconds: 3600,   // 1 h — jobs change frequently
  },
  internships: {
    backendPath: (batch) => `${API_BASE_URL}/internships-sitemap-${batch}.xml`,
    cacheSeconds: 3600,   // 1 h
  },
  companies: {
    backendPath: (batch) => `${API_BASE_URL}/companies-sitemap-${batch}.xml`,
    cacheSeconds: 21600,  // 6 h — companies change slowly
  },
  users: {
    backendPath: (batch) => `${API_BASE_URL}/users-sitemap-${batch}.xml`,
    cacheSeconds: 3600,   // 1 h — new users join constantly
  },
}

export async function GET(_req: Request, context: RouteContext): Promise<Response> {
  const { sitemap: sitemapArr } = await context.params

  if (!sitemapArr || sitemapArr.length !== 1) {
    return new NextResponse(null, { status: 404 })
  }

  const filename = sitemapArr[0]

  // Match: sitemap-{type}-{batchNumber}.xml
  const match = filename.match(/^sitemap-(jobs|internships|companies|users)-(\d+)\.xml$/)
  if (!match) {
    return new NextResponse(null, { status: 404 })
  }

  const type = match[1] as keyof typeof SITEMAP_TYPES
  const batch = match[2]
  const { backendPath, cacheSeconds } = SITEMAP_TYPES[type]

  try {
    const res = await fetch(backendPath(batch), {
      next: { revalidate: cacheSeconds },
    })

    if (res.status === 404) return new NextResponse(null, { status: 404 })
    if (!res.ok) {
      return new NextResponse(`Failed to fetch ${type} sitemap batch ${batch}`, { status: 502 })
    }

    const xml = await res.text()

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`,
      },
    })
  } catch {
    return new NextResponse(`Failed to fetch ${type} sitemap batch ${batch}`, { status: 500 })
  }
}
