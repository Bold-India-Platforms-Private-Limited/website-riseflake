import { API_BASE_URL } from './config'
import type { SeoListingItem } from '../app/components/seo/SeoListingCard'
import type { FacetKind, FacetLabels } from './facets'

export type Vertical = 'internships' | 'jobs'

export type DirectoryTarget = { slug: string; label: string; count?: number }

export type DirectoryIndex = {
  status: boolean
  roles: DirectoryTarget[]
  cities: DirectoryTarget[]
  companies: DirectoryTarget[]
  combos: DirectoryTarget[]
  months: DirectoryTarget[]
  countries: DirectoryTarget[]
  workplace_types: DirectoryTarget[]
  employment_types: DirectoryTarget[]
  stipend_buckets: DirectoryTarget[]
}

export type LandingResponse = {
  status: boolean
  redirectPath?: string
  kind?: FacetKind
  slug?: string
  labels?: FacetLabels
  count?: number
  result?: SeoListingItem[]
  page?: number
  limit?: number
  total?: number
  totalPages?: number
  hasMore?: boolean
  related?: {
    combos: DirectoryTarget[]
    top_roles: DirectoryTarget[]
    top_cities: DirectoryTarget[]
    top_companies: DirectoryTarget[]
  }
}

const REVALIDATE = 1800

export async function fetchDirectory(vertical: Vertical): Promise<DirectoryIndex | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${vertical}/directory`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    return (await res.json()) as DirectoryIndex
  } catch {
    return null
  }
}

export async function fetchLanding(
  vertical: Vertical,
  slug: string,
  page: number,
): Promise<LandingResponse | null> {
  try {
    const qs = page > 1 ? `?page=${page}` : ''
    const res = await fetch(`${API_BASE_URL}/${vertical}/directory/${encodeURIComponent(slug)}${qs}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (res.status === 404) return { status: false }
    if (!res.ok) return null
    return (await res.json()) as LandingResponse
  } catch {
    return null
  }
}
