"use client";

import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import CookieBody from "./CookieBody";

const CookiePolicy = () => {
    const router = useRouter();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
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
                                    <span className="font-semibold text-indigo-600">Cookie Policy</span>
                                </nav>
                                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Cookie Policy</h1>
                            </div>
                        </div>

                        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
                            <button
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
                                onClick={() => router.back()}
                                aria-label="Go back"
                            >
                                <FiArrowLeft color="black" />
                            </button>
                            <p className="text-lg font-semibold text-slate-900">Cookie Policy</p>
                        </div>

                        <div className="h-px w-full bg-slate-200 md:hidden"></div>

                        <div className="space-y-8 px-6 py-6 text-[15px] leading-relaxed text-slate-600 sm:text-base [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-800 [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-slate-800 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul.plain]:list-none [&_ul.plain]:pl-0 [&_a]:text-indigo-600 hover:[&_a]:underline [&_table]:mt-3 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-sm md:[&_table]:table [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-100 [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_td]:align-top [&_.callout]:my-4 [&_.callout]:rounded-lg [&_.callout]:border [&_.callout]:border-slate-200 [&_.callout]:bg-slate-50 [&_.callout]:p-4">
                            <CookieBody />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CookiePolicy;