import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GraduationCap, MapPin, Building2 } from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import FacetChips from '../../../components/seo/FacetChips'
import CrawlablePagination from '../../../components/seo/CrawlablePagination'
import FaqBlock from '../../../components/seo/FaqJsonLd'
import { WEBSITE_BASE_URL, hreflangAlternates } from '../../../../lib/config'
import { currentPeriod } from '../../../../lib/period'
import {
  fetchCollegeDirectory,
  fetchCollegeLanding,
  collegeHeadline,
  collegeTitle,
  collegeDescription,
  collegeFaqs,
  type CollegeItem,
  type CollegeLanding,
} from '../../../../lib/collegeBrowse'

export const dynamicParams = true
export const revalidate = 21600

type Props = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
}

const HUB = `${WEBSITE_BASE_URL}/colleges/browse`
const MAX_INDEXED_PAGE = 20

function parsePage(sp: Record<string, string | string[] | undefined>): number {
  const raw = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const n = parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? Math.min(n, 100) : 1
}

export async function generateStaticParams() {
  const dir = await fetchCollegeDirectory()
  if (!dir) return []
  const slugs = [...dir.types, ...dir.states, ...dir.cities.slice(0, 60), ...dir.combos.slice(0, 40)]
    .map((t) => t.slug)
    .filter(Boolean)
    .slice(0, 120)
  return slugs.map((s) => ({ slug: [s] }))
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug: slugArr = [] } = await params
  if (slugArr.length === 0) {
    const { year } = currentPeriod()
    // root layout applies the `%s | Riseflake` template — no explicit suffix
    const title = `Browse Colleges in India ${year} — By State, City & Type`
    const description = `Explore India's colleges by state, city and institution type — engineering, medical, management, law, arts & science. Verified from the AISHE directory on Riseflake.`
    return {
      title,
      description,
      alternates: { canonical: HUB, ...hreflangAlternates(HUB) },
      openGraph: { title: `${title} | Riseflake`, description, url: HUB, siteName: 'Riseflake', type: 'website' },
      robots: { index: true, follow: true },
    }
  }
  if (slugArr.length > 1) return { title: 'Colleges | Riseflake', robots: { index: false, follow: false } }

  const slug = slugArr[0]
  const page = parsePage(await searchParams)
  const landing = await fetchCollegeLanding(slug, page)
  if (!landing || landing === 'retry') {
    return { title: 'Colleges | Riseflake', robots: { index: false, follow: false } }
  }

  const cleanUrl = `${HUB}/${slug}`
  const canonical = page > 1 ? `${cleanUrl}?page=${page}` : cleanUrl
  const title = collegeTitle(landing, page)
  const description = collegeDescription(landing)
  const indexable = landing.count >= 5 && page <= MAX_INDEXED_PAGE

  return {
    title,
    description,
    alternates: { canonical, ...hreflangAlternates(canonical) },
    openGraph: { title: `${title} | Riseflake`, description, url: canonical, siteName: 'Riseflake', type: 'website' },
    twitter: { card: 'summary', title: `${title} | Riseflake`, description },
    robots: { index: indexable, follow: true },
  }
}

// ── college card ──────────────────────────────────────────────────────────
function CollegeCard({ c }: { c: CollegeItem }) {
  return (
    <Link
      href={`/colleges/${c.slug}`}
      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        {c.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.logo} alt="" className="h-full w-full object-contain" loading="lazy" />
        ) : (
          <GraduationCap className="h-5 w-5 text-slate-400" />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-indigo-700">{c.name}</h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
          {c.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {c.city}{c.state ? `, ${c.state}` : ''}
            </span>
          )}
          {c.college_type && <span>{c.college_type}</span>}
          {c.established && <span>Est. {c.established}</span>}
        </p>
        {c.university_name && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <Building2 className="h-3 w-3" />
            {c.university_name}
          </p>
        )}
      </div>
    </Link>
  )
}

