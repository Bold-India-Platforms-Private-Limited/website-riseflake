import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function ProfileNotFound() {
  return (
    <>
      <Navbar bgTransparent />
      <main className="min-h-screen bg-slate-50 pt-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h1>
          <p className="text-slate-500 mb-8">
            This profile doesn&apos;t exist or may have been removed. Discover professionals on Riseflake.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://app.riseflake.com/network"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
            >
              Browse network
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
