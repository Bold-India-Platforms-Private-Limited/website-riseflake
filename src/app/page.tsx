'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch } from 'react-icons/fi'
import { Briefcase as BriefcaseIcon, GraduationCap } from 'lucide-react'
import { Zap, Rocket, Target, Globe, BarChart2, Briefcase, Users, Trophy, Star, BadgeCheck, Gift } from 'lucide-react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import AppDownloadSection from './components/AppDownloadSection'
import Brands from './components/Brands'
import CityCategories from './components/CityCategories'
import Categories from './components/Categories'
import Introducing from './components/Introducing'
import Testimonials from './components/Testimonials'
import Assessment from './components/Assessment'
import DownloadTheApp from './components/DownloadTheApp'
import ContactSection from './components/ContactSection'

const JOB_SUGGESTIONS = [
  'Data Analyst', 'Software Engineer', 'Product Manager', 'UI/UX Designer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Business Development', 'Digital Marketing', 'Sales Executive',
  'HR Manager', 'DevOps Engineer', 'Machine Learning Engineer', 'Content Writer',
]

const INTERNSHIP_SUGGESTIONS = [
  'Data Science Intern', 'Software Development Intern', 'Marketing Intern',
  'UI/UX Intern', 'HR Intern', 'Content Writing Intern',
  'Finance Intern', 'Business Analyst Intern', 'Graphic Design Intern',
  'Research Intern', 'Social Media Intern', 'Operations Intern',
]

