import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Briefcase, GraduationCap, Building2, School, Globe, Home, FileText, ClipboardList, Info, Users, Mail, Rocket, HelpCircle, ScrollText, Lock, CreditCard, Shield, AlertTriangle, Cookie, Trash2, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'
import { API_BASE_URL, hreflangAlternates } from '../../lib/config'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Sitemap — All Pages & Sections',
  description: 'Full sitemap of Riseflake. Find all jobs, internships, companies, colleges, and static pages in one place.',
  alternates: { canonical: 'https://riseflake.com/sitemap.html', ...hreflangAlternates('https://riseflake.com/sitemap.html') },
  robots: { index: true, follow: true },
}

type CountResponse = { total?: number; status?: boolean }

async function fetchCount(url: string): Promise<number> {
  try {
    const res = await fetch(`${url}?limit=1&page=1`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return 0
    const data = (await res.json()) as CountResponse
    return data.total ?? 0
  } catch {
    return 0
  }
}

const fmt = (n: number) => n.toLocaleString('en-IN')

export default async function SitemapHtmlPage() {
  const [jobCount, internshipCount, companyCount, collegeCount] = await Promise.all([
    fetchCount(`${API_BASE_URL}/jobs`),
    fetchCount(`${API_BASE_URL}/internships`),
    fetchCount(`${API_BASE_URL}/companies`),
    fetchCount(`${API_BASE_URL}/colleges`),
  ])

  return (
    <>
      <Navbar bgTransparent />
      <main className="min-h-screen bg-slate-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
              <a href="/" className="hover:text-indigo-600">Home</a>
              <span>/</span>
              <span className="text-slate-700 font-medium">Sitemap</span>
            </nav>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Riseflake Sitemap</h1>
                <p className="text-sm text-slate-500 mt-0.5">All sections, pages & live content — updated hourly</p>
              </div>
            </div>
          </div>

          {/* Live stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <StatCard icon={<Briefcase className="h-5 w-5" />} label="Live Jobs" value={fmt(jobCount)} color="emerald" />
            <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Internships" value={fmt(internshipCount)} color="violet" />
            <StatCard icon={<Building2 className="h-5 w-5" />} label="Companies" value={fmt(companyCount)} color="blue" />
            <StatCard icon={<School className="h-5 w-5" />} label="Colleges" value={fmt(collegeCount)} color="amber" />
          </div>

          {/* Tree */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Site Structure</span>
            </div>

            <ul className="tree-root space-y-1" role="tree">

              {/* Root */}
              <TreeRoot />

              {/* Jobs */}
              <TreeBranch
                icon={<Briefcase className="h-4 w-4" />}
                label="Jobs"
                href="/jobs"
                badge={`${fmt(jobCount)} live`}
                badgeColor="emerald"
                defaultOpen
              >
                <TreeLeaf href="/jobs" label="Browse all jobs" icon={<ExternalLink className="h-3 w-3" />} />
                <TreeLeaf href="/jobs?workplace_type=1" label="Remote jobs" icon={<Globe className="h-3 w-3" />} />
                <TreeLeaf href="/jobs?workplace_type=2" label="Hybrid jobs" icon={<Home className="h-3 w-3" />} />
                <TreeLeaf href="/jobs?workplace_type=3" label="On-site jobs" icon={<Building2 className="h-3 w-3" />} />
                <TreeLeaf href="/sitemap-jobs.xml" label="XML sitemap (auto-updated)" icon={<FileText className="h-3 w-3" />} muted />
                <TreeInfo label={`${fmt(jobCount)} individual job pages · auto-indexed via XML sitemap`} />
              </TreeBranch>

              {/* Internships */}
              <TreeBranch
                icon={<GraduationCap className="h-4 w-4" />}
                label="Internships"
                href="/internships"
                badge={`${fmt(internshipCount)} active`}
                badgeColor="violet"
                defaultOpen
              >
                <TreeLeaf href="/internships" label="Browse all internships" icon={<ExternalLink className="h-3 w-3" />} />
                <TreeLeaf href="/internships?workplace_type=1" label="Work from home internships" icon={<Globe className="h-3 w-3" />} />
                <TreeLeaf href="/internships?workplace_type=3" label="In-office internships" icon={<Building2 className="h-3 w-3" />} />
                <TreeLeaf href="/sitemap-internships.xml" label="XML sitemap (auto-updated)" icon={<FileText className="h-3 w-3" />} muted />
                <TreeInfo label={`${fmt(internshipCount)} individual internship pages · auto-indexed via XML sitemap`} />
              </TreeBranch>

              {/* Companies */}
              <TreeBranch
                icon={<Building2 className="h-4 w-4" />}
                label="Companies"
                href="/companies"
                badge={`${fmt(companyCount)} registered`}
                badgeColor="blue"
                defaultOpen
              >
                <TreeLeaf href="/companies" label="Browse all companies" icon={<ExternalLink className="h-3 w-3" />} />
                <TreeLeaf href="/sitemap-companies.xml" label="Companies sitemap index (auto-updated)" icon={<FileText className="h-3 w-3" />} muted />
                <TreeInfo label={`${fmt(companyCount)} company profile pages · batched in XML sitemaps of 1,000`} />
              </TreeBranch>

              {/* Colleges */}
              <TreeBranch
                icon={<School className="h-4 w-4" />}
                label="Colleges"
                href="/colleges"
                badge={`${fmt(collegeCount)} listed`}
                badgeColor="amber"
              >
                <TreeLeaf href="/colleges" label="Browse all colleges" icon={<ExternalLink className="h-3 w-3" />} />
                <TreeInfo label={`${fmt(collegeCount)} college pages`} />
              </TreeBranch>

              {/* Indexed Jobs */}
              <TreeLeafTop href="/indexed-jobs" icon={<ClipboardList className="h-4 w-4" />} label="Indexed Jobs" desc="External job listings aggregated from the web" />

              {/* Company section */}
              <TreeBranch icon={<Info className="h-4 w-4" />} label="About Riseflake" defaultOpen={false}>
                <TreeLeaf href="/about" label="About us" icon={<Users className="h-3 w-3" />} />
                <TreeLeaf href="/contact" label="Contact" icon={<Mail className="h-3 w-3" />} />
                <TreeLeaf href="/careers" label="Careers at Riseflake" icon={<Rocket className="h-3 w-3" />} />
                <TreeLeaf href="/support" label="Support & Help" icon={<HelpCircle className="h-3 w-3" />} />
              </TreeBranch>

              {/* Legal */}
              <TreeBranch icon={<ScrollText className="h-4 w-4" />} label="Legal & Policies" defaultOpen={false}>
                <TreeLeaf href="/privacy-policy" label="Privacy Policy" icon={<Lock className="h-3 w-3" />} />
                <TreeLeaf href="/terms-of-service" label="Terms of Service" icon={<ClipboardList className="h-3 w-3" />} />
                <TreeLeaf href="/refund-policy" label="Refund Policy" icon={<CreditCard className="h-3 w-3" />} />
                <TreeLeaf href="/trust-and-safety" label="Trust & Safety" icon={<Shield className="h-3 w-3" />} />
                <TreeLeaf href="/disclaimer" label="Disclaimer" icon={<AlertTriangle className="h-3 w-3" />} />
                <TreeLeaf href="/cookie-policy" label="Cookie Policy" icon={<Cookie className="h-3 w-3" />} />
                <TreeLeaf href="/delete-account" label="Delete Account" icon={<Trash2 className="h-3 w-3" />} />
              </TreeBranch>

            </ul>
          </div>

          {/* XML Sitemaps for crawlers */}
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <h2 className="text-base font-semibold text-white">XML Sitemaps — for search engines</h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              These machine-readable sitemaps are submitted to Google Search Console and auto-update whenever content changes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <XmlCard href="/sitemap.xml" title="Sitemap Index" desc="Master index — points to all sub-sitemaps" />
              <XmlCard href="/sitemap-jobs.xml" title="Jobs Sitemap" desc={`${fmt(jobCount)} job URLs · refreshes hourly`} />
              <XmlCard href="/sitemap-internships.xml" title="Internships Sitemap" desc={`${fmt(internshipCount)} internship URLs · refreshes hourly`} />
              <XmlCard href="/sitemap-companies.xml" title="Companies Sitemap Index" desc={`${fmt(companyCount)} companies across batches of 1,000`} />
              <XmlCard href="/sitemap-static.xml" title="Static Pages Sitemap" desc="17 static pages · refreshes daily" />
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-xl bg-slate-800 px-4 py-3">
              <svg className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-slate-400">
                Dynamic pages (jobs, internships, companies) are automatically added to the XML sitemaps the moment they go live — no manual updates needed.
                New jobs appear in <span className="text-indigo-400 font-medium">/sitemap-jobs.xml</span> within 1 hour.
              </p>
            </div>
          </div>

        </div>
      </main>

    </>
  )
}

/* ─── Sub-components ───────────────────────────────────────────────────────── */

function StatCard({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-100',
    violet: 'bg-violet-50 border-violet-100',
    blue: 'bg-blue-50 border-blue-100',
    amber: 'bg-amber-50 border-amber-100',
  }
  const iconColors: Record<string, string> = {
    emerald: 'text-emerald-600',
    violet: 'text-violet-600',
    blue: 'text-blue-600',
    amber: 'text-amber-600',
  }
  const valueColors: Record<string, string> = {
    emerald: 'text-emerald-700',
    violet: 'text-violet-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
  }
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className={`mb-2 ${iconColors[color]}`}>{icon}</div>
      <p className={`text-xl font-bold ${valueColors[color]}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}

function TreeRoot() {
  return (
    <li className="flex items-center gap-2 py-1.5 mb-2">
      <Globe className="h-4 w-4 flex-shrink-0 text-slate-500" />
      <a
        href="https://riseflake.com"
        className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
      >
        riseflake.com
      </a>
      <span className="text-[11px] text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">root</span>
    </li>
  )
}

function TreeBranch({
  icon,
  label,
  href,
  badge,
  badgeColor,
  defaultOpen = true,
  children,
}: {
  icon: ReactNode
  label: string
  href?: string
  badge?: string
  badgeColor?: string
  defaultOpen?: boolean
  children?: ReactNode
}) {
  const badgeColors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  }

  return (
    <li className="relative pl-5 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
      <details open={defaultOpen} className="group">
        <summary className="flex items-center gap-2 py-1.5 cursor-pointer select-none rounded-lg hover:bg-slate-50 transition-colors -ml-1 pl-1 pr-2">
          <svg className="tree-chevron h-3.5 w-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="flex-shrink-0 text-slate-500">{icon}</span>
          {href ? (
            <a
              href={href}
              className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
            >
              {label}
            </a>
          ) : (
            <span className="text-sm font-semibold text-slate-800">{label}</span>
          )}
          {badge && badgeColor && (
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </summary>
        <ul className="mt-0.5 space-y-0.5 pl-5 border-l border-slate-200 ml-3">
          {children}
        </ul>
      </details>
    </li>
  )
}

function TreeLeafTop({ href, icon, label, desc }: { href: string; icon: ReactNode; label: string; desc?: string }) {
  return (
    <li className="relative pl-5 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
      <div className="flex items-center gap-2 py-1.5">
        <div className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="flex-shrink-0 text-slate-500">{icon}</span>
        <a href={href} className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors">{label}</a>
        {desc && <span className="text-xs text-slate-400 hidden sm:inline">— {desc}</span>}
      </div>
    </li>
  )
}

function TreeLeaf({ href, label, icon, muted }: { href: string; label: string; icon?: ReactNode; muted?: boolean }) {
  return (
    <li className="flex items-center gap-2 py-1">
      <span className="flex-shrink-0 w-4 flex items-center justify-center text-slate-400">{icon ?? <span className="text-xs">·</span>}</span>
      <a
        href={href}
        className={`text-sm transition-colors ${muted ? 'text-slate-400 hover:text-slate-600' : 'text-slate-600 hover:text-indigo-600'}`}
      >
        {label}
      </a>
    </li>
  )
}

function TreeInfo({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 py-1">
      <span className="flex-shrink-0 w-4 text-center text-xs text-slate-300">∞</span>
      <span className="text-xs text-slate-400 italic">{label}</span>
    </li>
  )
}

function XmlCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 p-4 transition-all"
    >
      <svg className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{desc}</p>
      </div>
      <svg className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 flex-shrink-0 ml-auto mt-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}
