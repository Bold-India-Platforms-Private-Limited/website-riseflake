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
              <p className="text-lg font-semibold text-slate-900">Refund Policy</p>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-10 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section>
                <p className="mb-1"><strong>Version 1.0</strong></p>
                <p>Last Updated: March 23, 2026 &nbsp;|&nbsp; Effective Date: March 23, 2026</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">1. Scope</h2>
                <p>
                  This Refund &amp; Cancellation Policy applies to all paid services offered on <strong>RiseFlake</strong>, a digital platform operated by <strong>Bold India Platforms Private Limited</strong> ("Company", "we", "us", or "our"). By purchasing any subscription, listing, plan, or digital service on our website or app (collectively, the "Platform"), you agree to this policy.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">2. Refund policy</h2>
                <p>
                  All payments made to RiseFlake are <strong>final and non-refundable</strong>.
                </p>
                <ul className="list-disc pl-5 mt-1">
                  <li>No refund will be provided once a payment is successfully processed</li>
                  <li>This includes subscriptions, plan upgrades, renewals, promotional purchases, and any other paid digital services</li>
                  <li>No partial or pro-rata refund is provided for unused periods or unused features</li>
                </ul>
                <p>
                  This policy is based on the digital and immediately consumable nature of our services.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">3. Subscription auto-renewal & cancellation</h2>
                <p>
                  Certain plans may be offered on an auto-renewal basis. You may cancel auto-renewal at any time before the next billing cycle.
                </p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Cancel from your account via our Subscription page on the Platform</li>
                  <li>You may also cancel your active auto-debit/mandate directly from your UPI app, bank portal, or payment app</li>
                  <li>Cancellation stops future auto-debits only and does not create eligibility for refund of already processed payments</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">4. Payment issues & support</h2>
                <p>
                  If you face any issue related to payment confirmation, duplicate debit indication, or billing status, please contact us promptly so we can verify transaction records with our payment partners.
                </p>
                <p style={{fontWeight: 'bold', color: '#2d3748'}}>
                  In case of any issue, please connect with our team before raising a dispute or chargeback with your bank or payment provider. Most concerns can be resolved quickly by our support team.
                </p>
                <ul className="list-none mt-1">
                  <li>Email: <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a></li>
                  <li>Phone / WhatsApp: <a href="https://wa.me/919225220170" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">+91 92252 20170</a></li>
                </ul>
                <p>
                  We may request payment reference details (transaction ID, date, amount, and payer information) to investigate and resolve concerns.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">5. Chargebacks & disputes</h2>
                <p>
                  If a charge is disputed through a bank, card network, UPI app, or payment gateway, we reserve the right to share relevant transaction and service-usage records with authorized financial and legal entities for investigation.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">6. Policy changes</h2>
                <p>
                  We may update this policy from time to time to reflect product, legal, or payment-process changes. The updated version will be published on this page with a revised "Last Updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">7. Contact information</h2>
                <p>
                  For any payment-related support, contact:
                </p>
                <ul className="list-none mt-1">
                  <li><strong>Company:</strong> Bold India Platforms Private Limited</li>
                  <li><strong>Brand:</strong> RiseFlake</li>
                  <li><strong>Registered Office:</strong> Sn 242/1/2 Baner, Tejaswini Soc, DP Road, N.I.A., Pune, Maharashtra 411045, India</li>
                  <li><strong>Email:</strong> <a href="mailto:hello@boldindia.in" className="text-indigo-600 hover:underline">hello@boldindia.in</a>, <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a></li>
                  <li><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/919225220170" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">+91 92252 20170</a></li>
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
