"use client";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

export default function TrustAndSafety() {
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
                  <span className="font-semibold text-indigo-600">Trust & Safety</span>
                </nav>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Trust & Safety</h1>
              </div>
            </div>
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" onClick={() => router.back()} aria-label="Go back">
                <FiArrowLeft color="black" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900">Trust & Safety</h1>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-10 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section>
                <p>Last Updated Date: 08/01/2026 12:00 PM</p>
                <h2>1. Our Commitment</h2>
                <p>Riseflake is committed to providing a safe and trustworthy platform for all users. We employ advanced security measures, regular audits, and strict moderation to protect your data and experience. Our team is trained to respond quickly to any security or safety concerns.</p>
                <h2>2. User Responsibilities</h2>
                <ul className="list-disc ml-6">
                  <li>Follow all community guidelines and terms of service.</li>
                  <li>Report any suspicious, fraudulent, or harmful activity immediately.</li>
                  <li>Protect your account credentials and never share them with others.</li>
                  <li>Respect the privacy and safety of other users.</li>
                </ul>
                <h2>3. Platform Safety Features</h2>
                <ul className="list-disc ml-6">
                  <li>End-to-end encryption for sensitive data.</li>
                  <li>24/7 monitoring for unusual or malicious activity.</li>
                  <li>Verified employer and recruiter profiles.</li>
                  <li>Easy-to-use reporting and blocking tools for users.</li>
                </ul>
                <h2>4. Reporting Issues</h2>
                <p>If you encounter any trust or safety concerns, please contact us at <a href="mailto:support@riseflake.com" className="text-blue-600 underline">support@riseflake.com</a> or use the in-app reporting tools. We investigate all reports promptly and take appropriate action.</p>
                <h2>5. Policy Updates</h2>
                <p>We regularly review and update our trust and safety policies. Please check this page for the latest information.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
