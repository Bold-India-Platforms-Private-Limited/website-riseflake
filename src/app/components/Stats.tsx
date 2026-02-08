const stats = [
  { metric: '50,000+', label: 'Active professionals' },
  { metric: '10,000+', label: 'Live opportunities' },
  { metric: '5,000+', label: 'Hiring companies' },
  { metric: '95%', label: 'Placement success' },
]

export default function Stats() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-16 text-slate-900">
          Measurable impact with <span className="text-gradient">Riseflake</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-8 text-center">
              <p className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-modern mb-2">
                {stat.metric}
              </p>
              <p className="text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