// ── hub ───────────────────────────────────────────────────────────────────
async function Hub() {
  const dir = await fetchCollegeDirectory()
  if (!dir) notFound()
  const { year } = currentPeriod()

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Colleges', item: `${WEBSITE_BASE_URL}/colleges` },
      { '@type': 'ListItem', position: 3, name: 'Browse', item: HUB },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Navbar bgTransparent />
      <main className="min-h-screen bg-slate-100 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <nav aria-label="Breadcrumb" className="pt-4 text-xs text-slate-500">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <span className="mx-1.5">/</span>
            <a href="/colleges" className="hover:text-indigo-600">Colleges</a>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700">Browse</span>
          </nav>
          <header className="py-6">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Browse Colleges in India {year}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Explore India&apos;s colleges by state, city and institution type — engineering, medical,
              management, law, arts &amp; science. Sourced from the AISHE college directory.
            </p>
          </header>

          <FacetChips title="By institution type" chips={dir.types} hrefBase="/colleges/browse" />
          <FacetChips title="By state" chips={dir.states} hrefBase="/colleges/browse" />
          <FacetChips title="By city" chips={dir.cities} hrefBase="/colleges/browse" seeAllHref="/colleges" />
          <FacetChips title="Popular combinations" chips={dir.combos.slice(0, 30)} hrefBase="/colleges/browse" />
        </div>
      </main>
      <Footer />
    </>
  )
}

// ── facet landing ─────────────────────────────────────────────────────────
async function Facet({ slug, page }: { slug: string; page: number }) {
  const landing = await fetchCollegeLanding(slug, page)
  if (landing === null) notFound()
  if (landing === 'retry') {
    return (
      <>
        <Navbar bgTransparent />
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-600">This page is loading. Please refresh in a moment.</p>
            <a href="/colleges/browse" className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline">
              Browse all colleges
            </a>
          </div>
        </main>
      </>
    )
  }

  const l: CollegeLanding = landing
  if (!l.result || (l.result.length === 0 && page > 1)) notFound()

  const h1 = collegeHeadline(l)
  const cleanUrl = `${HUB}/${slug}`
  const canonical = page > 1 ? `${cleanUrl}?page=${page}` : cleanUrl
  const faqs = collegeFaqs(l)

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Colleges', item: `${WEBSITE_BASE_URL}/colleges` },
      { '@type': 'ListItem', position: 3, name: 'Browse', item: HUB },
      { '@type': 'ListItem', position: 4, name: h1, item: cleanUrl },
    ],
  }
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: h1,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'Riseflake', url: WEBSITE_BASE_URL },
    ...(l.result.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: l.count,
            itemListElement: l.result.slice(0, 25).map((c, i) => ({
              '@type': 'ListItem',
              position: (page - 1) * l.limit + i + 1,
              url: `${WEBSITE_BASE_URL}/colleges/${c.slug}`,
              name: c.name,
            })),
          },
        }
      : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <Navbar bgTransparent />
      <main className="min-h-screen bg-slate-100 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <nav aria-label="Breadcrumb" className="pt-4 text-xs text-slate-500">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <span className="mx-1.5">/</span>
            <a href="/colleges" className="hover:text-indigo-600">Colleges</a>
            <span className="mx-1.5">/</span>
            <a href="/colleges/browse" className="hover:text-indigo-600">Browse</a>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700">{h1}</span>
          </nav>

          <header className="py-6">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{h1}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {l.count.toLocaleString('en-IN')} colleges. Each entry shows the affiliating university,
              institution type and year of establishment — open a college for its full profile.
            </p>
          </header>

          {l.result.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-600">
              No colleges listed here yet. <a href="/colleges/browse" className="text-indigo-600 hover:underline">Browse other categories</a>.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {l.result.map((c) => <CollegeCard key={c.id} c={c} />)}
            </div>
          )}

          <CrawlablePagination basePath={cleanUrl} currentPage={page} totalPages={l.totalPages} />

          {l.related.in_state.length > 0 && (
            <FacetChips title={`More in ${l.labels.place ?? 'this area'}`} chips={l.related.in_state} hrefBase="/colleges/browse" />
          )}
          <FacetChips title="Colleges by type" chips={l.related.top_types} hrefBase="/colleges/browse" />
          <FacetChips title="Colleges by state" chips={l.related.top_states} hrefBase="/colleges/browse" />
          <FacetChips title="Colleges by city" chips={l.related.top_cities} hrefBase="/colleges/browse" />

          <FaqBlock faqs={faqs} />

          <footer className="mt-10 rounded-2xl px-6 py-4 text-center text-xs text-slate-500">
            <a href="/colleges/browse" className="text-indigo-600 hover:underline">Browse all colleges by state, city &amp; type</a>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default async function CollegesBrowsePage({ params, searchParams }: Props) {
  const { slug: slugArr = [] } = await params
  if (slugArr.length === 0) return <Hub />
  if (slugArr.length > 1) notFound()
  return <Facet slug={slugArr[0]} page={parsePage(await searchParams)} />
}
