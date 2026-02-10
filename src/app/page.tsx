'use client'

import { useState } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import AppDownloadSection from './components/AppDownloadSection'

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 3000)
  }

  return (
    <>
      {/* Navigation - Modern Glassmorphism */}
      <Navbar />

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
              ✨ The Future of Job Searching is Here
            </p>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Rise Above</span>
            <br />
            <span className="text-slate-900">Your Career Limits</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto font-light">
            Riseflake is the next-generation job portal and professional networking platform designed for ambitious professionals. Discover job opportunities from top companies, connect with industry leaders, and accelerate your career growth with AI-powered recommendations.
          </p>

          <p className="text-sm text-slate-500 mb-10">
            ⚡ 10K+ Active Job Listings • 5K+ Companies Hiring • 95% Success Rate
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://app.riseflake.com/home"
              className="px-8 py-4 bg-gradient-modern text-white hover:shadow-2xl hover:shadow-indigo-400/50 rounded-full font-bold text-lg transition-all"
            >
              🚀 Start Your Journey
            </a>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-full font-bold text-lg transition-all"
            >
              Learn More
            </button>
          </div>

          <div className="flex justify-center gap-8 text-sm text-slate-600">
            <div>
              <p className="font-bold text-2xl text-slate-900">50K+</p>
              <p>Active Users</p>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div>
              <p className="font-bold text-2xl text-slate-900">10K+</p>
              <p>Job Listings</p>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div>
              <p className="font-bold text-2xl text-slate-900">95%</p>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-slate-600 mb-8">Trusted by professionals at:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {['Google', 'Microsoft', 'Apple', 'Meta', 'Amazon', 'Tesla'].map((company) => (
              <div key={company} className="text-center py-4">
                <p className="font-semibold text-slate-400">{company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards with Glassmorphism */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-slate-900">
              Why Professionals Choose <span className="text-gradient">Riseflake</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the most advanced job portal and professional networking platform built for career growth in 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'AI-Powered Job Matching',
                description: 'Our intelligent algorithm matches you with job opportunities based on your skills, experience, and career aspirations. Get personalized recommendations daily.',
                keywords: 'AI job matching, smart recommendations, personalized jobs',
              },
              {
                icon: '🌐',
                title: 'Professional Networking',
                description: 'Connect with industry leaders, mentors, and like-minded professionals. Build meaningful relationships that accelerate your career growth and open new doors.',
                keywords: 'networking, professional connections, industry leaders',
              },
              {
                icon: '📊',
                title: 'Career Analytics & Insights',
                description: 'Track your job search progress with detailed analytics. Get market insights, salary trends, and skill demand forecasts to make informed career decisions.',
                keywords: 'career analytics, market trends, salary insights',
              },
              {
                icon: '💼',
                title: 'Verified Job Listings',
                description: 'Discover thousands of verified job opportunities from top companies across industries. Every listing is reviewed for authenticity and quality.',
                keywords: 'verified jobs, job listings, verified companies',
              },
              {
                icon: '🤝',
                title: 'Direct Company Access',
                description: 'Contact hiring managers and recruiters directly. Skip the middleman and establish meaningful professional relationships with decision-makers.',
                keywords: 'direct hiring, recruiter contact, company access',
              },
              {
                icon: '🏆',
                title: 'Premium Resources & Training',
                description: 'Access exclusive interview preparation guides, resume templates, and professional development resources. Learn from industry experts.',
                keywords: 'training resources, interview prep, professional development',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group glass rounded-2xl p-8 hover:shadow-xl transition-all hover:bg-white/80"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{feature.description}</p>
                <p className="text-xs text-slate-400">{feature.keywords}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-slate-900">
              Your Path to <span className="text-gradient">Career Success</span>
            </h2>
            <p className="text-xl text-slate-600">Four simple steps to land your dream job on Riseflake</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Set up your professional profile showcasing your skills, experience, and achievements. Let employers discover you.',
              },
              {
                step: '02',
                title: 'Get Matched',
                description: 'Our AI analyzes your profile and recommends perfect job opportunities. Browse curated listings or wait for recommendations.',
              },
              {
                step: '03',
                title: 'Connect & Apply',
                description: 'Reach out to hiring managers directly or submit applications. Network with professionals in your field.',
              },
              {
                step: '04',
                title: 'Land Your Dream Job',
                description: 'Attend interviews and receive offers. Start your new journey with confidence and career growth.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="glass rounded-2xl p-8 text-center h-full">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-modern mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-modern"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">
            The Impact of <span className="text-gradient">Riseflake</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { metric: '50,000+', label: 'Active Professionals', icon: '👥' },
              { metric: '10,000+', label: 'Job Opportunities', icon: '💼' },
              { metric: '5,000+', label: 'Hiring Companies', icon: '🏢' },
              { metric: '95%', label: 'Placement Success', icon: '✅' },
            ].map((stat, idx) => (
              <div key={idx} className="glass rounded-2xl p-8 text-center">
                <p className="text-5xl mb-4">{stat.icon}</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-modern mb-2">
                  {stat.metric}
                </p>
                <p className="text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Success Stories from <span className="text-gradient">Riseflake</span> Users
          </h2>
          <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their careers using Riseflake's job portal and professional networking platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                title: 'Senior Software Engineer at Google',
                company: 'Google',
                quote:
                  "Riseflake's AI matching algorithm found my perfect role in just 2 weeks. The professional networking features helped me build connections that led to my current position.",
              },
              {
                name: 'Michael Torres',
                title: 'Product Manager at Meta',
                company: 'Meta',
                quote:
                  "The platform's direct company access feature is revolutionary. I contacted my future manager directly and had a conversation before even applying. Game-changing.",
              },
              {
                name: 'Priya Sharma',
                title: 'UX Designer at Apple',
                company: 'Apple',
                quote:
                  "Every job recommendation was relevant to my career goals. The career analytics helped me understand my market value and negotiate a better salary.",
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="glass rounded-2xl p-8 hover:shadow-lg transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.title}</p>
                  <p className="text-xs text-slate-500">Works at {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="mx-auto max-w-[1400px] bg-white px-[5%] py-20">
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
                src="/faq-boy-with-logos.png"
                alt="FAQ Illustration"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                question: 'Is ListedIndia free for job seekers?',
                answer:
                  'Yes. Creating a profile, browsing jobs, applying, and networking with professionals on ListedIndia is completely free for candidates.',
              },
              {
                question: 'Do companies need to pay to post jobs?',
                answer:
                  'We offer both free and premium hiring plans. Companies can post jobs for free, while premium plans provide advanced hiring tools, higher visibility, and faster shortlisting.',
              },
              {
                question: 'How does ListedIndia match candidates to jobs?',
                answer:
                  'We use smart matching based on skills, experience, preferences, and recruiter requirements to ensure candidates see the most relevant opportunities.',
              },
              {
                question: 'Are companies and job listings verified?',
                answer:
                  'Yes. Every employer and job listing on ListedIndia goes through a verification process to ensure authenticity, safety, and quality opportunities.',
              },
              {
                question: 'Can students and fresh graduates use ListedIndia?',
                answer:
                  'Absolutely. ListedIndia is designed for students, fresh graduates, and working professionals, offering internships, entry-level roles, and full-time career opportunities.',
              },
            ].map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={faq.question}
                  className={`flex w-full cursor-pointer flex-col justify-between rounded-xl border-2 bg-white px-6 py-5 shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition hover:shadow-[0_6px_18px_rgba(0,0,0,0.10)] ${
                    isOpen ? 'border-indigo-500' : 'border-transparent'
                  }`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <p className="text-base font-semibold text-slate-900 sm:text-lg">
                      {faq.question}
                    </p>
                    <span
                      className={`flex h-5 w-5 items-center justify-center text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180' : 'rotate-0'
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
                    className={`overflow-hidden text-sm text-slate-600 transition-all ${
                      isOpen ? 'mt-4 max-h-40 opacity-100' : 'mt-0 max-h-0 opacity-0'
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

      {/* CTA Section - High Converting */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-modern opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-slate-900">
            Ready to Transform Your <span className="text-gradient">Career?</span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Join 50,000+ professionals who are discovering opportunities, building meaningful connections, and accelerating their career growth on Riseflake. Your dream job is just a few clicks away.
          </p>
          <a
            href="https://app.riseflake.com/home"
            className="inline-block px-10 py-5 bg-gradient-modern text-white hover:shadow-2xl hover:shadow-indigo-400/50 rounded-full font-bold text-lg transition-all"
          >
            Start Exploring Jobs Today
          </a>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4 text-slate-900">Stay Updated</h3>
          <p className="text-center text-slate-600 mb-8">
            Get weekly job alerts, career tips, and industry insights tailored to your profile and goals.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your professional email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-modern text-white font-bold rounded-full hover:shadow-lg transition-all"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
          <p className="text-center text-xs text-slate-500 mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer - SEO Optimized */}
      <Footer />
    </>
  )
}

