"use client";

import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

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
                            <h1 className="text-lg font-semibold text-slate-900">Cookie Policy</h1>
                        </div>

                        <div className="h-px w-full bg-slate-200 md:hidden"></div>

                        <div className="space-y-8 px-6 py-6 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                        <section>
                            <p>Last Updated Date : 08/01/2026 12:00 PM</p>
                            <h2>1. Introduction</h2>
                            <p>
                                This Cookie Policy explains how <strong>Riseflake</strong>, operated by 
                                <strong> Bold India Platforms Private Limited</strong>, uses cookies and similar 
                                tracking technologies on our website and mobile applications. By using our services, 
                                you consent to the use of cookies as described in this policy.
                            </p>
                        </section>

                        <section>
                            <h2>2. What Are Cookies?</h2>
                            <p>
                                Cookies are small text files that are placed on your device (computer, smartphone, or tablet) 
                                when you visit a website. They help websites remember your preferences, improve user experience, 
                                and provide analytics about how the site is used.
                            </p>
                            <p>
                                Cookies can be "session cookies" (deleted when you close your browser) or "persistent cookies" 
                                (remain on your device until they expire or you delete them).
                            </p>
                        </section>

                        <section>
                            <h2>3. Types of Cookies We Use</h2>
                            <p>We use the following types of cookies on our platform:</p>
                            <ul>
                                <li>
                                    <strong>Essential Cookies:</strong> These cookies are necessary for the website to 
                                    function properly. They enable core features like security, authentication, and session 
                                    management. Without these cookies, certain services cannot be provided.
                                </li>
                                <li>
                                    <strong>Performance & Analytics Cookies:</strong> These cookies collect information 
                                    about how visitors use our website, such as which pages are visited most often and if 
                                    users receive error messages. This data helps us improve website performance and user experience.
                                </li>
                                <li>
                                    <strong>Functionality Cookies:</strong> These cookies remember your choices and 
                                    preferences (such as language, region, or login information) to provide enhanced, 
                                    personalized features.
                                </li>
                                <li>
                                    <strong>Advertising & Targeting Cookies:</strong> These cookies are used to deliver 
                                    relevant advertisements and track ad campaign effectiveness. They may also limit the 
                                    number of times you see an advertisement.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Third-Party Cookies</h2>
                            <p>
                                We may use third-party service providers who set cookies on our behalf to perform 
                                analytics, advertising, and other services. These third parties include:
                            </p>
                            <ul>
                                <li>Google Analytics (for website analytics)</li>
                                <li>Facebook Pixel (for advertising and remarketing)</li>
                                <li>LinkedIn Insight Tag (for professional networking analytics)</li>
                                <li>Other trusted partners for performance monitoring and security</li>
                            </ul>
                            <p>
                                These third-party cookies are governed by the respective privacy policies of these providers.
                            </p>
                        </section>

                        <section>
                            <h2>5. How We Use Cookies</h2>
                            <p>Cookies help us to:</p>
                            <ul>
                                <li>Authenticate users and maintain secure sessions</li>
                                <li>Remember your preferences and settings</li>
                                <li>Analyze website traffic and user behavior</li>
                                <li>Improve platform functionality and user experience</li>
                                <li>Deliver personalized content and job recommendations</li>
                                <li>Show relevant advertisements based on your interests</li>
                                <li>Prevent fraud and ensure platform security</li>
                            </ul>
                        </section>

                        <section>
                            <h2>6. Managing Cookies</h2>
                            <p>
                                You have the right to accept or reject cookies. Most web browsers automatically accept 
                                cookies, but you can modify your browser settings to decline cookies if you prefer.
                            </p>
                            <p>To manage cookies, you can:</p>
                            <ul>
                                <li>Adjust your browser settings to block or delete cookies</li>
                                <li>Use browser privacy or incognito mode</li>
                                <li>Opt out of third-party advertising cookies through industry opt-out tools</li>
                                <li>Disable cookies in your device settings for mobile applications</li>
                            </ul>
                            <p>
                                <strong>Note:</strong> Disabling cookies may affect the functionality of our website 
                                and limit your access to certain features.
                            </p>
                        </section>

                        <section>
                            <h2>7. Cookie Retention Period</h2>
                            <p>
                                The retention period for cookies varies based on their type:
                            </p>
                            <ul>
                                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (ranging from days to years) unless manually deleted</li>
                            </ul>
                        </section>

                        <section>
                            <h2>8. Updates to This Cookie Policy</h2>
                            <p>
                                We may update this Cookie Policy from time to time to reflect changes in technology, 
                                legal requirements, or our business practices. Any updates will be posted on this page 
                                with a revised "Last Updated" date.
                            </p>
                        </section>

                        <section>
                            <h2>9. Contact Information</h2>
                            <p>
                                If you have any questions or concerns about our use of cookies, please contact us:
                            </p>
                            <p>
                                <strong>Company:</strong> Bold India Platforms Private Limited<br />
                                <strong>Brand:</strong> Riseflake<br />
                                <strong>Email:</strong> hello@boldindia.in, support@riseflake.com<br />
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

export default CookiePolicy;