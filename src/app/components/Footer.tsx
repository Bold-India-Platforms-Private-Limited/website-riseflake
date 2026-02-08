export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <img src="/logo.webp" alt="Riseflake logo" className="h-4 w-4 object-contain" />
              </div>
              <h4 className="font-semibold text-lg text-slate-900">Riseflake</h4>
            </a>
            <p className="text-slate-600 text-sm leading-relaxed">
              A trusted job portal and professional networking platform built for career growth.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-slate-900">Job Portal</h5>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="https://app.riseflake.com/home" className="hover:text-indigo-600 transition">
                  Find Jobs
                </a>
              </li>
              <li>
                <a href="https://app.riseflake.com/home" className="hover:text-indigo-600 transition">
                  Browse Companies
                </a>
              </li>
              <li>
                <a href="https://app.riseflake.com/home" className="hover:text-indigo-600 transition">
                  Job Search Tips
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-slate-900">Networking</h5>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="https://app.riseflake.com/home" className="hover:text-indigo-600 transition">
                  Connect Professionals
                </a>
              </li>
              <li>
                <a href="https://app.riseflake.com/home" className="hover:text-indigo-600 transition">
                  Networking Tips
                </a>
              </li>
              <li>
                <a href="https://app.riseflake.com/home" className="hover:text-indigo-600 transition">
                  Career Growth
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-slate-900">Resources</h5>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-indigo-600 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-slate-900">Legal</h5>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="/privacy-policy" className="hover:text-indigo-600 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="hover:text-indigo-600 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className="hover:text-indigo-600 transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-sm">
              © 2024-2026 Riseflake. Transforming careers through trusted hiring connections.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition text-sm font-medium">
                Twitter
              </a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition text-sm font-medium">
                LinkedIn
              </a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition text-sm font-medium">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
