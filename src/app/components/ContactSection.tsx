export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-[1400px] bg-white px-[5%] py-20 md:py-16">
      <div className="mb-16 text-center">
        <span className="inline-block rounded-full bg-[rgba(95,114,228,0.1)] px-4 py-2 text-sm font-semibold text-[#5f72e4]">
          Contact US
        </span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-800 sm:text-4xl">Let's work together</h2>
        <img
          src="/section-title-icon.png"
          alt=""
          className="ml-auto mr-[52%] -mt-9 h-16 w-40 object-contain"
        />
        <p className="text-sm text-slate-600 sm:text-base -mt-4">
          Any question or remark? just write us a message
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="rounded-[60px_0_0_0] bg-[#f8f9fa] p-8 sm:p-7 lg:p-8">
          <div className="relative mb-6 rounded-[50px_0_0_0] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:rounded-[50px_0_0_0]">
            <img
              src="/contact-customer-service.webp"
              alt="Contact Us"
              className="h-[400px] w-full rounded-[50px_0_0_0] object-cover sm:h-[300px] sm:rounded-[50px_0_0_0] lg:h-[400px]"
            />
            <img
              src="/contact-border.png"
              alt=""
              className="pointer-events-none absolute -left-[30px] -top-[30px] w-[150px] sm:-left-[25px] sm:-top-[25px] sm:w-[120px] lg:-left-[30px] lg:-top-[30px] lg:w-[150px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-xl">
                📧
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">Email</div>
                <div className="text-sm text-slate-600">hello@listedindia.com</div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f5e9] text-xl">
                📱
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">Phone</div>
                <div className="text-sm text-slate-600">+919209550273</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl bg-white p-12 shadow-[0_2px_12px_rgba(0,0,0,0.08)] sm:p-8">
            <h3 className="text-2xl font-semibold text-slate-800">Send a message</h3>
            <p className="mt-2 text-sm text-slate-500">
              If you would like to discuss anything related to payment, account, licensing, partnerships,
              or have pre-sales questions, you're at the right place.
            </p>

            <form className="mt-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="Samay Raina"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition focus:border-slate-300 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    placeholder="samayraina@gmail.com"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition focus:border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea
                  placeholder="Write a message..."
                  className="min-h-[115px] resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition focus:border-slate-300 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-fit rounded-lg bg-[#6b7ff5] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#5a6ee5]"
              >
                Send inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
