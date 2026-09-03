import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import PersonCard, { type PersonCardData } from '../people/components/PersonCard'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicProfile {
  username: string
  profile_slug: string   // canonical slug: "sapna-singh-sapn18564"
  full_name: string
  headline: string | null
  location: string | null
  current_company: string | null
  college: string | null
  updated_at: string
  profile_photo_url: string | null
}

// Rich public detail from the curated read model (public_profile_index).
// Present only for profiles that opted in + cleared the quality bar — so these
// sections are strictly additive and never regress thin/private profiles.
interface RichProfile {
  about: string | null
  skills: string[]
  current_designation: string | null
  experience_years: number | null
  experience_bucket: string | null
  purposes: number[]
  experience: {
    title: string | null
    company: string | null
    employment_type: string | null
    start_date: string | null
    end_date: string | null
    currently_working: boolean | null
    is_remote: boolean | null
  }[]
  education: {
    college: string | null
    course: string | null
    specialization: string | null
    qualification: string | null
    start_year: number | null
    end_year: number | null
  }[]
  projects: { title: string | null; summary: string | null; skills: string[] }[]
  certifications: { title: string | null; issuer: string | null; issue_date: string | null }[]
}

interface Discovery {
  similar: PersonCardData[]
  more_by_role: PersonCardData[]
  more_by_city: PersonCardData[]
  role_slug: string | null
  city_slug: string | null
  combo_slug: string | null
  role_label: string | null
  city_label: string | null
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProfile(slug: string): Promise<PublicProfile | null | 'gone'> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/users/${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    )
    if (res.status === 404) return null
    if (res.status === 410) return 'gone'
    if (!res.ok) return null
    const data = await res.json()
    return data.status ? (data.result as PublicProfile) : null
  } catch {
    return null
  }
}

async function getRichProfile(slug: string): Promise<RichProfile | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/people/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.status ? (data.result as RichProfile) : null
  } catch {
    return null
  }
}

