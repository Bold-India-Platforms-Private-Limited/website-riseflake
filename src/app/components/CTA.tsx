export default function CTA() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-modern opacity-10"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-semibold mb-6 text-slate-900">
          Ready to accelerate your career?
        </h2>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          Join thousands of professionals who are discovering opportunities, building meaningful connections, and growing with confidence.
        </p>
        <a
          href="https://app.riseflake.com/home"
          className="inline-block px-10 py-5 bg-gradient-modern text-white hover:shadow-2xl hover:shadow-indigo-400/50 rounded-full font-semibold text-lg transition-all"
        >
          Start Exploring Jobs
        </a>
      </div>
    </section>
  )
}
