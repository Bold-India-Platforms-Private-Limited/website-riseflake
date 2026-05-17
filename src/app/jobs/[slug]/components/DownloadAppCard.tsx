import { Smartphone, Bell, ClipboardList, MessageSquare } from 'lucide-react'

const FEATURES = [
  { icon: Bell,          label: 'Job Alerts' },
  { icon: ClipboardList, label: 'Applied Jobs' },
  { icon: MessageSquare, label: 'Recruiter Msg' },
]

export default function DownloadAppCard() {
  return (
    <aside
      className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
      aria-label="Download the Riseflake App"
    >
      <div className="p-5">
        {/* Top badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Mobile App
          </span>
        </div>

        {/* Heading row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-100">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">Download Riseflake App</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Realtime job alerts, applied job updates, and recruiter messages.
            </p>
          </div>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {FEATURES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
            >
              <Icon className="h-3 w-3 text-slate-400" />
              {label}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-4" />

        {/* Store buttons */}
        <div className="flex gap-2">
          <a
            href="https://play.google.com/store/apps/details?id=com.riseflake.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
            aria-label="Download Riseflake on Google Play"
          >
            <img
              src="/download-on-the-play-store.png"
              alt="Download on Google Play"
              className="h-10 w-full object-contain object-left"
              loading="lazy"
            />
          </a>
          <a
            href="https://apps.apple.com/in/app/riseflake/id6743671773"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
            aria-label="Download Riseflake on the App Store"
          >
            <img
              src="/download-on-the-app-store.svg"
              alt="Download on the App Store"
              className="h-10 w-full object-contain object-right"
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </aside>
  )
}
