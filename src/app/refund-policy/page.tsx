"use client";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

export default function RefundPolicy() {
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
                  <span className="font-semibold text-indigo-600">Refund Policy</span>
                </nav>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Refund Policy</h1>
              </div>
            </div>
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" onClick={() => router.back()} aria-label="Go back">
                <FiArrowLeft color="black" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900">Refund Policy</h1>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-10 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section>
                <p className="mb-2"><strong>Version 1.0</strong></p>
                <p><strong>Last Updated:</strong> March 05, 2026 &nbsp;|&nbsp; <strong>Effective Date:</strong> March 05, 2026</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Introduction</h2>
                <p>
                  This Refund Policy outlines the terms and conditions regarding payments and refunds on <strong>RiseFlake</strong>, a digital employment and professional networking platform operated by <strong>Bold India Platforms Private Limited</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We provide services through our website (www.riseflake.com) and mobile applications available on the Google Play Store and Apple App Store (collectively, the &quot;Platform&quot;).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Free Services</h2>
                <p>RiseFlake currently provides all its services completely free of charge to all users, including but not limited to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Job Seekers:</strong> Account creation, profile building, job discovery, job applications, professional networking, skill listing, resume sharing, and all related features</li>
                  <li><strong>Recruiters &amp; Employers:</strong> Company profile creation, job posting, candidate discovery, and hiring-related features</li>
                  <li><strong>Networking:</strong> Connecting with professionals, mentorship, community engagement, events, and chat/messaging services</li>
                  <li><strong>All Platform Features:</strong> Profile completion tools, college listings, company listings, iJobs, and all other features available on the Platform</li>
                </ul>
                <p className="mt-3">
                  Since all services on the Platform are offered free of cost, no payments are required from users for accessing or using any feature of RiseFlake. Therefore, the question of refunds does not arise under normal circumstances.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. No Charges, No Refunds</h2>
                <p>As RiseFlake does not charge any fees, subscription costs, or premium payments for any of its services:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>There are no paid plans, subscriptions, or premium tiers on the Platform at this time</li>
                  <li>There are no in-app purchases available on the Platform</li>
                  <li>Users are not required to make any payment to access any feature or service</li>
                  <li>Since no payments are collected, no refunds are applicable</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4. Unauthorized or Fraudulent Charges</h2>
                <p>RiseFlake does not collect any payments from users. If you notice any unauthorized charge or debit on your bank statement, credit card, or UPI account that appears to be associated with RiseFlake:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Please note that this charge is not from RiseFlake, as we do not process any payments</li>
                  <li>We recommend you immediately contact your bank, card issuer, or payment provider to report the unauthorized transaction</li>
                  <li>You may also report the matter to us at <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a> so that we can investigate and assist you</li>
                  <li>If you suspect fraud, please also file a complaint with the relevant cyber crime authorities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5. Third-Party Services</h2>
                <p>
                  The Platform may contain links to or integrations with third-party websites or services that may have their own pricing, payment, and refund policies. RiseFlake is not responsible for any payments made to third-party services accessed through or linked from our Platform. Any refund requests for third-party services should be directed to the respective third-party provider.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">6. Future Paid Services</h2>
                <p>In the event that RiseFlake introduces paid features, premium plans, or subscription-based services in the future:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>This Refund Policy will be updated accordingly with detailed refund terms and conditions</li>
                  <li>Users will be notified of any changes via email, in-app notification, or a prominent notice on the Platform</li>
                  <li>The updated policy will be posted on this page with a revised &quot;Last Updated&quot; date</li>
                  <li>Any paid service will have clear pricing, billing terms, and refund eligibility criteria disclosed before purchase</li>
                  <li>All payments, if introduced, will be processed through secure, trusted payment gateways in compliance with applicable Indian laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7. Changes to This Refund Policy</h2>
                <p>
                  We reserve the right to update or modify this Refund Policy at any time. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use of our services after any changes constitutes acceptance of the revised policy. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8. Contact Information</h2>
                <p>If you have any questions, concerns, or inquiries about this Refund Policy or about any charge you believe is associated with RiseFlake, please contact us:</p>
                <ul className="list-none mt-3 space-y-1">
                  <li><strong>Company:</strong> Bold India Platforms Private Limited</li>
                  <li><strong>Brand:</strong> RiseFlake</li>
                  <li><strong>Registered Office:</strong> Sn 242/1/2 Baner, Tejaswini Soc, DP Road, N.I.A., Pune, Maharashtra 411045, India</li>
                  <li><strong>Email:</strong> <a href="mailto:hello@boldindia.in" className="text-indigo-600 hover:underline">hello@boldindia.in</a>, <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a></li>
                  <li><strong>Phone / WhatsApp (Company HQ):</strong> +91 92252 20170</li>
                  <li><strong>Website:</strong> <a href="https://www.boldindia.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.boldindia.in</a></li>
                  <li><strong>CIN:</strong> U85499PN2025PTC246360</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
