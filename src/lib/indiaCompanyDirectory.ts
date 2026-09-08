import { API_BASE_URL } from './config'

export type IndiaCompanyCard = {
  cin: string
  name_slug: string
  company_name: string
  company_category: string | null
  company_class: string | null
  company_status: string | null
  company_state_code: string | null
  registration_date: string | null
}

export type IndiaCompanyDetail = IndiaCompanyCard & {
  company_roc_code: string | null
  company_sub_category: string | null
  authorized_capital: string | null
  paidup_capital: string | null
  registered_office_address: string | null
  listing_status: string | null
  company_country: string | null
  nic_code: string | null
  company_industrial_classification: string | null
  updated_at: string | null
}

export type IndiaCompanyList = {
  status: boolean
  result: IndiaCompanyCard[]
  page: number
  limit: number
}

export type IndiaCompanyFacets = {
  status: boolean
  result: {
    states: { value: string; count: number }[]
    statuses: { value: string; count: number }[]
    categories: { value: string; count: number }[]
  }
}

export type IndiaCompanyListParams = {
  page?: number
  limit?: number
  state?: string
  status?: string
  category?: string
  q?: string
}

const REVALIDATE = 3600 // MCA/ROC registry data changes slowly

function buildQuery(params: IndiaCompanyListParams): string {
  const qs = new URLSearchParams()
  if (params.page && params.page > 1) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.state) qs.set('state', params.state)
  if (params.status) qs.set('status', params.status)
  if (params.category) qs.set('category', params.category)
  if (params.q) qs.set('q', params.q)
  const s = qs.toString()
  return s ? `?${s}` : ''
}

export async function fetchIndiaCompanyList(params: IndiaCompanyListParams): Promise<IndiaCompanyList | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/discover/companies/india${buildQuery(params)}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    return (await res.json()) as IndiaCompanyList
  } catch {
    return null
  }
}

export async function fetchIndiaCompanyCount(params: IndiaCompanyListParams): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/discover/companies/india/count${buildQuery(params)}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { status: boolean; count: number }
    return json.count
  } catch {
    return null
  }
}

export async function fetchIndiaCompanyFacets(): Promise<IndiaCompanyFacets | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/discover/companies/india/facets`, {
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    return (await res.json()) as IndiaCompanyFacets
  } catch {
    return null
  }
}

/** null = not found (404), undefined = transient fetch/backend error (retry-worthy) */
export async function fetchIndiaCompanyDetail(cin: string): Promise<IndiaCompanyDetail | null | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/discover/companies/india/${encodeURIComponent(cin)}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (res.status === 404) return null
    if (!res.ok) return undefined
    const json = (await res.json()) as { status: boolean; result: IndiaCompanyDetail }
    return json.result
  } catch {
    return undefined
  }
}
