export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20 pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-indigo-50 to-slate-50 rounded-full border border-indigo-100">
          <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
          <p className="text-sm font-semibold text-slate-700">Trusted career platform for modern professionals</p>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-6 leading-tight text-slate-900">
          Build a career with clarity, confidence, and the right opportunities
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
          Riseflake is a next-generation job portal and professional networking platform designed for ambitious professionals. Find verified roles, connect with hiring teams, and move forward with data-backed guidance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="https://app.riseflake.com/home"
            className="px-8 py-4 bg-gradient-modern text-white hover:shadow-2xl hover:shadow-indigo-400/40 rounded-full font-semibold text-lg transition-all"
          >
            Explore Jobs
          </a>
          <a
            href="#features"
            className="px-8 py-4 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-full font-semibold text-lg transition-all"
          >
            View Platform Features
          </a>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-slate-600">
          <div className="text-center">
            <p className="font-semibold text-2xl text-slate-900">50K+</p>
            <p>Active professionals</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
          <div className="text-center">
            <p className="font-semibold text-2xl text-slate-900">10K+</p>
            <p>Live opportunities</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
          <div className="text-center">
            <p className="font-semibold text-2xl text-slate-900">95%</p>
            <p>Placement success</p>
          </div>
        </div>
      </div>
    </section>
  )
}
