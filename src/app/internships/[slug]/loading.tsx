export default function InternshipDetailsLoading() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-200"></div>
              <div className="space-y-3">
                <div className="h-4 w-56 rounded-lg bg-slate-200"></div>
                <div className="h-3 w-32 rounded-lg bg-slate-200"></div>
              </div>
            </div>
            <div className="h-8 w-52 rounded-full bg-slate-200"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse space-y-4">
              <div className="h-4 w-32 rounded bg-slate-200"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-10 rounded-lg bg-slate-200"></div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 animate-pulse space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-3 rounded bg-slate-200"></div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 animate-pulse h-64"></div>
        </div>
      </div>
    </main>
  )
}
