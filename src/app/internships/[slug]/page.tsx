import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Users, Briefcase, Banknote, Globe, Home, Building2, GraduationCap, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ApplyCard from './components/ApplyCard'
import JobDescription from './components/JobDescription'
import JobHeader from './components/JobHeader'
import TagsSection from './components/TagsSection'
import DownloadAppCard from '../../jobs/[slug]/components/DownloadAppCard'
import JobReportWrapper from '../../components/JobReportWrapper'
import type { JobDetail } from './components/types'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import { formatSalaryChip } from '../../../lib/salary'
import React from 'react'

export const dynamicParams = true
export const revalidate = 900

// ─── Domain landing pages ─────────────────────────────────────────────────────
// Slugs that match a domain keyword are served as category listing pages,
// not internship detail pages. This avoids a separate conflicting [domain] route.

const DOMAIN_MAP: Record<string, { label: string; category: string; description: string; keywords: string }> = {
  'software-development': {
    label: 'Software Development',
    category: 'Software Development',
    description: 'Browse verified software development internships for students and freshers in India. Gain real coding experience with top startups and tech companies.',
    keywords: 'software development internship india, coding internship, programming internship, developer internship 2025, software engineer intern',
  },
  'web-development': {
    label: 'Web Development',
    category: 'Web Development',
    description: 'Find web development internships in India for students. Work on real websites and web apps with React, Node, PHP, and more.',
    keywords: 'web development internship india, frontend intern, backend intern, full stack intern, react internship, nodejs internship',
  },
  'marketing': {
    label: 'Marketing',
    category: 'Marketing',
    description: 'Discover marketing internships in India for students. Learn digital marketing, social media, SEO, and brand strategy with growing companies.',
    keywords: 'marketing internship india, digital marketing internship, social media intern, SEO internship, brand marketing intern 2025',
  },
  'data-science': {
    label: 'Data Science',
    category: 'Data Science',
    description: 'Find data science internships for students in India. Work with real datasets, build models, and learn machine learning with top companies.',
    keywords: 'data science internship india, machine learning intern, AI internship, data analyst internship, python internship',
  },
  'design': {
    label: 'Design',
    category: 'Design',
    description: 'Browse design internships in India — UI/UX, graphic design, product design, and visual design. Build your portfolio with real projects.',
    keywords: 'design internship india, UI UX internship, graphic design internship, product design intern, figma internship 2025',
  },
  'finance': {
    label: 'Finance',
    category: 'Finance',
    description: 'Find finance internships for students in India. Gain experience in financial analysis, accounting, investment research, and banking.',
    keywords: 'finance internship india, accounting internship, investment banking internship, financial analyst intern, CA internship',
  },
  'content-writing': {
    label: 'Content Writing',
    category: 'Content Writing',
    description: 'Browse content writing internships in India. Work as a content writer, copywriter, or editor with media companies, startups, and agencies.',
    keywords: 'content writing internship india, copywriting internship, blog writing intern, content creator intern 2025',
  },
  'human-resources': {
    label: 'Human Resources',
    category: 'Human Resources',
    description: 'Find HR internships in India. Learn recruitment, talent management, payroll, and employee engagement with real companies.',
    keywords: 'HR internship india, human resources internship, recruitment intern, talent acquisition internship 2025',
  },
  'sales': {
    label: 'Sales',
    category: 'Sales',
    description: 'Discover sales internships in India. Learn business development, inside sales, and client management with fast-growing companies.',
    keywords: 'sales internship india, business development internship, inside sales intern, BD internship 2025',
  },
  'operations': {
    label: 'Operations',
    category: 'Operations',
    description: 'Find operations internships in India. Work in supply chain, logistics, project management, and business operations.',
    keywords: 'operations internship india, supply chain internship, logistics intern, project management internship 2025',
  },
}

type DomainInternship = {
  id: number
  slug: string
  position: string
  company_name?: string | null
  company_logo?: string | null
  workplace_type?: number | null
  location_name?: string | null
  categories?: string[]
  is_salary_hidden?: boolean
  salary_type?: string | null
  fixed_amount?: string | null
  min_amount?: string | null
  max_amount?: string | null
  currency?: string | null
  salary_period?: string | null
}

