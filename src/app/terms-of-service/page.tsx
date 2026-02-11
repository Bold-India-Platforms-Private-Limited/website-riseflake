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
                            <p>Last Updated Date: 08/01/2026 12:00 PM</p>
                            <h2>1. Introduction & Acceptance of Terms</h2>
                            <p>
                                Welcome to <strong>Riseflake</strong> (the "Platform"), a digital employment and 
                                professional networking platform operated by <strong>Bold India Platforms Private Limited</strong> 
                                (CIN: U85499PN2025PTC246360) ("Company", "we", "us", or "our").
                            </p>
                            <p>
                                By accessing or using our website at app.riseflake.com and mobile applications 
                                available on Google Play Store and Apple App Store (collectively, the "Services"), 
                                you ("User", "you", or "your") agree to be legally bound by these Terms of Service 
                                ("Terms"). If you do not agree to these Terms, you must immediately discontinue use 
                                of our Services.
                            </p>
                            <p>
                                These Terms constitute a legally binding agreement between you and Bold India Platforms 
                                Private Limited. Your continued use of the Platform constitutes acceptance of any 
                                modifications to these Terms.
                            </p>
                        </section>

                        <section>
                            <h2>2. Eligibility & Account Registration</h2>
                            <p>
                                <strong>2.1 Age Requirement:</strong> You must be at least 18 years of age to use Riseflake. 
                                By using the Platform, you represent and warrant that you meet this age requirement.
                            </p>
                            <p>
                                <strong>2.2 Legal Capacity:</strong> You must have the legal capacity to enter into binding 
                                contracts under applicable law. If you are using the Platform on behalf of an organization, 
                                you represent that you have the authority to bind that organization to these Terms.
                            </p>
                            <p>
                                <strong>2.3 Account Information:</strong> You agree to provide accurate, current, and complete 
                                information during registration and to update such information to maintain its accuracy. 
                                You are solely responsible for maintaining the confidentiality of your account credentials.
                            </p>
                            <p>
                                <strong>2.4 Account Security:</strong> You are responsible for all activities that occur under 
                                your account. You must immediately notify us of any unauthorized access or security breach. 
                                We are not liable for any loss or damage arising from unauthorized account access due to your 
                                failure to maintain security.
                            </p>
                            <p>
                                <strong>2.5 One Account Per User:</strong> Each user may maintain only one active account. 
                                Creating multiple accounts for fraudulent purposes or to circumvent restrictions is prohibited.
                            </p>
                        </section>

                        <section>
                            <h2>3. Nature of the Platform & Disclaimer of Employment Relationship</h2>
                            <p>
                                <strong>3.1 Intermediary Status:</strong> Riseflake operates as an online intermediary platform 
                                that connects job seekers with employers and recruiters. We are NOT an employment agency, 
                                recruitment firm, or employer.
                            </p>
                            <p>
                                <strong>3.2 No Employment Guarantee:</strong> We do not guarantee, warrant, or promise:
                            </p>
                            <ul>
                                <li>Employment, job placement, interviews, or hiring outcomes for job seekers</li>
                                <li>The quality, suitability, or qualifications of any candidate for employers</li>
                                <li>That any job posting is genuine, accurate, or available</li>
                                <li>The accuracy of information provided by users</li>
                            </ul>
                            <p>
                                <strong>3.3 No Contractual Relationship:</strong> Riseflake is not a party to any employment 
                                contract, agreement, or relationship formed between job seekers and employers through the Platform. 
                                All employment terms, conditions, compensation, and arrangements are solely between the employer 
                                and employee.
                            </p>
                            <p>
                                <strong>3.4 Independent Verification Required:</strong> Users must independently verify all 
                                information, including job postings, employer legitimacy, candidate credentials, and company details. 
                                We do not conduct background checks, employment verification, or credential authentication.
                            </p>
                        </section>

                        <section>
                            <h2>4. User Responsibilities & Permitted Use</h2>
                            <p>
                                <strong>4.1 Job Seekers:</strong> Job seekers may use the Platform to:
                            </p>
                            <ul>
                                <li>Create professional profiles with truthful and accurate information</li>
                                <li>Upload resumes and professional credentials</li>
                                <li>Search for and apply to legitimate job opportunities</li>
                                <li>Network with other professionals in a lawful manner</li>
                                <li>Receive job alerts and recommendations</li>
                            </ul>
                            <p>
                                Job seekers represent and warrant that all information provided is accurate, current, and not 
                                misleading. You are solely responsible for the content of your profile and applications.
                            </p>
                            <p>
                                <strong>4.2 Employers & Recruiters:</strong> Employers and recruiters may use the Platform to:
                            </p>
                            <ul>
                                <li>Post legitimate job openings that comply with all applicable employment laws</li>
                                <li>Search for and contact potential candidates</li>
                                <li>Review applications and conduct recruitment activities</li>
                                <li>Manage hiring workflows and communications</li>
                            </ul>
                            <p>
                                Employers represent and warrant that all job postings are genuine, non-discriminatory, legal, 
                                and comply with applicable labor laws, including but not limited to laws prohibiting discrimination 
                                based on race, religion, caste, gender, age, disability, or any protected characteristic.
                            </p>
                            <p>
                                <strong>4.3 General Conduct:</strong> All users agree to use the Platform in a lawful, ethical, 
                                and professional manner consistent with community standards and business practices.
                            </p>
                        </section>

                        <section>
                            <h2>5. Prohibited Activities & Content</h2>
                            <p>
                                Users are strictly prohibited from engaging in the following activities:
                            </p>
                            <p>
                                <strong>5.1 Fraudulent Activity:</strong>
                            </p>
                            <ul>
                                <li>Posting fake, fraudulent, or non-existent job listings</li>
                                <li>Providing false credentials, qualifications, or employment history</li>
                                <li>Impersonating another person or entity</li>
                                <li>Creating fake profiles or accounts</li>
                                <li>Engaging in employment scams, pyramid schemes, or fraudulent recruitment</li>
                                <li>Requesting payment from job seekers for job applications or placements</li>
                            </ul>
                            <p>
                                <strong>5.2 Discriminatory Content:</strong>
                            </p>
                            <ul>
                                <li>Posting job listings that discriminate based on protected characteristics</li>
                                <li>Harassing, threatening, or abusing other users</li>
                                <li>Using hate speech or promoting discrimination</li>
                            </ul>
                            <p>
                                <strong>5.3 Unlawful Content:</strong>
                            </p>
                            <ul>
                                <li>Posting illegal job opportunities (e.g., unauthorized work, illegal activities)</li>
                                <li>Violating intellectual property rights</li>
                                <li>Distributing malware, viruses, or harmful code</li>
                                <li>Engaging in unauthorized data collection or scraping</li>
                            </ul>
                            <p>
                                <strong>5.4 Spam & Misuse:</strong>
                            </p>
                            <ul>
                                <li>Sending unsolicited bulk messages or spam</li>
                                <li>Using automated systems, bots, or scripts without authorization</li>
                                <li>Harvesting user data for unauthorized purposes</li>
                                <li>Selling or redistributing Platform data or access</li>
                                <li>Reverse engineering or attempting to access source code</li>
                            </ul>
                            <p>
                                <strong>5.5 Inappropriate Content:</strong>
                            </p>
                            <ul>
                                <li>Adult content, pornography, or sexually explicit material</li>
                                <li>Content promoting violence, self-harm, or illegal activities</li>
                                <li>Defamatory, libelous, or invasive content</li>
                            </ul>
                            <p>
                                Violation of these prohibitions may result in immediate account termination, legal action, 
                                and reporting to law enforcement authorities.
                            </p>
                        </section>

                        <section>
                            <h2>6. Content Ownership, Licensing & Intellectual Property</h2>
                            <p>
                                <strong>6.1 User Content:</strong> You retain ownership of all content you post on the Platform 
                                ("User Content"), including resumes, profiles, job postings, messages, and other materials. 
                                However, by posting User Content, you grant Bold India Platforms Private Limited a worldwide, 
                                non-exclusive, royalty-free, transferable, sublicensable license to use, reproduce, modify, 
                                adapt, publish, display, distribute, and create derivative works from your User Content for 
                                the purpose of:
                            </p>
                            <ul>
                                <li>Operating, maintaining, and improving the Platform</li>
                                <li>Providing Services to you and other users</li>
                                <li>Marketing and promoting Riseflake</li>
                                <li>Complying with legal obligations</li>
                            </ul>
                            <p>
                                This license continues even after you stop using the Platform, except for User Content you 
                                delete from your account.
                            </p>
                            <p>
                                <strong>6.2 Content Responsibility:</strong> You are solely responsible for your User Content. 
                                You represent and warrant that you have all necessary rights to post User Content and that it 
                                does not violate any third-party rights or applicable laws.
                            </p>
                            <p>
                                <strong>6.3 Platform Content:</strong> All Platform content, features, functionality, design, 
                                logos, trademarks, trade names, graphics, images, software, and other materials (excluding User 
                                Content) are owned by Bold India Platforms Private Limited and protected by copyright, trademark, 
                                patent, and other intellectual property laws.
                            </p>
                            <p>
                                <strong>6.4 Restrictions:</strong> You may not copy, modify, distribute, sell, lease, or 
                                reverse engineer any part of the Platform without express written permission.
                            </p>
                            <p>
                                <strong>6.5 Content Removal:</strong> We reserve the right, but have no obligation, to monitor, 
                                review, edit, or remove User Content that violates these Terms, is inappropriate, or for any 
                                other reason at our sole discretion.
                            </p>
                        </section>

                        <section>
                            <h2>7. Job Postings & Application Process</h2>
                            <p>
                                <strong>7.1 Employer Obligations:</strong> Employers posting job listings represent and warrant that:
                            </p>
                            <ul>
                                <li>All job postings are genuine, accurate, and currently available</li>
                                <li>Job descriptions comply with all applicable employment laws</li>
                                <li>Postings do not contain discriminatory requirements or preferences</li>
                                <li>They have the authority to recruit for the posted positions</li>
                                <li>They will not charge job seekers any fees for applications or interviews</li>
                                <li>They will conduct recruitment fairly and in good faith</li>
                            </ul>
                            <p>
                                <strong>7.2 Job Seeker Obligations:</strong> Job seekers represent and warrant that:
                            </p>
                            <ul>
                                <li>All information in profiles and applications is truthful and accurate</li>
                                <li>Uploaded documents (resumes, certificates) are genuine and belong to them</li>
                                <li>They have the legal right to work where they are applying</li>
                                <li>They will respond professionally to employer communications</li>
                            </ul>
                            <p>
                                <strong>7.3 Platform Role:</strong> Riseflake's role is limited to facilitating connections. 
                                We do NOT:
                            </p>
                            <ul>
                                <li>Verify the authenticity of job postings or employer companies</li>
                                <li>Conduct background checks on employers or job seekers</li>
                                <li>Guarantee the accuracy of posted salary ranges or benefits</li>
                                <li>Verify educational credentials or work experience</li>
                                <li>Mediate employment disputes or disagreements</li>
                                <li>Guarantee responses to applications or interviews</li>
                            </ul>
                            <p>
                                <strong>7.4 Due Diligence:</strong> Users must conduct their own due diligence before entering 
                                into any employment relationship, including verifying company legitimacy, job details, and 
                                conducting interviews.
                            </p>
                        </section>

                        <section>
                            <h2>8. Payment Terms & Refund Policy</h2>
                            <p>
                                <strong>8.1 Free & Paid Services:</strong> Riseflake offers both free and premium (paid) 
                                services. Premium features may include enhanced visibility, priority support, advanced search, 
                                and additional tools.
                            </p>
                            <p>
                                <strong>8.2 Pricing:</strong> Current pricing for premium services is displayed on the Platform. 
                                We reserve the right to modify pricing at any time with reasonable advance notice to existing 
                                subscribers.
                            </p>
                            <p>
                                <strong>8.3 Payment Processing:</strong> Payments are processed through secure third-party 
                                payment gateways. We do not store credit card or payment information on our servers.
                            </p>
                            <p>
                                <strong>8.4 Subscription Terms:</strong> Premium subscriptions automatically renew unless 
                                cancelled before the renewal date. You are responsible for cancelling subscriptions through 
                                your account settings.
                            </p>
                            <p>
                                <strong>8.5 Refund Policy:</strong> All fees are generally non-refundable except as required 
                                by law or in cases of proven technical failure on our part. Refund requests must be submitted 
                                within 7 days of purchase with valid justification.
                            </p>
                            <p>
                                <strong>8.6 Taxes:</strong> All fees are exclusive of applicable taxes, which are your 
                                responsibility to pay.
                            </p>
                        </section>

                        <section>
                            <h2>9. Privacy & Data Protection</h2>
                            <p>
                                Your use of Riseflake is governed by our Privacy Policy, which is incorporated into these 
                                Terms by reference. The Privacy Policy explains how we collect, use, store, and protect your 
                                personal information in compliance with the Information Technology Act, 2000, the Digital 
                                Personal Data Protection Act, 2023, and other applicable data protection laws.
                            </p>
                            <p>
                                By using the Platform, you consent to the collection and use of your information as described 
                                in the Privacy Policy. If you do not agree to the Privacy Policy, you must not use our Services.
                            </p>
                            <p>
                                Users are responsible for ensuring that any personal data they share or collect through the 
                                Platform complies with applicable data protection laws.
                            </p>
                        </section>

                        <section>
                            <h2>10. Disclaimers & Limitation of Liability</h2>
                            <p>
                                <strong>10.1 "AS IS" Basis:</strong> THE PLATFORM AND ALL SERVICES ARE PROVIDED ON AN "AS IS" 
                                AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING 
                                BUT NOT LIMITED TO:
                            </p>
                            <ul>
                                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                                <li>Warranties regarding accuracy, reliability, or completeness of content</li>
                                <li>Warranties of uninterrupted, timely, or error-free operation</li>
                                <li>Warranties regarding results obtained from use of the Platform</li>
                            </ul>
                            <p>
                                <strong>10.2 No Verification:</strong> WE DO NOT VERIFY, ENDORSE, OR GUARANTEE:
                            </p>
                            <ul>
                                <li>The identity, credentials, or background of users</li>
                                <li>The accuracy of job postings, profiles, or applications</li>
                                <li>The legitimacy of employers or job opportunities</li>
                                <li>The qualifications or suitability of job seekers</li>
                                <li>The outcome of any employment relationship formed through the Platform</li>
                            </ul>
                            <p>
                                <strong>10.3 Third-Party Conduct:</strong> We are not responsible for the conduct, actions, 
                                or omissions of any user, employer, recruiter, or third party. Users interact with each other 
                                at their own risk.
                            </p>
                            <p>
                                <strong>10.4 Limitation of Liability:</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW, BOLD 
                                INDIA PLATFORMS PRIVATE LIMITED, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AFFILIATES, AND 
                                LICENSORS SHALL NOT BE LIABLE FOR:
                            </p>
                            <ul>
                                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                                <li>Loss of profits, revenue, data, business opportunities, or goodwill</li>
                                <li>Damages arising from employment decisions, hiring outcomes, or job placements</li>
                                <li>Damages resulting from user conduct, fraudulent activity, or misrepresentation</li>
                                <li>Damages from unauthorized access, data breaches, or security incidents beyond our control</li>
                                <li>Damages from service interruptions, errors, or technical failures</li>
                                <li>Damages from third-party content, links, or services</li>
                            </ul>
                            <p>
                                <strong>10.5 Maximum Liability:</strong> IN NO EVENT SHALL OUR TOTAL AGGREGATE LIABILITY TO 
                                YOU EXCEED THE GREATER OF (A) THE AMOUNT PAID BY YOU TO RISEFLAKE IN THE 12 MONTHS PRECEDING 
                                THE CLAIM, OR (B) INR 10,000 (TEN THOUSAND RUPEES).
                            </p>
                            <p>
                                <strong>10.6 Jurisdictional Limitations:</strong> Some jurisdictions do not allow the exclusion 
                                of certain warranties or limitations of liability. In such jurisdictions, our liability will be 
                                limited to the maximum extent permitted by law.
                            </p>
                            <p>
                                <strong>10.7 User Acknowledgment:</strong> You acknowledge that these disclaimers and limitations 
                                are fundamental elements of the agreement between you and Bold India Platforms Private Limited, 
                                and that we would not provide the Services without these limitations.
                            </p>
                        </section>

                        <section>
                            <h2>11. Indemnification</h2>
                            <p>
                                You agree to indemnify, defend, and hold harmless Bold India Platforms Private Limited, its 
                                parent, subsidiaries, affiliates, officers, directors, employees, agents, partners, and 
                                licensors from and against any and all claims, liabilities, damages, losses, costs, expenses, 
                                fees (including reasonable attorneys' fees) arising from or related to:
                            </p>
                            <ul>
                                <li>Your use or misuse of the Platform and Services</li>
                                <li>Your violation of these Terms or any applicable law or regulation</li>
                                <li>Your User Content or any content you post or transmit</li>
                                <li>Your violation of any third-party rights, including intellectual property, privacy, or contractual rights</li>
                                <li>Your interactions with other users, including employment relationships</li>
                                <li>Any fraudulent, negligent, or intentional misconduct on your part</li>
                                <li>Any dispute between you and another user</li>
                            </ul>
                            <p>
                                This indemnification obligation survives termination of these Terms and your use of the Platform.
                            </p>
                        </section>

                        <section>
                            <h2>12. Third-Party Links & Services</h2>
                            <p>
                                The Platform may contain links to third-party websites, applications, or services that are not 
                                owned or controlled by Bold India Platforms Private Limited. We have no control over and assume 
                                no responsibility for the content, privacy policies, terms of service, or practices of any 
                                third-party sites or services.
                            </p>
                            <p>
                                You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, 
                                for any damage or loss caused or alleged to be caused by or in connection with use of or reliance 
                                on any such third-party content, goods, or services.
                            </p>
                            <p>
                                We strongly advise you to read the terms of service and privacy policies of any third-party 
                                websites or services that you visit.
                            </p>
                        </section>

                        <section>
                            <h2>13. Modification of Terms & Services</h2>
                            <p>
                                <strong>13.1 Terms Modification:</strong> We reserve the right to modify, update, or replace 
                                these Terms at any time at our sole discretion. Material changes will be communicated through:
                            </p>
                            <ul>
                                <li>Email notification to your registered email address</li>
                                <li>Prominent notice on the Platform</li>
                                <li>In-app notification</li>
                            </ul>
                            <p>
                                Changes take effect immediately upon posting for new users, and after the notice period (minimum 
                                7 days) for existing users. Your continued use of the Platform after changes become effective 
                                constitutes acceptance of the modified Terms.
                            </p>
                            <p>
                                <strong>13.2 Service Modification:</strong> We reserve the right to modify, suspend, or 
                                discontinue any aspect of the Platform or Services, temporarily or permanently, with or without 
                                notice. We shall not be liable to you or any third party for any modification, suspension, or 
                                discontinuance of Services.
                            </p>
                        </section>

                        <section>
                            <h2>14. Account Termination & Suspension</h2>
                            <p>
                                <strong>14.1 Termination by User:</strong> You may terminate your account at any time by 
                                following the account deletion process in your settings. Termination does not relieve you of 
                                obligations incurred prior to termination.
                            </p>
                            <p>
                                <strong>14.2 Termination by Riseflake:</strong> We reserve the right to suspend, disable, 
                                or terminate your account and access to the Platform at any time, with or without notice, for 
                                any reason, including but not limited to:
                            </p>
                            <ul>
                                <li>Violation of these Terms or any applicable law</li>
                                <li>Fraudulent, abusive, or illegal activity</li>
                                <li>Providing false or misleading information</li>
                                <li>Harming the Platform, other users, or our business interests</li>
                                <li>Extended period of inactivity</li>
                                <li>At our sole discretion for any other reason</li>
                            </ul>
                            <p>
                                <strong>14.3 Effects of Termination:</strong> Upon termination:
                            </p>
                            <ul>
                                <li>Your right to access and use the Platform immediately ceases</li>
                                <li>We may delete your User Content (subject to retention requirements)</li>
                                <li>Outstanding payment obligations remain due</li>
                                <li>Provisions regarding intellectual property, disclaimers, limitation of liability, and indemnification survive</li>
                            </ul>
                            <p>
                                <strong>14.4 No Refunds:</strong> Termination or suspension does not entitle you to any refund 
                                of fees paid, except as required by law.
                            </p>
                        </section>

                        <section>
                            <h2>15. Dispute Resolution & Governing Law</h2>
                            <p>
                                <strong>15.1 Governing Law:</strong> These Terms and your use of the Platform shall be governed 
                                by and construed in accordance with the laws of India, without regard to conflict of law principles.
                            </p>
                            <p>
                                <strong>15.2 Jurisdiction:</strong> Subject to the arbitration clause below, you agree that any 
                                legal action or proceeding arising out of or relating to these Terms or the Platform shall be 
                                instituted exclusively in the courts located in Pune, Maharashtra, India. You irrevocably submit 
                                to the jurisdiction of such courts and waive any objection to venue.
                            </p>
                            <p>
                                <strong>15.3 Arbitration Agreement:</strong> Any dispute, controversy, or claim arising out of 
                                or relating to these Terms or the Platform, including the breach, termination, or validity thereof, 
                                shall first be attempted to be resolved through good-faith negotiations between the parties.
                            </p>
                            <p>
                                If negotiations fail within 30 days, either party may refer the dispute to binding arbitration 
                                in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall be:
                            </p>
                            <ul>
                                <li>Conducted by a sole arbitrator mutually appointed by the parties</li>
                                <li>Held in Pune, Maharashtra, India</li>
                                <li>Conducted in English</li>
                                <li>Subject to the procedural rules of the Indian Council of Arbitration</li>
                            </ul>
                            <p>
                                The arbitrator's decision shall be final and binding, and judgment may be entered in any court 
                                of competent jurisdiction.
                            </p>
                            <p>
                                <strong>15.4 Exceptions to Arbitration:</strong> Notwithstanding the above, either party may 
                                seek injunctive or other equitable relief in any court of competent jurisdiction to prevent 
                                infringement of intellectual property rights or confidential information.
                            </p>
                            <p>
                                <strong>15.5 Class Action Waiver:</strong> TO THE EXTENT PERMITTED BY LAW, ALL CLAIMS MUST BE 
                                BROUGHT IN A PARTY'S INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED 
                                CLASS, COLLECTIVE ACTION, OR REPRESENTATIVE PROCEEDING.
                            </p>
                        </section>

                        <section>
                            <h2>16. General Provisions</h2>
                            <p>
                                <strong>16.1 Entire Agreement:</strong> These Terms, together with our Privacy Policy and any 
                                other policies referenced herein, constitute the entire agreement between you and Bold India 
                                Platforms Private Limited regarding the Platform and supersede all prior agreements and understandings.
                            </p>
                            <p>
                                <strong>16.2 Severability:</strong> If any provision of these Terms is found to be invalid, 
                                illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified 
                                to the minimum extent necessary to make it valid and enforceable, or if not possible, severed 
                                from these Terms. The remaining provisions shall continue in full force and effect.
                            </p>
                            <p>
                                <strong>16.3 Waiver:</strong> No waiver of any term or condition of these Terms shall be deemed 
                                a further or continuing waiver of such term or any other term. Our failure to assert any right 
                                or provision under these Terms shall not constitute a waiver of such right or provision.
                            </p>
                            <p>
                                <strong>16.4 Assignment:</strong> You may not assign, transfer, or delegate these Terms or your 
                                rights and obligations hereunder without our prior written consent. We may freely assign these 
                                Terms without restriction. Any attempted assignment in violation of this provision is void.
                            </p>
                            <p>
                                <strong>16.5 Force Majeure:</strong> We shall not be liable for any failure or delay in 
                                performance due to causes beyond our reasonable control, including acts of God, natural disasters, 
                                war, terrorism, riots, labor disputes, government actions, internet failures, or equipment failures.
                            </p>
                            <p>
                                <strong>16.6 Notices:</strong> All notices to Bold India Platforms Private Limited must be sent 
                                to the contact information provided in Section 18. We may provide notices to you via email, 
                                in-app notifications, or postings on the Platform.
                            </p>
                            <p>
                                <strong>16.7 No Agency:</strong> No agency, partnership, joint venture, employee-employer, or 
                                franchisor-franchisee relationship is intended or created by these Terms.
                            </p>
                            <p>
                                <strong>16.8 Survival:</strong> Provisions that by their nature should survive termination shall 
                                survive, including but not limited to intellectual property rights, disclaimers, limitation of 
                                liability, indemnification, and dispute resolution provisions.
                            </p>
                        </section>

                        <section>
                            <h2>17. Compliance with Laws</h2>
                            <p>
                                Users must comply with all applicable local, state, national, and international laws, regulations, 
                                and ordinances in their use of the Platform, including but not limited to:
                            </p>
                            <ul>
                                <li>Employment and labor laws</li>
                                <li>Anti-discrimination and equal opportunity laws</li>
                                <li>Data protection and privacy laws</li>
                                <li>Intellectual property laws</li>
                                <li>Anti-spam and electronic communications laws</li>
                                <li>Tax laws and regulations</li>
                                <li>Import/export control laws</li>
                            </ul>
                            <p>
                                You represent and warrant that your use of the Platform does not violate any applicable laws 
                                or regulations in your jurisdiction or the jurisdiction where you conduct business.
                            </p>
                        </section>

                        <section>
                            <h2>18. Contact Information</h2>
                            <p>
                                For questions, concerns, disputes, or any other matters regarding these Terms of Service, 
                                please contact us:
                            </p>
                            <p>
                                <strong>Company Name:</strong> Bold India Platforms Private Limited<br />
                                <strong>Brand Name:</strong> Riseflake<br />
                                <strong>Registered Office:</strong> [Complete registered office address to be added]<br />
                                <strong>Email:</strong> hello@boldindia.in, support@riseflake.com, legal@riseflake.com<br />
                                <strong>CIN:</strong> U85499PN2025PTC246360<br />
                                <strong>Customer Support:</strong> Available through the Platform
                            </p>
                            <p>
                                For legal notices, please send correspondence to our registered office address or to 
                                legal@riseflake.com with "Legal Notice" in the subject line.
                            </p>
                        </section>

                        <section>
                            <h2>19. Acknowledgment & Agreement</h2>
                            <p>
                                BY ACCESSING OR USING RISEFLAKE, YOU ACKNOWLEDGE THAT:
                            </p>
                            <ul>
                                <li>You have read, understood, and agree to be bound by these Terms of Service</li>
                                <li>You meet all eligibility requirements specified herein</li>
                                <li>You understand that Riseflake is an intermediary platform and not an employment agency</li>
                                <li>You accept all disclaimers and limitations of liability</li>
                                <li>You will use the Platform lawfully, ethically, and professionally</li>
                                <li>You are responsible for your own due diligence in all interactions</li>
                                <li>You have reviewed our Privacy Policy and consent to data practices described therein</li>
                            </ul>
                            <p className="mt-8 font-semibold text-slate-700">
                                These Terms constitute a legally binding agreement. If you do not agree to these Terms, 
                                you must not access or use the Platform.
                            </p>
                            <p className="mt-4 italic">
                                Last Updated: 08/01/2026 12:00 PM<br />
                                Version: 1.0<br />
                                Effective Date: 08/01/2026
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