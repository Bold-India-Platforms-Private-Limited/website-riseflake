"use client";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
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
              <h1 className="text-lg font-semibold text-slate-900">Contact Us</h1>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-10 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section>
                <p>Last Updated Date: 08/01/2026 12:00 PM</p>
                <h2>Contact Information</h2>
                <ul className="list-disc ml-6">
                  <li>Email: <a href="mailto:support@riseflake.com" className="text-blue-600 underline">support@riseflake.com</a></li>
                  <li>Phone: +91-9876543210</li>
                  <li>Support Hours: Monday to Friday, 9:00 AM – 6:00 PM IST</li>
                </ul>
                <h2>Business Address</h2>
                <p>Bold India Platforms Pvt. Ltd.,<br/> 123, Tech Park, Pune, India</p>
                <h2>Contact Form</h2>
                <p>For quick queries, please use our <a href="/support" className="text-blue-600 underline">Support</a> page or fill out the contact form below:</p>
                <form className="mt-4 grid gap-4 max-w-lg">
                  <input type="text" placeholder="Your Name" className="border rounded px-3 py-2" required />
                  <input type="email" placeholder="Your Email" className="border rounded px-3 py-2" required />
                  <textarea placeholder="Your Message" className="border rounded px-3 py-2" rows={4} required></textarea>
                  <button type="submit" className="bg-indigo-600 text-white rounded px-4 py-2 font-semibold hover:bg-indigo-700 transition">Send Message</button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
