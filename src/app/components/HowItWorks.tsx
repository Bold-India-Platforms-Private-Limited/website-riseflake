const steps = [
  {
    step: '01',
    title: 'Create Your Profile',
    description: 'Showcase your skills, experience, and career goals so employers can discover you faster.',
  },
  {
    step: '02',
    title: 'Get Matched',
    description: 'Receive AI-powered recommendations tailored to your profile and preferences.',
  },
  {
    step: '03',
    title: 'Connect & Apply',
    description: 'Engage with recruiters and hiring teams directly, then apply with confidence.',
  },
  {
    step: '04',
    title: 'Advance Your Career',
    description: 'Prepare, interview, and secure roles that align with your long-term goals.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-slate-900">
            A clear path to <span className="text-gradient">career success</span>
          </h2>
          <p className="text-lg text-slate-600">Four focused steps to find the right opportunity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => (
            <div key={item.step} className="relative">
              <div className="glass rounded-2xl p-8 text-center h-full">
                <div className="text-5xl font-semibold text-transparent bg-clip-text bg-gradient-modern mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-modern"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
