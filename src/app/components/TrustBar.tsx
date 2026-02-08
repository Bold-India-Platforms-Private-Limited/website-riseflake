const companies = ['Google', 'Microsoft', 'Apple', 'Meta', 'Amazon', 'Tesla']

export default function TrustBar() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-slate-600 mb-8">Trusted by professionals at:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {companies.map((company) => (
            <div key={company} className="text-center py-4">
              <p className="font-semibold text-slate-400 tracking-wide">{company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
