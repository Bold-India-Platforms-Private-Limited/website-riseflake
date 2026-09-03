import Link from 'next/link'
import { ArrowRight, Briefcase } from 'lucide-react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import SeoListingCard from './SeoListingCard'
import CrawlablePagination from './CrawlablePagination'
import FacetChips from './FacetChips'
import FacetJsonLd from './FacetJsonLd'
import FaqBlock from './FaqJsonLd'
import { WEBSITE_BASE_URL } from '../../../lib/config'
import {
  buildFacetH1, buildFacetFaq, facetPhrase, facetTrackingParams, currentMonthYear,
  INTERNSHIP_DOMAIN_SLUGS,
  type FacetKind, type FacetLabels,
} from '../../../lib/facets'
import type { DirectoryIndex, LandingResponse, Vertical } from '../../../lib/browseData'

const singular = (v: Vertical) => (v === 'internships' ? 'internship' : 'job') as 'internship' | 'job'

function Shell({ children, crumbTail }: { children: React.ReactNode; crumbTail: React.ReactNode }) {
  return (
    <>
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-16 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            {crumbTail}
          </nav>
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}

const Sep = () => <span aria-hidden="true">/</span>

// ─────────────────────────── HUB ───────────────────────────────────────────

export function BrowseHub({ vertical, directory }: { vertical: Vertical; directory: DirectoryIndex }) {
  const label = vertical === 'internships' ? 'Internships' : 'Jobs'
  const hubUrl = `${WEBSITE_BASE_URL}/${vertical}/browse`
  const hubBase = `/${vertical}/browse`

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: label, item: `${WEBSITE_BASE_URL}/${vertical}` },
      { '@type': 'ListItem', position: 3, name: 'Browse', item: hubUrl },
    ],
  }
  const faqs = [
    {
      question: `How is the Riseflake ${label.toLowerCase()} directory organised?`,
      answer: `You can browse ${label.toLowerCase()} by role, city, company, ${vertical === 'internships' ? 'stipend band' : 'salary band'}, month, workplace type${vertical === 'jobs' ? ', employment type and country' : ''}, and by role-in-city combinations. Each landing page lists verified, currently-open positions.`,
    },
    {
      question: `Is the directory kept up to date?`,
      answer: `Yes — as of ${currentMonthYear()} it reflects live inventory. Pages appear once a category has enough active openings and drop out when it doesn't, so you never land on an empty list.`,
    },
  ]

  const roleChips = directory.roles.map((r) => ({
    slug: r.slug, label: r.label.replace(/ (Internships|Jobs)$/, ''), count: r.count,
    href: vertical === 'internships' && INTERNSHIP_DOMAIN_SLUGS.has(r.slug.replace(/-internships$/, ''))
      ? `/internships/${r.slug.replace(/-internships$/, '')}` : undefined,
  }))
  const cityChips = directory.cities.map((c) => ({
    slug: c.slug, label: c.label.replace(/^(Internships|Jobs) in /, ''), count: c.count,
    href: `/${vertical}-in/${c.slug.replace(new RegExp(`^${vertical}-in-`), '')}`,
  }))

  return (
    <Shell
      crumbTail={
        <>
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <Sep />
          <Link href={`/${vertical}`} className="hover:text-indigo-600">{label}</Link>
          <Sep />
          <span className="text-slate-700 font-medium">Browse</span>
        </>
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Riseflake {label}</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Browse {label} in India</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Every way to explore verified {label.toLowerCase()} on Riseflake — by role, city, company,
          {vertical === 'internships' ? ' stipend' : ' salary'}, month and workplace type. Updated {currentMonthYear()}.
        </p>
      </div>

      <FacetChips title={`${label} by role`} chips={roleChips} hrefBase={hubBase} seeAllHref={`/${vertical}`} />
      <FacetChips title={`${label} by city`} chips={cityChips} hrefBase={hubBase} />
      <FacetChips
        title={`${label} by workplace type`}
        chips={directory.workplace_types.map((w) => ({ slug: w.slug, label: w.label, count: w.count }))}
        hrefBase={hubBase}
      />
      {vertical === 'jobs' && (
        <FacetChips
          title="Jobs by employment type"
          chips={directory.employment_types.map((e) => ({ slug: e.slug, label: e.label, count: e.count }))}
          hrefBase={hubBase}
        />
      )}
      <FacetChips
        title={vertical === 'internships' ? 'Internships by stipend' : 'Jobs by salary'}
        chips={directory.stipend_buckets.map((b) => ({ slug: b.slug, label: b.label, count: b.count }))}
        hrefBase={hubBase}
      />
      <FacetChips
        title={`${label} by company`}
        chips={directory.companies.map((c) => ({ slug: c.slug, label: c.label.replace(/^(Internships|Jobs) at /, ''), count: c.count }))}
        hrefBase={hubBase}
        seeAllHref="/companies"
      />
      <FacetChips
        title={`${label} by month`}
        chips={directory.months.map((m) => ({ slug: m.slug, label: m.label, count: m.count }))}
        hrefBase={hubBase}
      />
      {vertical === 'jobs' && (
        <FacetChips
          title="Jobs by country"
          chips={directory.countries.map((c) => ({ slug: c.slug, label: c.label, count: c.count }))}
          hrefBase={hubBase}
        />
      )}
      <FacetChips
        title="Popular role + city combinations"
        chips={directory.combos.map((c) => ({ slug: c.slug, label: c.label, count: c.count }))}
        hrefBase={hubBase}
      />

      <FaqBlock faqs={faqs} />
    </Shell>
  )
}

