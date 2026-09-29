import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../lib/config'
import { fetchSkillsDirectory } from '../../lib/skillsData'
import { currentPeriod } from '../../lib/period'

export async function generateMetadata(): Promise<Metadata> {
  const { year } = currentPeriod()
  const canonicalUrl = `${WEBSITE_BASE_URL}/skills`
  const title = `Skills Directory ${year} — Jobs & Internships by Skill | Riseflake Jobportal`
  const description = `Browse verified jobs and internships in India by skill — Python, React, Java, AWS, Figma, data analysis and more. See who is hiring, salary info and related skills.`
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    openGraph: { title, description, url: canonicalUrl, siteName: 'Riseflake Jobportal', type: 'website' },
    twitter: { card: 'summary', title, description },
    robots: { index: true, follow: true },
  }
}

export default async function SkillsDirectoryPage() {
  const skills = await fetchSkillsDirectory()
  const canonicalUrl = `${WEBSITE_BASE_URL}/skills`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Skills Directory', item: canonicalUrl },
    ],
  }

  const collectionSchema = skills.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Skills Directory — Jobs & Internships by Skill',
    url: canonicalUrl,
    isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: WEBSITE_BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: skills.length,
      itemListElement: skills.slice(0, 100).map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${WEBSITE_BASE_URL}/skills/${s.slug}`,
        name: s.name,
      })),
    },
  } : null

  const byCategory = new Map<string, typeof skills>()
  for (const s of skills) {
    const key = s.category || 'Other Skills'
    if (!byCategory.has(key)) byCategory.set(key, [])
    byCategory.get(key)!.push(s)
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}

      <Navbar bgTransparent />

      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-16 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-slate-700 font-medium">Skills Directory</span>
            </nav>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Skills Directory</p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Jobs &amp; Internships by Skill</h1>
            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-2xl">
              Find verified job and internship openings in India organized by skill. See who&apos;s hiring for Python, React, Java, AWS, Figma, data analysis and more.
            </p>
          </div>

          {skills.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-slate-500 text-sm">No skill pages available right now.</p>
            </div>
          ) : (
            Array.from(byCategory.entries()).map(([category, list]) => (
              <section key={category} className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">{category}</h2>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/skills/${s.slug}`}
                      className="group flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                    >
                      {s.name}
                      <span className="text-xs text-slate-400 group-hover:text-indigo-400">{s.total_count}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )}

          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3">About the Skills Directory</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Riseflake&apos;s skills directory maps every in-demand skill to verified job and internship openings
              posted by real, registered employers across India. Each skill page shows current openings, the
              companies actively hiring for that skill, and closely related skills — helping students and
              professionals discover relevant opportunities beyond a generic keyword search.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="/jobs" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Browse all jobs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/internships" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Browse all internships <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/companies/browse" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Companies by industry &amp; hiring <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
