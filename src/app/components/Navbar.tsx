'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, ChevronRight } from 'lucide-react'

export default function Navbar({ bgTransparent = false }: { bgTransparent?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [, setScrolled] = useState(false)

  // Determine active tab, but none for landing page
  const activeTab =
    pathname === '/jobs'
      ? '/jobs'
      : pathname === '/indexed-jobs'
      ? '/indexed-jobs'
      : pathname === '/companies'
      ? '/companies'
      : pathname === '/colleges'
      ? '/colleges'
      : null

  const isActive = (href: string) =>
    href.startsWith('/') && (pathname === href || (href !== '/' && pathname.startsWith(href)))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Show/hide drawer with fade-out
  useEffect(() => {
    if (open) {
      setShowDrawer(true)
    } else if (showDrawer) {
      // Wait for fade-out transition (300ms)
      const timeout = setTimeout(() => setShowDrawer(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [open])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('body-scroll-lock')
    } else {
      document.body.classList.remove('body-scroll-lock')
    }
    return () => {
      document.body.classList.remove('body-scroll-lock')
    }
  }, [open])

  return (
    <>
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
          <div className="flex h-14 md:h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <img src="/logo.webp" alt="Riseflake logo" className="h-5 w-5 object-contain" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Riseflake</h1>
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
                href="/internships"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                  pathname === '/internships'
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105'
                    : 'bg-transparent text-slate-700 hover:bg-white hover:text-slate-900'
                }`}
              >
                Internships
              </a>
              <a
                href="/indexed-jobs"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                  activeTab === '/indexed-jobs'
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
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="https://app.riseflake.com/home"
                className="hidden md:inline-flex rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:shadow-xl text-xs"
              >
                Find Jobs
              </a>
              <a
                href="https://app.riseflake.com/home"
                className="md:hidden inline-flex rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-3 py-1.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl text-xs mr-2"
                style={{ minWidth: '70px' }}
              >
                Find Jobs
              </a>
              <button
                type="button"
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen((value) => !value)}
                aria-label="Toggle navigation"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay and Drawer (unmount after fade-out) */}
      {showDrawer && (
        <div
          className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ background: open ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0)' }}
          aria-hidden={!open}
          onClick={() => open && setOpen(false)}
        >
          <div
            className={`absolute top-0 left-0 w-full border-t border-slate-200/70 bg-white/95 backdrop-blur transition-transform duration-300 ${open ? 'translate-y-0' : '-translate-y-8'}`}
            style={{ pointerEvents: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="mx-3 mt-10 mb-5 rounded-2xl bg-white/90 p-3 shadow-xl flex flex-col gap-2">
              <Link
                href="/jobs"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                  isActive('/jobs')
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => setOpen(false)}
                prefetch={false}
              >
                <span>Jobs</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>
              <Link
                href="/internships"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                  isActive('/internships')
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => setOpen(false)}
                prefetch={false}
              >
                <span>Internships</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>
              <Link
                href="/indexed-jobs"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                  isActive('/indexed-jobs')
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => setOpen(false)}
                prefetch={false}
              >
                <span>iJobs</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>
              <Link
                href="/companies"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                  isActive('/companies')
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => setOpen(false)}
                prefetch={false}
              >
                <span>Companies</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>
              <Link
                href="/colleges"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                  isActive('/colleges')
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => setOpen(false)}
                prefetch={false}
              >
                <span>Colleges</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
