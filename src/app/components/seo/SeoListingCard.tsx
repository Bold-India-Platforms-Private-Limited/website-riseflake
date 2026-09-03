import Link from 'next/link'
import { MapPin, Building2 } from 'lucide-react'
import { formatSalaryChip } from '../../../lib/salary'
import { WORKPLACE_LABELS } from '../../../lib/facets'

export type SeoListingItem = {
  slug: string
  position: string
  company_name?: string | null
  company_logo?: string | null
  job_type?: string | null
  workplace_type?: number | null
  location_name?: string | null
  created_at?: string | null
  categories?: string[] | null
  is_salary_hidden?: boolean | null
  salary_type?: string | null
  fixed_amount?: string | null
  min_amount?: string | null
  max_amount?: string | null
  currency?: string | null
  salary_period?: string | null
}

function relativeDate(iso?: string | null): string | null {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return null
  const days = Math.floor((Date.now() - then) / 86_400_000)
  if (days <= 0) return 'Posted today'
  if (days === 1) return 'Posted yesterday'
  if (days < 30) return `Posted ${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? 'Posted 1 month ago' : `Posted ${months} months ago`
}

/**
 * Compact listing card shared by every SEO listing page (facet browse pages,
 * city pages, WFH page, DOMAIN_MAP pages). Fully server-rendered. The internal
 * href carries a UTM suffix so app-side attribution can credit the SEO funnel.
 */
export default function SeoListingCard({
  item,
  hrefBase,
  trackingSuffix = '',
}: {
  item: SeoListingItem
  hrefBase: '/internships' | '/jobs'
  trackingSuffix?: string
}) {
  const posted = relativeDate(item.created_at)
  const salary = formatSalaryChip(item)
  const wp = item.workplace_type != null ? WORKPLACE_LABELS[item.workplace_type] : null

  return (
    <Link
      href={`${hrefBase}/${item.slug}${trackingSuffix}`}
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {item.company_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.company_logo} alt={item.company_name ?? ''} className="h-full w-full object-cover" />
          ) : (
            <Building2 className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {item.position}
          </h3>
          {item.company_name && <p className="text-xs text-slate-500 mt-0.5">{item.company_name}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-auto">
        {wp && (
          <span className="text-[11px] bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium">{wp}</span>
        )}
        {item.location_name && (
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.location_name}
          </span>
        )}
        {salary && <span className="text-[11px] text-emerald-600 font-semibold">{salary}</span>}
        {posted && <span className="text-[11px] text-slate-400">· {posted}</span>}
      </div>
    </Link>
  )
}
