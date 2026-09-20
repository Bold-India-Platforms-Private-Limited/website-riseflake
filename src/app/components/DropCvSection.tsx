'use client'

import { useCallback, useRef, useState } from 'react'
import { UploadCloud, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { API_BASE_URL } from '../../lib/config'
import {
  extractTextFromFile,
  extractContactFromText,
  isSupportedResumeFile,
  type ExtractedContact,
} from '../../utils/resumeContactExtractor'

type Status = 'idle' | 'parsing' | 'review' | 'submitting' | 'success' | 'error'

const MAX_FILE_BYTES = 8 * 1024 * 1024

export default function DropCvSection() {
  const [status, setStatus] = useState<Status>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [fields, setFields] = useState<ExtractedContact>({ fullName: '', email: '', mobileNo: '' })
  const [errorText, setErrorText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setErrorText('')

    if (!isSupportedResumeFile(file)) {
      setStatus('error')
      setErrorText('Please upload a PDF or DOCX file.')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setStatus('error')
      setErrorText('That file is a bit large — please upload a CV under 8MB.')
      return
    }

    setStatus('parsing')
    try {
      const text = await extractTextFromFile(file)
      setFields(extractContactFromText(text))
      setStatus('review')
    } catch (err) {
      setStatus('error')
      setErrorText(err instanceof Error ? err.message : 'Could not read that file.')
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const onSubmit = async () => {
    setStatus('submitting')
    setErrorText('')
    try {
      const res = await fetch(`${API_BASE_URL}/resume-drop-contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          full_name: fields.fullName,
          email: fields.email,
          mobile_no: fields.mobileNo,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message || 'Something went wrong. Please try again.')
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorText(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const reset = () => {
    setStatus('idle')
    setFields({ fullName: '', email: '', mobileNo: '' })
    setErrorText('')
  }

  return (
    <section className="mx-auto max-w-[1400px] bg-white px-[5%] py-20 md:py-16">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-100 bg-gradient-to-br from-[#f5f6ff] to-white p-10 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[rgba(95,114,228,0.1)] px-4 py-2 text-sm font-semibold text-[#5f72e4]">
            New · Get Discovered
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-800 sm:text-4xl">
            Can&apos;t find the right fit?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
            Drop your CV and let recruiters reach out to you. We&apos;ll pull out your name, email
            and mobile number automatically so you don&apos;t have to type a thing.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            100% on-device, so your file is never uploaded anywhere
          </p>
        </div>

        <div className="mt-8">
          {(status === 'idle' || status === 'error') && (
            <>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
                  isDragging
                    ? 'border-[#6b7ff5] bg-[#f0f1ff]'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                <UploadCloud className="h-9 w-9 text-[#6b7ff5]" />
                <div className="text-sm font-medium text-slate-700">Drop CV here, or click to browse</div>
                <div className="text-xs text-slate-400">PDF or DOCX, up to 8MB</div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={onFileInputChange}
                className="hidden"
              />
              {status === 'error' && errorText && (
                <p className="mt-3 text-center text-sm text-red-600">{errorText}</p>
              )}
            </>
          )}

          {status === 'parsing' && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#6b7ff5]" />
              <div className="text-sm font-medium text-slate-600">Reading your CV on this device…</div>
            </div>
          )}

          {status === 'review' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-5">
              <div className="text-sm font-semibold text-slate-800">
                Here&apos;s what we found — check it over before sending
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field
                  label="Full Name"
                  value={fields.fullName}
                  onChange={(v) => setFields((f) => ({ ...f, fullName: v }))}
                />
                <Field
                  label="Email"
                  value={fields.email}
                  onChange={(v) => setFields((f) => ({ ...f, email: v }))}
                />
                <Field
                  label="Mobile No."
                  value={fields.mobileNo}
                  onChange={(v) => setFields((f) => ({ ...f, mobileNo: v }))}
                />
              </div>
              {errorText && <p className="mt-3 text-sm text-red-600">{errorText}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!fields.fullName || !fields.email || !fields.mobileNo}
                  className="rounded-lg bg-[#6b7ff5] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5a6ee5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Get Discovered
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  Start over
                </button>
              </div>
            </div>
          )}

          {status === 'submitting' && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#6b7ff5]" />
              <div className="text-sm font-medium text-slate-600">Sending your details…</div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-12 text-center">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              <div className="text-sm font-semibold text-emerald-800">
                You&apos;re in! Recruiters can now discover you.
              </div>
              <button
                type="button"
                onClick={reset}
                className="mt-1 text-sm font-medium text-emerald-700 underline underline-offset-2"
              >
                Drop another CV
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-slate-300 focus:outline-none"
      />
    </div>
  )
}
