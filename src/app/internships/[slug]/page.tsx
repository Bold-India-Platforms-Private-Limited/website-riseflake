import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Users, Briefcase, Banknote, Globe, Home, Building2, GraduationCap, MapPin, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import ApplyCard from './components/ApplyCard'
import JobDescription from './components/JobDescription'
import JobHeader from './components/JobHeader'
import TagsSection from './components/TagsSection'
import DownloadAppCard from '../../jobs/[slug]/components/DownloadAppCard'
import JobReportWrapper from '../../components/JobReportWrapper'
import type { JobDetail } from './components/types'
import { API_BASE_URL, WEBSITE_BASE_URL } from '../../../lib/config'
import React from 'react'

export const dynamicParams = true
export const revalidate = 900

type InternshipResponse = {
  status: boolean
  result: JobDetail
}

const fetchInternship = async (slug: string) => {
  const response = await fetch(`${API_BASE_URL}/internships/${slug}`, { cache: 'force-cache' })
  if (response.status === 410) return { expired: true }
  if (!response.ok) return null
  return (await response.json()) as InternshipResponse
}

export async function generateStaticParams() {
  return []
}

// ─── Schema helpers ───────────────────────────────────────────────────────────

const SALARY_UNIT_MAP: Record<string, string> = {
  monthly: 'MONTH',
  yearly: 'YEAR',
  annually: 'YEAR',
  hourly: 'HOUR',
  weekly: 'WEEK',
}

