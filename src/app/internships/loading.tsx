export default function InternshipsLoading() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-2 bg-slate-100">
      <div className="max-w-[1200px] mx-auto">
        {/* Mobile Filters shimmer */}
        <div className="lg:hidden mb-4">
          <div className="h-10 w-full rounded-xl bg-slate-200/70 animate-pulse mb-2" />
        </div>
        {/* Banner shimmer */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="h-4 w-32 rounded bg-slate-200/70 animate-pulse mb-2" />
          <div className="h-8 w-1/2 rounded bg-slate-200/70 animate-pulse mb-2" />
          <div className="h-4 w-1/3 rounded bg-slate-200/70 animate-pulse" />
        </div>
        {/* Card shimmers */}
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-200/70 animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-2/3 rounded-lg bg-slate-200/70 animate-pulse"></div>
                  <div className="h-3 w-1/3 rounded-lg bg-slate-200/70 animate-pulse"></div>
                  <div className="h-3 w-1/2 rounded-lg bg-slate-200/70 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