async function fetchDomainInternships(category: string): Promise<DomainInternship[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/internships?categories=${encodeURIComponent(category)}&limit=30`, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.result ?? []
  } catch { return [] }
}

async function renderDomainPage(slug: string) {
  const info = DOMAIN_MAP[slug]
  if (!info) return null
  const internships = await fetchDomainInternships(info.category)
  const canonicalUrl = `${WEBSITE_BASE_URL}/internships/${slug}`
  const otherDomains = Object.entries(DOMAIN_MAP).filter(([s]) => s !== slug).slice(0, 7)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Internships', item: `${WEBSITE_BASE_URL}/internships` },
      { '@type': 'ListItem', position: 3, name: `${info.label} Internships`, item: canonicalUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-16 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <Link href="/internships" className="hover:text-indigo-600 font-medium">Internships</Link>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-slate-700 font-medium">{info.label}</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">{info.label}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{info.label} Internships in India</h1>
            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-2xl">{info.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/internships/work-from-home" className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">🏠 Work from Home</Link>
              {otherDomains.map(([s, d]) => (
                <Link key={s} href={`/internships/${s}`} className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">{d.label}</Link>
              ))}
            </div>
          </div>
          {internships.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 text-sm">No {info.label} internships right now — check back soon.</p>
              <Link href="/internships" className="mt-4 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline font-medium">Browse all internships <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {internships.map(item => (
                  <Link key={item.id} href={`/internships/${item.slug}`} className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.company_logo
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={item.company_logo} alt={item.company_name ?? ''} className="h-full w-full object-cover" />
                          : <Building2 className="h-5 w-5 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{item.position}</h2>
                        {item.company_name && <p className="text-xs text-slate-500 mt-0.5">{item.company_name}</p>}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-auto">
                      {item.workplace_type === 1 && <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Remote</span>}
                      {item.location_name && item.workplace_type !== 1 && <span className="text-[11px] text-slate-500">{item.location_name}</span>}
                      {!item.is_salary_hidden && formatSalaryChip(item) && <span className="text-[11px] text-emerald-600 font-semibold">{formatSalaryChip(item)}</span>}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href={`/internships?categories=${encodeURIComponent(info.category)}`} className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium">
                  View all {info.label} internships <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3">{info.label} Internships for Students — 2025 Guide</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{info.description}</p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">Riseflake lists verified {info.label.toLowerCase()} internship opportunities posted directly by recruiters and companies. Many offer monthly stipends and can be done remotely. Create your free Riseflake profile to apply in one click.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/internships" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">All internships <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/internships/work-from-home" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">Remote internships <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

type InternshipResponse = {
  status: boolean
  result: JobDetail
}

const fetchInternship = async (slug: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/internships/${slug}`, {
      next: { revalidate: 900 },
    })
    if (response.status === 410) return { expired: true }
    if (response.status === 404) return null
    if (!response.ok) {
      console.error(`[internships] fetch failed for "${slug}": HTTP ${response.status}`)
      return null
    }
    const data = (await response.json()) as InternshipResponse
    // Treat deadline-expired internships as expired on the frontend too
    if (data.result?.job_deadline) {
      const deadline = new Date(data.result.job_deadline)
      deadline.setHours(23, 59, 59, 999)
      if (deadline < new Date()) return { expired: true }
    }
    return data
  } catch (err) {
    console.error(`[internships] fetch error for "${slug}":`, err)
    return null
  }
}

export async function generateStaticParams() {
  // Pre-render domain landing pages at build time
  return Object.keys(DOMAIN_MAP).map(domain => ({ slug: domain }))
}

// ─── Schema helpers ───────────────────────────────────────────────────────────