function buildJobPostingSchema(job: JobDetail, canonicalUrl: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.position,
    description: job.job_description ?? `Apply for ${job.position} internship at ${job.company_name} on Riseflake.`,
    datePosted: job.created_at ? new Date(job.created_at).toISOString().slice(0, 10) : undefined,
    dateModified: job.updated_at ? new Date(job.updated_at).toISOString().slice(0, 10) : undefined,
    validThrough: job.job_deadline ? new Date(job.job_deadline).toISOString() : undefined,
    employmentType: 'INTERN',
    url: canonicalUrl,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_name,
      ...(job.company_logo ? { logo: job.company_logo } : {}),
    },
  }

  // jobLocation / jobLocationType
  if (job.workplace_type === 1) {
    schema.jobLocationType = 'TELECOMMUTE'
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: job.location_country ?? 'IN',
      },
    }
  } else if (job.location_city || job.location_state || job.location_country) {
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
    schema.jobLocation = {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
    }
  }

  // baseSalary (stipend)
  if (!job.is_salary_hidden) {
    const unitText = SALARY_UNIT_MAP[job.salary_period?.toLowerCase() ?? ''] ?? 'MONTH'
    const currency = job.currency ?? 'INR'

    if (job.salary_type === 'FIXED' && job.fixed_amount) {
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency,
        value: { '@type': 'QuantitativeValue', value: parseFloat(job.fixed_amount), unitText },
      }
    } else if (job.min_amount && job.max_amount) {
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
      schema.jobBenefits = 'Stipend negotiable'
    }
  }

  // experienceRequirements
  if (job.experience_min != null) {
    schema.experienceRequirements = {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: Math.round(job.experience_min * 12),
    }
  }

  // skills
  if (job.job_skills?.length) {
    schema.skills = job.job_skills.join(', ')
  }

  // jobBenefits from facilities
  if (job.job_facilities?.length) {
    schema.jobBenefits = job.job_facilities.join(', ')
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
      { '@type': 'ListItem', position: 2, name: 'Internships', item: `${WEBSITE_BASE_URL}/internships` },
      { '@type': 'ListItem', position: 3, name: job.position, item: canonicalUrl },
    ],
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params?: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = params ? await params : { slug: '' }
  const data = await fetchInternship(slug)
  const internship = (data && 'result' in data) ? (data as InternshipResponse).result : undefined

  if (!internship) {
    return { title: 'Internship Not Found | Riseflake', description: 'This internship is no longer available.' }
  }

  const location = internship.location_name ?? 'Remote'
  const expPart = internship.experience_min != null
    ? ` | ${internship.experience_min}–${internship.experience_max ?? ''}${internship.experience_max ? '' : '+'} yrs exp`
    : ''
  const canonicalUrl = `${WEBSITE_BASE_URL}/internships/${internship.slug}`

  const title = `${internship.position} Internship at ${internship.company_name} — ${location} | Riseflake`
  const description = `Internship: ${internship.position} at ${internship.company_name} in ${location}${expPart}. ${internship.job_skills?.slice(0, 4).join(', ')}. Apply on Riseflake — India's job portal for students & freshers.`

  const ogStipend = (() => {
    if (internship.is_salary_hidden) return ''
    const c = internship.currency ?? '₹'
    if (internship.salary_type === 'FIXED' && internship.fixed_amount) return `${c}${internship.fixed_amount}`
    if (internship.min_amount && internship.max_amount) return `${c}${internship.min_amount}–${internship.max_amount}`
    return ''
  })()
  const ogImageUrl = `${WEBSITE_BASE_URL}/api/og?type=internship` +
    `&title=${encodeURIComponent(internship.position)}` +
    `&company=${encodeURIComponent(internship.company_name ?? '')}` +
    `&location=${encodeURIComponent(location)}` +
    `&salary=${encodeURIComponent(ogStipend)}` +
    `&jobType=${encodeURIComponent(internship.job_type ?? '')}` +
    `&logo=${encodeURIComponent(internship.company_logo ?? '')}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Riseflake',
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${internship.position} Internship at ${internship.company_name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    keywords: [
      internship.position,
      internship.company_name,
      ...(internship.job_skills ?? []).slice(0, 8),
      location,
      'internship',
      'riseflake internships',
      'internships in india',
    ].filter(Boolean).join(', '),
    robots: { index: true, follow: true },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const formatLakh = (val: string | null | undefined): string => {
  const n = parseFloat(val ?? '')
  if (isNaN(n)) return String(val ?? '')
  if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
  return String(n)
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

export default async function InternshipDetailsPage(
  { params }: { params?: Promise<{ slug: string }> }
) {
  const { slug } = params ? await params : { slug: '' }
  const data = await fetchInternship(slug)

  if (data && 'expired' in data && data.expired) {
    return (
      <>
        <Navbar bgTransparent />
        <main className="px-4 sm:px-6 lg:px-8 py-12 bg-slate-100 min-h-screen">
          <div className="max-w-[1200px] mx-auto text-center py-24">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 mb-6">
              <svg className="h-8 w-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Internship No Longer Available</h1>
            <p className="text-lg text-slate-500 mb-8">This internship has expired or been removed.</p>
            <a href="/internships" className="inline-flex items-center gap-2 rounded-xl bg-[#414FEA] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition">
              Browse Open Internships <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </main>
      </>
    )
  }

  if (!data || !('status' in data) || !('result' in data) || !data.status || !data.result) {
    notFound()
  }

  const internship = (data as InternshipResponse).result
  const canonicalUrl = `${WEBSITE_BASE_URL}/internships/${internship.slug}`
  const jobPostingSchema = buildJobPostingSchema(internship, canonicalUrl)
  const breadcrumbSchema = buildBreadcrumbSchema(internship, canonicalUrl)

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
            <a href="/internships" className="hover:text-indigo-600 font-medium">Internships</a>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-700 font-medium truncate max-w-[200px]">{internship.position}</span>
          </nav>

          <JobHeader job={internship} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            {/* Main content */}
            <div className="space-y-6">

              {/* Internship highlights */}
              <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                  <svg className="h-4 w-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h2 className="text-sm font-semibold text-slate-700">Internship at a glance</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-slate-100">
                  <HighlightCell icon={<Users className="h-4 w-4" />} label="Openings" accent="bg-blue-50" iconColor="text-blue-500"
                    value={internship.job_vacancy != null ? String(internship.job_vacancy) : 'Not specified'} />
                  <HighlightCell icon={<Briefcase className="h-4 w-4" />} label="Experience" accent="bg-violet-50" iconColor="text-violet-500"
                    value={
                      internship.experience_min != null || internship.experience_max != null
                        ? `${internship.experience_min ?? 0}–${internship.experience_max ?? ''}${internship.experience_max ? '' : '+'} yrs`
                        : 'Any level'
                    }
                  />
                  <HighlightCell icon={<Banknote className="h-4 w-4" />} label="Stipend" accent="bg-emerald-50" iconColor="text-emerald-500"
                    value={
                      internship.is_salary_hidden
                        ? 'Confidential'
                        : internship.salary_type === 'FIXED' && internship.fixed_amount
                          ? `${internship.currency ?? '₹'}${formatLakh(internship.fixed_amount)}${internship.salary_period ? `/${internship.salary_period.toLowerCase()}` : ''}`
                          : internship.min_amount && internship.max_amount
                            ? `${internship.currency ?? '₹'}${formatLakh(internship.min_amount)}–${formatLakh(internship.max_amount)}`
                            : internship.is_negotiable ? 'Negotiable' : 'Not disclosed'
                    }
                  />
                  <HighlightCell icon={<GraduationCap className="h-4 w-4" />} label="Type" accent="bg-amber-50" iconColor="text-amber-500" value="Internship" />
                  <HighlightCell
                    icon={internship.workplace_type === 1 ? <Globe className="h-4 w-4" /> : internship.workplace_type === 2 ? <Home className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                    label="Workplace" accent="bg-pink-50" iconColor="text-pink-500"
                    value={internship.workplace_type === 1 ? 'Remote' : internship.workplace_type === 2 ? 'Hybrid' : internship.workplace_type === 3 ? 'On-site' : 'Not specified'}
                  />
                  <HighlightCell icon={<MapPin className="h-4 w-4" />} label="Location" accent="bg-rose-50" iconColor="text-rose-500"
                    value={internship.location_name ?? 'Remote'} />
                </div>
              </section>

              <JobDescription html={internship.job_description} />
              <TagsSection title="Skills" tags={internship.job_skills} />
              <TagsSection title="Facilities" tags={internship.job_facilities} />
              <JobReportWrapper jobSlug={internship.slug} isInternship />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <ApplyCard job={internship} />
              <DownloadAppCard />
            </div>
          </div>

          <p className="text-xs text-gray-700 text-center mt-12">
            BIPPL has taken all reasonable steps to ensure that information on this site is authentic. Applicants are advised to research bonafides of advertisers independently. BIPPL shall not have any responsibility in this regard. We also recommend that you visit Security Guidelines and Terms of Service for more comprehensive information on this aspect. Please note that RiseFlake will not be responsible for any information you share on the company platform.
          </p>
        </div>
      </main>
    </>
  )
}
