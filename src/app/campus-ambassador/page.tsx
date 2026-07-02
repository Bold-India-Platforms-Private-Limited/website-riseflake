'use client'

import Image from 'next/image'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CreditCard, IndianRupee, BadgeCheck, Gift, Star, Zap, ArrowRight, GraduationCap, CheckCircle2, Users, Clock } from 'lucide-react'

const APPLY_URL = 'https://app.riseflake.com/dashboard/campus-ambassador'

const MILESTONES = [
  {
    icon: <CreditCard className="h-6 w-6" />,
    signups: '100+',
    reward: 'Campus Ambassador ID Card',
    desc: 'Official CA ID Card — shareable on LinkedIn and your resume.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    dot: 'bg-amber-400',
  },
  {
    icon: <BadgeCheck className="h-6 w-6" />,
    signups: '300+',
    reward: 'Verified Certificate',
    desc: 'Digitally-signed PDF certificate — perfect for your portfolio.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    dot: 'bg-blue-400',
  },
  {
    icon: <IndianRupee className="h-6 w-6" />,
    signups: '15,000+',
    reward: '₹15,000 Cash Reward',
    desc: 'Onboard 15,000 unique users in a month to earn ₹15,000 cash.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    dot: 'bg-emerald-400',
  },
  {
    icon: <Gift className="h-6 w-6" />,
    signups: 'Elite Performer',
    reward: 'iPhone / MacBook / AirPods',
    desc: 'Premium gifts awarded to the very best campus ambassadors.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    iconBg: 'bg-violet-100',
    dot: 'bg-violet-400',
  },
]

const WHY = [
  { icon: '🏆', title: 'Real Rewards', desc: 'Cash, iPhones, MacBooks and AirPods for top performers.' },
  { icon: '📜', title: 'Verified Certificate', desc: 'Add a digitally signed certificate to your LinkedIn.' },
  { icon: '🌐', title: 'Grow Your Network', desc: 'Connect with peers, recruiters and industry professionals.' },
  { icon: '🚀', title: 'Leadership Experience', desc: 'Build real-world marketing and leadership skills.' },
]

const HOW = [
  { step: '01', title: 'Apply Online', desc: 'Fill the quick application form. 100% free, under 2 minutes.' },
  { step: '02', title: 'Get Approved', desc: 'Our team reviews your application within 2–3 business days.' },
  { step: '03', title: 'Share Your Link', desc: 'Get your unique CA referral link and share it with your college network.' },
  { step: '04', title: 'Earn Rewards', desc: 'Every sign-up through your link counts. Hit milestones, unlock rewards.' },
]

