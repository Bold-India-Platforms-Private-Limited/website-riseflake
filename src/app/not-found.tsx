"use client";
import Link from "next/link";
import { FiHome, FiSearch, FiArrowLeft } from "react-icons/fi";
import Footer from "./components/Footer";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Top Header / Breadcrumb area (Simulated for 404) */}
            <div className="w-full bg-white border-b border-slate-200">
                <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center gap-3">
                    <Link
                        href="/"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition"
                        aria-label="Go back home"
                    >
                        <FiArrowLeft className="text-xl" />
                    </Link>
                    <h1 className="text-lg font-semibold text-slate-900">Page Not Found</h1>
                </div>
            </div>

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-xl w-full text-center space-y-8">
                    {/* Animated 404 Illustration placeholder/CSS */}
                    <div className="relative">
                        <div className="text-[120px] md:text-[180px] font-black text-slate-200 select-none leading-none">
                            404
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white">
                                <span className="text-5xl md:text-6xl" role="img" aria-label="lost">🔍</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Oops! We can&apos;t find that page.</h2>
                        <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
                            The link you followed might be broken, or the page may have been moved. Let&apos;s get you back on track.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200/50"
                        >
                            <FiHome className="text-lg" />
                            Back to Home
                        </Link>
                        <Link
                            href="/jobs"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition"
                        >
                            <FiSearch className="text-lg" />
                            Explore Jobs
                        </Link>
                    </div>

                    {/* Quick Links section */}
                    <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        <div className="space-y-2">
                            <span className="font-bold text-slate-900 block">Candidate</span>
                            <ul className="space-y-1 text-slate-500">
                                <li><Link href="/jobs" className="hover:text-indigo-600 transition">Find Jobs</Link></li>
                                <li><Link href="/internships" className="hover:text-indigo-600 transition">Internships</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <span className="font-bold text-slate-900 block">Employer</span>
                            <ul className="space-y-1 text-slate-500">
                                <li><Link href="/companies" className="hover:text-indigo-600 transition">Post a Job</Link></li>
                                <li><Link href="/about" className="hover:text-indigo-600 transition">About Us</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <span className="font-bold text-slate-900 block">Support</span>
                            <ul className="space-y-1 text-slate-500">
                                <li><Link href="/contact" className="hover:text-indigo-600 transition">Contact Us</Link></li>
                                <li><Link href="/support" className="hover:text-indigo-600 transition">Help Center</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <span className="font-bold text-slate-900 block">Legal</span>
                            <ul className="space-y-1 text-slate-500">
                                <li><Link href="/privacy-policy" className="hover:text-indigo-600 transition">Privacy</Link></li>
                                <li><Link href="/terms-of-service" className="hover:text-indigo-600 transition">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
