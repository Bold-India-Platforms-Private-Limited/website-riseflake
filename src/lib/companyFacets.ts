/**
 * companyFacets.ts — presentation config for the SEO company directory pages
 * (/companies/browse/*). The backend (/api/v1/website/companies/directory/…)
 * owns slug resolution, counting and inventory.
 */

import { currentPeriod } from './period'

export type CompanyFacetKind =
  | 'industry' | 'type' | 'size' | 'hiring'
  | 'hiring_role' | 'hiring_city' | 'hiring_role_city'

export type CompanyFacetLabels = {
  industry?: string | null
  type?: string | null
  size?: string | null
  role?: string | null
  city?: string | null
}

export function currentYear(): number {
  return currentPeriod().year
}
export function currentMonthYear(): string {
  return currentPeriod().monthYear
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s)
const SMALL = new Set(['in', 'at', 'with', 'and', 'or', 'for', 'to', 'of', 'the', 'a'])
export function titleCasePhrase(s: string): string {
  return s
    .split(' ')
    .map((w, i) => (i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : cap(w)))
    .join(' ')
}

const isHiringKind = (k: CompanyFacetKind) =>
  k === 'hiring' || k === 'hiring_role' || k === 'hiring_city' || k === 'hiring_role_city'

/**
 * Human-readable phrase for the facet — location-aware (no dangling "in India"
 * when a city is already in the phrase). Used verbatim for the H1 and, lower-cased,
 * inside the description / FAQ.
 */
export function companyPhrase(kind: CompanyFacetKind, l: CompanyFacetLabels): string {
  const inIndia = 'in India'
  switch (kind) {
    case 'industry': return `${l.industry} Companies ${inIndia}`
    case 'type': return `${l.type} Companies ${inIndia}`
    case 'size': return `Companies ${inIndia} with ${l.size}`
    case 'hiring': return `Companies Hiring Now ${inIndia}`
    case 'hiring_role': return `Companies Hiring for ${l.role} ${inIndia}`
    case 'hiring_city': return `Companies Hiring in ${l.city}`
    case 'hiring_role_city': return `Companies Hiring for ${l.role} in ${l.city}`
    default: return `Companies ${inIndia}`
  }
}

export function buildCompanyH1(kind: CompanyFacetKind, l: CompanyFacetLabels): string {
  return titleCasePhrase(companyPhrase(kind, l))
}

/** Grammatical lower-case phrase for mid-sentence use — keeps label proper nouns
 *  (industry / city / role names) as given, lower-cases only the connectives. */
export function companyPhraseLower(kind: CompanyFacetKind, l: CompanyFacetLabels): string {
  const inIndia = 'in India'
  switch (kind) {
    case 'industry': return `${l.industry} companies ${inIndia}`
    case 'type': return `${l.type} companies ${inIndia}`
    case 'size': return `companies ${inIndia} with ${l.size}`
    case 'hiring': return `companies hiring now ${inIndia}`
    case 'hiring_role': return `companies hiring for ${l.role} ${inIndia}`
    case 'hiring_city': return `companies hiring in ${l.city}`
    case 'hiring_role_city': return `companies hiring for ${l.role} in ${l.city}`
    default: return `companies ${inIndia}`
  }
}

export function buildCompanyTitle(kind: CompanyFacetKind, l: CompanyFacetLabels, page: number, count?: number): string {
  const yr = currentYear()
  const phrase = titleCasePhrase(companyPhrase(kind, l))
  let clause = ''
  if (count && count > 0) {
    // the phrase already contains "Companies", so the count clause never repeats it
    clause = isHiringKind(kind)
      ? ` — ${count.toLocaleString('en-IN')} Actively Hiring`
      : ` — ${count.toLocaleString('en-IN')} Verified`
  }
  const suffix = page > 1 ? ` — Page ${page}` : ''
  // /companies has no layout title override → the root `%s | Riseflake` template applies.
  return `${phrase} ${yr}${clause}${suffix}`
}

export function buildCompanyDescription(kind: CompanyFacetKind, l: CompanyFacetLabels, count?: number): string {
  const my = currentMonthYear()
  const phrase = companyPhraseLower(kind, l)
  const n = count && count > 0 ? `${count.toLocaleString('en-IN')} ` : ''
  const hiringBit = isHiringKind(kind) ? ' Each one has at least one open role right now.' : ''
  return `Browse ${n}${phrase} on Riseflake — updated ${my}.${hiringBit} See every company's profile, industry, size and open jobs, and apply directly. Free for job seekers.`
}

export function buildCompanyKeywords(kind: CompanyFacetKind, l: CompanyFacetLabels): string {
  const p = companyPhraseLower(kind, l).toLowerCase()
  const yr = currentYear()
  const extra: string[] = []
  if (kind === 'industry' && l.industry) extra.push(`${l.industry!.toLowerCase()} companies list`, `top ${l.industry!.toLowerCase()} companies india`)
  if (isHiringKind(kind)) extra.push(p.replace('companies hiring', 'companies with job openings'))
  return [p, `${p} ${yr}`, `list of ${p}`, `top ${p}`, ...extra, 'companies in india riseflake'].join(', ')
}

export function buildCompanyFaq(kind: CompanyFacetKind, l: CompanyFacetLabels, count?: number): { question: string; answer: string }[] {
  const phrase = companyPhraseLower(kind, l)
  const my = currentMonthYear()
  const faqs = [
    {
      question: `How many ${phrase} are on Riseflake?`,
      answer: count
        ? `As of ${my}, Riseflake lists ${count.toLocaleString('en-IN')} ${phrase}. The list updates continuously as companies join Riseflake and post new roles.`
        : `Riseflake lists verified ${phrase}, updated continuously.`,
    },
    {
      question: `Are these company profiles verified?`,
      answer: `Yes. Every company profile on Riseflake is created by a registered employer or built from verified job postings. Each page shows the real company name, industry and size.`,
    },
    {
      question: `How do I see open jobs at these companies?`,
      answer: `Open any company to view its profile and current openings, then apply free with your Riseflake profile.`,
    },
  ]
  if (kind === 'hiring' || kind === 'hiring_role' || kind === 'hiring_city' || kind === 'hiring_role_city') {
    faqs.push({
      question: `Are these companies actively hiring?`,
      answer: `Yes — this list only includes companies with at least one open, in-date job posting on Riseflake right now.`,
    })
  }
  return faqs
}

export function companyTrackingParams(slug: string): string {
  const p = new URLSearchParams({
    utm_source: 'riseflake_seo',
    utm_medium: 'company_directory',
    utm_campaign: slug,
  })
  return `?${p.toString()}`
}
