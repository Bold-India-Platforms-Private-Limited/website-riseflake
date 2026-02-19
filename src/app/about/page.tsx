"use client";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

export default function About() {
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
                  <span className="font-semibold text-indigo-600">About</span>
                </nav>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">About Us</h1>
              </div>
            </div>
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" onClick={() => router.back()} aria-label="Go back">
                <FiArrowLeft color="black" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900">About Us</h1>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-10 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section>
                <p>Last Updated Date: 08/01/2026 12:00 PM</p>
                <h2>Who We Are</h2>
                <p>Riseflake is a digital employment and professional networking platform operated by Bold India Platforms Private Limited. We connect job seekers, employers, and professionals across India with innovative technology and a commitment to trust and safety.</p>
                <h2>Our Mission</h2>
                <p>To empower individuals and organizations to achieve their career and hiring goals through a modern, secure, and user-friendly platform.</p>
                <h2>Our Values</h2>
                <ul className="list-disc ml-6">
                  <li>Integrity and transparency in all our operations.</li>
                  <li>Innovation to drive better outcomes for users.</li>
                  <li>Commitment to privacy, security, and user empowerment.</li>
                  <li>Building a supportive and inclusive community.</li>
                </ul>
                <h2>Our Team</h2>
                <p>Our team consists of passionate professionals from diverse backgrounds, all dedicated to making career growth accessible and rewarding for everyone.</p>
                <h2>Contact Us</h2>
                <p>Want to know more? <a href="/contact" className="text-blue-600 underline">Contact us</a> or explore our <a href="/careers" className="text-blue-600 underline">Careers</a> page.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
