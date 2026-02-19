"use client";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

export default function Support() {
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
                  <span className="font-semibold text-indigo-600">Support</span>
                </nav>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Support</h1>
              </div>
            </div>
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" onClick={() => router.back()} aria-label="Go back">
                <FiArrowLeft color="black" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900">Support</h1>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-10 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section>
                <p>Last Updated Date: 08/01/2026 12:00 PM</p>
                <h2>Support</h2>
                <p>For any support queries, please email <a href="mailto:support@riseflake.com" className="text-blue-600 underline">support@riseflake.com</a> or use the contact form on our <a href="/contact" className="text-blue-600 underline">Contact</a> page.</p>
                <h2>Frequently Asked Questions</h2>
                <ul className="list-disc ml-6">
                  <li><strong>How do I reset my password?</strong> Use the "Forgot Password" link on the login page and follow the instructions sent to your email.</li>
                  <li><strong>How do I report a problem?</strong> Use the in-app reporting tools or email us at support@riseflake.com.</li>
                  <li><strong>How long does support take to respond?</strong> We aim to respond to all queries within 24 hours during business days.</li>
                </ul>
                <h2>Live Chat</h2>
                <p>For urgent issues, use our live chat feature available on the bottom right of the website during business hours.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
