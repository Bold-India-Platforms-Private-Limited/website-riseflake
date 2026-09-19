import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { BrowseHub, BrowseFacet } from './BrowseView'
import { fetchDirectory, fetchLanding, type Vertical } from '../../../lib/browseData'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../../lib/config'
import { facetSlugs } from '../../../lib/manifest'
import {
  buildFacetTitle, buildFacetDescription, buildFacetKeywords,
  currentMonthYear, currentYear,
  type FacetKind, type FacetLabels,
} from '../../../lib/facets'

type Params = { slug?: string[] }

// Static export: only page 1 of each landing is pre-rendered (the server never sees `?page=N`);
// deeper results are reached through the interactive list — see BrowseAllCta.
const PAGE = 1

// ── generateMetadata ──────────────────────────────────────────────────────

export async function buildBrowseMetadata(
  vertical: Vertical,
  params: Params,
): Promise<Metadata> {
  const slugArr = params.slug ?? []
  const label = vertical === 'internships' ? 'Internships' : 'Jobs'

  if (slugArr.length === 0) {
    const url = `${WEBSITE_BASE_URL}/${vertical}/browse`
    const title = `Browse ${label} in India ${currentYear()} — By Role, City, Company & Salary | Riseflake`
    const description = `Explore verified ${label.toLowerCase()} on Riseflake by role, city, company, ${vertical === 'internships' ? 'stipend' : 'salary'}, month and workplace type. Updated ${currentMonthYear()}. Free to apply.`
    return {
      title, description,
      alternates: { canonical: url, ...hreflangAlternates(url) },
      openGraph: { title, description, url, siteName: 'Riseflake', type: 'website' },
      twitter: { card: 'summary', title, description },
      robots: { index: true, follow: true },
    }
  }

  if (slugArr.length > 1) return { title: `${label} | Riseflake`, robots: { index: false, follow: false } }

  const slug = slugArr[0]
  const landing = await fetchLanding(vertical, slug, PAGE)

  if (!landing || landing.status === false) {
    return { title: `${label} | Riseflake`, robots: { index: false, follow: false } }
  }
  // Redirect here (in generateMetadata, before the page body streams behind the
  // /internships loading.tsx boundary) so crawlers get a real HTTP 308.
  if (landing.redirectPath) permanentRedirect(landing.redirectPath)

  const v = vertical === 'internships' ? 'internship' : 'job'
  const kind = landing.kind as FacetKind
  const labels = (landing.labels ?? {}) as FacetLabels
  const count = landing.count ?? landing.total
  const cleanUrl = `${WEBSITE_BASE_URL}/${vertical}/browse/${slug}`
  const canonical = cleanUrl

  const title = buildFacetTitle(v, kind, labels, PAGE, count)
  const description = buildFacetDescription(v, kind, labels, count)
  const indexable = (count ?? 0) >= 3

  return {
    title,
    description,
    keywords: buildFacetKeywords(v, kind, labels),
    alternates: { canonical, ...hreflangAlternates(canonical) },
    openGraph: { title, description, url: canonical, siteName: 'Riseflake', type: 'website' },
    twitter: { card: 'summary', title, description },
    robots: { index: indexable, follow: true },
  }
}

// ── page body ─────────────────────────────────────────────────────────────

export async function renderBrowsePage(
  vertical: Vertical,
  params: Params,
) {
  const slugArr = params.slug ?? []

  if (slugArr.length === 0) {
    const directory = await fetchDirectory(vertical)
    if (!directory || directory.status === false) notFound()
    return <BrowseHub vertical={vertical} directory={directory} />
  }
  if (slugArr.length > 1) notFound()

  const slug = slugArr[0]
  const landing = await fetchLanding(vertical, slug, PAGE)

  if (!landing || landing.status === false) notFound()
  if (landing.redirectPath) permanentRedirect(landing.redirectPath)
  if (!landing.result) notFound()

  return <BrowseFacet vertical={vertical} slug={slug} page={PAGE} landing={landing} />
}

// ── generateStaticParams — the manifest's facet landings (+ the hub) ─────

export function browseStaticParams(vertical: Vertical): { slug: string[] }[] {
  return [{ slug: [] }, ...facetSlugs(vertical).map((s) => ({ slug: [s] }))]
}
