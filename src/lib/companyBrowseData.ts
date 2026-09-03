import { API_BASE_URL } from './config'
import type { CompanyFacetKind, CompanyFacetLabels } from './companyFacets'

export type CompanyRow = {
  company_name: string
  slug: string
  company_logo?: string | null
  organization_type?: string | null
  industry_type?: string | null
  team_size?: string | null
  active_jobs?: number
}

export type CompanyTarget = { slug: string; label: string; count?: number }

export type CompanyDirectoryIndex = {
  status: boolean
  industries: CompanyTarget[]
  org_types: CompanyTarget[]
  sizes: CompanyTarget[]
  hiring: CompanyTarget[]
  hiring_roles: CompanyTarget[]
  hiring_cities: CompanyTarget[]
  combos: CompanyTarget[]
}

export type CompanyLanding = {
  status: boolean
  kind?: CompanyFacetKind
  slug?: string
  labels?: CompanyFacetLabels
  count?: number
  result?: CompanyRow[]
  page?: number
  total?: number
  totalPages?: number
  hasMore?: boolean
  related?: {
    combos: CompanyTarget[]
    industries: CompanyTarget[]
    hiring_roles: CompanyTarget[]
    hiring_cities: CompanyTarget[]
  }
}

const REVALIDATE = 3600

export async function fetchCompanyDirectory(): Promise<CompanyDirectoryIndex | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/companies/directory`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    return (await res.json()) as CompanyDirectoryIndex
  } catch {
    return null
  }
}

export async function fetchCompanyLanding(slug: string, page: number): Promise<CompanyLanding | null> {
  try {
    const qs = page > 1 ? `?page=${page}` : ''
    const res = await fetch(`${API_BASE_URL}/companies/directory/${encodeURIComponent(slug)}${qs}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (res.status === 404) return { status: false }
    if (!res.ok) return null
    return (await res.json()) as CompanyLanding
  } catch {
    return null
  }
}
