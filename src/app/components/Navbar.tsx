'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navbar({ bgTransparent = false }: { bgTransparent?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [, setScrolled] = useState(false)

  // Determine active tab, but none for landing page
  const activeTab =
    pathname === '/jobs'
      ? '/jobs'
      : pathname === '/ijobs'
      ? '/ijobs'
      : pathname === '/companies'
      ? '/companies'
      : pathname === '/colleges'
      ? '/colleges'
      : pathname.startsWith('#features')
      ? '#features'
      : pathname.startsWith('#testimonials')
      ? '#testimonials'
      : null

  const isActive = (href: string) =>
    href.startsWith('/') && (pathname === href || (href !== '/' && pathname.startsWith(href)))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/20 ${bgTransparent ? 'bg-transparent' : 'bg-white'} backdrop-blur-3xl`}
      style={bgTransparent
        ? {
            background: 'rgba(255, 255, 255, 0)', // Fully transparent
            WebkitBackdropFilter: 'blur(100px)',
            backdropFilter: 'blur(100px)',
            border: '1px solid rgba(255, 255, 255, 0)', // Fully transparent border
            boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0)',
            transition: 'background 0.5s, box-shadow 0.5s',
          }
        : {
            background: 'rgba(255, 255, 255, 1)', // Solid white
            WebkitBackdropFilter: 'blur(100px)',
            backdropFilter: 'blur(100px)',
            border: '1px solid rgba(255, 255, 255, 0)',
            boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0)',
            transition: 'background 0.5s, box-shadow 0.5s',
          }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <img src="/logo.webp" alt="Riseflake logo" className="h-6 w-6 object-contain" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Riseflake</h1>
          </a>

          <nav className="hidden md:flex items-center gap-1 rounded-lg p-1 bg-transparent">
            <a
              href="/jobs"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                activeTab === '/jobs'
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105'
                  : 'bg-transparent text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              Jobs
            </a>
            <a
              href="/ijobs"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                activeTab === '/ijobs'
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105'
                  : 'bg-transparent text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              iJobs
            </a>
            <a
              href="/companies"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                activeTab === '/companies'
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105'
                  : 'bg-transparent text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              Companies
            </a>
            <a
              href="/colleges"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                activeTab === '/colleges'
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105'
                  : 'bg-transparent text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              Colleges
            </a>
            <a
              href="#features"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                activeTab === '#features'
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105'
                  : 'bg-transparent text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                activeTab === '#testimonials'
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105'
                  : 'bg-transparent text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              Success Stories
            </a>
          </nav>

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
              href="/ijobs"
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive('/ijobs')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              iJobs
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
            <a
              href="/colleges"
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive('/colleges')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              Colleges
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
