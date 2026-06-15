import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { API_BASE_URL, WEBSITE_BASE_URL } from '../../../lib/config'

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

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProfile(slug: string): Promise<PublicProfile | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/users/${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    )
    if (res.status === 404) return null
    if (!res.ok) return null
    const data = await res.json()
    return data.status ? (data.result as PublicProfile) : null
  } catch {
    return null
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfile(slug)

  if (!profile) {
    return {
      title: 'Profile not found | Riseflake',
      robots: { index: false },
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

  const title = `${full_name} – ${headline ?? 'Professional'} | Riseflake`
  // Always use the canonical (current-name) slug for metadata
  const canonicalUrl = `${WEBSITE_BASE_URL}/in/${profile_slug}`

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
    alternates: { canonical: canonicalUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function UserProfilePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const profile = await getProfile(slug)

  if (!profile) notFound()

  // No redirect — any valid slug (old format, old name) renders the page.
  // The canonical tag in generateMetadata always points to profile_slug,
  // so Google consolidates to the correct URL without extra backend calls.
  const { full_name, headline, location, current_company, college, updated_at, profile_photo_url } = profile

  const displayOrg = current_company ?? college ?? null
  const appProfileUrl = `https://app.riseflake.com/network/${profile.username}`
  const canonicalUrl = `${WEBSITE_BASE_URL}/in/${profile.profile_slug}`

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
    ...(college && !current_company
      ? { alumniOf: { '@type': 'EducationalOrganization', name: college } }
      : {}),
    ...(location
      ? { address: { '@type': 'PostalAddress', addressLocality: location } }
      : {}),
    sameAs: [appProfileUrl],
    memberOf: { '@type': 'Organization', name: 'Riseflake', url: 'https://riseflake.com' },
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

      <main className="min-h-screen bg-slate-50 pt-20">

        {/* ── Profile card ───────────────────────────────────────────────── */}
        <section className="max-w-2xl mx-auto px-4 py-12">
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
                  Skills, work experience, education, projects &amp; connections are visible after
                  signing in to Riseflake.
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

      </main>
    </>
  )
}
