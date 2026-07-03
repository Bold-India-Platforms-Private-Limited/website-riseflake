"use client";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Building2, Rocket, FileText, Globe, MapPin, Mail } from "lucide-react";
import Footer from "../components/Footer";

export default function Contact() {
  const router = useRouter();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <div className="min-h-screen bg-slate-100">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col">
          <div className="bg-white">
            <div className="hidden w-full bg-slate-100/70 md:block">
              <div className="px-6 py-3">
                <nav className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="cursor-pointer font-medium text-slate-700 hover:text-indigo-600" onClick={() => router.push("/")}>Website</span>
                  <span className="text-slate-400"><FiArrowRight /></span>
                  <span className="cursor-pointer font-medium text-slate-700 hover:text-indigo-600" onClick={() => router.push("/")}>Home</span>
                  <span className="text-slate-400"><FiArrowRight /></span>
                  <span className="font-semibold text-indigo-600">Contact</span>
                </nav>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Contact Us</h1>
              </div>
            </div>
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" onClick={() => router.back()} aria-label="Go back">
                <FiArrowLeft color="black" />
              </button>
              <p className="text-lg font-semibold text-slate-900">Contact Us</p>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-10 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section className="space-y-6">
                <div>
                  <p className="mb-4"><strong>Last Updated:</strong> March 05, 2026</p>
                  <h2 className="text-2xl font-semibold text-slate-800 mb-2">Company Information</h2>
                  <p className="text-slate-500 mb-6">Bold India Platforms Private Limited — the company behind RiseFlake</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-4.5 w-4.5 text-blue-600 h-[18px] w-[18px]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Company Name</h3>
                      <p>Bold India Platforms Private Limited</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Rocket className="h-[18px] w-[18px] text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Brand Name</h3>
                      <p>RiseFlake</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-amber-100 flex items-center justify-center">
                      <FileText className="h-[18px] w-[18px] text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">CIN</h3>
                      <p>U85499PN2025PTC246360</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-sky-100 flex items-center justify-center">
                      <Globe className="h-[18px] w-[18px] text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Company Website</h3>
                      <a href="https://www.boldindia.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.boldindia.in</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-rose-100 flex items-center justify-center">
                      <MapPin className="h-[18px] w-[18px] text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Registered Office</h3>
                      <p>Sn 242/1/2 Baner, Tejaswini Soc, DP Road, N.I.A., Pune, Maharashtra 411045, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Mail className="h-[18px] w-[18px] text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Email Us</h3>
                      <div className="flex flex-wrap gap-x-4">
                        <a href="mailto:hello@boldindia.in" className="text-indigo-600 hover:underline">hello@boldindia.in</a>
                        <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200">
                  <h2 className="text-2xl font-semibold text-slate-800 mb-4">Contact Form</h2>
                  <p className="mb-6">For quick queries, please use our <a href="/support" className="text-indigo-600 hover:underline">Support</a> page or fill out the contact form below:</p>
                  <form className="grid gap-4 max-w-lg">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input type="text" placeholder="Your Name" className="border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" required />
                      <input type="email" placeholder="Your Email" className="border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" required />
                    </div>
                    <textarea placeholder="Your Message" className="border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" rows={4} required></textarea>
                    <button type="submit" className="bg-indigo-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200/50 w-full sm:w-max">Send Message</button>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
