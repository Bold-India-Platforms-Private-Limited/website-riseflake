/**
 * facets.ts — shared config + helpers for the programmatic-SEO faceted listing
 * pages (/internships/browse/* and /jobs/browse/*).
 *
 * The backend (/api/v1/website/{vertical}/directory/:filter) owns slug
 * resolution, counting and inventory. This module owns the *presentation*:
 * dynamic titles / descriptions / H1 / FAQ, the curated link lists that seed
 * internal linking (Navbar, Footer, hubs), and the slugify contract that must
 * stay byte-identical with the backend `slugifyValue`.
 */

import { currentPeriod } from './period'

export const WORKPLACE_LABELS: Record<number, string> = {
  1: 'Remote',
  2: 'In-office',
  3: 'On-field',
  4: 'Hybrid',
}

export const EMPLOYMENT_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
}

/** Byte-identical to backend WebsiteListingFacetModel.slugifyValue. */
export function slugifyFacet(s: string): string {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function currentYear(): number {
  return currentPeriod().year
}

export function currentMonthYear(): string {
  return currentPeriod().monthYear
}

/**
 * UTM suffix appended to the internal detail-page href of every listing card on
 * a facet page, so app-side attribution (UTMCapture -> localStorage -> ApplyCard)
 * can credit the SEO funnel. `campaign` = the facet slug.
 */
export function facetTrackingParams(slug: string, medium = 'faceted_listing'): string {
  const p = new URLSearchParams({
    utm_source: 'riseflake_seo',
    utm_medium: medium,
    utm_campaign: slug,
  })
  return `?${p.toString()}`
}

// ── Curated city list — single source of truth. Replaces the two duplicated
// 21-item arrays in internships-in/[city] and jobs-in/[city].
export const CITIES: string[] = [
  'bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai',
  'kolkata', 'ahmedabad', 'gurgaon', 'noida', 'jaipur', 'indore',
  'chandigarh', 'coimbatore', 'kochi', 'lucknow', 'nagpur', 'bhopal',
  'surat', 'kanpur', 'visakhapatnam', 'thiruvananthapuram', 'nashik',
  'vadodara', 'mysore', 'mangalore', 'bhubaneswar', 'guwahati', 'patna',
  'dehradun', 'raipur', 'ranchi', 'remote',
]

export function titleCaseSlug(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ── Curated roles — {label, slug} where slug matches master_job_category_list.
// Drives Footer "skill based" blocks + Navbar mega-menu. Backend gate hides any
// that lack inventory, so it is safe to over-list here.
// slug MUST match master_job_category_list.slug exactly (the resolver does an
// exact match). Verified against the live category master.
export const CURATED_ROLES: { label: string; slug: string }[] = [
  { label: 'Software Development', slug: 'software-development' },
  { label: 'Information Technology', slug: 'information-technology-it' },
  { label: 'Web Developer', slug: 'web-developer' },
  { label: 'Full Stack Developer', slug: 'full-stack-developer' },
  { label: 'Data Scientist', slug: 'data-scientist' },
  { label: 'Data Analyst', slug: 'data-analyst' },
  { label: 'Data Engineer', slug: 'data-engineer' },
  { label: 'AI / ML Engineer', slug: 'ai-ml-engineer' },
  { label: 'DevOps Engineer', slug: 'devops-engineer' },
  { label: 'Cybersecurity Analyst', slug: 'cybersecurity-analyst' },
  { label: 'Digital Marketing', slug: 'digital-marketing-specialist' },
  { label: 'Marketing Manager', slug: 'marketing-manager' },
  { label: 'Graphic Designer', slug: 'graphic-designer' },
  { label: 'UI / UX Designer', slug: 'ui-ux-designer' },
  { label: 'Content Creator', slug: 'content-creator' },
  { label: 'Technical Writer', slug: 'technical-writer' },
  { label: 'Business Analyst', slug: 'business-analyst' },
  { label: 'Product Manager', slug: 'product-manager' },
  { label: 'Project Manager', slug: 'project-manager' },
  { label: 'Sales Manager', slug: 'sales-manager' },
  { label: 'HR Manager', slug: 'hr-manager' },
  { label: 'Financial Analyst', slug: 'financial-analyst' },
  { label: 'Operations Manager', slug: 'operations-manager' },
  { label: 'Engineering', slug: 'engineering' },
  { label: 'Mechanical Engineer', slug: 'mechanical-engineer' },
  { label: 'Civil Engineer', slug: 'civil-engineer' },
  { label: 'Electrical Engineer', slug: 'electrical-engineer' },
]

// Internship role slugs that have a hand-built landing page at
// /internships/<slug> (the DOMAIN_MAP). Link straight there instead of
// /internships/browse/<slug>-internships (which 308-redirects anyway).
export const INTERNSHIP_DOMAIN_SLUGS = new Set([
  'software-development', 'web-development', 'marketing', 'data-science',
  'design', 'finance', 'content-writing', 'human-resources', 'sales', 'operations',
])

export const STIPEND_BUCKETS = [
  { slug: 'internships-with-stipend-5000-plus', label: '₹5,000+ /month' },
  { slug: 'internships-with-stipend-10000-plus', label: '₹10,000+ /month' },
  { slug: 'internships-with-stipend-15000-plus', label: '₹15,000+ /month' },
  { slug: 'internships-with-stipend-20000-plus', label: '₹20,000+ /month' },
  { slug: 'internships-with-stipend-10000-to-20000', label: '₹10k–₹20k /month' },
]

export const SALARY_BUCKETS = [
  { slug: 'jobs-3-to-6-lpa', label: '₹3–6 LPA' },
  { slug: 'jobs-6-to-10-lpa', label: '₹6–10 LPA' },
  { slug: 'jobs-10-to-15-lpa', label: '₹10–15 LPA' },
  { slug: 'jobs-15-to-25-lpa', label: '₹15–25 LPA' },
  { slug: 'jobs-10-lpa-plus', label: '₹10 LPA+' },
]

// ── Metadata builders ──────────────────────────────────────────────────────

export type FacetLabels = {
  role?: string | null
  city?: string | null
  company?: string | null
  workplace?: string | null
  employment?: string | null
  month?: string | null
  year?: string | null
  country?: string | null
  stipend?: string | null
}

export type FacetKind =
  | 'role' | 'city' | 'company' | 'workplace' | 'employment' | 'stipend'
  | 'month' | 'year' | 'country' | 'role_city' | 'workplace_city' | 'workplace_role'

/** Human phrase for the facet, e.g. "Software Development internships in Pune". */
export function facetPhrase(vertical: 'internship' | 'job', kind: FacetKind, l: FacetLabels): string {
  const V = vertical === 'internship' ? 'internships' : 'jobs'
  switch (kind) {
    case 'role': return `${l.role} ${V}`
    case 'city': return `${V} in ${l.city}`
    case 'company': return `${V} at ${l.company}`
    case 'workplace': return `${l.workplace} ${V}`
    case 'employment': return `${l.employment} ${V}`
    case 'month': return `${V} posted in ${l.month}`
    case 'year': return `${V} in ${l.year}`
    case 'country': return `${V} in ${l.country}`
    case 'role_city': return `${l.role} ${V} in ${l.city}`
    case 'workplace_city': return `${l.workplace} ${V} in ${l.city}`
    case 'workplace_role': return `${l.workplace} ${l.role} ${V}`
    case 'stipend': return vertical === 'internship'
      ? `${V} with stipend ${l.stipend}`
      : `${V} paying ${l.stipend}`
    default: return V
  }
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s)

const SMALL = new Set(['in', 'at', 'with', 'and', 'or', 'for', 'to', 'of', 'the', 'a'])
/** Title-case a facet phrase for H1 / <title>: "remote data science jobs" -> "Remote Data Science Jobs". */
export function titleCasePhrase(s: string): string {
  return s
    .split(' ')
    .map((w, i) => (i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : cap(w)))
    .join(' ')
}

export function buildFacetTitle(
  vertical: 'internship' | 'job', kind: FacetKind, l: FacetLabels, page: number, count?: number,
): string {
  const yr = currentYear()
  const phrase = titleCasePhrase(facetPhrase(vertical, kind, l))
  const base =
    kind === 'year' || kind === 'month'
      ? `${phrase} — Apply Now`
      : `${phrase} ${yr} — ${count ? count.toLocaleString('en-IN') + ' Openings' : 'Latest Openings'}`
  const suffix = page > 1 ? ` — Page ${page}` : ''
  // The /jobs and /internships layouts set a plain-string `title`, which stops
  // the root `%s | Riseflake` template from reaching /{vertical}/browse/* — so
  // append the brand here. (City pages under /{vertical}-in DO get the template.)
  return `${base}${suffix} | Riseflake`
}

export function buildFacetDescription(
  vertical: 'internship' | 'job', kind: FacetKind, l: FacetLabels, count?: number,
): string {
  const V = vertical === 'internship' ? 'internships' : 'jobs'
  const my = currentMonthYear()
  const phrase = facetPhrase(vertical, kind, l)
  const n = count ? `${count.toLocaleString('en-IN')} verified ` : 'Verified '
  const audience = vertical === 'internship' ? 'students and freshers' : 'freshers and experienced professionals'
  return `${n}${phrase} on Riseflake, updated ${my}. Browse ${V} for ${audience} across India — real companies, direct apply, salary and stipend details. Free to apply.`
}

export function buildFacetH1(vertical: 'internship' | 'job', kind: FacetKind, l: FacetLabels): string {
  return titleCasePhrase(facetPhrase(vertical, kind, l))
}

export function buildFacetKeywords(vertical: 'internship' | 'job', kind: FacetKind, l: FacetLabels): string {
  const phrase = facetPhrase(vertical, kind, l).toLowerCase()
  const yr = currentYear()
  return [
    phrase,
    `${phrase} ${yr}`,
    `${phrase} for students`,
    vertical === 'internship' ? 'paid internships india' : 'jobs in india',
    `apply ${phrase}`,
    'riseflake',
  ].join(', ')
}

/** 3–5 templated Q&A per facet kind — feeds a visible FAQ + FAQPage JSON-LD. */
export function buildFacetFaq(
  vertical: 'internship' | 'job', kind: FacetKind, l: FacetLabels, count?: number,
): { question: string; answer: string }[] {
  const V = vertical === 'internship' ? 'internships' : 'jobs'
  const phrase = facetPhrase(vertical, kind, l)
  const my = currentMonthYear()
  const faqs: { question: string; answer: string }[] = [
    {
      question: `How many ${phrase} are available on Riseflake?`,
      answer: count
        ? `As of ${my}, Riseflake lists ${count.toLocaleString('en-IN')} active ${phrase}. The list is refreshed continuously as employers post new roles and close filled ones.`
        : `Riseflake lists ${phrase} from verified employers across India. The list is refreshed continuously as new roles are posted.`,
    },
    {
      question: `Are these ${phrase} verified?`,
      answer: `Yes. Every posting on Riseflake is submitted by a registered employer or recruiter and reviewed before it goes live. Each listing shows the real hiring company name and role.`,
    },
    {
      question: `How do I apply for ${phrase}?`,
      answer: `Open any listing to see the full description, then apply with your Riseflake profile in one click. Applying is always free for candidates.`,
    },
  ]
  if (kind === 'stipend' || vertical === 'internship') {
    faqs.push({
      question: `Do these ${V} pay a stipend?`,
      answer: `Many do. Each card shows the stipend or salary where the employer has disclosed it. Use the stipend filter on the main ${V} page to narrow to paid roles only.`,
    })
  }
  if (kind === 'city' || kind === 'role_city' || kind === 'workplace_city') {
    faqs.push({
      question: `Can students from other cities apply?`,
      answer: `Remote and hybrid roles in this list accept applicants from anywhere in India. On-site roles are open to candidates who can commute or relocate to ${l.city}.`,
    })
  }
  return faqs
}
