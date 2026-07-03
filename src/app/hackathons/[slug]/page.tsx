import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import {
  Calendar, Users, Trophy, Globe, Clock,
  Tag, IndianRupee, Building2, GraduationCap, ExternalLink,
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { BLOG_API_URL, WEBSITE_BASE_URL } from '../../../lib/config'

export const dynamicParams = true
export const revalidate = 1800

// ─── Types ────────────────────────────────────────────────────────────────────

type HackathonDetail = {
  id: number
  slug: string
  title: string
  tagline?: string | null
  description?: string | null
  short_description?: string | null
  banner_image_url?: string | null
  logo_url?: string | null
  mode?: string | null
  category?: string | null
  theme_tags?: string[] | null
  organizer_name?: string | null
  organizer_logo_url?: string | null
  organizer_type?: string | null
  registration_type?: string | null
  registration_fee?: number | null
  fee_currency?: string | null
  participation_type?: string | null
  team_size_min?: number | null
  team_size_max?: number | null
  location_text?: string | null
  location_display?: string | null
  status?: string
  is_featured?: boolean
  hackathon_start_date?: string | null
  hackathon_end_date?: string | null
  registration_open_date?: string | null
  registration_close_date?: string | null
  submission_deadline?: string | null
  total_prize_pool?: number | null
  reg_count?: number | null
  prizes?: { title: string; description?: string | null; cash_amount?: number | null; currency?: string | null }[]
  faqs?: { question: string; answer: string }[]
  rounds?: { title: string; description?: string | null; start_date?: string | null; end_date?: string | null }[]
  contacts?: { name?: string | null; email?: string | null; phone?: string | null; linkedin_url?: string | null }[]
  eligibility?: { open_to_all?: boolean; min_age?: number | null; max_age?: number | null; allowed_education_levels?: string[] | null; notes?: string | null } | null
}

// ─── Data ─────────────────────────────────────────────────────────────────────

async function fetchHackathon(slug: string): Promise<HackathonDetail | null> {
  try {
    const res = await fetch(`${BLOG_API_URL}/hackathons/${slug}`, {
      next: { revalidate: 1800 },
    })
    if (res.status === 404 || res.status === 403) return null
    if (!res.ok) {
      console.error(`[hackathons] fetch failed for "${slug}": HTTP ${res.status}`)
      return null
    }
    const data = await res.json()
    return data.hackathon ?? null
  } catch (err) {
    console.error(`[hackathons] fetch error for "${slug}":`, err)
    return null
  }
}

export async function generateStaticParams() {
  return []
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrize(amount: number | null | undefined) {
  if (!amount) return null
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`
  return `₹${amount.toLocaleString()}`
}

function fmtDate(d: string | null | undefined, opts?: Intl.DateTimeFormatOptions) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-IN', opts ?? { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Schema ───────────────────────────────────────────────────────────────────

function buildEventSchema(h: HackathonDetail, canonicalUrl: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: h.title,
    description: h.short_description ?? h.tagline ?? `Join ${h.title} on Riseflake — India's job & hackathon platform.`,
    url: canonicalUrl,
    eventStatus: h.status === 'completed'
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: h.mode === 'online'
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : h.mode === 'hybrid'
      ? 'https://schema.org/MixedEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: h.organizer_name ?? 'Riseflake',
    },
  }

  if (h.hackathon_start_date) schema.startDate = new Date(h.hackathon_start_date).toISOString()
  if (h.hackathon_end_date) schema.endDate = new Date(h.hackathon_end_date).toISOString()
  if (h.banner_image_url) schema.image = h.banner_image_url

  if (h.mode !== 'online' && h.location_display) {
    schema.location = {
      '@type': 'Place',
      name: h.location_display,
      address: { '@type': 'PostalAddress', addressLocality: h.location_display, addressCountry: 'IN' },
    }
  } else if (h.mode === 'online') {
    schema.location = { '@type': 'VirtualLocation', url: canonicalUrl }
  }

  if (h.registration_type === 'free') {
    schema.isAccessibleForFree = true
    schema.offers = { '@type': 'Offer', price: '0', priceCurrency: 'INR', url: canonicalUrl, availability: 'https://schema.org/InStock' }
  } else if (h.registration_fee && h.registration_fee > 0) {
    schema.offers = {
      '@type': 'Offer',
      price: String(h.registration_fee),
      priceCurrency: h.fee_currency ?? 'INR',
      url: canonicalUrl,
      availability: 'https://schema.org/InStock',
    }
  }

  if (h.faqs?.length) {
    schema.about = {
      '@type': 'FAQPage',
      mainEntity: h.faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    }
  }

  return schema
}