const TERMS = [
  'You must be a currently enrolled college student to apply.',
  'Each new user who registers using your unique CA link with a verified email counts as one registration.',
  'Duplicate accounts, self-referrals, bots, or any fraud results in permanent disqualification.',
  'Rewards are subject to verification. Riseflake audits registrations before awarding any reward.',
  '100+ registrations: Campus Ambassador ID Card (digital, shareable on LinkedIn).',
  '300+ registrations: Verified Certificate of Achievement (digitally signed PDF).',
  'When you onboard 15,000 unique new users monthly via college/student WhatsApp groups, community WhatsApp groups, LinkedIn posts, and other methods, you will receive ₹15,000.',
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

        {/* ── Hero — 2-column: text left, image right ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 text-white">
          {/* Background blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/8 blur-3xl" />
            <div className="absolute -bottom-24 right-10 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl" />
            <div className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-300/10 blur-2xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left — Text content */}
              <div>
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                  <GraduationCap className="h-4 w-4 text-yellow-300" />
                  Student Program · 100% Free
                </div>

                <h1 className="mb-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-5xl xl:text-6xl">
                  Become a<br />
                  <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
                    Campus Ambassador
                  </span>
                </h1>

                <p className="mb-8 text-lg text-white/85 leading-relaxed max-w-lg">
                  Represent Riseflake at your college, share your unique referral link, and start earning
                  up to <strong className="text-white">₹15,000 per month</strong> — plus your official CA ID Card,
                  verified certificates &amp; premium gifts.
                </p>

                {/* Quick milestone chips */}
                <div className="mb-8 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-white/90">
                    <Star className="h-4 w-4 text-yellow-300 shrink-0" />
                    <span><strong className="text-white">100+ signups</strong> → Official CA ID Card</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-white/90">
                    <BadgeCheck className="h-4 w-4 text-blue-200 shrink-0" />
                    <span><strong className="text-white">300+ signups</strong> → Verified Certificate</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-white/90">
                    <IndianRupee className="h-4 w-4 text-emerald-300 shrink-0" />
                    <span><strong className="text-white">15,000+ signups/month</strong> → ₹15,000 Cash Reward</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-white/90">
                    <Gift className="h-4 w-4 text-pink-300 shrink-0" />
                    <span><strong className="text-white">Top performers</strong> → iPhone / MacBook / AirPods</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={APPLY_URL}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-violet-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    <Zap className="h-4 w-4" />
                    Apply Now — It&apos;s Free
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    How It Works
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                {/* Trust signals */}
                <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    2–3 day review
                  </div>
                  <div className="h-3 w-px bg-white/25" />
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    No cost, no commitment
                  </div>
                  <div className="h-3 w-px bg-white/25" />
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Open to all students
                  </div>
                </div>
              </div>

              {/* Right — Hero image */}
              <div className="flex items-center justify-center lg:justify-end">
                <a href={APPLY_URL} target="_blank" rel="noopener noreferrer" className="block w-full max-w-sm lg:max-w-none">
                  <Image
                    src="/refer-win-banner.webp"
                    alt="Refer & Win — Apple Watch, MacBook, iPhone & More"
                    width={560}
                    height={560}
                    className="w-full rounded-3xl shadow-2xl shadow-black/30 transition-transform duration-300 hover:-translate-y-1"
                    priority
                  />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── Why Join ── */}
        <section className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Why Join?</h2>
              <p className="mt-2 text-slate-500">Real benefits for real students.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WHY.map((w) => (
                <div
                  key={w.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-indigo-200"
                >
                  <div className="mb-4 text-4xl">{w.icon}</div>
                  <div className="mb-1.5 text-base font-bold text-slate-900">{w.title}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{w.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Reward Milestones ── */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Reward Milestones</h2>
              <p className="mt-2 text-slate-500">The more you share, the more you earn.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.reward}
                  className={`relative flex flex-col rounded-2xl border ${m.border} ${m.bg} p-6 overflow-hidden`}
                >
                  {/* Step number watermark */}
                  <span className="absolute top-4 right-5 text-6xl font-black text-black/5 select-none leading-none">
                    {i + 1}
                  </span>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${m.iconBg} ${m.color}`}>
                    {m.icon}
                  </div>
                  <div className={`mb-1 text-xs font-bold uppercase tracking-widest ${m.color} opacity-80`}>
                    {m.signups} Signups
                  </div>
                  <div className="mb-2 text-lg font-extrabold text-slate-900 leading-snug">{m.reward}</div>
                  <div className="text-sm text-slate-500 leading-relaxed flex-1">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">How It Works</h2>
              <p className="mt-2 text-slate-500">Four simple steps to start earning.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {HOW.map((h) => (
                <div key={h.step} className="relative rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-extrabold text-white shadow-md shadow-indigo-200">
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
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl shadow-indigo-500/25 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />
              </div>
              <div className="relative z-10">
                <div className="mb-3 text-5xl">🎓</div>
                <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl">Ready to Represent Riseflake?</h2>
                <p className="mx-auto mb-8 max-w-lg text-white/80 text-base sm:text-lg">
                  Applications are reviewed within 2–3 business days. Join hundreds of student ambassadors already earning rewards.
                </p>
                <a
                  href={APPLY_URL}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-violet-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Zap className="h-5 w-5" />
                  Apply Now — It&apos;s Free
                </a>
                <p className="mt-4 text-sm text-white/50">No cost. No commitment. Just your referral link.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Terms ── */}
        <section className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-2xl font-extrabold text-slate-900">Terms &amp; Conditions</h2>
            <ul className="space-y-3">
              {TERMS.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                    {i + 1}
                  </span>
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
