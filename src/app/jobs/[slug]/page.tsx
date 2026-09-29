import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JobDetailView from './JobDetailView'
import SimilarListings from './components/SimilarListings'
import type { JobDetail } from './components/types'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates, OG_FALLBACK_IMAGE } from '../../../lib/config'
import { jobSlugs } from '../../../lib/manifest'
import React from 'react'

// Static export: only the slugs in the build manifest exist (see src/lib/manifest.ts).
export const dynamicParams = false

type JobResponse = {
  status: boolean
  result: JobDetail
}

// `expired` is layered ON TOP of a successful fetch — the deadline has passed,
// but the listing itself still exists and should render normally with an
// expired status, not 404. A bare `{ expired: true }` (no `result`) means the
// backend returned 410 Gone (recruiter/admin explicitly took the post down —
// see the takedown flow) and IS a hard not-found, handled separately below.
type JobFetchResult = (JobResponse & { expired: boolean }) | { expired: true } | null

const fetchJob = async (slug: string): Promise<JobFetchResult> => {
  try {
    // Use ISR revalidate — never force-cache (that bypasses ISR and keeps stale content forever)
    const response = await fetch(`${API_BASE_URL}/jobs/${slug}`, {
      next: { revalidate: 900 },
    })
    if (response.status === 410) return { expired: true }
    if (response.status === 404) return null
    if (!response.ok) {
      console.error(`[jobs] fetch failed for "${slug}": HTTP ${response.status}`)
      return null
    }
    const data = (await response.json()) as JobResponse
    // Deadline passed, or the recruiter closed it early (job_status === 'closed')
    // → still a real listing, just flagged expired. The page renders it with an
    // "Expired"/"Closed" status and disables Apply, instead of 404ing.
    let expired = data.result?.job_status === 'closed'
    if (data.result?.job_deadline) {
      const deadline = new Date(data.result.job_deadline)
      deadline.setHours(23, 59, 59, 999) // end of deadline day
      if (deadline < new Date()) expired = true
    }
    return { ...data, expired }
  } catch (err) {
    console.error(`[jobs] fetch error for "${slug}":`, err)
    return null
  }
}

export async function generateStaticParams() {
  return jobSlugs().map((slug) => ({ slug }))
}

// ─── Schema helpers ───────────────────────────────────────────────────────────

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  contract: 'CONTRACTOR',
  internship: 'INTERN',
  freelance: 'OTHER',
}

// salary_period is stored uppercase in DB (MONTH/YEAR/HOUR/WEEK) — schema.org uses same values
const SALARY_UNIT_MAP: Record<string, string> = {
  MONTH: 'MONTH', YEAR: 'YEAR', HOUR: 'HOUR', WEEK: 'WEEK',
  monthly: 'MONTH', yearly: 'YEAR', annually: 'YEAR', hourly: 'HOUR', weekly: 'WEEK',
}

