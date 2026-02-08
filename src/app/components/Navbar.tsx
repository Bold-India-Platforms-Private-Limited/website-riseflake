export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <img src="/logo.webp" alt="Riseflake logo" className="h-6 w-6 object-contain" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Riseflake</h1>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <a href="/jobs" className="hover:text-indigo-600 transition">Jobs</a>
            <a href="/companies" className="hover:text-indigo-600 transition">Companies</a>
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition">Success Stories</a>
          </div>

          <div className="flex items-center gap-3 md:hidden text-sm font-semibold text-slate-700">
            <a href="/jobs" className="hover:text-indigo-600 transition">Jobs</a>
            <a href="/companies" className="hover:text-indigo-600 transition">Companies</a>
          </div>

          <a
            href="https://app.riseflake.com/home"
            className="hidden md:inline-flex px-5 py-2.5 bg-gradient-modern text-white hover:shadow-lg hover:shadow-indigo-400/50 rounded-full font-semibold transition-all"
          >
            Find Jobs
          </a>
        </div>
      </div>
    </nav>
  )
}
