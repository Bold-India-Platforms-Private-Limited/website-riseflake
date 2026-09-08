import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Briefcase, Building2, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import { fetchSkillsDirectory, fetchSkillDetail } from '../../../lib/skillsData'
import { currentPeriod } from '../../../lib/period'
import SeoListingCard from '../../components/seo/SeoListingCard'
import CrawlablePagination from '../../components/seo/CrawlablePagination'
import FaqBlock from '../../components/seo/FaqJsonLd'

export const dynamicParams = true
export const revalidate = 1800

export async function generateStaticParams() {
  const skills = await fetchSkillsDirectory()
  return skills.slice(0, 200).map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(parseInt(pageParam || '1', 10) || 1, 1)
  const { year } = currentPeriod()

  const data = await fetchSkillDetail(slug, page)
  if (!data) {
    return { title: 'Skills | Riseflake', robots: { index: false, follow: false } }
  }

  const name = data.skill.name
  const baseUrl = `${WEBSITE_BASE_URL}/skills/${slug}`
  const canonicalUrl = page > 1 ? `${baseUrl}?page=${page}` : baseUrl
  const pageSuffix = page > 1 ? ` — Page ${page}` : ''
  const title = `${name} Jobs & Internships in India ${year} — ${data.totalCount} Openings${pageSuffix} | Riseflake`
  const description = `Find ${name} jobs and internships in India. ${data.jobCount} jobs and ${data.internshipCount} internships from verified companies hiring ${name} skills right now. Apply free on Riseflake.`

  const shouldIndex = data.result.length > 0 && page <= data.totalPages

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    openGraph: { title, description, url: canonicalUrl, siteName: 'Riseflake', type: 'website' },
    twitter: { card: 'summary', title, description },
    keywords: `${name.toLowerCase()} jobs, ${name.toLowerCase()} jobs in india, ${name.toLowerCase()} internships, ${name.toLowerCase()} developer jobs, companies hiring ${name.toLowerCase()}, riseflake ${name.toLowerCase()}`,
    robots: { index: shouldIndex, follow: true },
  }
}

export default async function SkillDetailPage(
  { params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }
) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(parseInt(pageParam || '1', 10) || 1, 1)
  const { year, monthYear } = currentPeriod()

  const data = await fetchSkillDetail(slug, page)
  if (!data) notFound()

  const { skill, result: listings, totalPages, total, jobCount, internshipCount, totalCount, companies, relatedSkills } = data
  const name = skill.name
  const basePath = `/skills/${slug}`
  const canonicalUrl = page > 1 ? `${WEBSITE_BASE_URL}${basePath}?page=${page}` : `${WEBSITE_BASE_URL}${basePath}`
  const now = new Date().toISOString()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Skills Directory', item: `${WEBSITE_BASE_URL}/skills` },
      { '@type': 'ListItem', position: 3, name: `${name} Jobs`, item: canonicalUrl },
    ],
  }

  const collectionSchema = listings.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${name} Jobs & Internships in India ${year}`,
    description: `Verified ${name} job and internship openings on Riseflake, updated ${monthYear}.`,
    url: canonicalUrl,
    datePublished: now,
    dateModified: now,
    isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: WEBSITE_BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total,
      itemListElement: listings.slice(0, 25).map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${WEBSITE_BASE_URL}/${it.job_type === 'internship' ? 'internships' : 'jobs'}/${it.slug}`,
        name: it.company_name ? `${it.position} at ${it.company_name}` : it.position,
      })),
    },
  } : null

  const faqs = [
    {
      question: `What is ${name}?`,
      answer: `${name} is one of the most in-demand skills employers on Riseflake look for. Below you'll find live job and internship openings that specifically require ${name}, along with the companies currently hiring for it.`,
    },
    {
      question: `How many ${name} jobs are available right now?`,
      answer: `Riseflake currently lists ${jobCount} ${name} job${jobCount === 1 ? '' : 's'} and ${internshipCount} ${name} internship${internshipCount === 1 ? '' : 's'} from verified employers, refreshed continuously as of ${monthYear}.`,
    },
    {
      question: `Which companies are hiring for ${name}?`,
      answer: companies.length > 0
        ? `Companies currently hiring for ${name} include ${companies.slice(0, 5).map((c) => c.company_name).join(', ')}, and more. See the full list below.`
        : `Check the companies section below for employers currently hiring for ${name} skills.`,
    },
    {
      question: `Is it free to apply for ${name} jobs on Riseflake?`,
      answer: `Yes. Applying is always free for candidates. Every listing shows the real hiring company and role requirements.`,
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
              <Link href="/skills" className="hover:text-indigo-600 font-medium">Skills</Link>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-slate-700 font-medium">{name}</span>
            </nav>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{name} Skill</p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{name} Jobs &amp; Internships in India</h1>
            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-2xl">
              {totalCount} verified {name} opening{totalCount === 1 ? '' : 's'} — {jobCount} job{jobCount === 1 ? '' : 's'} and {internshipCount} internship{internshipCount === 1 ? '' : 's'} from real, registered employers. Apply free on Riseflake.
            </p>
          </div>

          {/* Listings grid */}
          {listings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 text-sm">No {name} openings found right now.</p>
              <Link href="/skills" className="mt-4 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline font-medium">
                Browse all skills <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((item) => (
                <SeoListingCard
                  key={item.slug}
                  item={item}
                  hrefBase={item.job_type === 'internship' ? '/internships' : '/jobs'}
                />
              ))}
            </div>
          )}

          <CrawlablePagination basePath={basePath} currentPage={page} totalPages={totalPages} />

          {/* Companies hiring for this skill */}
          {companies.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">
                Companies hiring for {name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {companies.map((c) => (
                  c.company_slug ? (
                    <Link
                      key={c.company_name}
                      href={`/companies/${c.company_slug}`}
                      className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                    >
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {c.company_name}
                    </Link>
                  ) : (
                    <span
                      key={c.company_name}
                      className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-600"
                    >
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {c.company_name}
                    </span>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Related skills */}
          {relatedSkills.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Related skills</h2>
              <div className="flex flex-wrap gap-2">
                {relatedSkills.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/skills/${s.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <FaqBlock faqs={faqs} />

          {/* SEO content block */}
          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3">About {name} Jobs — {year}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Riseflake lists verified {name} job and internship openings from registered companies across India.
              Whether you&apos;re a fresher building your first project or an experienced professional switching
              roles, browse current {name} openings by company, explore related skills employers ask for alongside
              {' '}{name}, and apply directly — completely free.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="/skills" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Browse all skills <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/jobs" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Browse all jobs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/internships" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Browse all internships <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
