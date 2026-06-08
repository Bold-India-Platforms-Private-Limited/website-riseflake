import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware — runs on every request at the edge before the page renders.
 *
 * Purpose:
 *   Listing pages (/jobs, /internships, /companies, /colleges) with URL query
 *   params (filters, search, pagination) are NOT canonical — Google must index
 *   only the clean base URL. Adding ?search=react or ?page=2 creates thousands
 *   of duplicate URLs that waste crawl budget and fragment link equity.
 *
 *   Solution: if a known listing path has any query params → send
 *   `X-Robots-Tag: noindex, follow` so Google drops the variant but still
 *   follows links on it (follow = crawl jobs linked from filtered pages).
 */

const LISTING_PATHS = ['/jobs', '/internships', '/companies', '/colleges', '/network']

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Only act when there are query params on listing pages
  if (search && LISTING_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    // Only suppress listing-level pages, not detail pages like /jobs/my-slug
    const isListingRoot = LISTING_PATHS.some(p => pathname === p)
    if (isListingRoot) {
      const response = NextResponse.next()
      response.headers.set('X-Robots-Tag', 'noindex, follow')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/jobs',
    '/internships',
    '/companies',
    '/colleges',
    '/network',
  ],
}