function buildBreadcrumbSchema(h: HackathonDetail, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Hackathons', item: `${WEBSITE_BASE_URL}/hackathons` },
      { '@type': 'ListItem', position: 3, name: h.title, item: canonicalUrl },
    ],
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const h = await fetchHackathon(slug)

  if (!h) {
    return {
      title: 'Hackathon Not Found',
      description: 'This hackathon could not be found.',
      robots: { index: false, follow: false },
    }
  }

  const canonicalUrl = `${WEBSITE_BASE_URL}/hackathons/${h.slug}`
  const prizeStr = h.total_prize_pool ? ` | ₹${formatPrize(Number(h.total_prize_pool))} Prize Pool` : ''
  const modeStr = h.mode ? ` | ${h.mode.charAt(0).toUpperCase() + h.mode.slice(1)}` : ''
  const title = `${h.title}${prizeStr}${modeStr}`
  const description = (
    h.short_description ??
    h.tagline ??
    `Join ${h.title} on Riseflake. ${h.organizer_name ? `Organized by ${h.organizer_name}.` : ''} ${h.registration_type === 'free' ? 'Free to register.' : ''} Apply now.`
  ).slice(0, 160)

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Riseflake',
      type: 'website',
      ...(h.banner_image_url ? { images: [{ url: h.banner_image_url, width: 1200, height: 630, alt: h.title }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
    keywords: [
      h.title,
      h.category ?? '',
      ...(h.theme_tags ?? []),
      h.organizer_name ?? '',
      'hackathon india',
      'coding competition',
      'riseflake hackathon',
    ].filter(Boolean).join(', '),
    robots: { index: true, follow: true },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HackathonDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const h = await fetchHackathon(slug)

  if (!h) notFound()

  const canonicalUrl = `${WEBSITE_BASE_URL}/hackathons/${h.slug}`
  const appUrl = `https://app.riseflake.com/hackathons/${h.slug}`
  const prizeTotal = h.total_prize_pool ? Number(h.total_prize_pool) : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildEventSchema(h, canonicalUrl)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(h, canonicalUrl)) }} />

      <Navbar bgTransparent />

      <main className="bg-slate-100 min-h-screen pt-16">
        {/* Hero banner */}
        <div className="relative h-56 sm:h-72 bg-gradient-to-br from-indigo-600 to-violet-700 overflow-hidden">
          {h.banner_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={h.banner_image_url} alt={h.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
          )}
          <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-6">
            <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-3" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white">Home</Link>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <Link href="/hackathons" className="hover:text-white">Hackathons</Link>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-white/90 truncate max-w-[180px]">{h.title}</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">{h.title}</h1>
            {h.tagline && <p className="mt-2 text-white/80 text-sm sm:text-base max-w-2xl">{h.tagline}</p>}
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">

            {/* Main */}
            <div className="space-y-6">

              {/* Quick stats */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100">
                  <h2 className="text-sm font-semibold text-slate-700">At a glance</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-slate-100">
                  <StatCell icon={<Globe className="h-4 w-4" />} label="Mode" value={h.mode ? h.mode.charAt(0).toUpperCase() + h.mode.slice(1) : 'TBA'} accent="bg-blue-50" iconColor="text-blue-500" />
                  <StatCell icon={<Calendar className="h-4 w-4" />} label="Start Date" value={fmtDate(h.hackathon_start_date) ?? 'TBA'} accent="bg-indigo-50" iconColor="text-indigo-500" />
                  <StatCell icon={<Clock className="h-4 w-4" />} label="Registration Closes" value={fmtDate(h.registration_close_date) ?? 'TBA'} accent="bg-violet-50" iconColor="text-violet-500" />
                  <StatCell icon={<IndianRupee className="h-4 w-4" />} label="Prize Pool" value={prizeTotal ? (formatPrize(prizeTotal) ?? 'N/A') : 'N/A'} accent="bg-emerald-50" iconColor="text-emerald-500" />
                  <StatCell icon={<Users className="h-4 w-4" />} label="Participants" value={h.reg_count ? `${Number(h.reg_count).toLocaleString()} registered` : 'Open'} accent="bg-amber-50" iconColor="text-amber-500" />
                  <StatCell
                    icon={<Tag className="h-4 w-4" />}
                    label="Entry"
                    value={h.registration_type === 'free' ? 'Free' : h.registration_fee ? `₹${h.registration_fee}` : 'Paid'}
                    accent="bg-pink-50"
                    iconColor="text-pink-500"
                  />
                </div>
              </section>

              {/* Description */}
              {h.description && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-700">About this hackathon</h2>
                  </div>
                  <div
                    className="px-5 py-4 prose prose-sm max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{ __html: h.description }}
                  />
                </section>
              )}

              {/* Prizes */}
              {h.prizes && h.prizes.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <h2 className="text-sm font-semibold text-slate-700">Prizes</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {h.prizes.map((p, i) => (
                      <div key={i} className="px-5 py-4 flex items-start gap-4">
                        <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{p.title}</p>
                          {p.cash_amount && Number(p.cash_amount) > 0 && (
                            <p className="text-sm text-emerald-600 font-bold mt-0.5">{formatPrize(Number(p.cash_amount))}</p>
                          )}
                          {p.description && <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Rounds / Timeline */}
              {h.rounds && h.rounds.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-700">Rounds & Timeline</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {h.rounds.map((r, i) => (
                      <div key={i} className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                        {(r.start_date || r.end_date) && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {fmtDate(r.start_date)}{r.end_date ? ` → ${fmtDate(r.end_date)}` : ''}
                          </p>
                        )}
                        {r.description && <p className="text-xs text-slate-500 mt-1">{r.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQs */}
              {h.faqs && h.faqs.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-700">FAQs</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {h.faqs.map((f, i) => (
                      <div key={i} className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">{f.question}</p>
                        <p className="text-sm text-slate-600 mt-1">{f.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Eligibility */}
              {h.eligibility && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                    <h2 className="text-sm font-semibold text-slate-700">Eligibility</h2>
                  </div>
                  <div className="px-5 py-4 space-y-2 text-sm text-slate-700">
                    {h.eligibility.open_to_all && <p>Open to all participants.</p>}
                    {h.eligibility.allowed_education_levels?.length && (
                      <p><span className="font-medium">Education: </span>{h.eligibility.allowed_education_levels.join(', ')}</p>
                    )}
                    {h.eligibility.notes && <p>{h.eligibility.notes}</p>}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-24 self-start">

              {/* CTA card */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                {h.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={h.logo_url} alt={`${h.organizer_name ?? h.title} logo`} className="h-14 w-14 rounded-xl object-cover border border-slate-100 mb-4" />
                )}
                <h3 className="text-base font-bold text-slate-900">{h.title}</h3>
                {h.organizer_name && (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> {h.organizer_name}
                  </p>
                )}
                {prizeTotal && (
                  <p className="mt-3 text-2xl font-black text-emerald-600">{formatPrize(prizeTotal)}</p>
                )}
                <p className="text-[10px] text-slate-400 mb-4">{prizeTotal ? 'Total Prize Pool' : ''}</p>

                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Register Now <ExternalLink className="h-4 w-4" />
                </a>
                <p className="mt-2 text-[10px] text-slate-400 text-center">Opens on Riseflake App</p>
              </div>

              {/* Organizer */}
              {h.organizer_name && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Organizer</p>
                  <div className="flex items-center gap-3">
                    {h.organizer_logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={h.organizer_logo_url} alt={h.organizer_name} className="h-10 w-10 rounded-lg object-cover border border-slate-100" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {h.organizer_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{h.organizer_name}</p>
                      {h.organizer_type && <p className="text-xs text-slate-500 capitalize">{h.organizer_type}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Theme tags */}
              {h.theme_tags && h.theme_tags.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Themes</p>
                  <div className="flex flex-wrap gap-2">
                    {h.theme_tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contacts */}
              {h.contacts && h.contacts.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Contact</p>
                  {h.contacts.map((c, i) => (
                    <div key={i} className="space-y-1">
                      {c.name && <p className="text-sm font-medium text-slate-800">{c.name}</p>}
                      {c.email && <a href={`mailto:${c.email}`} className="text-xs text-indigo-600 hover:underline block">{c.email}</a>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function StatCell({ icon, label, value, accent, iconColor }: { icon: React.ReactNode; label: string; value: string; accent?: string; iconColor?: string }) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${accent ?? 'bg-slate-100'}`}>
        <span className={iconColor ?? 'text-slate-500'}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800 leading-snug">{value}</p>
      </div>
    </div>
  )
}
