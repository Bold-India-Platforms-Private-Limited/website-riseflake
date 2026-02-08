export default function JobsLoading() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-[1200px] mx-auto">
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
