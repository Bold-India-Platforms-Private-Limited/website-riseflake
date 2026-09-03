import { API_BASE_URL, WEBSITE_BASE_URL } from './config'
import { currentPeriod } from './period'

export type CollegeItem = {
  id: number
  slug: string
  name: string
  university_name: string | null
  university_type: string | null
  college_type: string | null
  state: string | null
  city: string | null
  established: number | null
  logo: string | null
}

export type Target = { slug: string; label: string; count?: number; city_slug?: string }

export type CollegeDirectory = {
  status: boolean
  states: Target[]
  cities: Target[]
  types: Target[]
  combos: Target[]
}

export type CollegeLanding = {
  status: boolean
  kind: 'state' | 'city' | 'type' | 'type_state' | 'type_city'
  slug: string
  labels: { type?: string | null; place?: string | null }
  count: number
  result: CollegeItem[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
  related: {
    in_state: Target[]
    top_states: Target[]
    top_cities: Target[]
    top_types: Target[]
  }
}

const REVALIDATE = 21600 // 6h — college data is static

export async function fetchCollegeDirectory(): Promise<CollegeDirectory | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/colleges/directory`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    return (await res.json()) as CollegeDirectory
  } catch {
    return null
  }
}

// null → genuine 404; 'retry' → transient backend failure (don't 404-cache it)
export async function fetchCollegeLanding(
  slug: string,
  page: number,
): Promise<CollegeLanding | null | 'retry'> {
  try {
    const qs = page > 1 ? `?page=${page}` : ''
    const res = await fetch(
      `${API_BASE_URL}/colleges/directory/${encodeURIComponent(slug)}${qs}`,
      { next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(10_000) },
    )
    if (res.status === 404) return null
    if (res.status === 429 || res.status >= 500) return 'retry'
    if (!res.ok) return null
    const json = await res.json()
    return json?.status ? (json as CollegeLanding) : null
  } catch {
    return 'retry'
  }
}

// ── SEO copy builders ─────────────────────────────────────────────────────
export function collegeHeadline(l: Pick<CollegeLanding, 'kind' | 'labels'>): string {
  const type = l.labels.type ?? ''
  const place = l.labels.place ?? ''
  if (l.kind === 'type') return `${type} Colleges in India`
  if (l.kind === 'state' || l.kind === 'city') return `Colleges in ${place}`
  return `${type} Colleges in ${place}`
}

const nf = (n: number) => n.toLocaleString('en-IN')

// NOTE: `/colleges` has no own layout.tsx, so the root `%s | Riseflake` title
// template applies — do NOT append "| Riseflake" here (would double it).
// Kept < ~60 chars before the template so it doesn't get truncated in SERPs.
export function collegeTitle(l: Pick<CollegeLanding, 'kind' | 'labels' | 'count'>, page: number): string {
  const { year } = currentPeriod()
  const type = l.labels.type ?? ''
  const place = l.labels.place ?? 'India'
  const c = l.count

  if (page > 1) return `${collegeHeadline(l)} — Page ${page}`

  switch (l.kind) {
    case 'type':
      // "Top Engineering Colleges in India 2026 — 13,862 Colleges List"
      return `Top ${type} Colleges in India ${year} — ${nf(c)} Colleges List`
    case 'state':
      return `Colleges in ${place} ${year} — ${nf(c)} Colleges by City & Course`
    case 'city':
      return `Colleges in ${place} ${year} — List of ${nf(c)} Colleges & Universities`
    case 'type_state':
      return `${type} Colleges in ${place} ${year} — ${nf(c)} Colleges List`
    case 'type_city':
      return `${type} Colleges in ${place} ${year} — ${nf(c)} Colleges, Courses & Admission`
    default:
      return `${collegeHeadline(l)} ${year}`
  }
}

export function collegeDescription(l: Pick<CollegeLanding, 'kind' | 'labels' | 'count'>): string {
  const { monthYear } = currentPeriod()
  const type = l.labels.type ?? ''
  const place = l.labels.place ?? 'India'
  const c = nf(l.count)

  switch (l.kind) {
    case 'type':
      return `Explore ${c} ${type.toLowerCase()} colleges across India (updated ${monthYear}). Filter by state and city, and see each college's affiliating university, type and year of establishment on Riseflake.`
    case 'state':
      return `Full list of ${c} colleges in ${place} (${monthYear}). Browse by city, discipline and affiliating university — engineering, medical, management, arts & science, law and more, on Riseflake.`
    case 'city':
      return `${c} colleges and universities in ${place} (${monthYear}). See the affiliating university, institution type and year of establishment for each, and browse by discipline on Riseflake.`
    case 'type_state':
      return `${c} ${type.toLowerCase()} colleges in ${place} (updated ${monthYear}). Browse by city with affiliating university and year of establishment for each, on Riseflake.`
    case 'type_city':
      return `${c} ${type.toLowerCase()} colleges in ${place} (updated ${monthYear}). See the affiliating university, courses direction and year of establishment for each college on Riseflake.`
    default:
      return `Browse ${c} verified colleges with university affiliation, type and year of establishment. Updated ${monthYear} on Riseflake.`
  }
}

export function collegeFaqs(l: Pick<CollegeLanding, 'kind' | 'labels' | 'count'>) {
  const h = collegeHeadline(l)
  const place = l.labels.place ?? 'India'
  return [
    {
      question: `How many ${h.toLowerCase()} are there?`,
      answer: `Riseflake lists ${l.count.toLocaleString('en-IN')} ${h.toLowerCase()} from the AISHE college directory, with university affiliation, institution type and year of establishment for each.`,
    },
    {
      question: `Are these colleges government or private?`,
      answer: `The list covers both. Open any college to see its management type, affiliating university and full profile.`,
    },
    {
      question: `Can I see courses and admission details for colleges in ${place}?`,
      answer: `Each college page on Riseflake shows the affiliating university, institution type and location. Course and admission info is added as colleges claim and complete their profiles.`,
    },
  ]
}

export const COLLEGE_BROWSE_HUB = `${WEBSITE_BASE_URL}/colleges/browse`
