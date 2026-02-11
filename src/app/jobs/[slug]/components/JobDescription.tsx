'use client'

import DOMPurify from 'dompurify'

export default function JobDescription({ html }: { html?: string | null }) {
  if (!html) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-600">
        Job description is not available for this role.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Role overview</h2>
      <div
        className="job-description text-sm text-slate-700 leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(html || '', {
            ALLOWED_TAGS: [
              'p',
              'b',
              'i',
              'u',
              'strong',
              'em',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'ul',
              'ol',
              'li',
              'blockquote',
              'code',
              'pre',
              'span',
              'div',
            ],
            ALLOWED_ATTR: ['style', 'class', 'align'],
          }),
        }}
      />
    </div>
  )
}
