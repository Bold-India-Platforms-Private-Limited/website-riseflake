'use client'

import { useState } from 'react'
import { Download, Star, X } from 'lucide-react'

export default function DownloadTheApp() {
  const [showNudge, setShowNudge] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => setShowNudge(false), 600)
  }

  if (!showNudge && !isClosing) return null

  return (
    <div
      className={`fixed bottom-7 right-7 z-[10000] hidden flex-col items-start md:flex ${isClosing ? 'animate-slide-out-left' : ''
        }`}
    >
      <div className="ml-5 rounded-t-xl bg-[#ff4d88] px-4 py-1.5 text-xs font-bold text-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        Download the App!
      </div>
      <div className="relative flex w-[420px] items-center gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.15)]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-2.5 top-2.5 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <img
          src="https://assets.riseflake.com/images/photos/download-app-qr.png"
          alt="QR"
          className="h-[90px] w-[90px] rounded-xl border border-slate-200 object-cover"
          loading="lazy"
        />

        <div className="flex flex-1 flex-col">
          <div className="mb-2 flex items-center gap-5">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xl font-bold text-slate-900">
                4.9
                <Star size={18} className="text-amber-400" fill="currentColor" />
              </div>
              <div className="text-xs font-normal text-slate-400">2.3K+ Review</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xl font-bold text-slate-900">
                10K+
                <Download size={18} className="text-slate-700" />
              </div>
              <div className="text-xs font-normal text-slate-400">Downloads</div>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 border-t border-slate-200 pt-2 text-xs text-slate-500">
            <span>Available on</span>
            <a
              href="https://apps.apple.com/app/idYOUR_APP_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:opacity-80"
            >
              <img
                src="https://assets.riseflake.com/images/illustrations/apple_v1.png"
                alt="Apple"
                className="h-3.5 cursor-pointer"
                loading="lazy"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.riseflake.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:opacity-80"
            >
              <img
                src="https://assets.riseflake.com/images/illustrations/android_v1.png"
                alt="Play Store"
                className="h-3.5 cursor-pointer"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
