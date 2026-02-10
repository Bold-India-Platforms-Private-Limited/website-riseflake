'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isActive = (href: string) =>
    href.startsWith('/') && (pathname === href || (href !== '/' && pathname.startsWith(href)))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/30 bg-white/65 backdrop-blur-2xl transition-shadow ${
        scrolled ? 'shadow-[0_10px_25px_rgba(15,23,42,0.12)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <img src="/logo.webp" alt="Riseflake logo" className="h-6 w-6 object-contain" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Riseflake</h1>
          </a>

          <div className="hidden md:flex items-center gap-1 rounded-lg bg-slate-100/80 p-1 shadow-inner">
            <a
              href="/jobs"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive('/jobs')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow'
              }`}
            >
              Jobs
            </a>
            <a
              href="/companies"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive('/companies')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow'
              }`}
            >
              Companies
            </a>
            <a
              href="#features"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow"
            >
              Success Stories
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://app.riseflake.com/home"
              className="hidden md:inline-flex rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
            >
              Find Jobs
            </a>

            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200/70 bg-white/95 backdrop-blur">
          <div className="mx-4 my-4 rounded-lg bg-slate-100/70 p-2 shadow-inner">
            <a
              href="/jobs"
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive('/jobs')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              Jobs
            </a>
            <a
              href="/companies"
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive('/companies')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              Companies
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
