type TagsSectionProps = {
  title: string
  tags: string[] | null | undefined
}

export default function TagsSection({ title, tags }: TagsSectionProps) {
  if (!tags || tags.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600">Not specified</p>
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
