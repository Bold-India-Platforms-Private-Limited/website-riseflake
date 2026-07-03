import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users, Trophy, IndianRupee, Globe } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { BLOG_API_URL, WEBSITE_BASE_URL } from '../../lib/config'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Hackathons & Coding Competitions in India 2025',
  description:
    'Find upcoming hackathons, coding competitions, and innovation challenges in India. Register free, win prizes, and build real projects. Discover the best hackathons for students and developers on Riseflake.',
  alternates: { canonical: `${WEBSITE_BASE_URL}/hackathons` },
  openGraph: {
    title: 'Hackathons & Coding Competitions in India 2025 | Riseflake',
    description:
      'Discover upcoming hackathons, coding contests, and innovation challenges. Win prizes and build your portfolio.',
    url: `${WEBSITE_BASE_URL}/hackathons`,
    siteName: 'Riseflake',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Hackathons & Competitions in India | Riseflake',
    description: 'Find and register for the best hackathons in India — free, open to students and developers.',
  },
  keywords:
    'hackathons india 2025, coding competitions, innovation challenges, student hackathons, online hackathons, prize money hackathons, riseflake hackathons',
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Hackathons', item: `${WEBSITE_BASE_URL}/hackathons` },
  ],
}

type Hackathon = {
  id: number
  slug: string
  title: string
  tagline?: string | null
  short_description?: string | null
  banner_image_url?: string | null
  logo_url?: string | null
  mode?: string | null
  category?: string | null
  organizer_name?: string | null
  registration_type?: string | null
  registration_fee?: number | null
  fee_currency?: string | null
  participation_type?: string | null
  hackathon_start_date?: string | null
  hackathon_end_date?: string | null
  registration_close_date?: string | null
  total_prize_pool?: number | null
  reg_count?: number | null
  location_display?: string | null
  is_featured?: boolean
  status?: string
}

async function fetchHackathons(): Promise<Hackathon[]> {
  try {
    const res = await fetch(`${BLOG_API_URL}/hackathons?limit=50&sort=newest`, {
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.hackathons ?? []
  } catch {
    return []
  }
}

function formatPrize(amount: number | null | undefined) {
  if (!amount) return null
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`
  return `₹${amount.toLocaleString()}`
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function HackathonsPage() {
  const hackathons = await fetchHackathons()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar bgTransparent />

      <main className="px-4 sm:px-6 lg:px-8 pt-20 pb-16 bg-slate-100 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
              <a href="/" className="hover:text-indigo-600 font-medium">Home</a>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-700 font-medium">Hackathons</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Riseflake Hackathons</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Hackathons & Competitions</h1>
            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-2xl">
              Discover upcoming hackathons, coding contests, and innovation challenges. Build real projects, win prizes, and grow your profile.
            </p>
          </div>

          {hackathons.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Trophy className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 text-sm">No hackathons available right now. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hackathons.map((h) => (
                <Link
                  key={h.id}
                  href={`/hackathons/${h.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                >
                  {/* Banner */}
                  <div className="relative h-36 bg-gradient-to-br from-indigo-500 to-violet-600 overflow-hidden">
                    {h.banner_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={h.banner_image_url}
                        alt={h.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Trophy className="h-16 w-16 text-white" />
                      </div>
                    )}
                    {h.is_featured && (
                      <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                    {h.registration_type === 'free' && (
                      <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Free
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4 gap-2">
                    <div className="flex items-start gap-3">
                      {h.logo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={h.logo_url}
                          alt={`${h.organizer_name ?? h.title} logo`}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-100 flex-shrink-0 -mt-7 relative z-10 bg-white shadow-sm"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {h.title}
                        </h2>
                        {h.organizer_name && (
                          <p className="text-xs text-slate-400 mt-0.5">by {h.organizer_name}</p>
                        )}
                      </div>
                    </div>

                    {h.short_description && (
                      <p className="text-xs text-slate-500 line-clamp-2">{h.short_description}</p>
                    )}

                    <div className="mt-auto pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                      {h.hackathon_start_date && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span>{formatDate(h.hackathon_start_date)}</span>
                        </div>
                      )}
                      {h.mode && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          {h.mode === 'online' ? (
                            <Globe className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          ) : (
                            <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          )}
                          <span className="capitalize">{h.mode}</span>
                        </div>
                      )}
                      {h.reg_count != null && Number(h.reg_count) > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Users className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span>{Number(h.reg_count).toLocaleString()} registered</span>
                        </div>
                      )}
                      {h.total_prize_pool != null && Number(h.total_prize_pool) > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                          <IndianRupee className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{formatPrize(Number(h.total_prize_pool))} prize pool</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
