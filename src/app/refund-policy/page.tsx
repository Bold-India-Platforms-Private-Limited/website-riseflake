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
                <p>Last Updated Date: 08/01/2026 12:00 PM</p>
                <h2>1. General Policy</h2>
                <p>All purchases made on Riseflake are non-refundable unless otherwise stated in a specific offer or as required by law. Please review all product/service details before making a purchase. We strive to provide clear information and transparent pricing for all our services.</p>
                <h2>2. Eligibility for Refunds</h2>
                <ul className="list-disc ml-6">
                  <li>Duplicate transactions or accidental payments.</li>
                  <li>Technical errors resulting in failed or incomplete service delivery.</li>
                  <li>Unauthorized transactions reported within 48 hours.</li>
                  <li>Other cases as required by applicable law.</li>
                </ul>
                <h2>3. How to Request a Refund</h2>
                <ol className="list-decimal ml-6">
                  <li>Contact our support team at <a href="mailto:support@riseflake.com" className="text-blue-600 underline">support@riseflake.com</a> with your order ID, payment details, and reason for the request.</li>
                  <li>Submit your request within 7 days of the transaction date.</li>
                  <li>Our team will acknowledge your request within 2 business days and may request additional information if needed.</li>
                </ol>
                <h2>4. Refund Process & Timeline</h2>
                <ul className="list-disc ml-6">
                  <li>All valid refund requests are reviewed within 3-5 business days.</li>
                  <li>If approved, refunds are processed to your original payment method within 7-10 business days.</li>
                  <li>You will receive a confirmation email once your refund is initiated.</li>
                </ul>
                <h2>5. Non-Refundable Items</h2>
                <ul className="list-disc ml-6">
                  <li>Services already rendered or consumed.</li>
                  <li>Promotional or discounted offers unless specified.</li>
                  <li>Third-party services purchased through Riseflake.</li>
                  <li>Any fees paid for premium features after usage has begun.</li>
                </ul>
                <h2>6. Disputes & Escalation</h2>
                <p>If you are dissatisfied with our decision, you may escalate your concern to our Grievance Officer at <a href="mailto:grievance@riseflake.com" className="text-blue-600 underline">grievance@riseflake.com</a>. We are committed to resolving all disputes fairly and promptly.</p>
                <h2>7. Contact</h2>
                <p>For refund requests or questions, please email <a href="mailto:support@riseflake.com" className="text-blue-600 underline">support@riseflake.com</a> or call +91-9876543210.</p>
                <h2>8. Policy Updates</h2>
                <p>Riseflake reserves the right to update this policy at any time. Please review this page periodically for changes. Significant changes will be communicated via email or platform notifications.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
