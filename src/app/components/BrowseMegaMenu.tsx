import Link from 'next/link'
import { CITIES, CURATED_ROLES, INTERNSHIP_DOMAIN_SLUGS, titleCaseSlug } from '../../lib/facets'

/**
 * Hover mega-menu under the Jobs / Internships nav items — surfaces the faceted
 * discovery pages from every page for internal linking. Pure CSS `group-hover`
 * (matches the existing "More" dropdown), no client state.
 */
export default function BrowseMegaMenu({ vertical }: { vertical: 'jobs' | 'internships' }) {
  const isInt = vertical === 'internships'
  const label = isInt ? 'Internships' : 'Jobs'
  const hub = `/${vertical}/browse`
  const cities = CITIES.filter((c) => c !== 'remote').slice(0, 10)
  const roles = CURATED_ROLES.slice(0, 10)

  const roleHref = (slug: string) =>
    isInt && INTERNSHIP_DOMAIN_SLUGS.has(slug)
      ? `/internships/${slug}`
      : `${hub}/${slug}-${vertical}`

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[640px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 grid grid-cols-3 gap-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">{label} by city</p>
          <ul className="space-y-1">
            {cities.map((c) => (
              <li key={c}>
                <Link href={`/${vertical}-in/${c}`} className="text-sm text-slate-600 hover:text-indigo-600">
                  {label} in {titleCaseSlug(c)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">{label} by role</p>
          <ul className="space-y-1">
            {roles.map((r) => (
              <li key={r.slug}>
                <Link href={roleHref(r.slug)} className="text-sm text-slate-600 hover:text-indigo-600">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">By workplace</p>
          <ul className="space-y-1">
            <li>
              <Link href={isInt ? '/internships/work-from-home' : `${hub}/remote-${vertical}`} className="text-sm text-slate-600 hover:text-indigo-600">
                Remote {label.toLowerCase()}
              </Link>
            </li>
            <li>
              <Link href={`${hub}/hybrid-${vertical}`} className="text-sm text-slate-600 hover:text-indigo-600">
                Hybrid {label.toLowerCase()}
              </Link>
            </li>
            <li>
              <Link href={`${hub}/in-office-${vertical}`} className="text-sm text-slate-600 hover:text-indigo-600">
                In-office {label.toLowerCase()}
              </Link>
            </li>
            {!isInt && (
              <>
                <li><Link href={`${hub}/full-time-jobs`} className="text-sm text-slate-600 hover:text-indigo-600">Full-time jobs</Link></li>
                <li><Link href={`${hub}/part-time-jobs`} className="text-sm text-slate-600 hover:text-indigo-600">Part-time jobs</Link></li>
              </>
            )}
            <li className="pt-1">
              <Link href={isInt ? '/internships/browse/internships-with-stipend-10000-plus' : '/jobs/browse/jobs-6-to-10-lpa'} className="text-sm text-slate-600 hover:text-indigo-600">
                By {isInt ? 'stipend' : 'salary'}
              </Link>
            </li>
            <li className="pt-2">
              <Link href={hub} className="text-sm font-semibold text-indigo-600 hover:underline">
                See all {label.toLowerCase()} filters →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
