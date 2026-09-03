import Link from 'next/link'
import { API_BASE_URL } from '../../../../lib/config'

type Item = {
  slug: string
  position: string
  company_name?: string | null
  company_logo?: string | null
  location_name?: string | null
  workplace_type?: number | null
}

const workplaceLabel = (v?: number | null) =>
  v === 1 ? 'Remote' : v === 2 ? 'Hybrid' : v === 3 ? 'On-site' : null

/**
 * "Other similar …" sidebar card on job / internship detail pages.
 * Server-rendered from the public listing API (category match), so it's part of
 * the crawlable HTML and adds internal links between related detail pages.
 */
export default async function SimilarListings({
  slug,
  categories,
  isInternship = false,
}: {
  slug: string
  categories?: string[] | null
  isInternship?: boolean
}) {
  const base = isInternship ? 'internships' : 'jobs'
  const heading = isInternship ? 'Other similar internships' : 'Other similar roles'
  const cat = (categories ?? []).filter(Boolean)[0]

  let items: Item[] = []
  try {
    const qs = new URLSearchParams({ limit: '7' })
    if (cat) qs.set('categories', cat)
    const res = await fetch(`${API_BASE_URL}/${base}?${qs.toString()}`, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) {
      const json = await res.json()
      items = (json.result ?? []).filter((j: Item) => j.slug !== slug).slice(0, 5)
    }
  } catch {
    /* sidebar card is non-critical — render nothing on failure */
  }

  if (items.length === 0) return null

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">{heading}</h2>
      <ul className="mt-3 divide-y divide-slate-100">
        {items.map((j) => {
          const wp = workplaceLabel(j.workplace_type)
          const loc = j.location_name ?? (j.workplace_type === 1 ? 'Remote' : null)
          return (
            <li key={j.slug} className="py-2.5 first:pt-0 last:pb-0">
              <Link href={`/${base}/${j.slug}`} className="group flex items-start gap-3">
                {j.company_logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={j.company_logo}
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                    className="mt-0.5 h-8 w-8 shrink-0 rounded-md border border-slate-200 object-contain"
                  />
                ) : (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">
                    {(j.company_name ?? '?').charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-800 group-hover:text-indigo-600">
                    {j.position}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {[j.company_name, loc, wp].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link
        href={cat ? `/${base}?categories=${encodeURIComponent(cat)}` : `/${base}`}
        className="mt-3 inline-block text-xs font-medium text-indigo-600 hover:underline"
      >
        View all {isInternship ? 'internships' : 'jobs'} →
      </Link>
    </section>
  )
}
