import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Users, Briefcase, Globe, Home, Building2, BadgeCheck, GraduationCap, Calendar, MapPin, Banknote } from 'lucide-react'
import Navbar from '../../components/Navbar'
import ApplyCard from './components/ApplyCard'
import JobDescription from './components/JobDescription'
import JobHeader from './components/JobHeader'
import TagsSection from './components/TagsSection'
import DownloadAppCard from './components/DownloadAppCard'
import SimilarListings from './components/SimilarListings'
import JobReportWrapper from '../../components/JobReportWrapper'
import type { JobDetail } from './components/types'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import { formatSalaryChip } from '../../../lib/salary'
import React from 'react'

export const dynamicParams = true
export const revalidate = 900   // ISR: rebuild every 15 min

type JobResponse = {
  status: boolean
  result: JobDetail
}

const fetchJob = async (slug: string) => {
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
    // If the job deadline has passed, treat as expired on the frontend too
    if (data.result?.job_deadline) {
      const deadline = new Date(data.result.job_deadline)
      deadline.setHours(23, 59, 59, 999) // end of deadline day
      if (deadline < new Date()) return { expired: true }
    }
    return data
  } catch (err) {
    console.error(`[jobs] fetch error for "${slug}":`, err)
    return null
  }
}

export async function generateStaticParams() {
  return []
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
  if (job.company_slug) companySameAs.push(`https://riseflake.com/companies/${job.company_slug}`)
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

  const ogSalary = formatSalaryChip(job) ?? ''
  const ogImageUrl = `${WEBSITE_BASE_URL}/api/og?type=job` +
    `&title=${encodeURIComponent(job.position)}` +
    `&company=${encodeURIComponent(job.company_name ?? '')}` +
    `&location=${encodeURIComponent(location)}` +
    `&salary=${encodeURIComponent(ogSalary)}` +
    `&jobType=${encodeURIComponent(job.job_type ?? '')}` +
    `&logo=${encodeURIComponent(job.company_logo ?? '')}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Riseflake',
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

  if (data && 'expired' in data && data.expired) {
    // SEO: trigger Next.js notFound() which returns HTTP 404.
    // Google will deindex this URL on next crawl.
    // A 200 "expired" page is far worse — Google keeps it indexed and it wastes crawl budget.
    notFound()
  }

  if (!data || !('status' in data) || !('result' in data) || !data.status || !data.result) {
    notFound()
  }

  const job = (data as JobResponse).result
  const canonicalUrl = `${WEBSITE_BASE_URL}/jobs/${job.slug}`
  const jobPostingSchema = buildJobPostingSchema(job, canonicalUrl)
  const breadcrumbSchema = buildBreadcrumbSchema(job, canonicalUrl)

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar bgTransparent />

      <main className="px-4 sm:px-6 lg:px-8 py-8 bg-slate-100 min-h-screen pt-20">
        <div className="max-w-[1200px] mx-auto space-y-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
            <a href="/" className="hover:text-indigo-600 font-medium">Home</a>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <a href="/jobs" className="hover:text-indigo-600 font-medium">Jobs</a>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-700 font-medium truncate max-w-[200px]">{job.position}</span>
          </nav>

          <JobHeader job={job} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            {/* Main content */}
            <div className="space-y-6">

              {/* Role highlights */}
              <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                  <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h2 className="text-sm font-semibold text-slate-700">Role at a glance</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-slate-100">
                  <HighlightCell icon={<Users className="h-4 w-4" />} label="Openings" accent="bg-blue-50" iconColor="text-blue-500"
                    value={job.job_vacancy != null ? String(job.job_vacancy) : 'Not specified'} />
                  <HighlightCell icon={<Briefcase className="h-4 w-4" />} label="Experience" accent="bg-indigo-50" iconColor="text-indigo-500"
                    value={
                      job.experience_min != null || job.experience_max != null
                        ? `${job.experience_min ?? 0}–${job.experience_max ?? ''}${job.experience_max ? '' : '+'} yrs`
                        : 'Any level'
                    }
                  />
                  <HighlightCell icon={<Banknote className="h-4 w-4" />} label="Salary" accent="bg-emerald-50" iconColor="text-emerald-500"
                    value={
                      job.is_salary_hidden
                        ? 'Confidential'
                        : formatSalaryChip(job) ?? 'Not disclosed'
                    }
                  />
                  <HighlightCell
                    icon={job.workplace_type === 1 ? <Globe className="h-4 w-4" /> : job.workplace_type === 2 ? <Home className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                    label="Workplace" accent="bg-violet-50" iconColor="text-violet-500"
                    value={job.workplace_type === 1 ? 'Remote' : job.workplace_type === 2 ? 'Hybrid' : job.workplace_type === 3 ? 'On-site' : 'Not specified'}
                  />
                  <HighlightCell icon={<BadgeCheck className="h-4 w-4" />} label="Eligibility" accent="bg-emerald-50" iconColor="text-emerald-500"
                    value={job.eligibility === 1 ? 'Eligible' : job.eligibility === 0 ? 'Not eligible' : 'Open to all'}
                  />
                  <HighlightCell icon={<GraduationCap className="h-4 w-4" />} label="Student status" accent="bg-amber-50" iconColor="text-amber-500"
                    value={job.student_currently_studying === true ? 'Studying OK' : job.student_currently_studying === false ? 'Pass-out only' : 'Not specified'}
                  />
                  {(() => {
                    const ys = Array.isArray(job.year_selection)
                      ? job.year_selection
                      : (() => { try { return JSON.parse(job.year_selection as unknown as string) } catch { return [] } })()
                    return ys?.length ? (
                      <HighlightCell icon={<Calendar className="h-4 w-4" />} label="Year of study" accent="bg-pink-50" iconColor="text-pink-500"
                        value={(ys as number[]).map(y => `${y}th`).join(', ')} />
                    ) : (
                      <HighlightCell icon={<MapPin className="h-4 w-4" />} label="Location" accent="bg-rose-50" iconColor="text-rose-500"
                        value={job.location_name ?? 'Remote'} />
                    )
                  })()}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TagsSection title="Categories" tags={job.categories} />
                <TagsSection title="Skills required" tags={job.job_skills} />
              </div>

              {job.job_facilities?.length > 0 && (
                <TagsSection title="Benefits & Facilities" tags={job.job_facilities} />
              )}

              <JobDescription html={job.job_description} />

              <JobReportWrapper jobSlug={job.slug} />
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <ApplyCard job={job} />
              <DownloadAppCard />
              <SimilarListings slug={job.slug} categories={job.categories} />
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-[1200px] mx-auto px-4 pb-10">
        <p className="text-xs text-gray-500 text-center mt-8">
          BIPPL has taken all reasonable steps to ensure that information on this site is authentic. Applicants are advised to research bonafides of advertisers independently. BIPPL shall not have any responsibility in this regard. Please note that RiseFlake will not be responsible for any information you share on the company platform.
        </p>
      </div>
    </>
  )
}

function HighlightCell({ icon, label, value, accent, iconColor }: { icon: React.ReactNode; label: string; value: string; accent?: string; iconColor?: string }) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${accent ?? 'bg-slate-100'}`}>
        <span className={iconColor ?? 'text-slate-500'}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800 leading-snug">{value}</p>
      </div>
    </div>
  )
}
