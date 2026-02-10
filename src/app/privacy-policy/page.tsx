"use client";

import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
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
                                        <span className="font-semibold text-indigo-600">Privacy Policy</span>
                                    </nav>
                                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">Privacy Policy</h1>
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
                                <h1 className="text-lg font-semibold text-slate-900">Privacy Policy</h1>
                            </div>

                            <div className="h-px w-full bg-slate-200 md:hidden"></div>

                            <div className="space-y-8 px-6 py-6 text-[15px] leading-relaxed text-slate-600 sm:text-base">
    <section>
        <p>Last Updated Date : 08/01/2026 12:00 PM</p>
        <h2>1. Introduction</h2>
        <p>
            Welcome to <strong>ListedIndia</strong>, a digital employment and professional networking
            platform operated by <strong>Bold India Platforms Private Limited</strong>.
            We provide services through our website and mobile applications available on the
            Google Play Store and Apple App Store.
        </p>
        <p>
            This Privacy Policy explains how we collect, use, store, disclose, and protect
            your personal data in compliance with applicable Indian laws, including the
            Information Technology Act, 2000, Digital Personal Data Protection Act, 2023,
            and globally accepted data protection standards.
        </p>
    </section>

    <section>
        <h2>2. Information We Collect</h2>
        <p>We collect information in the following categories:</p>
        <ul>
            <li>
                <strong>Personal Information:</strong> Name, email address, phone number,
                date of birth, profile photo, resume details, education, employment history,
                and professional skills.
            </li>
            <li>
                <strong>Account Information:</strong> Login credentials, preferences,
                communication settings, and verification data.
            </li>
            <li>
                <strong>Usage & Technical Data:</strong> Device information, IP address,
                browser type, operating system, app usage data, cookies, and log files.
            </li>
            <li>
                <strong>Recruiter & Employer Data:</strong> Company details, job postings,
                business contact information, and hiring activity.
            </li>
        </ul>
    </section>

    <section>
        <h2>3. How We Use Your Information</h2>
        <p>Your information is used to:</p>
        <ul>
            <li>Create and manage user accounts</li>
            <li>Enable job discovery, professional networking, and recruitment services</li>
            <li>Facilitate communication between job seekers, recruiters, and employers</li>
            <li>Improve platform performance, features, and user experience</li>
            <li>Send service updates, alerts, and relevant notifications</li>
            <li>Ensure platform security, fraud prevention, and legal compliance</li>
        </ul>
    </section>

    <section>
        <h2>4. Information Sharing & Disclosure</h2>
        <p>
            We do <strong>not sell</strong> personal data. Information may be shared only in the
            following circumstances:
        </p>
        <ul>
            <li>With recruiters or employers when users apply for jobs or enable profile visibility</li>
            <li>With trusted service providers under strict confidentiality agreements</li>
            <li>To comply with legal obligations, court orders, or government requests</li>
            <li>During corporate restructuring, mergers, or acquisitions (with safeguards)</li>
        </ul>
    </section>

    <section>
        <h2>5. Data Security</h2>
        <p>
            We implement industry-standard administrative, technical, and physical safeguards
            to protect your data against unauthorized access, alteration, disclosure, or destruction.
            While we strive to protect your information, no digital platform can guarantee
            absolute security.
        </p>
    </section>

    <section>
        <h2>6. Data Retention</h2>
        <p>
            Personal data is retained only for as long as necessary to fulfill the purposes
            outlined in this policy or as required under applicable laws. Users may request
            deletion of their data subject to legal and regulatory requirements.
        </p>
    </section>

    <section>
        <h2>7. Your Rights</h2>
        <p>Depending on applicable law, you have the right to:</p>
        <ul>
            <li>Access and review your personal data</li>
            <li>Correct or update inaccurate information</li>
            <li>Withdraw consent where applicable</li>
            <li>Request deletion or restriction of processing</li>
            <li>Control profile visibility and communication preferences</li>
        </ul>
    </section>

    <section>
        <h2>8. Cookies & Tracking Technologies</h2>
        <p>
            We use cookies and similar technologies to enhance user experience, analyze usage,
            and improve platform functionality. You may control cookies through browser or
            device settings.
        </p>
    </section>

    <section>
        <h2>9. Children’s Privacy</h2>
        <p>
            ListedIndia is not intended for users under the age of 18. We do not knowingly
            collect personal data from minors.
        </p>
    </section>

    <section>
        <h2>10. Changes to This Privacy Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. Updates will be posted on
            this page, and continued use of our services constitutes acceptance of the revised policy.
        </p>
    </section>

    <section>
        <h2>11. Contact Information</h2>
        <p>
            If you have any questions, concerns, or data-related requests, please contact us:
        </p>
        <p>
            <strong>Company:</strong> Bold India Platforms Private Limited<br />
            <strong>Brand:</strong> ListedIndia<br />
            <strong>Email:</strong> hello@boldindia.in, support@listedindia.com<br />
            <strong>CIN:</strong> U85499PN2025PTC246360
        </p>
    </section>
</div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
};

export default PrivacyPolicy;