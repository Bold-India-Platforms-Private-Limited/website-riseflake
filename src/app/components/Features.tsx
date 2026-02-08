const features = [
  {
    title: 'AI-Powered Job Matching',
    description:
      'Personalized recommendations based on skills, experience, and career goals. Stay informed with updates aligned to your profile.',
  },
  {
    title: 'Professional Networking',
    description:
      'Build meaningful relationships with peers, mentors, and hiring teams. Connect with decision-makers to move faster.',
  },
  {
    title: 'Career Analytics & Insights',
    description:
      'Track applications, understand market demand, and make smarter decisions with clear, actionable insights.',
  },
  {
    title: 'Verified Job Listings',
    description:
      'Every role is reviewed for quality and authenticity, reducing noise and improving response rates.',
  },
  {
    title: 'Direct Company Access',
    description:
      'Reach hiring managers and recruiters directly to build trust before you apply.',
  },
  {
    title: 'Resources & Training',
    description:
      'Interview preparation, resume templates, and expert-led guidance to keep your growth on track.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-slate-900">
            Why professionals choose <span className="text-gradient">Riseflake</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A modern job platform designed to help you navigate opportunities with clarity and credibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group glass rounded-2xl p-8 hover:shadow-xl transition-all hover:bg-white/80"
            >
              <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
