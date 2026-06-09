'use client'

import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Trophy, Award, BadgeCheck, Gift, Star, Zap, ArrowRight, GraduationCap } from 'lucide-react'

const APPLY_URL = 'https://app.riseflake.com/dashboard/campus-ambassador'

const MILESTONES = [
  {
    icon: <Trophy className="h-7 w-7" />,
    signups: '100+',
    reward: 'Campus Ambassador Badge',
    desc: 'Official digital badge — shareable on LinkedIn and your resume.',
    color: '#D97706',
    bg: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    icon: <BadgeCheck className="h-7 w-7" />,
    signups: '150+',
    reward: 'Verified Certificate',
    desc: 'Digitally-signed certificate of achievement (PDF), perfect for your portfolio.',
    color: '#0165E9',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    icon: <Award className="h-7 w-7" />,
    signups: 'Top Performer',
    reward: 'Cash Reward',
    desc: 'Selected by Riseflake based on referral quality and performance.',
    color: '#16A34A',
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100 text-green-600',
  },
  {
    icon: <Gift className="h-7 w-7" />,
    signups: 'Elite Performer',
    reward: 'iPhone / MacBook / AirPods',
    desc: 'Premium gifts awarded to the very best campus ambassadors.',
    color: '#7C3AED',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    iconBg: 'bg-violet-100 text-violet-600',
  },
]

const WHY = [
  { icon: '🏆', title: 'Real Rewards', desc: 'Cash, iPhones, MacBooks and AirPods for top performers.' },
  { icon: '📜', title: 'Verified Certificate', desc: 'Add a digitally signed certificate to your LinkedIn profile.' },
  { icon: '🌐', title: 'Grow Your Network', desc: 'Connect with peers, recruiters and industry professionals.' },
  { icon: '🚀', title: 'Leadership Experience', desc: 'Build real-world marketing and leadership skills for your CV.' },
]

const HOW = [
  { step: '01', title: 'Apply Online', desc: 'Fill out the quick application form. 100% free, takes under 2 minutes.' },
  { step: '02', title: 'Get Approved', desc: 'Our team reviews your application within 2–3 business days.' },
  { step: '03', title: 'Share Your Link', desc: 'You get a unique CA referral link. Share it with your college network.' },
  { step: '04', title: 'Earn Rewards', desc: 'Every sign-up through your link counts. Hit milestones, unlock rewards.' },
]

const TERMS = [
  'You must be a currently enrolled college student to apply.',
  'Each new user who registers using your unique CA link with a verified email counts as one registration.',
  'Duplicate accounts, self-referrals, bots, or any fraud results in permanent disqualification.',
  'Rewards are subject to verification. Riseflake audits registrations before awarding any reward.',
  '100+ registrations: Campus Ambassador Badge (digital, shareable on LinkedIn).',
  '150+ registrations: Verified Certificate of Achievement (digitally signed PDF).',
  'Cash rewards and premium gifts are awarded exclusively to top performers at Riseflake\'s sole discretion.',
  'Riseflake reserves the right to select, verify, and publicly disclose top performers.',
  'Rewards are non-transferable and cannot be exchanged for cash (except the cash reward tier).',
  'Riseflake may modify or discontinue this program with 7 days\' notice to active ambassadors.',
  'Badge and certificate issuance may take up to 15 business days after the threshold is crossed.',
  'By applying, you agree to these terms and the Riseflake Terms of Service.',
]

export default function CampusAmbassadorPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-14 md:pt-16">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-4 py-20 sm:py-28 text-white">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/10 blur-2xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              <GraduationCap className="h-4 w-4" />
              Student Program · 100% Free
            </div>

            <h1 className="mb-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Become a Riseflake<br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Campus Ambassador
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/85 sm:text-xl leading-relaxed">
              Represent Riseflake at your college, grow your professional network, and earn real rewards —
              badges, verified certificates, cash &amp; premium gifts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={APPLY_URL}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-violet-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              >
                <Zap className="h-5 w-5" />
                Apply Now — It&apos;s Free
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                How It Works
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* quick stats */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-300" /><span>100+ signups → CA Badge</span></div>
              <div className="h-4 w-px bg-white/30" />
              <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-blue-200" /><span>150+ signups → Verified Certificate</span></div>
              <div className="h-4 w-px bg-white/30" />
              <div className="flex items-center gap-2"><Gift className="h-4 w-4 text-pink-300" /><span>Top performers → iPhone / MacBook</span></div>
            </div>
          </div>
        </section>

        {/* ── Why Join ── */}
        <section className="bg-slate-50 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">Why Join?</h2>
            <p className="mb-12 text-center text-slate-500">Real benefits for real students.</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {WHY.map((w) => (
                <div key={w.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-3 text-3xl">{w.icon}</div>
                  <div className="mb-1.5 font-bold text-slate-900">{w.title}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{w.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Reward Milestones ── */}
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-3 text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">Reward Milestones</h2>
            <p className="mb-12 text-center text-slate-500">The more you share, the more you earn.</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {MILESTONES.map((m) => (
                <div key={m.reward} className={`flex flex-col rounded-2xl border ${m.border} bg-gradient-to-br ${m.bg} p-6`}>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${m.iconBg}`}>
                    {m.icon}
                  </div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">{m.signups} Signups</div>
                  <div className="mb-2 text-lg font-extrabold text-slate-900 leading-snug">{m.reward}</div>
                  <div className="text-sm text-slate-500 leading-relaxed flex-1">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Refer & Win Banner ── */}
        <section className="px-4 py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <a href={APPLY_URL} target="_blank" rel="noopener noreferrer" className="block">
              <Image
                src="/refer-win-banner.webp"
                alt="Refer & Win — Apple Watch, MacBook, iPhone & More"
                width={900}
                height={600}
                className="w-full rounded-3xl shadow-2xl shadow-indigo-200/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-indigo-300/60"
                priority
              />
            </a>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="bg-gradient-to-br from-indigo-50 to-violet-50 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-3 text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">How It Works</h2>
            <p className="mb-12 text-center text-slate-500">Four simple steps to start earning.</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW.map((h) => (
                <div key={h.step} className="relative rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-extrabold text-white shadow-md">
                    {h.step}
                  </div>
                  <div className="mb-1.5 font-bold text-slate-900">{h.title}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 sm:p-12 text-center text-white shadow-2xl shadow-indigo-500/30">
            <div className="mb-2 text-4xl">🎓</div>
            <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl">Ready to Represent Riseflake?</h2>
            <p className="mx-auto mb-8 max-w-lg text-white/80">
              Applications are reviewed within 2–3 business days. Join hundreds of student ambassadors already earning rewards.
            </p>
            <a
              href={APPLY_URL}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-violet-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Zap className="h-5 w-5" />
              Apply Now — It&apos;s Free
            </a>
            <p className="mt-4 text-sm text-white/60">No cost. No commitment. Just your referral link.</p>
          </div>
        </section>

        {/* ── Terms ── */}
        <section className="bg-slate-50 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-2xl font-extrabold text-slate-900">Terms &amp; Conditions</h2>
            <ul className="space-y-3">
              {TERMS.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-center">
              <a
                href={APPLY_URL}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                I Agree — Apply Now
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
