import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CollegeDetailClient from './CollegeDetailClient'
import { API_BASE_URL, WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'

export const revalidate = 3600
export const dynamicParams = true

type PageProps = {
  params: Promise<{ slug: string }>
}

interface CollegeDetail {
  college_name: string
  college_logo?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  slug: string
  university_type?: string | null
  affiliated_university?: string | null
  website?: string | null
  college_type?: string | null
  management_type?: number | string | null
  ownership_type?: number | string | null
  location_category?: number | string | null
}

async function fetchCollege(slug: string): Promise<CollegeDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/colleges/${slug}`, {
      next: { revalidate: 3600 },
    })
    if (res.status === 404) return null
    if (!res.ok) {
      console.error(`[colleges] fetch failed for "${slug}": HTTP ${res.status}`)
      return null
    }
    const json = await res.json()
    return json.result ?? null
  } catch (err) {
    console.error(`[colleges] fetch error for "${slug}":`, err)
    return null
  }
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const college = await fetchCollege(slug)

  if (!college) {
    return {
      title: 'College Not Found',
      description: 'This college profile could not be found on Riseflake.',
      robots: { index: false, follow: false },
    }
  }

  const { college_name, city, state, country, university_type } = college

  const locationParts = [city, state, country].filter(Boolean)
  const locationStr = locationParts.join(', ')

  const title = `${college_name} — Jobs, Internships & Placements`
  const description = [
    `Explore ${college_name} on Riseflake.`,
    locationStr ? `Located in ${locationStr}.` : '',
    university_type ? `${university_type}.` : '',
    'View job openings, internships, alumni network and placement opportunities.',
  ].filter(Boolean).join(' ').slice(0, 160)

  const ogImageUrl =
    `${WEBSITE_BASE_URL}/api/og?type=college` +
    `&company=${encodeURIComponent(college_name)}` +
    `&logo=${encodeURIComponent(college.college_logo ?? '')}` +
    (locationStr ? `&subtitle=${encodeURIComponent(locationStr)}` : '')

  const canonicalUrl = `${WEBSITE_BASE_URL}/colleges/${slug}`

  return {
    title,
    description,
    keywords: [
      `${college_name} jobs`,
      `${college_name} internships`,
      `${college_name} placements`,
      `${college_name} alumni`,
      locationStr,
      university_type ?? '',
      'college placements india',
      'riseflake colleges',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Riseflake',
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${college_name} on Riseflake` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: { canonical: canonicalUrl, ...hreflangAlternates(canonicalUrl) },
    robots: { index: true, follow: true },
  }
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params
  const college = await fetchCollege(slug)

  if (!college) notFound()

  const canonicalUrl = `${WEBSITE_BASE_URL}/colleges/${slug}`
  const locationParts = [college.city, college.state, college.country].filter(Boolean)
  const locationStr = locationParts.join(', ')

  // JSON-LD: CollegeOrUniversity schema — helps Google understand and rich-display the page
  const collegeSchema = {
    '@context': 'https://schema.org/',
    '@type': 'CollegeOrUniversity',
    name: college.college_name,
    url: canonicalUrl,
    ...(college.college_logo ? { logo: college.college_logo } : {}),
    ...(locationStr
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(college.city ? { addressLocality: college.city } : {}),
            ...(college.state ? { addressRegion: college.state } : {}),
            ...(college.country ? { addressCountry: college.country } : {}),
          },
        }
      : {}),
    ...(college.website ? { sameAs: [college.website] } : {}),
    description: `${college.college_name} on Riseflake — view job openings, internships, and alumni.`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Colleges', item: `${WEBSITE_BASE_URL}/colleges` },
      { '@type': 'ListItem', position: 3, name: college.college_name, item: canonicalUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CollegeDetailClient college={college} />
    </>
  )
}
