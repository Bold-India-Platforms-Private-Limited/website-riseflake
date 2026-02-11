export default function RightSidebar() {
  return (
    <aside className="hidden lg:block h-[70vh]">
      <div className="flex h-full flex-col gap-2">
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-2">
          <div className="h-full w-full overflow-hidden rounded-xl bg-slate-50">
            <picture>
              <source srcSet="/website-jobs-hero.webp" type="image/webp" />
              <img
                src="/website-jobs-hero.jpg"
                alt="Riseflake hiring dashboard showing active jobs"
                width={800}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </picture>
          </div>
        </div>
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-full w-full rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center text-xs font-medium text-slate-400">
            Banner placeholder
          </div>
        </div>
      </div>
    </aside>
  )
}
