'use client'

import { useState } from 'react'
import { BASE_ASSETS_URL } from '../../lib/config'

export default function AppDownloadSection() {
  const [mobileNumber, setMobileNumber] = useState('')
  const illustrationImage = `${BASE_ASSETS_URL}/hero-app-showcase.webp`

  return (
    <section className="hidden md:block px-10 pb-[60px] pt-[60px]">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex min-h-[450px] flex-col items-center justify-between gap-10 rounded-[24px_24px_12px_12px] bg-gradient-to-br from-white via-white to-pink-100 px-10 pb-0 pt-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur xl:flex-row xl:items-start">
          <div className="max-w-[480px] pt-6 text-center xl:text-left">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              More than a resume
              <br />
              It's your professional story
            </h2>
            <p className="mt-3 text-sm text-slate-600">Available for both Android and iOS apps</p>

            <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center">
              <input
                type="tel"
                placeholder="Enter mobile number..."
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="flex-1 rounded-[18px] bg-transparent px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-slate-50 focus:outline-none"
              />
              <button
                type="button"
                className="rounded-[18px] bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
              >
                Get link
              </button>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
              <img
                src="/android-app_v1.jpg"
                alt="Get it on Google Play"
                className="h-10 w-auto cursor-pointer transition hover:-translate-y-0.5"
              />
              <img
                src="/ios-app_v1.jpg"
                alt="Download on App Store"
                className="h-10 w-auto cursor-pointer transition hover:-translate-y-0.5"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 xl:mt-8">
            <div className="rounded-xl bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <img src="/QR_code.png" alt="QR Code" className="h-[150px] w-[150px]" />
            </div>
            <p className="text-xs font-medium text-slate-500">Scan to download</p>
          </div>

          <div className="hidden h-[420px] flex-1 items-end justify-end xl:flex">
            <img
              src={illustrationImage}
              alt="Job recommendations illustration"
              className="w-full max-w-[680px] object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
