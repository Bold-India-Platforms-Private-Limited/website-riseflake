import { BASE_ASSETS_URL } from '@/lib/config'

export default function RightSidebar() {
  return (
    <aside className="hidden lg:block h-[70vh]">
      <div className="flex h-full flex-col gap-2">
        <div className="flex-1 rounded-2xl border border-slate-200 bg-#dddddd p-2">
          <div className="h-full w-full overflow-hidden rounded-xl bg-slate-50">
            <picture>
              <source srcSet="https://assets.riseflake.com/images/illustrations/clg-girl-hero.webp" type="image/webp" />
              <img
                src={`${BASE_ASSETS_URL}/illustrations/clg-girl-hero.webp`} alt="Riseflake hiring dashboard showing active jobs" width={800} height={800} loading="lazy" className="h-full w-full object-cover" /> </picture>
          </div>
        </div>
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <a
            href="https://riseflake.com/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="h-full w-full rounded-xl overflow-hidden flex items-center justify-center transition-transform hover:scale-[1.02]"
          >
            <img src="/build-resume.webp" alt="Build Resume" className="h-full w-full object-cover" loading="lazy" />
          </a>
        </div>
      </div>
    </aside>
  )
}
