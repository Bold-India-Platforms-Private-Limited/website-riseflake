import React from 'react'
import Link from 'next/link'
import { Building2, Factory, MapPin, Calendar, FileText, ChevronRight, ExternalLink, Briefcase, Users, TrendingUp, Lock } from 'lucide-react'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { WEBSITE_BASE_URL } from '../../../../lib/config'
import type { IndiaCompanyDetail } from '../../../../lib/indiaCompanyDirectory'

function DetailCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center bg-indigo-50">
        <span className="text-indigo-600">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-slate-900 leading-snug break-words">{value}</p>
      </div>
    </div>
  )
}

/**
 * India Company Registry detail page body. The registry holds 3.6M+ companies so these pages can
 * never be pre-rendered; this view is rendered in the browser by the 404 fallback
 * (src/app/components/NotFoundFallback.tsx) after fetching the company from the public API.
 */
export default function IndiaCompanyDetailView({ company }: { company: IndiaCompanyDetail }) {
  const canonicalUrl = `${WEBSITE_BASE_URL}/discover/companies/india/${encodeURIComponent(company.cin)}/${company.name_slug}`
  const initials = company.company_name.slice(0, 2).toUpperCase()

  const orgSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: company.company_name,
    identifier: company.cin,
    url: canonicalUrl,
    ...(company.registration_date ? { foundingDate: company.registration_date } : {}),
    ...(company.registered_office_address
      ? { address: { '@type': 'PostalAddress', streetAddress: company.registered_office_address } }
      : {}),
    description: [
      company.company_category,
      company.company_state_code && `registered in ${company.company_state_code}`,
    ]
      .filter(Boolean)
      .join(', '),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Discover', item: `${WEBSITE_BASE_URL}/discover/companies/india` },
      { '@type': 'ListItem', position: 3, name: 'India Company Registry', item: `${WEBSITE_BASE_URL}/discover/companies/india` },
      { '@type': 'ListItem', position: 4, name: company.company_name, item: canonicalUrl },
    ],
  }

  const isActive = (company.company_status || '').toLowerCase() === 'active'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-20 pb-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
          </div>
          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 pt-4 flex-wrap" aria-label="Breadcrumb">
              <a href="/discover/companies/india" className="hover:text-indigo-600 transition-colors">India Company Registry</a>
              <ChevronRight className="h-3 w-3 opacity-40" />
              <span className="text-slate-600 font-medium">{company.company_name}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-slate-200 bg-white flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-slate-600 select-none">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                  {company.company_name}
                </h1>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {company.company_status || 'Unknown'}
                  </span>
                  {company.company_category && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      <Building2 className="h-3 w-3" />
                      {company.company_category}
                    </span>
                  )}
                </div>
              </div>

              {/* Static CTA — same on every detail page, hands off to the app for full details */}
              <a
                href="https://app.riseflake.com/login"
                className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm"
              >
                View More Details
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">Company details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailCell icon={<FileText className="h-4 w-4" />} label="CIN / LLPIN" value={company.cin} />
              {company.registration_date && (
                <DetailCell icon={<Calendar className="h-4 w-4" />} label="Registration date" value={company.registration_date} />
              )}
              {company.company_state_code && (
                <DetailCell icon={<MapPin className="h-4 w-4" />} label="State" value={company.company_state_code} />
              )}
              {company.company_class && (
                <DetailCell icon={<Building2 className="h-4 w-4" />} label="Company class" value={company.company_class} />
              )}
              {company.company_sub_category && (
                <DetailCell icon={<Factory className="h-4 w-4" />} label="Sub-category" value={company.company_sub_category} />
              )}
              {company.company_roc_code && (
                <DetailCell icon={<FileText className="h-4 w-4" />} label="ROC office" value={company.company_roc_code} />
              )}
              {company.authorized_capital && (
                <DetailCell icon={<FileText className="h-4 w-4" />} label="Authorized capital" value={company.authorized_capital} />
              )}
              {company.paidup_capital && (
                <DetailCell icon={<FileText className="h-4 w-4" />} label="Paid-up capital" value={company.paidup_capital} />
              )}
              {company.company_industrial_classification && (
                <DetailCell icon={<Factory className="h-4 w-4" />} label="Industrial classification" value={company.company_industrial_classification} />
              )}
              {company.registered_office_address && (
                <div className="sm:col-span-2">
                  <DetailCell icon={<MapPin className="h-4 w-4" />} label="Registered office address" value={company.registered_office_address} />
                </div>
              )}
            </div>
          </div>

          {/* Blurred teaser — nudges toward login for jobs + deeper company data */}
          <section className="mt-8 relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
              Jobs &amp; Company Insights
            </h2>

            <div aria-hidden="true" className="pointer-events-none select-none blur-sm opacity-70">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <Briefcase className="h-4 w-4 text-indigo-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-400">Open positions</p>
                  <p className="text-lg font-bold text-slate-300">••</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <Users className="h-4 w-4 text-indigo-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-400">Employee headcount</p>
                  <p className="text-lg font-bold text-slate-300">••••</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <TrendingUp className="h-4 w-4 text-indigo-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-400">Hiring trend</p>
                  <p className="text-lg font-bold text-slate-300">••••</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-200" />
                <div className="h-3 w-5/6 rounded bg-slate-200" />
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-white/40 via-white/85 to-white px-6 text-center">
              <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Lock className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-sm font-semibold text-slate-900 max-w-sm">
                Login to view open jobs, hiring trends, and more details about {company.company_name}
              </p>
              <a
                href="https://app.riseflake.com/login"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm"
              >
                View More Details About Company &amp; Jobs
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3">Explore more</h2>
            <div className="flex flex-wrap gap-2">
              {company.company_state_code && (
                <Link
                  href={`/discover/companies/india?state=${encodeURIComponent(company.company_state_code)}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                >
                  Companies in {company.company_state_code}
                </Link>
              )}
              {company.company_status && (
                <Link
                  href={`/discover/companies/india?status=${encodeURIComponent(company.company_status)}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                >
                  {company.company_status} companies
                </Link>
              )}
              <Link href="/discover/companies/india" className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600">
                Browse India Company Registry
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
