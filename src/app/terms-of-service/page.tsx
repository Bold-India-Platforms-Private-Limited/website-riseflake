"use client";

import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

const TermsOfService = () => {
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
                                    <span className="font-semibold text-indigo-600">Terms of Service</span>
                                </nav>
                                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Terms of Service</h1>
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
                            <h1 className="text-lg font-semibold text-slate-900">Terms of Service</h1>
                        </div>

                        <div className="h-px w-full bg-slate-200 md:hidden"></div>

                        <div className="space-y-8 px-6 py-6 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                            <section>
                                <p className="mb-2"><strong>Version 1.0</strong></p>
                                <p><strong>Last Updated:</strong> March 05, 2026 &nbsp;|&nbsp; <strong>Effective Date:</strong> March 05, 2026</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Introduction &amp; Acceptance of Terms</h2>
                                <p>
                                    Welcome to <strong>RiseFlake</strong> (the &quot;Platform&quot;), a digital employment and professional networking platform operated by <strong>Bold India Platforms Private Limited</strong> (CIN: U85499PN2025PTC246360) (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                                </p>
                                <p className="mt-2">
                                    By accessing or using our website at www.riseflake.com and mobile applications available on the Google Play Store and Apple App Store (collectively, the &quot;Services&quot;), you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) agree to be legally bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must immediately discontinue use of our Services.
                                </p>
                                <p className="mt-2">
                                    These Terms constitute a legally binding agreement between you and Bold India Platforms Private Limited. Your continued use of the Platform constitutes acceptance of any modifications to these Terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Eligibility &amp; Account Registration</h2>
                                <p><strong>2.1 Age Requirement:</strong> You must be at least 18 years of age to use RiseFlake. By using the Platform, you represent and warrant that you meet this age requirement.</p>
                                <p className="mt-2"><strong>2.2 Legal Capacity:</strong> You must have the legal capacity to enter into binding contracts under applicable law. If you are using the Platform on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.</p>
                                <p className="mt-2"><strong>2.3 Account Information:</strong> You agree to provide accurate, current, and complete information during registration and to update such information to maintain its accuracy. You are solely responsible for maintaining the confidentiality of your account credentials.</p>
                                <p className="mt-2"><strong>2.4 Account Security:</strong> You are responsible for all activities that occur under your account. You must immediately notify us of any unauthorized access or security breach. We are not liable for any loss or damage arising from unauthorized account access due to your failure to maintain security.</p>
                                <p className="mt-2"><strong>2.5 One Account Per User:</strong> Each user may maintain only one active account. Creating multiple accounts for fraudulent purposes or to circumvent restrictions is prohibited.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Nature of the Platform &amp; Disclaimer of Employment Relationship</h2>
                                <p><strong>3.1 Intermediary Status:</strong> RiseFlake operates as an online intermediary platform that connects job seekers with employers and recruiters. We are NOT an employment agency, recruitment firm, or employer.</p>
                                <p className="mt-2"><strong>3.2 No Employment Guarantee:</strong> We do not guarantee, warrant, or promise:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Employment, job placement, interviews, or hiring outcomes for job seekers</li>
                                    <li>The quality, suitability, or qualifications of any candidate for employers</li>
                                    <li>That any job posting is genuine, accurate, or available</li>
                                    <li>The accuracy of information provided by users</li>
                                </ul>
                                <p className="mt-2"><strong>3.3 No Contractual Relationship:</strong> RiseFlake is not a party to any employment contract, agreement, or relationship formed between job seekers and employers through the Platform. All employment terms, conditions, compensation, and arrangements are solely between the employer and employee.</p>
                                <p className="mt-2"><strong>3.4 Independent Verification Required:</strong> Users must independently verify all information, including job postings, employer legitimacy, candidate credentials, and company details. We do not conduct background checks, employment verification, or credential authentication.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4. User Responsibilities &amp; Permitted Use</h2>
                                <p><strong>4.1 Job Seekers:</strong> Job seekers may use the Platform to:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Create professional profiles with truthful and accurate information</li>
                                    <li>Upload resumes and professional credentials</li>
                                    <li>Search for and apply to legitimate job opportunities</li>
                                    <li>Network with other professionals in a lawful manner</li>
                                    <li>Receive job alerts and recommendations</li>
                                </ul>
                                <p className="mt-2">Job seekers represent and warrant that all information provided is accurate, current, and not misleading. You are solely responsible for the content of your profile and applications.</p>
                                <p className="mt-4"><strong>4.2 Employers &amp; Recruiters:</strong> Employers and recruiters may use the Platform to:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Post legitimate job openings that comply with all applicable employment laws</li>
                                    <li>Search for and contact potential candidates</li>
                                    <li>Review applications and conduct recruitment activities</li>
                                    <li>Manage hiring workflows and communications</li>
                                </ul>
                                <p className="mt-2">Employers represent and warrant that all job postings are genuine, non-discriminatory, legal, and comply with applicable labor laws, including but not limited to laws prohibiting discrimination based on race, religion, caste, gender, age, disability, or any protected characteristic.</p>
                                <p className="mt-2"><strong>4.3 General Conduct:</strong> All users agree to use the Platform in a lawful, ethical, and professional manner consistent with community standards and business practices.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5. Prohibited Activities &amp; Content</h2>
                                <p>Users are strictly prohibited from engaging in the following activities:</p>
                                <p className="mt-2"><strong>5.1 Fraudulent Activity:</strong></p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Posting fake, fraudulent, or non-existent job listings</li>
                                    <li>Providing false credentials, qualifications, or employment history</li>
                                    <li>Impersonating another person or entity</li>
                                    <li>Creating fake profiles or accounts</li>
                                    <li>Engaging in employment scams, pyramid schemes, or fraudulent recruitment</li>
                                    <li>Requesting payment from job seekers for job applications or placements</li>
                                </ul>
                                <p className="mt-2"><strong>5.2 Discriminatory Content:</strong></p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Posting job listings that discriminate based on protected characteristics</li>
                                    <li>Harassing, threatening, or abusing other users</li>
                                    <li>Using hate speech or promoting discrimination</li>
                                </ul>
                                <p className="mt-2"><strong>5.3 Unlawful Content:</strong></p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Posting illegal job opportunities (e.g., unauthorized work, illegal activities)</li>
                                    <li>Violating intellectual property rights</li>
                                    <li>Distributing malware, viruses, or harmful code</li>
                                    <li>Engaging in unauthorized data collection or scraping</li>
                                </ul>
                                <p className="mt-2"><strong>5.4 Spam &amp; Misuse:</strong></p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Sending unsolicited bulk messages or spam</li>
                                    <li>Using automated systems, bots, or scripts without authorization</li>
                                    <li>Harvesting user data for unauthorized purposes</li>
                                    <li>Selling or redistributing Platform data or access</li>
                                    <li>Reverse engineering or attempting to access source code</li>
                                </ul>
                                <p className="mt-2"><strong>5.5 Inappropriate Content:</strong></p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>Adult content, pornography, or sexually explicit material</li>
                                    <li>Content promoting violence, self-harm, or illegal activities</li>
                                    <li>Defamatory, libelous, or invasive content</li>
                                </ul>
                                <p className="mt-2">Violation of these prohibitions may result in immediate account termination, legal action, and reporting to law enforcement authorities.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">6. Content Ownership, Licensing &amp; Intellectual Property</h2>
                                <p><strong>6.1 User Content:</strong> You retain ownership of all content you post on the Platform (&quot;User Content&quot;), including resumes, profiles, job postings, messages, and other materials. However, by posting User Content, you grant Bold India Platforms Private Limited a worldwide, non-exclusive, royalty-free, transferable, sublicensable license to use, reproduce, modify, adapt, publish, display, distribute, and create derivative works from your User Content for the purpose of:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Operating, maintaining, and improving the Platform</li>
                                    <li>Providing Services to you and other users</li>
                                    <li>Marketing and promoting RiseFlake</li>
                                    <li>Complying with legal obligations</li>
                                </ul>
                                <p className="mt-2">This license continues even after you stop using the Platform, except for User Content you delete from your account.</p>
                                <p className="mt-2"><strong>6.2 Content Responsibility:</strong> You are solely responsible for your User Content. You represent and warrant that you have all necessary rights to post User Content and that it does not violate any third-party rights or applicable laws.</p>
                                <p className="mt-2"><strong>6.3 Platform Content:</strong> All Platform content, features, functionality, design, logos, trademarks, trade names, graphics, images, software, and other materials (excluding User Content) are owned by Bold India Platforms Private Limited and protected by copyright, trademark, patent, and other intellectual property laws.</p>
                                <p className="mt-2"><strong>6.4 Restrictions:</strong> You may not copy, modify, distribute, sell, lease, or reverse engineer any part of the Platform without express written permission.</p>
                                <p className="mt-2"><strong>6.5 Content Removal:</strong> We reserve the right, but have no obligation, to monitor, review, edit, or remove User Content that violates these Terms, is inappropriate, or for any other reason at our sole discretion.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7. Job Postings &amp; Application Process</h2>
                                <p><strong>7.1 Employer Obligations:</strong> Employers posting job listings represent and warrant that:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>All job postings are genuine, accurate, and currently available</li>
                                    <li>Job descriptions comply with all applicable employment laws</li>
                                    <li>Postings do not contain discriminatory requirements or preferences</li>
                                    <li>They have the authority to recruit for the posted positions</li>
                                    <li>They will not charge job seekers any fees for applications or interviews</li>
                                    <li>They will conduct recruitment fairly and in good faith</li>
                                </ul>
                                <p className="mt-4"><strong>7.2 Job Seeker Obligations:</strong> Job seekers represent and warrant that:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>All information in profiles and applications is truthful and accurate</li>
                                    <li>Uploaded documents (resumes, certificates) are genuine and belong to them</li>
                                    <li>They have the legal right to work where they are applying</li>
                                    <li>They will respond professionally to employer communications</li>
                                </ul>
                                <p className="mt-4"><strong>7.3 Platform Role:</strong> RiseFlake&apos;s role is limited to facilitating connections. We do NOT:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Verify the authenticity of job postings or employer companies</li>
                                    <li>Conduct background checks on employers or job seekers</li>
                                    <li>Guarantee the accuracy of posted salary ranges or benefits</li>
                                    <li>Verify educational credentials or work experience</li>
                                    <li>Mediate employment disputes or disagreements</li>
                                    <li>Guarantee responses to applications or interviews</li>
                                </ul>
                                <p className="mt-2"><strong>7.4 Due Diligence:</strong> Users must conduct their own due diligence before entering into any employment relationship, including verifying company legitimacy, job details, and conducting interviews.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8. Free Services &amp; Payment Terms</h2>
                                <p><strong>8.1 Free Platform:</strong> RiseFlake currently provides all its services completely free of charge to all users. There are no paid plans, subscriptions, premium tiers, or in-app purchases available on the Platform at this time. All features — including job discovery, profile building, networking, job posting, candidate search, chat, and all other functionalities — are available to every user at no cost.</p>
                                <p className="mt-2"><strong>8.2 No Payments Required:</strong> Users are not required to make any payment to access or use any feature of the Platform. Since no payments are collected, no refunds are applicable. For more details, please refer to our Refund Policy.</p>
                                <p className="mt-2"><strong>8.3 Future Paid Services:</strong> We reserve the right to introduce paid features, premium plans, or subscription-based services in the future. If and when paid services are introduced:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Users will be notified in advance via email, in-app notification, or a prominent notice on the Platform</li>
                                    <li>Clear pricing, billing terms, and refund eligibility will be disclosed before any purchase</li>
                                    <li>These Terms and the Refund Policy will be updated accordingly</li>
                                    <li>Existing free features will continue to remain accessible</li>
                                    <li>All payments, if introduced, will be processed through secure, trusted payment gateways (e.g., Razorpay) in compliance with applicable laws</li>
                                </ul>
                                <p className="mt-2"><strong>8.4 Third-Party Charges:</strong> RiseFlake is not responsible for any charges imposed by your mobile carrier, internet service provider, or any third-party service accessed through the Platform. Standard data and messaging rates from your carrier may apply.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">9. Privacy &amp; Data Protection</h2>
                                <p>Your use of RiseFlake is governed by our Privacy Policy, which is incorporated into these Terms by reference. The Privacy Policy explains how we collect, use, store, and protect your personal information in compliance with the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023, and other applicable data protection laws.</p>
                                <p className="mt-2">By using the Platform, you consent to the collection and use of your information as described in the Privacy Policy. If you do not agree to the Privacy Policy, you must not use our Services.</p>
                                <p className="mt-2">Users are responsible for ensuring that any personal data they share or collect through the Platform complies with applicable data protection laws.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10. Disclaimers &amp; Limitation of Liability</h2>
                                <p><strong>10.1 &quot;AS IS&quot; Basis:</strong> THE PLATFORM AND ALL SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 uppercase">
                                    <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                                    <li>Warranties regarding accuracy, reliability, or completeness of content</li>
                                    <li>Warranties of uninterrupted, timely, or error-free operation</li>
                                    <li>Warranties regarding results obtained from use of the Platform</li>
                                </ul>
                                <p className="mt-4"><strong>10.2 No Verification:</strong> WE DO NOT VERIFY, ENDORSE, OR GUARANTEE:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 uppercase">
                                    <li>The identity, credentials, or background of users</li>
                                    <li>The accuracy of job postings, profiles, or applications</li>
                                    <li>The legitimacy of employers or job opportunities</li>
                                    <li>The qualifications or suitability of job seekers</li>
                                    <li>The outcome of any employment relationship formed through the Platform</li>
                                </ul>
                                <p className="mt-4"><strong>10.3 Third-Party Conduct:</strong> We are not responsible for the conduct, actions, or omissions of any user, employer, recruiter, or third party. Users interact with each other at their own risk.</p>
                                <p className="mt-2"><strong>10.4 Limitation of Liability:</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW, BOLD INDIA PLATFORMS PRIVATE LIMITED, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AFFILIATES, AND LICENSORS SHALL NOT BE LIABLE FOR:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 uppercase">
                                    <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                                    <li>Loss of profits, revenue, data, business opportunities, or goodwill</li>
                                    <li>Damages arising from employment decisions, hiring outcomes, or job placements</li>
                                    <li>Damages resulting from user conduct, fraudulent activity, or misrepresentation</li>
                                    <li>Damages from unauthorized access, data breaches, or security incidents beyond our control</li>
                                    <li>Damages from service interruptions, errors, or technical failures</li>
                                    <li>Damages from third-party content, links, or services</li>
                                </ul>
                                <p className="mt-4"><strong>10.5 Maximum Liability:</strong> Since RiseFlake currently provides all services free of charge, in no event shall our total aggregate liability to you exceed INR 10,000 (Ten Thousand Indian Rupees). If paid services are introduced in the future, our liability shall not exceed the greater of (a) the amount paid by you to RiseFlake in the 12 months preceding the claim, or (b) INR 10,000.</p>
                                <p className="mt-2"><strong>10.6 Jurisdictional Limitations:</strong> Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability. In such jurisdictions, our liability will be limited to the maximum extent permitted by law.</p>
                                <p className="mt-2"><strong>10.7 User Acknowledgment:</strong> You acknowledge that these disclaimers and limitations are fundamental elements of the agreement between you and Bold India Platforms Private Limited, and that we would not provide the Services without these limitations.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">11. Indemnification</h2>
                                <p>You agree to indemnify, defend, and hold harmless Bold India Platforms Private Limited, its parent, subsidiaries, affiliates, officers, directors, employees, agents, partners, and licensors from and against any and all claims, liabilities, damages, losses, costs, expenses, fees (including reasonable attorneys&apos; fees) arising from or related to:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Your use or misuse of the Platform and Services</li>
                                    <li>Your violation of these Terms or any applicable law or regulation</li>
                                    <li>Your User Content or any content you post or transmit</li>
                                    <li>Your violation of any third-party rights, including intellectual property, privacy, or contractual rights</li>
                                    <li>Your interactions with other users, including employment relationships</li>
                                    <li>Any fraudulent, negligent, or intentional misconduct on your part</li>
                                    <li>Any dispute between you and another user</li>
                                </ul>
                                <p className="mt-2">This indemnification obligation survives termination of these Terms and your use of the Platform.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">12. Third-Party Links &amp; Services</h2>
                                <p>The Platform may contain links to third-party websites, applications, or services that are not owned or controlled by Bold India Platforms Private Limited. We have no control over and assume no responsibility for the content, privacy policies, terms of service, or practices of any third-party sites or services.</p>
                                <p className="mt-2">You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such third-party content, goods, or services.</p>
                                <p className="mt-2">We strongly advise you to read the terms of service and privacy policies of any third-party websites or services that you visit.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">13. Modification of Terms &amp; Services</h2>
                                <p><strong>13.1 Terms Modification:</strong> We reserve the right to modify, update, or replace these Terms at any time at our sole discretion. Material changes will be communicated through:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Email notification to your registered email address</li>
                                    <li>Prominent notice on the Platform</li>
                                    <li>In-app notification</li>
                                </ul>
                                <p className="mt-2">Changes take effect immediately upon posting for new users, and after the notice period (minimum 7 days) for existing users. Your continued use of the Platform after changes become effective constitutes acceptance of the modified Terms.</p>
                                <p className="mt-2"><strong>13.2 Service Modification:</strong> We reserve the right to modify, suspend, or discontinue any aspect of the Platform or Services, temporarily or permanently, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of Services.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">14. Account Termination, Suspension &amp; Deletion</h2>
                                <p><strong>14.1 Termination by User:</strong> You may terminate your account at any time by using the Permanently Delete Account option in your account settings, or by contacting us at privacy@riseflake.com. Upon permanent deletion, your data will be irreversibly removed from our primary systems within 90 days, subject to legal retention requirements.</p>
                                <p className="mt-2"><strong>14.2 Account Hibernation:</strong> If you wish to take a break without losing your data, you may Hibernate (deactivate) your account. While hibernated, your profile will not be visible to other users and you will not receive communications. You can reactivate your account at any time by logging back in.</p>
                                <p className="mt-2"><strong>14.3 Termination by RiseFlake:</strong> We reserve the right to suspend, disable, or terminate your account and access to the Platform at any time, with or without notice, for any reason, including but not limited to:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Violation of these Terms or any applicable law</li>
                                    <li>Fraudulent, abusive, or illegal activity</li>
                                    <li>Providing false or misleading information</li>
                                    <li>Harming the Platform, other users, or our business interests</li>
                                    <li>Extended period of inactivity</li>
                                    <li>At our sole discretion for any other reason</li>
                                </ul>
                                <p className="mt-2"><strong>14.4 Effects of Termination:</strong> Upon termination:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Your right to access and use the Platform immediately ceases</li>
                                    <li>We may delete your User Content (subject to retention requirements as outlined in our Privacy Policy)</li>
                                    <li>Provisions regarding intellectual property, disclaimers, limitation of liability, and indemnification survive</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">15. Dispute Resolution &amp; Governing Law</h2>
                                <p><strong>15.1 Governing Law:</strong> These Terms and your use of the Platform shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.</p>
                                <p className="mt-2"><strong>15.2 Jurisdiction:</strong> Subject to the arbitration clause below, you agree that any legal action or proceeding arising out of or relating to these Terms or the Platform shall be instituted exclusively in the courts located in Pune, Maharashtra, India. You irrevocably submit to the jurisdiction of such courts and waive any objection to venue.</p>
                                <p className="mt-2"><strong>15.3 Amicable Resolution:</strong> Any dispute, controversy, or claim arising out of or relating to these Terms or the Platform shall first be attempted to be resolved through good-faith negotiations between the parties. We encourage you to connect with us directly at <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a> or via WhatsApp at +91 92252 20170 before pursuing formal dispute resolution.</p>
                                <p className="mt-2"><strong>15.4 Arbitration Agreement:</strong> If negotiations fail within 30 days, either party may refer the dispute to binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall be:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Conducted by a sole arbitrator mutually appointed by the parties</li>
                                    <li>Held in Pune, Maharashtra, India</li>
                                    <li>Conducted in English</li>
                                    <li>Subject to the procedural rules of the Indian Council of Arbitration</li>
                                </ul>
                                <p className="mt-2">The arbitrator&apos;s decision shall be final and binding, and judgment may be entered in any court of competent jurisdiction.</p>
                                <p className="mt-2"><strong>15.5 Exceptions to Arbitration:</strong> Notwithstanding the above, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent infringement of intellectual property rights or confidential information.</p>
                                <p className="mt-2 uppercase"><strong>15.6 Class Action Waiver:</strong> TO THE EXTENT PERMITTED BY LAW, ALL CLAIMS MUST BE BROUGHT IN A PARTY&apos;S INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE ACTION, OR REPRESENTATIVE PROCEEDING.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">16. General Provisions</h2>
                                <p><strong>16.1 Entire Agreement:</strong> These Terms, together with our Privacy Policy, Refund Policy, and any other policies referenced herein, constitute the entire agreement between you and Bold India Platforms Private Limited regarding the Platform and supersede all prior agreements and understandings.</p>
                                <p className="mt-2"><strong>16.2 Severability:</strong> If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if not possible, severed from these Terms. The remaining provisions shall continue in full force and effect.</p>
                                <p className="mt-2"><strong>16.3 Waiver:</strong> No waiver of any term or condition of these Terms shall be deemed a further or continuing waiver of such term or any other term. Our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.</p>
                                <p className="mt-2"><strong>16.4 Assignment:</strong> You may not assign, transfer, or delegate these Terms or your rights and obligations hereunder without our prior written consent. We may freely assign these Terms without restriction. Any attempted assignment in violation of this provision is void.</p>
                                <p className="mt-2"><strong>16.5 Force Majeure:</strong> We shall not be liable for any failure or delay in performance due to causes beyond our reasonable control, including acts of God, natural disasters, war, terrorism, riots, labor disputes, government actions, internet failures, or equipment failures.</p>
                                <p className="mt-2"><strong>16.6 Notices:</strong> All notices to Bold India Platforms Private Limited must be sent to the contact information provided in Section 18. We may provide notices to you via email, in-app notifications, or postings on the Platform.</p>
                                <p className="mt-2"><strong>16.7 No Agency:</strong> No agency, partnership, joint venture, employee-employer, or franchisor-franchisee relationship is intended or created by these Terms.</p>
                                <p className="mt-2"><strong>16.8 Survival:</strong> Provisions that by their nature should survive termination shall survive, including but not limited to intellectual property rights, disclaimers, limitation of liability, indemnification, and dispute resolution provisions.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">17. Compliance with Laws</h2>
                                <p>Users must comply with all applicable local, state, national, and international laws, regulations, and ordinances in their use of the Platform, including but not limited to:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Employment and labor laws</li>
                                    <li>Anti-discrimination and equal opportunity laws</li>
                                    <li>Data protection and privacy laws (including the DPDP Act, 2023)</li>
                                    <li>Intellectual property laws</li>
                                    <li>Anti-spam and electronic communications laws</li>
                                    <li>Tax laws and regulations</li>
                                    <li>Import/export control laws</li>
                                </ul>
                                <p className="mt-2">You represent and warrant that your use of the Platform does not violate any applicable laws or regulations in your jurisdiction or the jurisdiction where you conduct business.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">18. Contact Information</h2>
                                <p>For questions, concerns, disputes, or any other matters regarding these Terms of Service, please contact us:</p>
                                <ul className="list-none mt-3 space-y-1">
                                    <li><strong>Company Name:</strong> Bold India Platforms Private Limited</li>
                                    <li><strong>Brand Name:</strong> RiseFlake</li>
                                    <li><strong>Registered Office:</strong> Sn 242/1/2 Baner, Tejaswini Soc, DP Road, N.I.A., Pune, Maharashtra 411045, India</li>
                                    <li><strong>Email:</strong> <a href="mailto:hello@boldindia.in" className="text-indigo-600 hover:underline">hello@boldindia.in</a>, <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a></li>
                                    <li><strong>Phone / WhatsApp (Company HQ):</strong> +91 92252 20170</li>
                                    <li><strong>Website:</strong> <a href="https://www.boldindia.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.boldindia.in</a></li>
                                    <li><strong>CIN:</strong> U85499PN2025PTC246360</li>
                                </ul>
                                <p className="mt-4">For grievance-related concerns, please contact our Grievance Officer at <a href="mailto:grievance@riseflake.com" className="text-indigo-600 hover:underline">grievance@riseflake.com</a> or reach us via WhatsApp at +91 92252 20170.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">19. Acknowledgment &amp; Agreement</h2>
                                <p>BY ACCESSING OR USING RISEFLAKE, YOU ACKNOWLEDGE THAT:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>You have read, understood, and agree to be bound by these Terms of Service</li>
                                    <li>You meet all eligibility requirements specified herein</li>
                                    <li>You understand that RiseFlake is an intermediary platform and not an employment agency</li>
                                    <li>You accept all disclaimers and limitations of liability</li>
                                    <li>You will use the Platform lawfully, ethically, and professionally</li>
                                    <li>You are responsible for your own due diligence in all interactions</li>
                                    <li>You have reviewed our Privacy Policy and consent to data practices described therein</li>
                                    <li>You understand that all services are currently provided free of charge</li>
                                </ul>
                                <p className="mt-8 font-semibold text-slate-800">
                                    These Terms constitute a legally binding agreement. If you do not agree to these Terms, you must not access or use the Platform.
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

export default TermsOfService;