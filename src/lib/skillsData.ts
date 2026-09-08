import { API_BASE_URL } from './config'
import type { SeoListingItem } from '../app/components/seo/SeoListingCard'

export type SkillSummary = {
  slug: string
  name: string
  category?: string | null
  job_count: number
  internship_count: number
  total_count: number
}

export type SkillCompany = {
  company_name: string
  company_slug?: string | null
  company_logo?: string | null
  active_listings: number
}

export type RelatedSkill = { name: string; slug: string; count: number }

export type SkillDetail = {
  skill: { name: string; slug: string; category?: string | null }
  jobCount: number
  internshipCount: number
  totalCount: number
  result: SeoListingItem[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
  companies: SkillCompany[]
  relatedSkills: RelatedSkill[]
}

export async function fetchSkillsDirectory(): Promise<SkillSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/skills/directory`, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.skills ?? []
  } catch {
    return []
  }
}

export async function fetchSkillDetail(slug: string, page = 1, type?: 'job' | 'internship'): Promise<SkillDetail | null> {
  try {
    const params = new URLSearchParams({ page: String(page) })
    if (type) params.set('type', type)
    const res = await fetch(`${API_BASE_URL}/skills/${encodeURIComponent(slug)}?${params}`, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
