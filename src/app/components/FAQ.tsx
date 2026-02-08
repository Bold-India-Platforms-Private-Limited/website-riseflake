const faqs = [
  {
    q: 'What makes Riseflake different from other job portals?',
    a: 'Riseflake combines AI-powered job matching with professional networking and verified listings. The result is a more focused, higher-quality experience.',
  },
  {
    q: 'How does professional networking work on Riseflake?',
    a: 'You can connect with industry peers, mentors, and hiring teams. Direct messaging enables meaningful conversations with decision-makers.',
  },
  {
    q: 'Is Riseflake free to use?',
    a: 'Yes. Creating a profile and browsing listings is free. Premium features are available for advanced tools and training.',
  },
  {
    q: 'How does the job matching algorithm work?',
    a: 'Our AI analyzes your skills, experience, and goals to surface roles aligned with your profile and preferences.',
  },
  {
    q: 'Can I contact hiring managers directly?',
    a: 'Yes. Verified recruiters and hiring managers are available for direct outreach within the platform.',
  },
  {
    q: 'What resources are included for career growth?',
    a: 'Access interview preparation, resume templates, market insights, and expert-led guidance to stay competitive.',
  },
]

export default function FAQ() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-16 text-slate-900">
          Frequently asked questions
        </h2>

        <div className="space-y-6">
          {faqs.map((item) => (
            <div key={item.q} className="glass rounded-xl p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{item.q}</h3>
              <p className="text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
