import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Building2, ArrowRight, Wifi } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { API_BASE_URL, WEBSITE_BASE_URL } from '../../../lib/config'
import { formatSalaryChip } from '../../../lib/salary'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Work from Home Internships 2025 — Remote Internships in India',
  description:
    'Find verified work from home and remote internships in India for students and freshers. Browse paid online internships in software, marketing, design, data science and more. Apply free on Riseflake.',
  alternates: { canonical: `${WEBSITE_BASE_URL}/internships/work-from-home` },
  openGraph: {
    title: 'Work from Home Internships 2025 | Riseflake',
    description: 'Browse verified remote internship opportunities for students across India. Paid work from home internships in all domains.',
    url: `${WEBSITE_BASE_URL}/internships/work-from-home`,
    siteName: 'Riseflake',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Work from Home Internships 2025 | Riseflake',
    description: 'Browse paid remote internships for Indian students on Riseflake.',
  },
  keywords:
    'work from home internships 2025, remote internships india, online internships for students, virtual internships, wfh internship, paid remote internship india, riseflake internships',
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Internships', item: `${WEBSITE_BASE_URL}/internships` },
    { '@type': 'ListItem', position: 3, name: 'Work from Home', item: `${WEBSITE_BASE_URL}/internships/work-from-home` },
  ],
}

type Internship = {
  id: number
  slug: string
  position: string
  company_name?: string | null
  company_logo?: string | null
  job_type?: string | null
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

async function fetchWFHInternships(): Promise<Internship[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/internships?workplace_type=1&limit=30`, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.result ?? []
  } catch {
    return []
  }
}

const DOMAINS = [
  { label: 'Software Development', href: '/internships/software-development' },
  { label: 'Marketing', href: '/internships/marketing' },
  { label: 'Data Science', href: '/internships/data-science' },
  { label: 'Design', href: '/internships/design' },
  { label: 'Finance', href: '/internships/finance' },
  { label: 'Content Writing', href: '/internships/content-writing' },
]

export default async function WFHInternshipsPage() {
  const internships = await fetchWFHInternships()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
              <span className="text-slate-700 font-medium">Work from Home</span>
            </nav>
            <div className="flex items-center gap-2 mb-1">
              <Wifi className="h-5 w-5 text-indigo-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Remote / Online</p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Work from Home Internships</h1>
            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-2xl">
              Browse verified remote internship opportunities for students and freshers across India. Work from anywhere — no commute, flexible hours, real experience.
            </p>

            {/* Domain quick-links */}
            <div className="mt-4 flex flex-wrap gap-2">
              {DOMAINS.map(d => (
                <Link
                  key={d.href}
                  href={d.href}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  {d.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Why WFH callout */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Home className="h-5 w-5 text-indigo-500" />, title: 'Work from anywhere', body: 'No commute. Apply from any city in India.' },
              { icon: <Wifi className="h-5 w-5 text-emerald-500" />, title: 'Flexible hours', body: 'Most remote internships offer flexible scheduling.' },
              { icon: <Building2 className="h-5 w-5 text-violet-500" />, title: 'Top companies', body: 'Startups and MNCs hiring remotely nationwide.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">{icon}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Internship grid */}
          {internships.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Wifi className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 text-sm">No remote internships available right now. Check back soon!</p>
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
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Wifi className="h-2.5 w-2.5" /> Remote
                    </span>
                    {item.categories && item.categories[0] && (
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {item.categories[0]}
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

          {internships.length > 0 && (
            <div className="mt-6 text-center">
              <Link
                href="/internships?workplace_type=1"
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium"
              >
                View all remote internships <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* SEO content */}
          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Work from Home Internships for Students — 2025</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Riseflake lists hundreds of verified remote and work-from-home internship opportunities for students and freshers across India. Whether you are pursuing B.Tech, BCA, MBA, BBA, B.Com, or any other degree, you can find online internships that fit your schedule. Remote internships in 2025 span across software development, web development, digital marketing, data science, graphic design, content writing, human resources, and more.
            </p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Most work-from-home internships on Riseflake offer a monthly stipend. Use the stipend filter on the internships page to find paid opportunities that match your expectations. All internships are posted directly by verified companies and recruiters — apply in one click with your Riseflake profile.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Link href="/internships" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                All internships <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/internships-in/remote" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Remote internships by city <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/jobs-in/remote" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                Remote full-time jobs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