export default function Home() {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggTab, setSuggTab] = useState<'jobs' | 'internships'>('jobs')
  const searchWrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChipClick = (label: string) => {
    setSearchQuery(label)
    setShowSuggestions(false)
    router.push(`/jobs?position=${encodeURIComponent(label)}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    const trimmed = searchQuery.trim()
    if (trimmed) {
      router.push(`/jobs?position=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/jobs')
    }
  }

  return (
    <>
      {/* Navigation - Modern Glassmorphism */}
      <Navbar bgTransparent />

      {/* Hero Section - Premium Modern Design */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20 pb-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto text-center z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-indigo-100 to-pink-100 rounded-full border border-indigo-200">
            <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-modern">
              Discover Your Next Career Move
            </p>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Rise Above</span>
            <br />
            <span className="text-slate-900">Your Career Limits</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto font-light">
            Riseflake is a job portal and professional networking platform designed for career growth. Discover job opportunities, connect with industry leaders, and find roles that match your skills.
          </p>

          <p className="text-sm text-slate-500 mb-10 flex items-center justify-center gap-1.5">
            <Zap className="h-4 w-4 text-indigo-400" />
            Browse active job listings from companies hiring now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://play.google.com/store/apps/details?id=com.riseflake.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-modern text-white hover:shadow-2xl hover:shadow-indigo-400/50 rounded-full font-bold text-lg transition-all"
            >
              <Rocket className="h-5 w-5" />
              Start Your Journey
            </a>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-full font-bold text-lg transition-all"
            >
              Learn More
            </button>
          </div>

          <div className="flex justify-center gap-8 text-sm text-slate-600 mb-12">
            <div>
              <p className="font-bold text-2xl text-slate-900">3L+</p>
              <p>Active Users</p>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div>
              <p className="font-bold text-2xl text-slate-900">5K+</p>
              <p>Job Listings</p>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div>
              <p className="font-bold text-2xl text-slate-900">92%</p>
              <p>Success Rate</p>
            </div>
          </div>

          {/* Search Bar */}
          <div ref={searchWrapperRef} className="relative max-w-3xl mx-auto mb-12">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative flex items-center gap-3 rounded-full border-2 border-slate-200 bg-white shadow-lg hover:border-indigo-300 transition-colors">
                <FiSearch className="absolute left-6 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search jobs, internships, roles…"
                  autoComplete="off"
                  className="flex-1 pl-14 pr-2 py-4 text-base text-slate-700 bg-transparent focus:outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 mr-2 bg-gradient-modern text-white rounded-full font-semibold text-base whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">

                {/* Tabs */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setSuggTab('jobs')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-600 border transition-all ${
                      suggTab === 'jobs'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                        : 'border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-500'
                    }`}
                  >
                    <BriefcaseIcon className="h-3.5 w-3.5" />
                    Jobs
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setSuggTab('internships')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-600 border transition-all ${
                      suggTab === 'internships'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                        : 'border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-500'
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    Internships
                  </button>
                </div>

                <div className="h-px bg-slate-100 mb-3" />

                <p className="text-[11px] font-700 tracking-widest uppercase text-slate-400 mb-2.5">
                  {suggTab === 'jobs' ? 'Popular Job Searches' : 'Popular Internship Searches'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {(suggTab === 'jobs' ? JOB_SUGGESTIONS : INTERNSHIP_SUGGESTIONS).map((label) => (
                    <button
                      key={label}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleChipClick(label)}
                      className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-sm font-500 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all hover:-translate-y-px hover:shadow-sm"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Partners Section */}
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500 mb-4">Proud to Support</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <img
                src="https://assets.riseflake.com/images/logos/startup-india.png"
                alt="Startup India"
                width={100}
                height={80}
              />
              <img
                src="https://assets.riseflake.com/images/logos/mle.png"
                alt="Ministry of Labour and Employment"
                width={100}
                height={80}
              />
              <img
                src="https://assets.riseflake.com/images/logos/mca.png"
                alt="MCA"
                width={100}
                height={80}
              />
            </div>
          </div>
        </div>
      </section>

      <Brands />

      {/* ── Campus Ambassador Banner ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mx-auto max-w-[1200px]">
          <a
            href="/campus-ambassador"
            className="group relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-7 sm:p-10 shadow-2xl shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/40"
          >
            {/* decorative blobs */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-pink-400/15 blur-2xl" />
            </div>

            {/* emoji */}
            <div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur text-5xl shadow-inner">
              🎓
            </div>

            {/* text */}
            <div className="relative z-10 flex-1 text-center sm:text-left">
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur">
                <Star className="h-3 w-3 text-yellow-300" />
                Student Program · 100% Free
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl leading-tight">
                Become a Campus Ambassador
              </h2>
              <p className="mt-1.5 text-sm text-white/80 max-w-xl leading-relaxed">
                Represent Riseflake at your college, share your link, and earn real rewards — CA badges, verified certificates, cash &amp; premium gifts.
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-white/70">
                <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-yellow-300" />100+ signups → CA Badge</span>
                <span className="h-3 w-px bg-white/30" />
                <span className="flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5 text-blue-200" />150+ → Verified Certificate</span>
                <span className="h-3 w-px bg-white/30" />
                <span className="flex items-center gap-1"><Gift className="h-3.5 w-3.5 text-pink-300" />Top performers → iPhone / MacBook</span>
              </div>
            </div>

            {/* CTA */}
            <div className="relative z-10 flex shrink-0 flex-col items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-lg transition-all group-hover:shadow-xl">
                <Zap className="h-4 w-4" />
                Apply Now
              </span>
              <span className="text-xs text-white/60">2–3 day review</span>
            </div>
          </a>
        </div>
      </section>

      <Categories />

      <Introducing />

      <Testimonials />

      <CityCategories />

      <Assessment />

      {/* FAQ Section */}
      <section id="faq" className="mx-auto max-w-[1400px] bg-white px-[5%] py-20 z-10 relative">
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-600">
            FAQ
          </span>
          <h2 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-4xl md:text-[2.5rem]">
            Frequently asked questions
          </h2>
          <img
            src="/section-title-icon.png"
            alt=""
            className="mx-auto -mt-6 h-16 w-40 object-contain"
          />
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Browse through these FAQs to find answers to commonly asked questions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div className="lg:sticky lg:top-8">
            <div className="h-[250px] overflow-hidden rounded-xl bg-transparent sm:h-[300px] lg:h-[400px]">
              <img
                src="/faq-boy-with-logos.webp"
                alt="FAQ Illustration"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                question: 'Is Riseflake free for job seekers?',
                answer:
                  'Yes. Creating a profile, browsing jobs, applying, and networking with professionals on Riseflake is completely free for candidates.',
              },
              {
                question: 'How does Riseflake match candidates to jobs?',
                answer:
                  'We use smart matching based on skills, experience, preferences, and recruiter requirements to ensure candidates see the most relevant opportunities.',
              },
              {
                question: 'Are companies and job listings verified?',
                answer:
                  'Yes. Every employer and job listing on Riseflake goes through a verification process to ensure authenticity, safety, and quality opportunities.',
              },
              {
                question: 'Can students and fresh graduates use Riseflake?',
                answer:
                  'Absolutely. Riseflake is designed for students, fresh graduates, and working professionals, offering internships, entry-level roles, and full-time career opportunities.',
              },
            ].map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={faq.question}
                  className={`flex w-full cursor-pointer flex-col justify-between rounded-xl border-2 bg-white px-6 py-5 shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.10)] ${isOpen ? 'border-indigo-500' : 'border-transparent'
                    }`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <p className="text-base font-semibold text-slate-900 sm:text-lg">
                      {faq.question}
                    </p>
                    <span
                      className={`flex h-5 w-5 items-center justify-center text-slate-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden text-sm text-slate-600 transition-all ${isOpen ? 'mt-4 max-h-40 opacity-100' : 'mt-0 max-h-0 opacity-0'
                      }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <AppDownloadSection />

      {/* Features Section - Modern Cards with Glassmorphism (moved to bottom) */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-slate-900">
              Why Professionals Choose <span className="text-gradient">Riseflake</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience a job portal and professional networking platform built for career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                gradient: 'from-indigo-500 to-violet-600',
                title: 'AI-Powered Job Matching',
                description: 'Our intelligent algorithm matches you with job opportunities based on your skills, experience, and career aspirations. Get personalized recommendations daily.',
                keywords: 'AI job matching, smart recommendations, personalized jobs',
              },
              {
                icon: Globe,
                gradient: 'from-sky-500 to-indigo-600',
                title: 'Professional Networking',
                description: 'Connect with industry leaders, mentors, and like-minded professionals. Build meaningful relationships that accelerate your career growth and open new doors.',
                keywords: 'networking, professional connections, industry leaders',
              },
              {
                icon: BarChart2,
                gradient: 'from-emerald-500 to-teal-600',
                title: 'Career Analytics & Insights',
                description: 'Track your job search progress with detailed analytics. Get market insights, salary trends, and skill demand forecasts to make informed career decisions.',
                keywords: 'career analytics, market trends, salary insights',
              },
              {
                icon: Briefcase,
                gradient: 'from-amber-500 to-orange-600',
                title: 'Verified Job Listings',
                description: 'Explore verified job opportunities from companies across various industries. Every listing is reviewed for authenticity.',
                keywords: 'verified jobs, job listings, verified companies',
              },
              {
                icon: Users,
                gradient: 'from-rose-500 to-pink-600',
                title: 'Direct Company Access',
                description: 'Contact hiring managers and recruiters directly. Skip the middleman and establish meaningful professional relationships with decision-makers.',
                keywords: 'direct hiring, recruiter contact, company access',
              },
              {
                icon: Trophy,
                gradient: 'from-violet-500 to-purple-600',
                title: 'Premium Resources & Training',
                description: 'Access exclusive interview preparation guides, resume templates, and professional development resources. Learn from industry experts.',
                keywords: 'training resources, interview prep, professional development',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="group glass rounded-2xl p-8 hover:shadow-xl transition-all hover:bg-white/80"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{feature.description}</p>
                  <p className="text-xs text-slate-400">{feature.keywords}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer - SEO Optimized */}
      <ContactSection />
      <DownloadTheApp />
      <Footer />
    </>
  )
}

