'use client'

import { useState } from 'react'
import { Copy, Check, Linkedin, Twitter, Share2 } from 'lucide-react'

export default function ShareCard({ slug, companyName }: { slug: string; companyName: string }) {
  const [copied, setCopied] = useState(false)

  const url = `https://riseflake.com/companies/${slug}`
  const text = `Check out ${companyName} on Riseflake`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('input')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareLinks = [
    {
      label: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      className: 'bg-[#0A66C2] hover:bg-[#004182] text-white',
    },
    {
      label: 'X / Twitter',
      icon: <Twitter className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      className: 'bg-slate-900 hover:bg-slate-700 text-white',
    },
  ]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
          <Share2 className="h-3.5 w-3.5 text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">Share this profile</h3>
      </div>

      {/* URL row with copy */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
        <span className="text-xs text-slate-500 truncate flex-1 min-w-0">
          riseflake.com/companies/{slug}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
            copied
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Social share buttons */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {shareLinks.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-colors ${s.className}`}
          >
            {s.icon}
            {s.label}
          </a>
        ))}
      </div>
    </div>
  )
}