// Strip HTML tags for schema.org description — Google requires plain text, not HTML.
// Preserves newlines from <br>, <p>, <li> so the text stays readable.
function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function buildJobPostingSchema(job: JobDetail, canonicalUrl: string) {
  // validThrough: use deadline if present, else 90 days from posting date.
  // Google warns when missing — a reasonable fallback beats an absent field.
  const validThrough = job.job_deadline
    ? new Date(job.job_deadline).toISOString()
    : job.created_at
    ? new Date(new Date(job.created_at).getTime() + 90 * 86_400_000).toISOString()
    : undefined

  // description must be plain text — Google rejects HTML tags in JobPosting schema
  const plainDescription = stripHtml(job.job_description)
    || `Apply for ${job.position} at ${job.company_name} on Riseflake — India's job portal for students and freshers.`

  // hiringOrganization.sameAs: company's own page on Riseflake, then their website
  const companySameAs: string[] = []
  if (job.company_slug) companySameAs.push(`https://jobportal.riseflake.com/companies/${job.company_slug}`)
  if (job.company_website) companySameAs.push(job.company_website)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.position,
    description: plainDescription,
    datePosted: job.created_at ? new Date(job.created_at).toISOString().slice(0, 10) : undefined,
    dateModified: job.updated_at ? new Date(job.updated_at).toISOString().slice(0, 10) : undefined,
    validThrough,
    employmentType: EMPLOYMENT_TYPE_MAP[job.job_type?.toLowerCase()] ?? 'OTHER',
    url: canonicalUrl,
    // directApply: false — users are redirected to app.riseflake.com to complete the application
    directApply: false,
    // identifier: Google uses this to deduplicate job postings across syndication
    identifier: {
      '@type': 'PropertyValue',
      name: 'Riseflake',
      value: job.job_id ? `riseflake-job-${job.job_id}` : job.slug,
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_name,
      ...(job.company_logo ? { logo: job.company_logo } : {}),
      ...(companySameAs.length === 1 ? { sameAs: companySameAs[0] } : {}),
      ...(companySameAs.length > 1 ? { sameAs: companySameAs } : {}),
    },
  }

  // jobLocation — always required. Remote jobs get TELECOMMUTE + country.
  // On-site/hybrid jobs get city/state/country. Fallback: India.
  if (job.workplace_type === 1) {
    // Fully remote — Google requires applicantLocationRequirements whenever
    // jobLocationType is TELECOMMUTE, or the JobPosting fails rich-result validation.
    schema.jobLocationType = 'TELECOMMUTE'
    schema.applicantLocationRequirements = {
      '@type': 'Country',
      name: job.location_country ?? 'India',
    }
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: job.location_country ?? 'IN',
      },
    }
  } else if (job.workplace_type === 2) {
    // Hybrid — list both flags
    schema.jobLocationType = 'TELECOMMUTE'
    schema.applicantLocationRequirements = {
      '@type': 'Country',
      name: job.location_country ?? 'India',
    }
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...(job.location_city ? { addressLocality: job.location_city } : {}),
        ...(job.location_state ? { addressRegion: job.location_state } : {}),
        addressCountry: job.location_country ?? 'IN',
      },
    }
  } else {
    // On-site or unknown — always emit jobLocation with at minimum addressCountry
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...(job.location_city ? { addressLocality: job.location_city } : {}),
        ...(job.location_state ? { addressRegion: job.location_state } : {}),
        addressCountry: job.location_country ?? 'IN',
      },
    }
  }

  // baseSalary — emit whenever we have real data; for hidden/unknown use jobBenefits note
  const unitText = SALARY_UNIT_MAP[job.salary_period?.toLowerCase() ?? ''] ?? 'MONTH'
  const currency = job.currency ?? 'INR'
  const type = job.salary_type?.toUpperCase()

  if (job.is_salary_hidden) {
    // Confidential — signal intentional omission so Google doesn't penalise
    schema.jobBenefits = (schema.jobBenefits ? `${schema.jobBenefits}. ` : '') + 'Salary: Confidential'
  } else if (type === 'UNPAID') {
    schema.jobBenefits = 'Unpaid / Voluntary position'
  } else if ((type === 'FIXED' || type === 'FIXED_INCENTIVE') && job.fixed_amount && parseFloat(job.fixed_amount) > 0) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency,
      value: { '@type': 'QuantitativeValue', value: parseFloat(job.fixed_amount), unitText },
    }
    if (type === 'FIXED_INCENTIVE' && job.incentive_details) {
      schema.jobBenefits = job.incentive_details
    }
  } else if (type === 'RANGE' && job.min_amount && job.max_amount) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: parseFloat(job.min_amount),
        maxValue: parseFloat(job.max_amount),
        unitText,
      },
    }
  } else if (job.is_negotiable) {
    schema.jobBenefits = (schema.jobBenefits ? `${schema.jobBenefits}. ` : '') + 'Salary: Negotiable'
  }

  // experienceRequirements — Google rejects monthsOfExperience: 0 ("must be positive"),
  // so freshers/no-experience-required roles omit the field entirely rather than emit 0.
  if (job.experience_min != null && job.experience_min > 0) {
    schema.experienceRequirements = {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: Math.round(job.experience_min * 12),
    }
  }

  // skills
  if (job.job_skills?.length) {
    schema.skills = job.job_skills.join(', ')
  }

  // jobBenefits from facilities (append, don't overwrite)
  if (job.job_facilities?.length) {
    const fac = job.job_facilities.join(', ')
    schema.jobBenefits = schema.jobBenefits ? `${schema.jobBenefits}. ${fac}` : fac
  }

  // openings
  if (job.job_vacancy) {
    schema.totalJobOpenings = Number(job.job_vacancy)
  }

  // occupationalCategory
  if (job.categories?.length) {
    schema.occupationalCategory = job.categories[0]
  }

  return schema
}