const SALARY_UNIT_MAP: Record<string, string> = {
  MONTH: 'MONTH', YEAR: 'YEAR', HOUR: 'HOUR', WEEK: 'WEEK',
  monthly: 'MONTH', yearly: 'YEAR', annually: 'YEAR', hourly: 'HOUR', weekly: 'WEEK',
}

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
  const plainDescription = stripHtml(job.job_description)
    || `Apply for ${job.position} internship at ${job.company_name} on Riseflake.`

  // validThrough: use deadline if present, else 90 days from posting date
  const validThrough = job.job_deadline
    ? new Date(job.job_deadline).toISOString()
    : job.created_at
    ? new Date(new Date(job.created_at).getTime() + 90 * 86_400_000).toISOString()
    : undefined

  const companySameAs: string[] = []
  if (job.company_slug) companySameAs.push(`https://riseflake.com/companies/${job.company_slug}`)
  if (job.company_website) companySameAs.push(job.company_website)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.position,
    description: plainDescription,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Riseflake',
      value: job.job_id ? `riseflake-internship-${job.job_id}` : job.slug,
    },
    directApply: false,
    datePosted: job.created_at ? new Date(job.created_at).toISOString().slice(0, 10) : undefined,
    dateModified: job.updated_at ? new Date(job.updated_at).toISOString().slice(0, 10) : undefined,
    validThrough,
    employmentType: 'INTERN',
    url: canonicalUrl,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_name,
      ...(job.company_logo ? { logo: job.company_logo } : {}),
      ...(companySameAs.length === 1
        ? { sameAs: companySameAs[0] }
        : companySameAs.length > 1
        ? { sameAs: companySameAs }
        : {}),
    },
  }

  // jobLocation — always required; remote gets TELECOMMUTE flag too
  if (job.workplace_type === 1) {
    schema.jobLocationType = 'TELECOMMUTE'
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: job.location_country ?? 'IN',
      },
    }
  } else if (job.workplace_type === 2) {
    schema.jobLocationType = 'TELECOMMUTE'
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
      address: {
        '@type': 'PostalAddress',
        ...(job.location_city ? { addressLocality: job.location_city } : {}),
        ...(job.location_state ? { addressRegion: job.location_state } : {}),
        addressCountry: job.location_country ?? 'IN',
      },
    }
  }

  // baseSalary (stipend) — guard against zero amounts
  const unitText = SALARY_UNIT_MAP[job.salary_period?.toLowerCase() ?? ''] ?? 'MONTH'
  const currency = job.currency ?? 'INR'
  const type = job.salary_type?.toUpperCase()

  if (job.is_salary_hidden) {
    schema.jobBenefits = 'Stipend: Confidential'
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
    schema.jobBenefits = 'Stipend negotiable'
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

  // Domain landing page — return domain-specific metadata
  const domainInfo = DOMAIN_MAP[slug]
  if (domainInfo) {
    const canonicalUrl = `${WEBSITE_BASE_URL}/internships/${slug}`
    const title = `${domainInfo.label} Internships in India 2025 — Students & Freshers`
    return {
      title,
      description: domainInfo.description,
      alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
      openGraph: { title, description: domainInfo.description, url: canonicalUrl, siteName: 'Riseflake', type: 'website' },
      twitter: { card: 'summary', title, description: domainInfo.description },
      keywords: domainInfo.keywords,
      robots: { index: true, follow: true },
    }
  }

  const data = await fetchInternship(slug)
  const internship = (data && 'result' in data) ? (data as InternshipResponse).result : undefined

  if (!internship) {
    return {
      title: 'Internship Not Found',
      description: 'This internship is no longer available.',
      robots: { index: false, follow: false },
    }
  }

  const location = internship.location_name ?? 'Remote'
  const expPart = internship.experience_min != null
    ? ` | ${internship.experience_min}–${internship.experience_max ?? ''}${internship.experience_max ? '' : '+'} yrs exp`
    : ''
  const canonicalUrl = `${WEBSITE_BASE_URL}/internships/${internship.slug}`

  const title = `${internship.position} Internship at ${internship.company_name} — ${location}`
  const description = `Internship: ${internship.position} at ${internship.company_name} in ${location}${expPart}. ${internship.job_skills?.slice(0, 4).join(', ')}. Apply on Riseflake — India's job portal for students & freshers.`

  const ogStipend = formatSalaryChip(internship) ?? ''
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
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
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

  // Domain landing page — render category listing instead of detail
  const domainPage = await renderDomainPage(slug)
  if (domainPage) return domainPage

  const data = await fetchInternship(slug)

  if (data && 'expired' in data && data.expired) {
    // SEO: return 404 so Google deindexes expired internship URLs.
    // Never return 200 for expired content — it wastes crawl budget and hurts ranking.
    notFound()
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
                        : formatSalaryChip(internship) ?? 'Not disclosed'
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

              <TagsSection title="Skills" tags={internship.job_skills} />
              <TagsSection title="Facilities" tags={internship.job_facilities} />
              <JobDescription html={internship.job_description} />
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