// ─────────────────────────── FACET LANDING ─────────────────────────────────

export function BrowseFacet({
  vertical, slug, page, landing,
}: {
  vertical: Vertical
  slug: string
  page: number
  landing: LandingResponse
}) {
  const v = singular(vertical)
  const label = vertical === 'internships' ? 'Internships' : 'Jobs'
  const kind = landing.kind as FacetKind
  const labels = (landing.labels ?? {}) as FacetLabels
  const items = landing.result ?? []
  const total = landing.total ?? landing.count ?? items.length
  const totalPages = landing.totalPages ?? 1
  const related = landing.related
  const hubBase = `/${vertical}/browse`
  const cleanPath = `${hubBase}/${slug}`
  const canonicalUrl = `${WEBSITE_BASE_URL}${cleanPath}${page > 1 ? `?page=${page}` : ''}`
  const h1 = buildFacetH1(v, kind, labels)
  const phrase = facetPhrase(v, kind, labels)
  const faqs = buildFacetFaq(v, kind, labels, landing.count)
  const tracking = facetTrackingParams(slug)

  const crumbs = [
    { name: 'Home', url: WEBSITE_BASE_URL },
    { name: label, url: `${WEBSITE_BASE_URL}/${vertical}` },
    { name: 'Browse', url: `${WEBSITE_BASE_URL}/${vertical}/browse` },
    { name: h1, url: `${WEBSITE_BASE_URL}${cleanPath}` },
  ]

  return (
    <Shell
      crumbTail={
        <>
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <Sep />
          <Link href={`/${vertical}`} className="hover:text-indigo-600">{label}</Link>
          <Sep />
          <Link href={`/${vertical}/browse`} className="hover:text-indigo-600">Browse</Link>
          <Sep />
          <span className="text-slate-700 font-medium">{h1}</span>
        </>
      }
    >
      <FacetJsonLd
        canonicalUrl={canonicalUrl}
        name={`${h1} — Riseflake`}
        description={`${total.toLocaleString('en-IN')} ${phrase} on Riseflake, updated ${currentMonthYear()}.`}
        crumbs={crumbs}
        items={items.map((it) => ({ position: it.position, slug: it.slug, company: it.company_name }))}
        totalItems={total}
        hrefBase={vertical === 'internships' ? '/internships' : '/jobs'}
      />

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {h1}
          {page > 1 && <span className="text-slate-400 font-normal"> — Page {page}</span>}
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          {total.toLocaleString('en-IN')} verified {phrase} on Riseflake, updated {currentMonthYear()}.
          {v === 'internship'
            ? ' Real companies, direct apply, stipend details where disclosed — free for students and freshers.'
            : ' Real companies, direct apply, salary details where disclosed — free to apply.'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 text-sm">No {phrase} open right now. New roles are added daily.</p>
          <Link href={`/${vertical}`} className="mt-4 inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline font-medium">
            Browse all {label.toLowerCase()} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <SeoListingCard
              key={item.slug}
              item={item}
              hrefBase={vertical === 'internships' ? '/internships' : '/jobs'}
              trackingSuffix={tracking}
            />
          ))}
        </div>
      )}

      <CrawlablePagination basePath={cleanPath} currentPage={page} totalPages={totalPages} />

      {related && (
        <>
          {related.combos.length > 0 && (
            <FacetChips
              title={labels.city ? `Other roles in ${labels.city}` : labels.role ? `${labels.role} in other cities` : 'Related searches'}
              chips={related.combos.map((c) => ({ slug: c.slug, label: c.label, count: c.count }))}
              hrefBase={hubBase}
            />
          )}
          <FacetChips
            title={`Popular ${label.toLowerCase()} by role`}
            chips={related.top_roles.map((r) => ({
              slug: r.slug, label: r.label.replace(/ (Internships|Jobs)$/, ''), count: r.count,
              href: vertical === 'internships' && INTERNSHIP_DOMAIN_SLUGS.has(r.slug.replace(/-internships$/, ''))
                ? `/internships/${r.slug.replace(/-internships$/, '')}` : undefined,
            }))}
            hrefBase={hubBase}
            seeAllHref={`/${vertical}/browse`}
          />
          <FacetChips
            title={`${label} by city`}
            chips={related.top_cities.map((c) => ({
              slug: c.slug, label: c.label.replace(/^(Internships|Jobs) in /, ''), count: c.count,
              href: `/${vertical}-in/${c.slug.replace(new RegExp(`^${vertical}-in-`), '')}`,
            }))}
            hrefBase={hubBase}
          />
          {related.top_companies.length > 0 && (
            <FacetChips
              title="Hiring companies"
              chips={related.top_companies.map((c) => ({ slug: c.slug, label: c.label.replace(/^(Internships|Jobs) at /, ''), count: c.count }))}
              hrefBase={hubBase}
            />
          )}
        </>
      )}

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-3">{h1} on Riseflake</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Riseflake is India&rsquo;s job and internship platform for students, freshers and early-career
          professionals. This page collects {phrase} from verified employers, refreshed continuously.
          Every listing shows the real hiring company and role — open any card for the full description,
          eligibility and {v === 'internship' ? 'stipend' : 'salary'}, then apply free with your Riseflake profile.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link href={`/${vertical}`} className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
            All {label.toLowerCase()} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/${vertical}/browse`} className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
            Browse all filters <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={vertical === 'internships' ? '/jobs' : '/internships'}
            className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1"
          >
            {vertical === 'internships' ? 'Full-time jobs' : 'Internships'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <FaqBlock faqs={faqs} />
    </Shell>
  )
}
