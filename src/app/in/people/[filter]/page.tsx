import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Navbar from '../../../components/Navbar'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates } from '../../../../lib/config'
import PeopleClient, { type Facets, type LockedFilter } from '../PeopleClient'
import type { PersonCardData } from '../components/PersonCard'

export const revalidate = 3600
export const dynamicParams = true

type ComboTarget = { slug: string; role_slug: string; city_slug: string; label: string; count: number }
type Target = { slug: string; label: string; count: number }

type Landing = {
  status: boolean
  kind: 'role' | 'city' | 'combo' | 'skill'
  slug: string
  role_label: string | null
  city_label: string | null
  skill_label: string | null
  count: number
  result: PersonCardData[]
  next_cursor: string | null
  related: {
    roles_in_city: ComboTarget[]
    cities_for_role: ComboTarget[]
    top_roles: Target[]
    top_cities: Target[]
    top_skills: Target[]
  }
}

const titleCase = (s: string) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const EMPTY_FACETS: Facets = {
  cities: [], states: [], roles: [], skills: [],
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

// Returns:
//   Landing   → render the page
//   null      → genuine 404 (backend: this filter has no landing page)
//   'retry'   → transient failure (429 / 5xx / network / timeout). The caller
//               must NOT turn this into notFound() — a brief backend blip must
//               never be baked into a permanent 404 that de-indexes a real
//               landing page.
async function getLanding(filter: string): Promise<Landing | null | 'retry'> {
  try {
    const res = await fetch(`${API_BASE_URL}/people/directory/${encodeURIComponent(filter)}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })
    if (res.status === 404) return null
    if (res.status === 429 || res.status >= 500) return 'retry'
    if (!res.ok) return null
    const json = await res.json()
    if (json?.status) return json as Landing
    if (typeof json?.message === 'string' && /not\s*found|no such/i.test(json.message)) return null
    return 'retry'
  } catch {
    return 'retry'
  }
}

async function getFacets(): Promise<Facets> {
  try {
    const res = await fetch(`${API_BASE_URL}/people/facets`)
    if (!res.ok) return EMPTY_FACETS
    const json = await res.json()
    return json?.result ? { ...EMPTY_FACETS, ...json.result } : EMPTY_FACETS
  } catch {
    return EMPTY_FACETS
  }
}

export async function generateStaticParams() {
  // Pre-render only the highest-value landing pages — the rest render on demand
  // (dynamicParams=true) and get picked up by ISR. Kept well under the backend's
  // per-IP rate limit so a build burst doesn't 429 itself.
  try {
    const res = await fetch(`${API_BASE_URL}/people-directory-sitemap.xml`, {
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    const xml = await res.text()
    const slugs = Array.from(xml.matchAll(/\/in\/people\/([^<]+)</g))
      .map((m) => m[1])
      .filter((s) => s && s !== 'people')
    return slugs.slice(0, 36).map((filter) => ({ filter }))
  } catch {
    return []
  }
}

function headline(l: Pick<Landing, 'kind' | 'role_label' | 'city_label' | 'skill_label'>) {
  const role = l.role_label ? titleCase(l.role_label) : null
  const city = l.city_label ? titleCase(l.city_label) : null
  const skill = l.skill_label ?? null
  if (l.kind === 'combo' && role && city) return `${role}s in ${city}`
  if (l.kind === 'city' && city) return `Professionals & Candidates in ${city}`
  if (l.kind === 'role' && role) return `${role} Profiles & Candidates in India`
  if (l.kind === 'skill' && skill) return `${skill} Professionals & Candidates in India`
  return 'Professionals & Candidates'
}

export async function generateMetadata(
  { params }: { params: Promise<{ filter: string }> }
): Promise<Metadata> {
  const { filter } = await params
  const landing = await getLanding(filter).catch(() => null)
  // 404 or transient failure → safe noindex metadata; never crash metadata gen.
  if (!landing || landing === 'retry') {
    return { title: 'People | Riseflake', robots: { index: false, follow: false } }
  }

  const h1 = headline(landing)
  const canonical = `${WEBSITE_BASE_URL}/in/people/${filter}`
  const role = landing.role_label ? titleCase(landing.role_label) : ''
  const city = landing.city_label ? titleCase(landing.city_label) : ''

  const skill = landing.skill_label ?? ''
  const description =
    landing.kind === 'combo'
      ? `Find ${role}s in ${city} — ${landing.count}+ public profiles of professionals, freshers and job candidates. Explore skills, experience and education on Riseflake.`
      : landing.kind === 'city'
      ? `Find professionals, freshers and job candidates in ${city}. Browse ${landing.count}+ public Riseflake profiles by role, skills, education and experience.`
      : landing.kind === 'skill'
      ? `Find candidates skilled in ${skill}. Browse ${landing.count}+ public Riseflake profiles of professionals and freshers by location, role and experience.`
      : `Find ${role} professionals and candidates across India. Browse ${landing.count}+ public Riseflake profiles by location, skills, education and experience.`

  const shouldIndex = landing.count >= 5

  return {
    // Root layout applies the `%s | Riseflake` template to this string.
    title: h1,
    description,
    keywords: [
      role && city ? `${role.toLowerCase()} in ${city.toLowerCase()}` : '',
      role ? `${role.toLowerCase()} candidates` : '',
      city ? `professionals in ${city.toLowerCase()}` : '',
      city ? `freshers in ${city.toLowerCase()}` : '',
      'riseflake people',
    ].filter(Boolean),
    alternates: { canonical, ...hreflangAlternates(canonical) },
    openGraph: {
      title: `${h1} | Riseflake`,
      description,
      url: canonical,
      siteName: 'Riseflake',
      type: 'website',
      locale: 'en_IN',
      images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: `${h1} | Riseflake`, description },
    robots: { index: shouldIndex, follow: true },
  }
}

const Chip = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
  >
    {children}
  </a>
)

export default async function PeopleLandingPage(
  { params }: { params: Promise<{ filter: string }> }
) {
  const { filter } = await params
  const [landing, facets] = await Promise.all([getLanding(filter), getFacets()])
  if (landing === null) notFound()
  // Transient backend failure — render a 200 "loading" shell (noindex, not a
  // 404) so the URL stays indexed and self-heals on the next revalidation.
  if (landing === 'retry') {
    return (
      <>
        <Navbar bgTransparent />
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-600">This page is loading. Please refresh in a moment.</p>
            <a href="/in/people" className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline">
              Browse the people directory
            </a>
          </div>
        </main>
      </>
    )
  }

  const h1 = headline(landing)
  const canonical = `${WEBSITE_BASE_URL}/in/people/${filter}`
  const role = landing.role_label ? titleCase(landing.role_label) : ''
  const city = landing.city_label ? titleCase(landing.city_label) : ''

  const skill = landing.skill_label ?? ''
  const lockedFilter: LockedFilter =
    landing.kind === 'city' ? 'location' : landing.kind === 'skill' ? 'skill' : 'role'
  const initialFilters = {
    role: landing.role_label ?? '',
    location: landing.city_label ?? '',
    skill: landing.skill_label ?? '',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'People', item: `${WEBSITE_BASE_URL}/in/people` },
      { '@type': 'ListItem', position: 3, name: h1, item: canonical },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: h1,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: WEBSITE_BASE_URL },
    ...(landing.result.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: landing.count,
            itemListElement: landing.result.slice(0, 24).map((p, i) => ({
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-100 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <nav aria-label="Breadcrumb" className="pt-4 text-xs text-slate-500">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <span className="mx-1.5">/</span>
            <a href="/in/people" className="hover:text-indigo-600">People</a>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700">{h1}</span>
          </nav>

          <header className="py-6">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{h1}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {landing.kind === 'combo' && (
                <>Browse {landing.count}+ public profiles of {role.toLowerCase()}s in {city}. Filter by
                experience, profile type and skills, or open a profile to see full skills, work
                experience and education on Riseflake.</>
              )}
              {landing.kind === 'city' && (
                <>Browse {landing.count}+ public profiles of professionals, freshers and job candidates
                in {city}. Filter by role, experience and skills to find the right people on Riseflake.</>
              )}
              {landing.kind === 'role' && (
                <>Browse {landing.count}+ public profiles of {role.toLowerCase()}s across India. Filter by
                city, experience and skills, or open a profile for full details on Riseflake.</>
              )}
              {landing.kind === 'skill' && (
                <>Browse {landing.count}+ public profiles of candidates skilled in {skill} across India.
                Filter by city, role and experience, or open a profile for full details on Riseflake.</>
              )}
            </p>
          </header>

          <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">Loading profiles…</div>}>
            <PeopleClient
              initialItems={landing.result}
              initialCursor={landing.next_cursor}
              facets={facets}
              initialFilters={initialFilters}
              lockedFilter={lockedFilter}
              syncUrl={false}
            />
          </Suspense>

          {/* Internal links — the SEO mesh */}
          {landing.related.roles_in_city.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-semibold text-slate-900">Other roles in {city}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {landing.related.roles_in_city.map((c) => (
                  <Chip key={c.slug} href={`/in/people/${c.slug}`}>{c.label} ({c.count})</Chip>
                ))}
              </div>
            </section>
          )}

          {landing.related.cities_for_role.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold text-slate-900">{role} in other cities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {landing.related.cities_for_role.map((c) => (
                  <Chip key={c.slug} href={`/in/people/${c.slug}`}>{c.label} ({c.count})</Chip>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-sm font-semibold text-slate-900">Popular roles</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {landing.related.top_roles.map((r) => (
                <Chip key={r.slug} href={`/in/people/${r.slug}`}>{r.label}</Chip>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-semibold text-slate-900">Popular cities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {landing.related.top_cities.map((c) => (
                <Chip key={c.slug} href={`/in/people/${c.slug}`}>{titleCase(c.label)}</Chip>
              ))}
            </div>
          </section>

          {landing.related.top_skills?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold text-slate-900">Popular skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {landing.related.top_skills.map((s) => (
                  <Chip key={s.slug} href={`/in/people/${s.slug}`}>{titleCase(s.label)}</Chip>
                ))}
              </div>
            </section>
          )}

          <footer className="mt-10 rounded-2xl px-6 py-4 text-center text-xs text-slate-500">
            <p>
              Only public profiles of consenting members are listed.{' '}
              <a href="/in/people" className="text-indigo-600 hover:underline">Browse the full people directory</a>.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
