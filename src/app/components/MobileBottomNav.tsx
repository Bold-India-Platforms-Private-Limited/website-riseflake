'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Briefcase,
  GraduationCap,
  MessageCircle,
  LayoutGrid,
  X,
  Building2,
  School,
  Users,
  Globe2,
  FileText,
  FileCheck,
  Star,
  BookOpen,
} from 'lucide-react'
import { PARKED_VERTICALS } from '../../lib/parkedVerticals'

const TABS = [
  { href: '/', label: 'Home', icon: Home, match: (p: string) => p === '/' },
  { href: '/jobs', label: 'Jobs', icon: Briefcase, match: (p: string) => p.startsWith('/jobs') },
  { href: '/internships', label: 'Internships', icon: GraduationCap, match: (p: string) => p.startsWith('/internships') },
  { href: 'https://app.riseflake.com/chat', label: 'Chat', icon: MessageCircle, match: () => false, external: true },
]

const MORE_LINKS = [
  { href: '/companies', label: 'Companies', icon: Building2, color: 'bg-emerald-50 text-emerald-600' },
  { href: '/colleges', label: 'Colleges', icon: School, color: 'bg-sky-50 text-sky-600' },
  { href: '/in/people', label: 'People', icon: Users, color: 'bg-indigo-50 text-indigo-600' },
  { href: '/discover/companies/india', label: 'Discover', icon: Globe2, color: 'bg-fuchsia-50 text-fuchsia-600' },
  { href: 'https://jobportal.riseflake.com/resume', label: 'Build Resume', icon: FileText, color: 'bg-slate-100 text-slate-600', external: true },
  { href: 'https://jobportal.riseflake.com/resume/ats-checker', label: 'ATS Checker', icon: FileCheck, color: 'bg-orange-50 text-orange-600', external: true },
  { href: '/campus-ambassador', label: 'Campus Ambassador', icon: Star, color: 'bg-violet-50 text-violet-600' },
  { href: '/blog', label: 'Blog', icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      <nav
        className="animate-fade-in-up xl:hidden fixed inset-x-3 z-30 flex items-center justify-between gap-1 rounded-full border border-white/70 bg-white/80 p-1.5 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.28)] backdrop-blur-xl"
        style={{
          bottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        {TABS.map((tab) => {
          const active = tab.match(pathname)
          const Icon = tab.icon
          const content = active ? (
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-4 py-2.5 text-white shadow-md shadow-indigo-500/30">
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
              <span className="text-[13px] font-semibold leading-none whitespace-nowrap">{tab.label}</span>
            </span>
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400">
              <Icon className="h-[21px] w-[21px]" strokeWidth={2} />
            </span>
          )
          const className = 'flex shrink-0 items-center justify-center transition-all duration-300 ease-out active:scale-90'
          return tab.external ? (
            <a key={tab.label} href={tab.href} className={className} aria-label={tab.label}>
              {content}
            </a>
          ) : (
            <Link key={tab.label} href={tab.href} className={className} aria-label={tab.label}>
              {content}
            </Link>
          )
        })}

        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className="flex shrink-0 items-center justify-center transition-all duration-300 ease-out active:scale-90"
          aria-label="More"
          aria-expanded={moreOpen}
        >
          {moreOpen ? (
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-4 py-2.5 text-white shadow-md shadow-indigo-500/30">
              <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={2.25} />
              <span className="text-[13px] font-semibold leading-none whitespace-nowrap">More</span>
            </span>
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400">
              <LayoutGrid className="h-[21px] w-[21px]" strokeWidth={2} />
            </span>
          )}
        </button>
      </nav>

      {moreOpen && (
        <div
          className="xl:hidden fixed inset-0 z-[60] bg-slate-900/35 backdrop-blur-[2px]"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-[32px] border-t border-slate-100 bg-white pb-4 shadow-[0_-16px_48px_-12px_rgba(15,23,42,0.35)]"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1.5 w-10 rounded-full bg-slate-200" />
            </div>

            <div className="mb-3 flex items-center justify-between px-5 pt-2">
              <div className="text-base font-semibold text-slate-900">Explore more</div>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 active:scale-90 transition-transform"
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 px-4 pb-2">
              {MORE_LINKS.filter(
                (item) =>
                  (item.href !== '/colleges' || !PARKED_VERTICALS.colleges) &&
                  (item.href !== '/in/people' || !PARKED_VERTICALS.people),
              ).map((item) => {
                const Icon = item.icon
                const inner = (
                  <>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-center text-[11px] font-medium leading-tight text-slate-700">
                      {item.label}
                    </span>
                  </>
                )
                const className = 'flex flex-col items-center gap-1.5 rounded-2xl p-2 active:scale-90 transition-transform'
                return item.external ? (
                  <a key={item.label} href={item.href} className={className} onClick={() => setMoreOpen(false)}>
                    {inner}
                  </a>
                ) : (
                  <Link key={item.label} href={item.href} className={className} onClick={() => setMoreOpen(false)}>
                    {inner}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
