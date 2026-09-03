import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export type Chip = { slug: string; label: string; count?: number; href?: string }

/** A titled cluster of internal-link pills. */
export default function FacetChips({
  title,
  chips,
  hrefBase,
  seeAllHref,
}: {
  title: string
  chips: Chip[]
  /** e.g. "/internships/browse" — prepended to chip.slug unless chip.href is set */
  hrefBase: string
  seeAllHref?: string
}) {
  if (!chips || chips.length === 0) return null
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-xs text-indigo-600 hover:underline font-medium flex items-center gap-1">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <Link
            key={c.slug + (c.href ?? '')}
            href={c.href ?? `${hrefBase}/${c.slug}`}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            {c.label}
            {typeof c.count === 'number' && c.count > 0 && (
              <span className="ml-1 text-slate-400">({c.count.toLocaleString('en-IN')})</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