async function getDiscovery(slug: string): Promise<Discovery | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/people/${encodeURIComponent(slug)}/similar`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data?.discovery as Discovery) ?? null
  } catch {
    return null
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fmtDate(d: string | null): string {
  if (!d) return ''
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return ''
  return `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`
}
function dateRange(start: string | null, end: string | null, ongoing?: boolean | null): string {
  const s = fmtDate(start)
  const e = ongoing ? 'Present' : fmtDate(end)
  return [s, e].filter(Boolean).join(' – ')
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfile(slug)

  if (!profile || profile === 'gone') {
    return {
      title: 'Profile not found',
      robots: { index: false, follow: false },
    }
  }

  const { full_name, headline, location, current_company, college, profile_slug, profile_photo_url } = profile

  const orgSnippet = current_company
    ? `at ${current_company}`
    : college
    ? `at ${college}`
    : ''

  const locationSnippet = location ? `, based in ${location}` : ''

  const description = (
    headline
      ? `${headline}${orgSnippet ? ` ${orgSnippet}` : ''}${locationSnippet}.`
      : `${full_name} is a professional on Riseflake${orgSnippet ? ` ${orgSnippet}` : ''}${locationSnippet}.`
  ).slice(0, 160)

  const title = `${full_name} – ${headline ?? 'Professional'}`
  // Always use the canonical (current-name) slug for metadata
  const canonicalUrl = `${WEBSITE_BASE_URL}/in/${profile_slug}`

  // Thin profiles (no headline, no company, no college) produce stub pages that
  // Google flags as low-quality and refuses to index anyway — noindex them to
  // save crawl budget and avoid "crawled — currently not indexed" warnings.
  const hasMeaningfulContent = !!(headline || current_company || college)

  return {
    title,
    description,
    keywords: [
      full_name,
      headline ?? '',
      location ?? '',
      current_company ?? '',
      college ?? '',
      `${full_name} Riseflake`,
      `${full_name} profile`,
      'professional network India',
      'Riseflake',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Riseflake',
      type: 'profile',
      images: profile_photo_url
        ? [{ url: profile_photo_url, width: 400, height: 400, alt: `${full_name} profile photo` }]
        : [{ url: `${WEBSITE_BASE_URL}/api/og`, width: 1200, height: 630 }],
    },
    twitter: {
      card: profile_photo_url ? 'summary' : 'summary_large_image',
      title,
      description,
      images: profile_photo_url ? [profile_photo_url] : [`${WEBSITE_BASE_URL}/api/og`],
    },
    // Canonical always points to the name-slug URL — even if user renamed
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    robots: {
      index: hasMeaningfulContent,
      follow: true,
      googleBot: { index: hasMeaningfulContent, follow: true },
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function UserProfilePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const profile = await getProfile(slug)

  // null = never existed (404), 'gone' = deactivated (410 upstream) — both show not-found
  if (!profile || profile === 'gone') notFound()

  const safeProfile = profile as PublicProfile

  // Additive detail + internal-link data — both optional, page still renders without them.
  const [rich, discovery] = await Promise.all([
    getRichProfile(safeProfile.profile_slug),
    getDiscovery(safeProfile.profile_slug),
  ])

  // 301/308 to the canonical name-slug URL when accessed via the bare
  // username (old format) or a stale name-slug (user renamed since).
  // A real redirect — not just a <link rel="canonical"> hint — is what
  // resolves "Duplicate without user-selected canonical" in Search Console:
  // canonical tags are only a suggestion Google may ignore when two live,
  // fully-indexable URLs both return 200 for the same content.
  if (slug !== safeProfile.profile_slug) {
    permanentRedirect(`/in/${safeProfile.profile_slug}`)
  }

  const { full_name, headline, location, current_company, college, updated_at, profile_photo_url } = safeProfile

  const displayOrg = current_company ?? college ?? null
  const appProfileUrl = `https://app.riseflake.com/network/${safeProfile.username}`
  const canonicalUrl = `${WEBSITE_BASE_URL}/in/${safeProfile.profile_slug}`

  const eduOrgs = (rich?.education ?? [])
    .map((e) => e.college)
    .filter((c): c is string => Boolean(c))
  const uniqueEduOrgs = Array.from(new Set(eduOrgs))

  // ── JSON-LD Person schema — Google rich results ───────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: full_name,
    url: canonicalUrl,
    ...(profile_photo_url ? { image: profile_photo_url } : {}),
    ...(headline ? { jobTitle: headline } : {}),
    ...(current_company
      ? { worksFor: { '@type': 'Organization', name: current_company } }
      : {}),
    ...(uniqueEduOrgs.length
      ? { alumniOf: uniqueEduOrgs.map((name) => ({ '@type': 'EducationalOrganization', name })) }
      : college && !current_company
      ? { alumniOf: { '@type': 'EducationalOrganization', name: college } }
      : {}),
    ...(location
      ? { address: { '@type': 'PostalAddress', addressLocality: location } }
      : {}),
    ...(rich?.skills?.length ? { knowsAbout: rich.skills } : {}),
    ...(rich?.current_designation
      ? { hasOccupation: { '@type': 'Occupation', name: rich.current_designation } }
      : {}),
    sameAs: [appProfileUrl],
    memberOf: { '@type': 'Organization', name: 'Riseflake', url: 'https://riseflake.com' },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'People', item: `${WEBSITE_BASE_URL}/in/people` },
      { '@type': 'ListItem', position: 3, name: full_name, item: canonicalUrl },
    ],
  }

  const lastmodFormatted = updated_at
    ? new Date(updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : null

  return (
    <>
      <Navbar bgTransparent />

      {/* Structured data — injected into <head> by Next.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <main className="min-h-screen bg-slate-50 pt-20">

        <nav aria-label="Breadcrumb" className="max-w-2xl mx-auto px-4 pt-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/in/people" className="hover:text-indigo-600">People</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">{full_name}</span>
        </nav>

        {/* ── Profile card ───────────────────────────────────────────────── */}
        <section className="max-w-2xl mx-auto px-4 pt-6 pb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Banner */}
            <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />

            <div className="px-6 pb-8">
              {/* Avatar */}
              <div className="-mt-11 mb-5">
                {profile_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile_photo_url}
                    alt={`${full_name} profile photo`}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full border-4 border-white shadow-md
                               bg-indigo-100 flex items-center justify-center
                               text-3xl font-bold text-indigo-700 select-none"
                    aria-label={`${full_name} avatar`}
                  >
                    {full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name — H1, primary keyword */}
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                {full_name}
              </h1>

              {/* Headline — H2 equivalent for SEO weight */}
              {headline && (
                <p className="mt-1 text-base text-slate-600 font-medium">{headline}</p>
              )}

              {/* Meta chips — location + org */}
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                {displayOrg && (
                  <span className="flex items-center gap-1.5">
                    {/* Building icon */}
                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6" />
                    </svg>
                    <span>{displayOrg}</span>
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5">
                    {/* Pin icon */}
                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span>{location}</span>
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="my-5 border-t border-slate-100" />

              {/* Privacy lock notice */}
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700 flex items-start gap-2.5">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <span>
                  {rich
                    ? 'Contact details, connections and messaging are available after signing in to Riseflake.'
                    : 'Skills, work experience, education, projects & connections are visible after signing in to Riseflake.'}
                </span>
              </div>

              {/* CTA buttons */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a
                  href={appProfileUrl}
                  className="inline-flex items-center justify-center rounded-xl
                             bg-indigo-600 px-6 py-3 text-sm font-semibold text-white
                             shadow hover:bg-indigo-700 active:scale-[.98] transition-all"
                >
                  View full profile
                </a>
                <a
                  href="https://app.riseflake.com/register"
                  className="inline-flex items-center justify-center rounded-xl
                             border border-slate-200 bg-white px-6 py-3
                             text-sm font-semibold text-slate-700
                             hover:bg-slate-50 active:scale-[.98] transition-all"
                >
                  Join Riseflake free
                </a>
              </div>
            </div>
          </div>

          {/* Last updated */}
          {lastmodFormatted && (
            <p className="mt-4 text-center text-xs text-slate-400">
              Profile last updated {lastmodFormatted}
            </p>
          )}
        </section>

        {/* ── Rich, crawlable detail (opted-in profiles only) ──────────────── */}
        {rich && (
          <section className="max-w-2xl mx-auto px-4 pb-4 space-y-5">
            {rich.about && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">About</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">{rich.about}</p>
              </div>
            )}

            {rich.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {rich.skills.map((s) => (
                    <Link
                      key={s}
                      href={`/in/people/${s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}
                      className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {rich.experience.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Experience</h2>
                <ul className="mt-3 space-y-4">
                  {rich.experience.map((e, i) => (
                    <li key={i} className="text-sm">
                      <p className="font-semibold text-slate-900">{e.title ?? 'Role'}</p>
                      <p className="text-slate-600">
                        {[e.company, e.employment_type].filter(Boolean).join(' · ')}
                      </p>
                      {dateRange(e.start_date, e.end_date, e.currently_working) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {dateRange(e.start_date, e.end_date, e.currently_working)}
                          {e.is_remote ? ' · Remote' : ''}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rich.education.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Education</h2>
                <ul className="mt-3 space-y-4">
                  {rich.education.map((e, i) => (
                    <li key={i} className="text-sm">
                      <p className="font-semibold text-slate-900">{e.college ?? 'Institution'}</p>
                      <p className="text-slate-600">
                        {[e.qualification, e.course, e.specialization].filter(Boolean).join(', ')}
                      </p>
                      {(e.start_year || e.end_year) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {[e.start_year, e.end_year].filter(Boolean).join(' – ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rich.projects.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Projects</h2>
                <ul className="mt-3 space-y-4">
                  {rich.projects.map((p, i) => (
                    <li key={i} className="text-sm">
                      <p className="font-semibold text-slate-900">{p.title ?? 'Project'}</p>
                      {p.summary && <p className="text-slate-600 mt-0.5">{p.summary}</p>}
                      {p.skills.length > 0 && (
                        <p className="text-xs text-slate-400 mt-1">{p.skills.join(' · ')}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rich.certifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Certifications</h2>
                <ul className="mt-3 space-y-2">
                  {rich.certifications.map((c, i) => (
                    <li key={i} className="text-sm text-slate-600">
                      <span className="font-medium text-slate-900">{c.title}</span>
                      {c.issuer ? ` — ${c.issuer}` : ''}
                      {fmtDate(c.issue_date) ? ` (${fmtDate(c.issue_date)})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* ── SEO paragraph block — crawlable text for Google ───────────────── */}
        <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
          <p className="text-sm text-slate-500 leading-relaxed">
            <strong>{full_name}</strong>
            {headline ? ` is a ${headline}` : ' is a professional'}
            {displayOrg ? ` at ${displayOrg}` : ''}
            {location ? `, based in ${location}` : ''}.{' '}
            View their complete profile — including skills, work experience, and education — on{' '}
            <Link href="https://app.riseflake.com" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
              Riseflake
            </Link>
            , India&apos;s professional network for students and early-career professionals.
          </p>
        </section>

        {/* ── Discover more — internal-link mesh ───────────────────────────── */}
        {discovery && (
          <section className="max-w-5xl mx-auto px-4 pb-20 space-y-10">
            {discovery.more_by_role.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    More {discovery.role_label ?? 'similar'} profiles
                  </h2>
                  {discovery.role_slug && (
                    <Link href={`/in/people/${discovery.role_slug}`} className="text-sm font-medium text-indigo-600 hover:underline shrink-0">
                      View all →
                    </Link>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {discovery.more_by_role.slice(0, 6).map((p) => (
                    <PersonCard key={p.slug} person={p} />
                  ))}
                </div>
              </div>
            )}

            {discovery.more_by_city.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    People in {discovery.city_label ?? 'the same city'}
                  </h2>
                  {discovery.city_slug && (
                    <Link href={`/in/people/${discovery.city_slug}`} className="text-sm font-medium text-indigo-600 hover:underline shrink-0">
                      View all →
                    </Link>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {discovery.more_by_city.slice(0, 6).map((p) => (
                    <PersonCard key={p.slug} person={p} />
                  ))}
                </div>
              </div>
            )}

            {discovery.combo_slug && discovery.role_label && discovery.city_label && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-4 text-center text-sm">
                <Link href={`/in/people/${discovery.combo_slug}`} className="font-semibold text-indigo-700 hover:underline">
                  Browse all {discovery.role_label} in {discovery.city_label} →
                </Link>
              </div>
            )}

            {discovery.similar.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900">Similar profiles</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {discovery.similar.slice(0, 6).map((p) => (
                    <PersonCard key={p.slug} person={p} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      </main>
    </>
  )
}
