'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, ChevronRight, ChevronDown, Building2, GraduationCap, Briefcase, Cloud, FileText, FileCheck, Star, BookOpen } from 'lucide-react'
import BrowseMegaMenu from './BrowseMegaMenu'

export default function Navbar({ bgTransparent = false }: { bgTransparent?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [businessModalOpen, setBusinessModalOpen] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Determine active tab, but none for landing page
  const activeTab =
    pathname === '/jobs'
      ? '/jobs'
      : pathname === '/companies'
        ? '/companies'
        : pathname === '/colleges'
          ? '/colleges'
          : pathname === '/in/people' || pathname.startsWith('/in/')
            ? '/in/people'
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
    setBusinessModalOpen(false)
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
  }, [open, showDrawer])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open || businessModalOpen) {
      document.body.classList.add('body-scroll-lock')
    } else {
      document.body.classList.remove('body-scroll-lock')
    }
    return () => {
      document.body.classList.remove('body-scroll-lock')
    }
  }, [open, businessModalOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgTransparent && !scrolled ? 'bg-transparent border-transparent' : 'border-white/10 shadow-lg'}`}
        style={bgTransparent && !scrolled
          ? {
            background: 'rgba(255, 255, 255, 0.01)',
            backdropFilter: 'blur(0px)',
            borderBottom: '1px solid transparent',
          }
          : {
            background: 'rgba(255, 255, 255, 0.3)', // Solid glass feel
            WebkitBackdropFilter: 'blur(64px) saturate(200%)',
            backdropFilter: 'blur(64px) saturate(200%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-3 shrink-0 mr-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/50 bg-white/80 backdrop-blur">
                <img src="/logo.webp" alt="Riseflake logo" className="h-5 w-5 object-contain" />
              </div>
              <span className="text-xl font-semibold text-slate-900 hidden sm:block">Riseflake</span>
            </a>

            {/* Main Center Menu */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 rounded-lg p-1 bg-transparent shrink">
              <div className="relative group shrink-0">
                <a
                  href="/jobs"
                  className={`inline-block rounded-lg px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-500 whitespace-nowrap ${activeTab === '/jobs'
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105 shadow-md shadow-indigo-500/20'
                    : 'bg-transparent text-slate-700 hover:bg-white/60 hover:text-slate-900'
                    }`}
                >
                  Jobs
                </a>
                <BrowseMegaMenu vertical="jobs" />
              </div>
              <div className="relative group shrink-0">
                <a
                  href="/internships"
                  className={`inline-block rounded-lg px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-500 whitespace-nowrap ${pathname === '/internships'
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105 shadow-md shadow-indigo-500/20'
                    : 'bg-transparent text-slate-700 hover:bg-white/60 hover:text-slate-900'
                    }`}
                >
                  Internships
                </a>
                <BrowseMegaMenu vertical="internships" />
              </div>
              <div className="relative group shrink-0">
                <a
                  href="/companies"
                  className={`inline-block rounded-lg px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-500 whitespace-nowrap ${activeTab === '/companies'
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105 shadow-md shadow-indigo-500/20'
                    : 'bg-transparent text-slate-700 hover:bg-white/60 hover:text-slate-900'
                    }`}
                >
                  Companies
                </a>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="rounded-2xl bg-white p-3 shadow-2xl border border-slate-200 flex flex-col gap-1">
                    <Link href="/companies" className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">All companies</Link>
                    <Link href="/companies/browse" className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">Browse by industry &amp; size</Link>
                    <Link href="/companies/browse/hiring-companies" className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">Companies hiring now</Link>
                    <Link href="/companies/browse/companies-hiring-in-bangalore" className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">Companies hiring by city</Link>
                    <Link href="/companies/browse/companies-hiring-for-software-development" className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">Companies hiring by role</Link>
                  </div>
                </div>
              </div>
              <a
                href="/colleges"
                className={`rounded-lg px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-500 whitespace-nowrap ${activeTab === '/colleges'
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105 shadow-md shadow-indigo-500/20'
                  : 'bg-transparent text-slate-700 hover:bg-white/60 hover:text-slate-900'
                  }`}
              >
                Colleges
              </a>
              <Link
                href="/in/people"
                className={`rounded-lg px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-500 whitespace-nowrap ${activeTab === '/in/people'
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white scale-105 shadow-md shadow-indigo-500/20'
                  : 'bg-transparent text-slate-700 hover:bg-white/60 hover:text-slate-900'
                  }`}
              >
                People
              </Link>
              <a
                href="https://app.riseflake.com/chat"
                className={`flex items-center rounded-lg px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-500 whitespace-nowrap bg-transparent text-slate-700 hover:bg-white/60 hover:text-slate-900`}
              >
                Chat
                <span className="relative flex h-2 w-2 ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </a>

              {/* More Dropdown */}
              <div className="relative group shrink-0 ml-1">
                <button className="flex items-center gap-1 rounded-lg px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-500 whitespace-nowrap bg-transparent text-slate-700 hover:bg-white/60 hover:text-slate-900">
                  More <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full right-0 mt-3 w-56 rounded-2xl bg-white/95 backdrop-blur-xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-slate-100 flex flex-col gap-1">
                  <a href="https://app.riseflake.com/login-recruiter" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    List Your Jobs
                  </a>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <a href="https://riseflake.com/resume" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <FileText className="h-4 w-4 text-slate-400" />
                    Build Resume
                  </a>
                  <a href="https://riseflake.com/resume/ats-checker" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <FileCheck className="h-4 w-4 text-slate-400" />
                    ATS Checker
                  </a>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <Link href="/campus-ambassador" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-50 transition-colors">
                    <Star className="h-4 w-4 text-violet-400" />
                    Campus Ambassador
                    <span className="ml-auto text-[10px] font-bold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">New</span>
                  </Link>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <Link href="/blog" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    Blog
                  </Link>
                </div>
              </div>
            </nav>

            {/* Right Group (Business Dropdown + CTA) */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-auto lg:ml-0">

              {/* Business Dropdown */}
              <div className="relative group shrink-0 hidden lg:block">
                <button className="flex items-center gap-1 md:gap-1.5 rounded-full px-3 md:px-4 lg:px-5 py-2 md:py-2.5 text-xs lg:text-sm font-semibold transition-all duration-500 whitespace-nowrap bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 border-[1.5px] border-indigo-200/60 hover:border-indigo-300/60 hover:-translate-y-0.5 shadow-sm">
                  <span className="hidden sm:inline">For </span>Business <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                </button>
                <div className="absolute top-full left-4 right-4 sm:left-auto sm:right-0 sm:w-[420px] mt-3 rounded-2xl bg-white/95 backdrop-blur-xl p-3 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-slate-100 grid grid-cols-1 gap-1">

                  <a href="https://app.riseflake.com/login-company" className="flex items-start gap-4 rounded-xl p-3 hover:bg-slate-50 transition-colors group/item relative overflow-hidden">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover/item:bg-gradient-to-br group-hover/item:from-indigo-500 group-hover/item:to-violet-500 group-hover/item:text-white transition-all duration-300 shadow-sm">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 group-hover/item:text-indigo-700 transition-colors">Manage Your Company Team</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">Streamline your workforce, post exclusive jobs, and manage employees efficiently.</div>
                    </div>
                  </a>

                  <a href="https://app.riseflake.com/login-college" className="flex items-start gap-4 rounded-xl p-3 hover:bg-slate-50 transition-colors group/item relative overflow-hidden">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover/item:bg-gradient-to-br group-hover/item:from-sky-500 group-hover/item:to-blue-600 group-hover/item:text-white transition-all duration-300 shadow-sm">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 group-hover/item:text-sky-700 transition-colors">Training & Placement - Colleges</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">Empower your TPO cell, track student progress, and connect with top recruiters.</div>
                    </div>
                  </a>

                  <a href="https://app.riseflake.com/login-recruiter" className="flex items-start gap-4 rounded-xl p-3 hover:bg-slate-50 transition-colors group/item relative overflow-hidden">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover/item:bg-gradient-to-br group-hover/item:from-emerald-500 group-hover/item:to-teal-500 group-hover/item:text-white transition-all duration-300 shadow-sm">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 group-hover/item:text-emerald-700 transition-colors">List Your Jobs</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">Post openings quickly and reach thousands of qualified candidates on our platform.</div>
                    </div>
                  </a>

                  <a href="https://app.riseflake.com/dashboard/manage-jobs" className="flex items-start gap-4 rounded-xl p-3 hover:bg-slate-50 transition-colors group/item relative overflow-hidden">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover/item:bg-gradient-to-br group-hover/item:from-purple-500 group-hover/item:to-fuchsia-500 group-hover/item:text-white transition-all duration-300 shadow-sm">
                      <Cloud className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 group-hover/item:text-purple-700 transition-colors">Riseflake Talent Cloud</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">Access AI-driven candidate matching and build your premium talent pipeline.</div>
                    </div>
                  </a>

                </div>
              </div>

              {/* Main Call to Action */}
              <a
                href="https://app.riseflake.com/home"
                className="hidden md:inline-flex rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-4 lg:px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 text-xs lg:text-sm whitespace-nowrap"
              >
                Find Jobs
              </a>

              {/* Mobile Business Button */}
              <button
                type="button"
                className="md:hidden inline-flex items-center gap-1 rounded-full border border-indigo-200/70 bg-indigo-50/90 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm transition-all hover:bg-indigo-100"
                onClick={() => {
                  setBusinessModalOpen((value) => !value)
                  setOpen(false)
                }}
                aria-label="Open business menu"
                aria-expanded={businessModalOpen}
              >
                Business
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${businessModalOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mobile Call to Action */}
              <a
                href="https://app.riseflake.com/home"
                className="md:hidden inline-flex rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-4 py-1.5 font-semibold text-white shadow-md transition-all hover:shadow-lg text-xs mr-1"
                style={{ minWidth: '80px', justifyContent: 'center' }}
              >
                Find Jobs
              </a>

              <button
                type="button"
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 backdrop-blur text-slate-700 hover:bg-white shrink-0"
                onClick={() => {
                  setBusinessModalOpen(false)
                  setOpen((value) => !value)
                }}
                aria-label="Toggle navigation"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Business Modal */}
      {businessModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/30 backdrop-blur-[1px] lg:hidden"
          onClick={() => setBusinessModalOpen(false)}
          aria-hidden={!businessModalOpen}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="text-sm font-semibold text-slate-900">Business Tools</div>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600"
                onClick={() => setBusinessModalOpen(false)}
                aria-label="Close business menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 pb-3">
              <a
                href="https://app.riseflake.com/login-company"
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-indigo-50"
                onClick={() => setBusinessModalOpen(false)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Manage Your Company Team</div>
                  <div className="text-xs text-slate-500">Post exclusive jobs and manage your workforce efficiently.</div>
                </div>
              </a>

              <a
                href="https://app.riseflake.com/login-college"
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-sky-50"
                onClick={() => setBusinessModalOpen(false)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Training and Placement</div>
                  <div className="text-xs text-slate-500">Empower your college placement cell and connect with recruiters.</div>
                </div>
              </a>

              <a
                href="https://app.riseflake.com/login-recruiter"
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-emerald-50"
                onClick={() => setBusinessModalOpen(false)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">List Your Jobs</div>
                  <div className="text-xs text-slate-500">Post openings and reach quality candidates faster.</div>
                </div>
              </a>

              <a
                href="https://app.riseflake.com/dashboard/manage-jobs"
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-purple-50"
                onClick={() => setBusinessModalOpen(false)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Cloud className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Riseflake Talent Cloud</div>
                  <div className="text-xs text-slate-500">Use AI matching to build your hiring pipeline.</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Overlay and Drawer (unmount after fade-out) */}
      {showDrawer && (
        <div
          className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ background: open ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0)' }}
          aria-hidden={!open}
          onClick={() => open && setOpen(false)}
        >
          <div
            className={`absolute top-0 left-0 w-full h-screen overflow-y-auto border-t border-slate-200/70 bg-white/95 backdrop-blur-xl transition-transform duration-300 ${open ? 'translate-y-0' : '-translate-y-8'}`}
            style={{ pointerEvents: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="mx-3 mt-4 mb-20 rounded-3xl bg-white/90 p-4 shadow-xl flex flex-col gap-2">
              <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Menu
              </div>
              <Link
                href="/jobs"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${isActive('/jobs')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => setOpen(false)}
              >
                <span>Jobs</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>
              <Link
                href="/jobs/browse"
                className="rounded-xl px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                Browse jobs by city, role, company &amp; salary →
              </Link>
              <Link
                href="/internships"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${isActive('/internships')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => setOpen(false)}
              >
                <span>Internships</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>
              <Link
                href="/internships/browse"
                className="rounded-xl px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                Browse internships by city, role &amp; stipend →
              </Link>
              <Link
                href="/companies"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${isActive('/companies')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => setOpen(false)}
              >
                <span>Companies</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>
              <Link
                href="/colleges"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${isActive('/colleges')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => setOpen(false)}
              >
                <span>Colleges</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>
              <Link
                href="/in/people"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${isActive('/in/people')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => setOpen(false)}
              >
                <span>People</span>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>

              <a
                href="https://app.riseflake.com/chat"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>Chat</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </a>

              <div className="mt-4 mb-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Business
              </div>

              <a
                href="https://app.riseflake.com/login-company"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                onClick={() => setOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100/50 text-indigo-600">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="flex-1">Manage Your Company Team</span>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </a>

              <a
                href="https://app.riseflake.com/login-college"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                onClick={() => setOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100/50 text-sky-600">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="flex-1">Training and Placement</span>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </a>

              <a
                href="https://app.riseflake.com/login-recruiter"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={() => setOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100/50 text-emerald-600">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="flex-1">List Your Jobs</span>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </a>

              <a
                href="https://app.riseflake.com/dashboard/manage-jobs"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                onClick={() => setOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100/50 text-purple-600">
                  <Cloud className="h-4 w-4" />
                </div>
                <span className="flex-1">Talent Cloud</span>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </a>

              <div className="mt-4 mb-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                More
              </div>

              <a
                href="https://app.riseflake.com/login-recruiter"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                  <span>List your job</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </a>
              <a
                href="https://riseflake.com/resume"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-400" />
                  <span>Build Resume</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </a>
              <a
                href="https://riseflake.com/resume/ats-checker"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-slate-400" />
                  <span>ATS Checker</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </a>
              <Link
                href="/campus-ambassador"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition text-violet-700 hover:bg-violet-50"
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-violet-500" />
                  <span>Campus Ambassador</span>
                  <span className="text-[10px] font-bold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">New</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </Link>
              <Link
                href="/blog"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${isActive('/blog')
                  ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
                  }`}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 opacity-70" />
                  <span>Blog</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Link>

              <div className="mt-4 pt-4 pb-12 border-t border-slate-100 md:hidden">
                <a
                  href="https://app.riseflake.com/home"
                  className="flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-4 py-3 font-semibold text-white shadow-lg transition-all"
                  onClick={() => setOpen(false)}
                >
                  Find Jobs
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