function buildBreadcrumbSchema(job: JobDetail, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${WEBSITE_BASE_URL}/jobs` },
      { '@type': 'ListItem', position: 3, name: job.position, item: canonicalUrl },
    ],
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params?: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = params ? await params : { slug: '' }
  const data = await fetchJob(slug)
  const job = (data && 'result' in data) ? (data as JobResponse).result : undefined

  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'This job is no longer available.',
      robots: { index: false, follow: false },
    }
  }

  const location = job.location_name ?? 'Remote'
  const expPart = job.experience_min != null
    ? ` | ${job.experience_min}–${job.experience_max ?? ''}${job.experience_max ? '' : '+'} yrs exp`
    : ''
  const canonicalUrl = `${WEBSITE_BASE_URL}/jobs/${job.slug}`

  const title = `${job.position} at ${job.company_name} — ${location}`
  const description = `Hiring: ${job.position} at ${job.company_name} in ${location}${expPart}. ${job.job_type} role. ${job.job_skills?.slice(0, 4).join(', ')}. Apply on Riseflake — India's job portal for students & freshers.`

  const ogImageUrl = OG_FALLBACK_IMAGE

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Riseflake Jobportal',
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${job.position} at ${job.company_name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    keywords: [
      job.position,
      job.company_name,
      ...(job.job_skills ?? []).slice(0, 8),
      location,
      `${job.job_type} jobs`,
      'riseflake jobs',
      'jobs in india',
    ].filter(Boolean).join(', '),
    robots: { index: true, follow: true },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function JobDetailsPage(
  { params }: { params?: Promise<{ slug: string }> }
) {
  const { slug } = params ? await params : { slug: '' }
  const data = await fetchJob(slug)

  // A bare `{ expired: true }` with no `result` is a 410 Gone (post explicitly
  // taken down) — that stays a hard not-found. A deadline-passed listing still
  // carries its `result` and renders normally below, just flagged expired.
  if (!data || !('status' in data) || !('result' in data) || !data.status || !data.result) {
    notFound()
  }

  const job = (data as JobResponse).result
  const isExpired = (data as { expired?: boolean }).expired === true
  const canonicalUrl = `${WEBSITE_BASE_URL}/jobs/${job.slug}`
  const breadcrumbSchema = buildBreadcrumbSchema(job, canonicalUrl)
  // Google's JobPosting guidelines: remove the rich-result markup once a
  // listing expires rather than leaving stale "still hiring" data indexed.
  // The page itself stays up (with the Expired status below) — only the
  // structured data is dropped.
  const jobPostingSchema = isExpired ? null : buildJobPostingSchema(job, canonicalUrl)

  return (
    <>
      {/* Structured data */}
      {jobPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <JobDetailView
        job={job}
        isExpired={isExpired}
        similar={<SimilarListings slug={job.slug} categories={job.categories} />}
      />
    </>
  )
}
