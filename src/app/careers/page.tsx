"use client";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

export default function Careers() {
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
                  <span className="font-semibold text-indigo-600">Careers</span>
                </nav>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Careers</h1>
              </div>
            </div>
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" onClick={() => router.back()} aria-label="Go back">
                <FiArrowLeft color="black" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900">Careers</h1>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-10 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section>
                <p>Last Updated Date: 08/01/2026 12:00 PM</p>
                <h2>Join Our Team</h2>
                <p>We are always looking for talented, passionate individuals to join our mission. If you are interested in working at Riseflake, please send your resume to <a href="mailto:careers@riseflake.com" className="text-blue-600 underline">careers@riseflake.com</a>.</p>
                <h2>Why Work With Us?</h2>
                <ul className="list-disc ml-6">
                  <li>Collaborative, innovative, and inclusive work environment.</li>
                  <li>Opportunities for professional growth and learning.</li>
                  <li>Competitive compensation and benefits.</li>
                  <li>Flexible work arrangements and a focus on work-life balance.</li>
                </ul>
                <h2>Open Positions</h2>
                <p>Check back soon for open roles or reach out to us directly!</p>
                <h2>Internships</h2>
                <p>We also offer internship opportunities for students and recent graduates. Email <a href="mailto:interns@riseflake.com" className="text-blue-600 underline">interns@riseflake.com</a> to learn more.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
