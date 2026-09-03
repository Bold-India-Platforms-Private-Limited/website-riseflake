import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '../../components/Navbar'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import PeopleClient, { type Facets } from './PeopleClient'
import type { PersonCardData } from './components/PersonCard'

// Rebuild hourly — the backend read model refreshes on the same cadence.
export const revalidate = 3600

const CANONICAL = `${WEBSITE_BASE_URL}/in/people`

const EMPTY_FACETS: Facets = {
  cities: [],
  states: [],
  roles: [],
  skills: [],
  types: [
    { value: 'professional', label: 'Professional' },
    { value: 'fresher', label: 'Fresher' },
    { value: 'college-student', label: 'College Student' },
  ],
  experience: [
    { value: 'fresher', label: 'Fresher' },
    { value: '0-1', label: '0–1 years' },
    { value: '1-3', label: '1–3 years' },
    { value: '3-5', label: '3–5 years' },
    { value: '5+', label: '5+ years' },
  ],
}

export const metadata: Metadata = {
  title: 'Professionals & Candidates in India',
  description:
    'Find professionals, students, freshers and job candidates across India. Explore public Riseflake profiles by location, role, skills, education and experience.',
  keywords: [
    'professionals in india',
    'job candidates india',
    'find candidates india',
    'software engineers india',
    'data analysts india',
    'fresher profiles india',
    'college student profiles',
    'riseflake people',
    'professional directory india',
  ],
  openGraph: {
    locale: 'en_IN',
    type: 'website',
    url: CANONICAL,
    siteName: 'Riseflake',
    title: 'Professionals & Candidates in India | Riseflake',
    description:
      'Explore public professional and candidate profiles across India — by location, role, skills, education and experience.',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professionals & Candidates in India | Riseflake',
    description:
      'Explore public professional and candidate profiles across India on Riseflake.',
  },
  alternates: { canonical: CANONICAL, ...hreflangAlternates(CANONICAL) },
  robots: { index: true, follow: true },
}

type DirTarget = { slug: string; label: string; count: number }
type DirCombo = DirTarget & { role_slug: string; city_slug: string }
type DirIndex = { roles: DirTarget[]; cities: DirTarget[]; combos: DirCombo[]; skills: DirTarget[] }

const EMPTY_DIR: DirIndex = { roles: [], cities: [], combos: [], skills: [] }

async function getDirectoryIndex(): Promise<DirIndex> {
  try {
    const res = await fetch(`${API_BASE_URL}/people/directory`)
    if (!res.ok) return EMPTY_DIR
    const json = await res.json()
    return json?.status ? { ...EMPTY_DIR, ...json } : EMPTY_DIR
  } catch {
    return EMPTY_DIR
  }
}

const cityCase = (s: string) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

async function getInitialData(): Promise<{
  items: PersonCardData[]
  cursor: string | null
  facets: Facets
}> {
  // No per-fetch cache opts — these inherit the route's `revalidate = 3600`
  // so the page is ISR-cached as a unit.
  const [listRes, facetRes] = await Promise.allSettled([
    fetch(`${API_BASE_URL}/people?limit=24`),
    fetch(`${API_BASE_URL}/people/facets`),
  ])

  let items: PersonCardData[] = []
  let cursor: string | null = null
  let facets: Facets = EMPTY_FACETS

  if (listRes.status === 'fulfilled' && listRes.value.ok) {
    const json = await listRes.value.json()
    items = json.result ?? []
    cursor = json.next_cursor ?? null
  } else {
    console.error('[people] list fetch failed:', listRes.status === 'rejected' ? listRes.reason : listRes.value.status)
  }
  if (facetRes.status === 'fulfilled' && facetRes.value.ok) {
    const json = await facetRes.value.json()
    if (json.result) facets = { ...EMPTY_FACETS, ...json.result }
  } else {
    console.error('[people] facet fetch failed:', facetRes.status === 'rejected' ? facetRes.reason : facetRes.value.status)
  }

  return { items, cursor, facets }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'People', item: CANONICAL },
  ],
}

export default async function PeopleDirectoryPage() {
  const [{ items, cursor, facets }, dir] = await Promise.all([getInitialData(), getDirectoryIndex()])

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Professionals & Candidates in India',
    description:
      'Public professional and candidate profiles across India on Riseflake.',
    url: CANONICAL,
    isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: WEBSITE_BASE_URL },
    ...(items.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: items.slice(0, 24).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${WEBSITE_BASE_URL}/in/${p.slug}`,
              name: p.name,
            })),
          },
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-100 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <nav aria-label="Breadcrumb" className="pt-4 text-xs text-slate-500">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700">People</span>
          </nav>

          <header className="py-6">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Professionals &amp; Candidates in India
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Find professionals, students, freshers and job candidates across India.
              Explore public Riseflake profiles by location, role, skills, education and
              experience.
            </p>
          </header>

          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                Loading profiles…
              </div>
            }
          >
            <PeopleClient initialItems={items} initialCursor={cursor} facets={facets} />
          </Suspense>

          {/* Browse-by internal links — crawl entry points into the landing pages */}
          {dir.combos.length > 0 && (
            <section className="mt-12">
              <h2 className="text-base font-semibold text-slate-900">Popular searches</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {dir.combos.map((c) => (
                  <a
                    key={c.slug}
                    href={`/in/people/${c.slug}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  >
                    {c.label} ({c.count})
                  </a>
                ))}
              </div>
            </section>
          )}

          {dir.roles.length > 0 && (
            <section className="mt-8">
              <h2 className="text-base font-semibold text-slate-900">Browse candidates by role</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {dir.roles.map((r) => (
                  <a
                    key={r.slug}
                    href={`/in/people/${r.slug}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  >
                    {r.label} ({r.count})
                  </a>
                ))}
              </div>
            </section>
          )}

          {dir.cities.length > 0 && (
            <section className="mt-8">
              <h2 className="text-base font-semibold text-slate-900">Browse candidates by city</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {dir.cities.map((c) => (
                  <a
                    key={c.slug}
                    href={`/in/people/${c.slug}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  >
                    {cityCase(c.label)} ({c.count})
                  </a>
                ))}
              </div>
            </section>
          )}

          {dir.skills.length > 0 && (
            <section className="mt-8">
              <h2 className="text-base font-semibold text-slate-900">Browse candidates by skill</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {dir.skills.map((s) => (
                  <a
                    key={s.slug}
                    href={`/in/people/${s.slug}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  >
                    {cityCase(s.label)} ({s.count})
                  </a>
                ))}
              </div>
            </section>
          )}

          <footer className="mt-10 rounded-2xl px-6 py-4 text-center text-xs text-slate-500">
            <p>
              Only public profiles of consenting members are listed. Sign in to Riseflake
              to connect, message, and see full professional details.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
