"use client";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiAlertCircle, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

const REASONS = [
    "No longer using the account",
    "Duplicated by mistake",
    "Privacy concerns",
    "Receiving too many emails/notifications",
    "Found a job elsewhere",
    "Other"
];

export default function DeleteAccount() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        mobile: "",
        reason: "",
        customMessage: ""
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            window.scrollTo(0, 0);
        }, 1500);
    };

    if (submitted) {
        return (
            <>
                <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                                <FiCheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Request Submitted</h1>
                        <p className="text-slate-600">
                            Your account deletion request has been successfully received.
                            As per our policy, your account and all associated data will be permanently removed from our servers
                            and database within <strong>90 days</strong>.
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full bg-indigo-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-indigo-700 transition"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-slate-100">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col pb-20">
                    <div className="bg-white md:rounded-b-2xl overflow-hidden shadow-sm">
                        {/* Breadcrumbs (Desktop) */}
                        <div className="hidden w-full bg-slate-100/70 md:block">
                            <div className="px-6 py-3">
                                <nav className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="cursor-pointer font-medium text-slate-700 hover:text-indigo-600" onClick={() => router.push("/")}>Website</span>
                                    <span className="text-slate-400"><FiArrowRight /></span>
                                    <span className="cursor-pointer font-medium text-slate-700 hover:text-indigo-600" onClick={() => router.push("/")}>Home</span>
                                    <span className="text-slate-400"><FiArrowRight /></span>
                                    <span className="font-semibold text-indigo-600">Delete Account</span>
                                </nav>
                            </div>
                        </div>

                        {/* Header (Mobile-Friendly) */}
                        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:static md:border-none">
                            <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 md:hidden" onClick={() => router.back()} aria-label="Go back">
                                <FiArrowLeft />
                            </button>
                            <h1 className="text-xl font-bold text-slate-900 md:text-3xl md:px-0">Delete Account</h1>
                        </div>

                        <div className="h-px w-full bg-slate-200 md:hidden"></div>

                        <div className="px-6 py-8 max-w-3xl">
                            <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8 flex gap-4">
                                <div className="shrink-0">
                                    <FiAlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="font-bold text-red-900">Important Instruction</h2>
                                    <p className="text-red-800 text-sm leading-relaxed">
                                        Once you submit this request, your access to the RiseFlake platform will be disabled.
                                        Your profile, resumes, applications, and networking history will be queued for permanent deletion.
                                        This process is irreversible after the 90-day grace period.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <section>
                                    <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <FiTrash2 className="text-red-500" /> Account Deletion Steps
                                    </h2>
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="text-indigo-600 font-bold mb-1">Step 1</div>
                                            <p className="text-sm text-slate-600">Fill in your registered email and mobile number.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="text-indigo-600 font-bold mb-1">Step 2</div>
                                            <p className="text-sm text-slate-600">Select the reason for leaving to help us improve.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="text-indigo-600 font-bold mb-1">Step 3</div>
                                            <p className="text-sm text-slate-600">Verify and submit the request for processing.</p>
                                        </div>
                                    </div>
                                </section>

                                <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-inner">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="your@email.com"
                                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-white"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+91 XXXXX XXXXX"
                                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-white"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700">Reason for leaving</label>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {REASONS.map((r) => (
                                                <label
                                                    key={r}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${formData.reason === r
                                                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500"
                                                            : "border-slate-200 bg-white hover:border-slate-300"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="reason"
                                                        required
                                                        className="hidden"
                                                        value={r}
                                                        checked={formData.reason === r}
                                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                                    />
                                                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${formData.reason === r ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                                                        }`}>
                                                        {formData.reason === r && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <span className="text-sm">{r}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Additional Comments (Optional)</label>
                                        <textarea
                                            placeholder="Please tell us how we can improve..."
                                            rows={4}
                                            className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-white"
                                            value={formData.customMessage}
                                            onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full sm:w-max bg-red-600 text-white rounded-lg px-8 py-3.5 font-bold hover:bg-red-700 transition shadow-lg shadow-red-200/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Delete My Account Permanently
                                                </>
                                            )}
                                        </button>
                                        <p className="mt-4 text-xs text-slate-500 text-center sm:text-left">
                                            By clicking the button above, you acknowledge that your account data will be permanently removed within 90 days.
                                        </p>
                                    </div>
                                </form>
                            </div>

                            <section className="mt-16 space-y-6 text-slate-600 border-t border-slate-200 pt-10">
                                <h2 className="text-xl font-bold text-slate-800 font-semibold">Data Policy & Removal Process</h2>
                                <div className="space-y-4 text-sm leading-relaxed">
                                    <p>
                                        <strong>Timeline:</strong> Once the deletion request is submitted, your account enters a 90-day &quot;grace period&quot;. During the first 7 days, your account will be deactivated and hidden from other users.
                                    </p>
                                    <p>
                                        <strong>Data Removal:</strong> All your personal identification information, including name, email, phone number, resumes, and saved jobs, will be purged from our active databases and backup servers within 90 days.
                                    </p>
                                    <p>
                                        <strong>Residual Data:</strong> Some non-identifiable data (like aggregated hiring trends) may be retained for analytical purposes, but it will no longer be linked to you.
                                    </p>
                                    <p>
                                        <strong>Support:</strong> If you change your mind within the first 48 hours, you can reach out to <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline font-medium">support@riseflake.com</a> to request a cancellation of the deletion process.
                                    </p>
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
