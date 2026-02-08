export default function RightSidebar() {
  return (
    <aside className="hidden lg:block h-[70vh]">
      <div className="flex h-full flex-col gap-4">
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-full w-full rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center text-xs font-medium text-slate-400">
            Banner placeholder
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
