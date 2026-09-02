'use client'

import { useEffect, useState } from 'react'
import {
  Mail, X, Copy, Check, ArrowRight, Rocket, GraduationCap,
  Sparkles, HeartHandshake, Briefcase, Send,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { WEBSITE_BASE_URL } from '../../lib/config'

const HR_EMAIL = 'hr@riseflake.com'

function gmailComposeUrl(subject: string) {
  const body = "Hi Riseflake Team,\n\nI'm interested in opportunities at Riseflake. Please find my resume attached.\n\nThanks!"
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(HR_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: WEBSITE_BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Careers', item: `${WEBSITE_BASE_URL}/careers` },
  ],
}

const benefits = [
  { icon: Rocket, title: 'Build & Ship Fast', desc: 'A collaborative, innovative team where your work reaches real users quickly.' },
  { icon: GraduationCap, title: 'Grow With Us', desc: 'Real ownership and opportunities for professional growth and learning.' },
  { icon: Sparkles, title: 'Fair Compensation', desc: 'Competitive pay and benefits that reflect the value you bring.' },
  { icon: HeartHandshake, title: 'Work-Life Balance', desc: 'Flexible work arrangements built around trust, not hours logged.' },
]

function ApplyModal({ open, onClose, subject }: { open: boolean; onClose: () => void; subject: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => { if (open) setCopied(false) }, [open])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(HR_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
      aria-describedby="apply-modal-desc"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="px-7 py-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <Mail size={26} className="text-indigo-600" />
          </div>

          <h2 id="apply-modal-title" className="text-xl font-bold text-slate-900">
            Apply to Riseflake
          </h2>
          <p id="apply-modal-desc" className="mt-2 text-sm text-slate-500 leading-relaxed">
            Share your resume with our HR team and we&apos;ll get back to you soon.
          </p>

          <div className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="truncate text-sm font-medium text-slate-800">{HR_EMAIL}</span>
            <button
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-indigo-600 hover:ring-indigo-200"
              aria-label="Copy email address"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <a
            href={gmailComposeUrl(subject)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
          >
            <Send size={15} />
            Send Email via Gmail
          </a>

          <a
            href={`mailto:${HR_EMAIL}?subject=${encodeURIComponent(subject)}`}
            className="mt-3 inline-block text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600 transition"
          >
            Or open your default mail app
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Careers() {
  const [modalOpen, setModalOpen] = useState(false)
  const [subject, setSubject] = useState('Job Application — Riseflake')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const openApply = (subj: string) => {
    setSubject(subj)
    setModalOpen(true)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar bgTransparent />

      <main className="min-h-screen bg-slate-100 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          {/* Hero */}
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
            <nav className="mb-5 flex items-center justify-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
              <a href="/" className="font-medium hover:text-indigo-600">Home</a>
              <ArrowRight size={12} className="text-slate-400" />
              <span className="font-medium text-slate-700">Careers</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">We&apos;re Hiring</p>
            <h1 className="mx-auto mt-2 max-w-2xl text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              Help Us Build India&apos;s Career Platform
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              We&apos;re a small, fast-moving team building the way India finds jobs and hires talent.
              If that excites you, we&apos;d love to hear from you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => openApply('Job Application — Riseflake')}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
              >
                <Briefcase size={16} />
                Apply Now
              </button>
              <a
                href={`mailto:${HR_EMAIL}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
              >
                <Mail size={16} />
                {HR_EMAIL}
              </a>
            </div>
          </section>

          {/* Why work with us */}
          <section className="mt-10">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">Why Work With Us?</h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                    <Icon size={20} className="text-indigo-600" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Open positions */}
          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Open Positions</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              We don&apos;t have specific roles listed right now, but we&apos;re always looking for
              talented, passionate people across engineering, design, and marketing. Send us your
              resume and tell us how you&apos;d like to contribute — we review every application.
            </p>
            <button
              onClick={() => openApply('Job Application — Riseflake')}
              className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
            >
              <Briefcase size={16} />
              Apply Now
            </button>
          </section>

          {/* Internships */}
          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Internships</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                  We offer internship opportunities for students and recent graduates looking to
                  get real, hands-on experience.
                </p>
              </div>
              <button
                onClick={() => openApply('Internship Application — Riseflake')}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
              >
                <GraduationCap size={16} />
                Apply for Internship
              </button>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-12 text-center shadow-sm sm:px-10">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Don&apos;t See Your Role?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-indigo-100 sm:text-base">
              We&apos;d still love to hear from you. Share your resume with us — great people always find a place at Riseflake.
            </p>
            <button
              onClick={() => openApply('Job Application — Riseflake')}
              className="mx-auto mt-7 flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 active:scale-95"
            >
              <Send size={16} />
              Share Your Resume
            </button>
          </section>
        </div>
      </main>

      <ApplyModal open={modalOpen} onClose={() => setModalOpen(false)} subject={subject} />

      <Footer />
    </>
  )
}
