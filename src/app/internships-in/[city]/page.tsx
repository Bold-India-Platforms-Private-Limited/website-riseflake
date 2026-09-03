import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Briefcase, Building2, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import { formatSalaryChip } from '../../../lib/salary'
import { currentPeriod } from '../../../lib/period'
import FacetChips from '../../components/seo/FacetChips'
import FaqBlock from '../../components/seo/FaqJsonLd'

export const dynamicParams = true
export const revalidate = 3600

const CITIES = [
  'bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai',
  'kolkata', 'ahmedabad', 'jaipur', 'surat', 'lucknow', 'kanpur',
  'nagpur', 'indore', 'bhopal', 'noida', 'gurgaon', 'chandigarh',
  'coimbatore', 'kochi', 'remote',
]

function titleCase(str: string) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

type Internship = {
  id: number
  slug: string
  position: string
  company_name?: string | null
  company_logo?: string | null
  job_type?: string | null
  location_name?: string | null
  is_salary_hidden?: boolean
  salary_type?: string | null
  fixed_amount?: string | null
  min_amount?: string | null
  max_amount?: string | null
  currency?: string | null
  salary_period?: string | null
}

async function fetchInternshipsByCity(city: string): Promise<Internship[]> {
  try {
    const params = new URLSearchParams({
      limit: '24',
      location: city === 'remote' ? '' : city,
      ...(city === 'remote' ? { workplace_type: '1' } : {}),
    })
    const res = await fetch(`${API_BASE_URL}/internships?${params}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.result ?? data.internships ?? []
  } catch {
    return []
  }
}

type Combo = { slug: string; label: string; count?: number; city_slug?: string }

async function fetchRoleCombosForCity(city: string): Promise<Combo[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/internships/directory`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.combos ?? []).filter((c: Combo) => c.city_slug === city)
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  return CITIES.map(city => ({ city }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city } = await params
  if (!CITIES.includes(city.toLowerCase())) {
    return { title: 'Internships | Riseflake', robots: { index: false, follow: false } }
  }

  const cityLabel = titleCase(city)
  const { year } = currentPeriod()
  const canonicalUrl = `${WEBSITE_BASE_URL}/internships-in/${city}`
  const isRemote = city === 'remote'
  const title = isRemote
    ? `Remote Internships in India ${year} — Work from Home`
    : `Internships in ${cityLabel} ${year} — Paid & Unpaid`
  const description = isRemote
    ? `Find remote internship opportunities in India for students and freshers. Browse verified online internships in software, marketing, design, and more. Apply free on Riseflake.`
    : `Find internships in ${cityLabel} for students and freshers. Paid and stipend-based internships across IT, marketing, finance, design, and more. Apply free on Riseflake.`

  // Noindex empty city pages to avoid Google "soft 404" flags
  const internships = await fetchInternshipsByCity(city)
  const shouldIndex = internships.length > 0

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    openGraph: { title, description, url: canonicalUrl, siteName: 'Riseflake', type: 'website' },
    twitter: { card: 'summary', title, description },
    keywords: isRemote
      ? 'remote internships india, online internships, work from home internships, virtual internships india, riseflake internships'
      : `internships in ${cityLabel.toLowerCase()}, ${cityLabel.toLowerCase()} internships, student internships ${cityLabel.toLowerCase()}, paid internships ${cityLabel.toLowerCase()}, riseflake ${cityLabel.toLowerCase()}`,
    robots: { index: shouldIndex, follow: true },
  }
}

export default async function InternshipsInCityPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params
  if (!CITIES.includes(city.toLowerCase())) notFound()

  const cityLabel = titleCase(city)
  const isRemote = city === 'remote'
  const { year, monthYear } = currentPeriod()
  const [internships, roleCombos] = await Promise.all([
    fetchInternshipsByCity(city),
    isRemote ? Promise.resolve([] as Combo[]) : fetchRoleCombosForCity(city),
  ])
  const canonicalUrl = `${WEBSITE_BASE_URL}/internships-in/${city}`
  const now = new Date().toISOString()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Internships', item: `${WEBSITE_BASE_URL}/internships` },
      { '@type': 'ListItem', position: 3, name: `Internships in ${cityLabel}`, item: canonicalUrl },
    ],
  }

  const collectionSchema = internships.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Internships in ${cityLabel} ${year}`,
    description: `Verified internship openings in ${cityLabel} on Riseflake, updated ${monthYear}.`,
    url: canonicalUrl,
    datePublished: now,
    dateModified: now,
    isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: WEBSITE_BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: internships.length,
      itemListElement: internships.slice(0, 25).map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${WEBSITE_BASE_URL}/internships/${it.slug}`,
        name: it.company_name ? `${it.position} at ${it.company_name}` : it.position,
      })),
    },
  } : null

  const faqs = [
    {
      question: `How many internships are available in ${cityLabel}?`,
      answer: `Riseflake lists verified internship openings in ${cityLabel} from registered companies, refreshed continuously as of ${monthYear}. Open any listing for the full description, eligibility and stipend.`,
    },
    {
      question: `Are internships in ${cityLabel} paid?`,
      answer: `Many are. Each card shows the stipend where the employer has disclosed it. Use the stipend filter on the main internships page to see paid roles only.`,
    },
    {
      question: `Can students from outside ${cityLabel} apply?`,
      answer: `Remote and hybrid roles accept applicants from anywhere in India. On-site roles are open to candidates who can commute to or relocate to ${cityLabel}.`,
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}

      <Navbar bgTransparent />

      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-16 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <Link href="/internships" className="hover:text-indigo-600 font-medium">Internships</Link>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-slate-700 font-medium">{cityLabel}</span>
            </nav>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 text-indigo-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                {isRemote ? 'Remote / Online' : cityLabel}
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {isRemote ? 'Remote Internships in India' : `Internships in ${cityLabel}`}
            </h1>
            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-2xl">
              {isRemote
                ? 'Browse verified remote internship opportunities for students and freshers across India. Apply free on Riseflake.'
                : `Browse verified internship openings in ${cityLabel} for students and freshers. Paid and stipend-based opportunities across all industries.`}
            </p>
          </div>

          {/* City links */}
          <div className="mb-6 flex flex-wrap gap-2">
            {CITIES.filter(c => c !== city).slice(0, 10).map(c => (
              <Link
                key={c}
                href={`/internships-in/${c}`}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                {titleCase(c)}
              </Link>
            ))}
          </div>

          {/* Internships grid */}
          {internships.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 text-sm">No internships found in {cityLabel} right now.</p>
              <Link href="/internships" className="mt-4 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline font-medium">
                Browse all internships <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {internships.map(item => (
                <Link
                  key={item.id}
                  href={`/internships/${item.slug}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.company_logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.company_logo} alt={item.company_name ?? ''} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {item.position}
                      </h2>
                      {item.company_name && (
                        <p className="text-xs text-slate-500 mt-0.5">{item.company_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-auto">
                    {item.job_type && (
                      <span className="text-[11px] bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium capitalize">
                        {item.job_type}
                      </span>
                    )}
                    {item.location_name && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{item.location_name}
                      </span>
                    )}
                    {!item.is_salary_hidden && formatSalaryChip(item) && (
                      <span className="text-[11px] text-emerald-600 font-semibold">{formatSalaryChip(item)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Role-in-city landing pages */}
          {roleCombos.length > 0 && (
            <FacetChips
              title={`Internships in ${cityLabel} by role`}
              chips={roleCombos.map(c => ({ slug: c.slug, label: c.label.replace(/ Internships in .+$/, ''), count: c.count }))}
              hrefBase="/internships/browse"
              seeAllHref="/internships/browse"
            />
          )}

          {/* FAQ */}
          <FaqBlock faqs={faqs} />

          {/* SEO content */}
          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              {isRemote ? `Remote Internships for Indian Students — ${year}` : `Internships in ${cityLabel} — ${year} Guide`}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isRemote
                ? `Riseflake lists hundreds of verified remote internship opportunities for students and freshers across India. Find online internships in software development, digital marketing, data science, UI/UX design, content writing, human resources, and more. All internships are posted by verified companies and recruiters.`
                : `Riseflake is India's trusted internship portal for college students and freshers. Find verified internship openings in ${cityLabel} across IT, software, marketing, finance, design, HR, operations, and more. Paid internships with stipends and valuable work experience to build your resume.`}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="/internships" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Browse all internships <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/internships/browse" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Internships by role, company &amp; stipend <ArrowRight className="h-4 w-4" />
              </Link>
              {!isRemote && (
                <Link href={`/jobs-in/${city}`} className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                  Jobs in {cityLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
