import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates, OG_FALLBACK_IMAGE } from '../../../lib/config'
import ProfileView, { type PublicProfile, type RichProfile, type Discovery } from './ProfileView'
import { profileSlugs } from '../../../lib/manifest'

// Static export: only the slugs in the build manifest exist (see src/lib/manifest.ts).
export const dynamicParams = false

export async function generateStaticParams() {
  return profileSlugs().map((slug) => ({ slug }))
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
        : [{ url: OG_FALLBACK_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: profile_photo_url ? 'summary' : 'summary_large_image',
      title,
      description,
      images: profile_photo_url ? [profile_photo_url] : [OG_FALLBACK_IMAGE],
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

  return <ProfileView profile={safeProfile} rich={rich} discovery={discovery} />
}
