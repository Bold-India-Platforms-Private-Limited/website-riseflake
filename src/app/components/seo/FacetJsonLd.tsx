import { WEBSITE_BASE_URL } from '../../../lib/config'

type Crumb = { name: string; url: string }
type ListItem = { position: string; slug: string; company?: string | null }

/**
 * BreadcrumbList + CollectionPage(ItemList) JSON-LD for a faceted listing page.
 * ListItem references the detail page URL only — the detail page carries the
 * validated JobPosting, which Google / LinkedIn / Gemini follow.
 */
export default function FacetJsonLd({
  canonicalUrl,
  name,
  description,
  crumbs,
  items,
  totalItems,
  hrefBase,
}: {
  canonicalUrl: string
  name: string
  description: string
  crumbs: Crumb[]
  items: ListItem[]
  totalItems: number
  hrefBase: '/internships' | '/jobs'
}) {
  const now = new Date().toISOString()

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }

  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: canonicalUrl,
    datePublished: now,
    dateModified: now,
    isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: WEBSITE_BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalItems,
      itemListElement: items.slice(0, 25).map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${WEBSITE_BASE_URL}${hrefBase}/${it.slug}`,
        name: it.company ? `${it.position} at ${it.company}` : it.position,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
    </>
  )
}
