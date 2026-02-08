const testimonials = [
  {
    name: 'Sarah Chen',
    title: 'Senior Software Engineer, Google',
    quote:
      'Riseflake surfaced roles that matched my experience precisely. The direct access to hiring teams helped me move quickly through the process.',
  },
  {
    name: 'Michael Torres',
    title: 'Product Manager, Meta',
    quote:
      'The platform offers a professional, streamlined experience. I connected with the right stakeholders and received clear feedback.',
  },
  {
    name: 'Priya Sharma',
    title: 'UX Designer, Apple',
    quote:
      'The analytics and market insights helped me understand my positioning and confidently negotiate a stronger offer.',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4 text-slate-900">
          Success stories from <span className="text-gradient">Riseflake</span> professionals
        </h2>
        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
          Join thousands of professionals who advanced their careers using Riseflake's job portal and networking platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="glass rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="flex gap-1 mb-4 text-amber-400 text-lg">★★★★★</div>
              <p className="text-slate-700 mb-6 leading-relaxed">“{testimonial.quote}”</p>
              <div>
                <p className="font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-600">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
