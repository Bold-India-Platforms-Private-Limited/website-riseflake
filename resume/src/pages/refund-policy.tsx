import Head from 'next/head';
import InfoPageLayout from '@/components/legal/InfoPageLayout';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const RefundPolicyPage = () => {
    return (
        <>
            <Head>
                <title>Refund Policy | Riseflake Resume Builder</title>
            </Head>

            <LandingNavbar />

            <InfoPageLayout
                hideMobileHeader
                showLegalNav
                title="Refund Policy"
                breadcrumbLabel="Refund Policy"
                intro="Last Updated: March 2026. This Refund Policy is part of the Terms of Service of Riseflake Resume Builder (Riseflake.com), a product of Bold India Platforms Private Limited. PLEASE READ THIS POLICY CAREFULLY BEFORE MAKING A PURCHASE."
                sections={[
                    {
                        heading: '1. General Refund Policy Statement',
                        body: 'Riseflake Resume Builder provides digital goods and services including, but not limited to, professional resume templates, AI-based content generation, and ATS optimization tools. Due to the digital nature of these products, Bold India Platforms Private Limited maintains a STRICT NO REFUND POLICY. Once a payment is completed and a plan is activated, the transaction is final and non-refundable.',
                    },
                    {
                        heading: '2. Why We Do Not Offer Refunds',
                        body: 'Our services are considered "used" the moment a user accesses our premium templates, uses AI credits for content, or clicks the "Download" button. As our intellectual property and digital assets are delivered instantly upon purchase, we cannot accept returns or provide reversals. You agree that by purchasing a plan, you are paying for access to the platform for a specific duration.',
                    },
                    {
                        heading: '3. ATS Score & Job Outcomes',
                        body: 'A common reason for refund requests in the resume industry is the lack of a "100% ATS Score" or failure to get a job. Bold India Platforms Private Limited expressly disclaims any guarantee regarding ATS rankings, job shortlisting, interview calls, or recruitment success. We provide the tools to build a better resume, but the final outcome depends on external market factors and individual profiles. Dissatisfaction with these outcomes is NOT a valid ground for a refund.',
                    },
                    {
                        heading: '4. Plan Expiration & Careful Usage',
                        body: 'Each Riseflake plan (Trial, Free, or Paid) has a specific validity period (e.g., 30 days). Once the plan expires, all premium access is revoked immediately. There are no partial refunds for unused days or unused download quotas. Users are advised to use the download button carefully; "accidental" downloads consume plan limits and do not qualify for credits or refunds.',
                    },
                    {
                        heading: '5. Plan Renewal Requirements',
                        body: 'To continue using premium features after expiration, users must purchase a new plan at the prevailing rates. We do not provide automatic extensions. It is the user\'s responsibility to download and save their work before their plan expires.',
                    },
                    {
                        heading: '6. Technical Issues Disclaimer',
                        body: 'In the rare event of a widespread server-side technical failure that prevents access for more than 48 consecutive hours, we may, at our sole discretion, provide a plan extension. However, this does not entitle the user to a cash refund. Issues caused by the user\'s local hardware, browser, or internet connection are not the responsibility of Bold India Platforms.',
                    },
                    {
                        heading: '7. Fraudulent Transactions',
                        body: 'If we detect any unauthorized or fraudulent use of your payment method, please contact your bank immediately. We work with secure gateways (Razorpay/Stripe) to ensure safety. Any chargebacks filed without first attempting to resolve a biller query with us may result in permanent account suspension.',
                    },
                    {
                        heading: '8. Cancellation Policy',
                        body: 'You may choose not to renew your plan at the end of its term. As we do not use an auto-recurring subscription model (unless explicitly stated otherwise during checkout), you will not be charged again once your current plan ends.',
                    },
                    {
                        heading: '9. Changes to This Policy',
                        body: 'We reserve the right to update this Refund Policy at any time. Changes will be effective immediately upon posting to this page. Continued use of the platform after changes implies your acceptance of the updated policy.',
                    },
                    {
                        heading: '10. Official Statutory Details',
                        body: (
                            <div className="space-y-6 mt-4">
                                <p>For any billing inquiries, please contact our support desk:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-2 underline underline-offset-4">Legal Entity</h4>
                                        <p className="font-semibold">Bold India Platforms Private Limited</p>
                                        <p>CIN: U85499PN2025PTC246360</p>
                                        <p>Brand: Riseflake.com</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-2 underline underline-offset-4">Statutory Address</h4>
                                        <p>Sn 242/1/2 Baner, Tejaswini Soc</p>
                                        <p>DP Road, N.I.A., Pune</p>
                                        <p>Maharashtra 411045, India</p>
                                    </div>
                                    <div className="md:col-span-2 border-t border-slate-200 pt-4 flex flex-wrap gap-x-8 gap-y-2">
                                        <p><span className="font-bold">Support Email:</span> hello@boldindia.in</p>
                                        <p><span className="font-bold">Corporate Website:</span> www.boldindia.in</p>
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                ]}
            />

            <LandingFooter />
        </>
    );
};

export default RefundPolicyPage;
