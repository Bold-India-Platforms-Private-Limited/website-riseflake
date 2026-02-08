'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 3000)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-3xl font-semibold text-center mb-4 text-slate-900">Stay updated</h3>
        <p className="text-center text-slate-600 mb-8">
          Receive weekly job alerts, career insights, and curated resources tailored to your goals.
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
            className="px-8 py-4 bg-gradient-modern text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-4">We respect your privacy. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
