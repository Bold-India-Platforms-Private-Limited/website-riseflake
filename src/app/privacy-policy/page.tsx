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
        <p className="mb-2"><strong>Version 1.1</strong></p>
        <p><strong>Last Updated:</strong> May 21, 2026 &nbsp;|&nbsp; <strong>Effective Date:</strong> May 21, 2026</p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Introduction</h2>
        <p>
            Welcome to <strong>RiseFlake</strong>, a digital employment and professional networking platform operated by <strong>Bold India Platforms Private Limited</strong> ("Company", "we", "us", or "our"). We provide services through our website (www.riseflake.com) and mobile applications available on the Google Play Store and Apple App Store (collectively, the "Platform").
        </p>
        <p className="mt-2">
            This Privacy Policy explains how we collect, use, store, disclose, and protect your personal data when you access or use our Platform. This policy applies to all users of the Platform, including job seekers, recruiters, employers, and visitors.
        </p>
        <p className="mt-2">
            This Privacy Policy is published in compliance with the Information Technology Act, 2000 and the rules made thereunder, the Digital Personal Data Protection Act, 2023 ("DPDP Act"), and other applicable Indian laws and globally accepted data protection standards.
        </p>
        <p className="mt-2">
            By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with this Privacy Policy, please do not use the Platform.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Definitions</h2>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>&quot;Personal Data&quot;</strong> means any data about an individual who is identifiable by or in relation to such data, as defined under the DPDP Act, 2023.</li>
            <li><strong>&quot;Data Fiduciary&quot;</strong> means Bold India Platforms Private Limited, which determines the purpose and means of processing personal data.</li>
            <li><strong>&quot;Data Principal&quot;</strong> means the individual to whom the personal data relates — i.e., you, the user.</li>
            <li><strong>&quot;Processing&quot;</strong> means any operation performed on personal data, including collection, storage, use, sharing, modification, or deletion.</li>
            <li><strong>&quot;Platform&quot;</strong> means the RiseFlake website, web application, mobile applications (Android &amp; iOS), and all related services.</li>
        </ul>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Data Fiduciary Information</h2>
        <ul className="list-none space-y-1">
            <li><strong>Company Name:</strong> Bold India Platforms Private Limited</li>
            <li><strong>Brand Name:</strong> RiseFlake</li>
            <li><strong>CIN:</strong> U85499PN2025PTC246360</li>
            <li><strong>Registered Office:</strong> Sn 242/1/2 Baner, Tejaswini Soc, DP Road, N.I.A., Pune, Maharashtra 411045, India</li>
            <li><strong>Email:</strong> <a href="mailto:hello@boldindia.in" className="text-indigo-600 hover:underline">hello@boldindia.in</a></li>
            <li><strong>Website:</strong> <a href="https://www.boldindia.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.boldindia.in</a></li>
            <li><strong>Phone / WhatsApp:</strong> +91 92252 20170</li>
        </ul>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4. Information We Collect</h2>
        <p>We collect the following categories of information when you use our Platform:</p>
        
        <h3 className="text-lg font-medium text-slate-800 mt-4 mb-2">4.1 Information You Provide Directly</h3>
        <p className="font-semibold mt-2">a) Account &amp; Identity Information</p>
        <ul className="list-disc pl-5 mt-1">
            <li>Full name, username, email address, phone number, and password</li>
            <li>Date of birth and gender</li>
            <li>Profile photo</li>
            <li>Account role (e.g., Candidate, Recruiter, Employer)</li>
            <li>Email and phone verification status</li>
            <li>Communication preferences and notification settings</li>
        </ul>

        <p className="font-semibold mt-3">b) Professional Information</p>
        <ul className="list-disc pl-5 mt-1">
            <li>Professional headline and career goals</li>
            <li>Job preferences (e.g., Job Only, Internship, Remote preference)</li>
            <li>User type (e.g., College Student, Working Professional)</li>
            <li>Purposes for using the Platform (e.g., Find Job, Upskill, Mentoring, Events)</li>
            <li>Work experience details including company name, designation, employment type, office location, start/end dates, currently working status, remote work status, and description</li>
            <li>Whether you obtained your job through RiseFlake</li>
        </ul>

        <p className="font-semibold mt-3">c) Education Information</p>
        <ul className="list-disc pl-5 mt-1">
            <li>College or institution name</li>
            <li>Qualification, course, and specialization</li>
            <li>Start and end years</li>
            <li>Percentage or CGPA</li>
            <li>Board of education (e.g., for High School/10th, 12th)</li>
        </ul>

        <p className="font-semibold mt-3">d) Skills, Certifications &amp; Projects</p>
        <ul className="list-disc pl-5 mt-1">
            <li>Professional and technical skills</li>
            <li>Certificates including title, issuing organization, issue and expiry dates, credential ID, credential URL, associated skills, and description</li>
            <li>Projects including title, project type, description, skills used, project URL, start and end dates, and ongoing status</li>
        </ul>

        <p className="font-semibold mt-3">e) Resume &amp; Portfolio</p>
        <ul className="list-disc pl-5 mt-1">
            <li>Resume link (e.g., Google Drive URL)</li>
            <li>External portfolio links</li>
        </ul>

        <p className="font-semibold mt-3">f) Location &amp; Address Information</p>
        <ul className="list-disc pl-5 mt-1">
            <li>Current location and preferred work location (city, state, country)</li>
            <li>Current address (address line 1, address line 2, landmark, pincode, city/state/country)</li>
            <li>Permanent address (address line 1, address line 2, landmark, pincode, city/state/country)</li>
        </ul>

        <p className="font-semibold mt-3">g) Personal Bio &amp; Interests</p>
        <ul className="list-disc pl-5 mt-1">
            <li>&quot;About Yourself&quot; description (free-text bio)</li>
            <li>Hobbies and personal interests</li>
        </ul>

        <p className="font-semibold mt-3">h) Social &amp; External Links</p>
        <ul className="list-disc pl-5 mt-1">
            <li>LinkedIn, GitHub, Twitter (X), Instagram, Reddit, Medium, Behance, Dribbble, CodePen, Figma, LeetCode profile URLs</li>
            <li>Personal website and portfolio URLs</li>
            <li>Any other external link you choose to provide</li>
        </ul>

        <p className="font-semibold mt-3">i) Recruiter &amp; Employer Data</p>
        <ul className="list-disc pl-5 mt-1">
            <li>Company or organization details</li>
            <li>Job postings and hiring activity</li>
            <li>Business contact information</li>
        </ul>

        <h3 className="text-lg font-medium text-slate-800 mt-6 mb-2">4.2 Information Collected Automatically</h3>
        <ul className="list-disc pl-5 mt-1">
            <li><strong>Device &amp; Technical Data:</strong> Device type, model, operating system, browser type and version, unique device identifiers, app version, screen resolution, and language settings</li>
            <li><strong>Usage Data:</strong> Pages and features accessed, search queries, clicks, session duration, interaction patterns, referring URLs, and in-app navigation behavior</li>
            <li><strong>Network Data:</strong> IP address, internet service provider, and approximate geolocation derived from IP</li>
            <li><strong>Log Data:</strong> Access timestamps, error logs, crash reports, and diagnostic data</li>
            <li><strong>Cookies &amp; Similar Technologies:</strong> Session cookies, persistent cookies, local storage data, and pixel tags (see Section 11 for details)</li>
        </ul>

        <h3 className="text-lg font-medium text-slate-800 mt-6 mb-2">4.3 Information from Third Parties</h3>
        <ul className="list-disc pl-5 mt-1">
            <li>If you sign in using a third-party service (e.g., Google), we may receive your name, email, and profile picture as authorized by you</li>
            <li>Information provided by recruiters or employers about candidates, where applicable and with proper consent</li>
        </ul>

        <h3 className="text-lg font-medium text-slate-800 mt-6 mb-2">4.4 Device Contacts (Android App Only)</h3>
        <p>
            When you use the <strong>Networking</strong> or <strong>Chat</strong> features in the RiseFlake Android app, we request access to your device contacts. This permission is optional — you may decline it and still use the rest of the app.
        </p>
        <p className="mt-2 font-semibold">What we access:</p>
        <ul className="list-disc pl-5 mt-1">
            <li>Contact names and associated phone numbers / email addresses stored on your device</li>
        </ul>
        <p className="mt-2 font-semibold">Why we use it:</p>
        <ul className="list-disc pl-5 mt-1">
            <li>To identify which of your contacts are already registered on RiseFlake</li>
            <li>To show you relevant professional connection suggestions (colleagues, classmates, HRs, recruiters)</li>
            <li>To help you grow your professional network faster by surfacing people you already know</li>
        </ul>
        <p className="mt-2 font-semibold">What we do NOT do:</p>
        <ul className="list-disc pl-5 mt-1">
            <li>We do <strong>not</strong> upload your raw contact list to our servers</li>
            <li>We do <strong>not</strong> share your contacts with third parties</li>
            <li>We do <strong>not</strong> use contact data for advertising</li>
            <li>Contact data is processed on-device or via a one-way hashed matching process and is never stored in identifiable form</li>
        </ul>
        <p className="mt-2">
            You can revoke contacts permission at any time through your device Settings → Apps → Riseflake → Permissions. Revoking permission disables connection suggestions but does not affect your existing connections or any other feature.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5. How We Use Your Information</h2>
        <p>We process your personal data for the following specific purposes:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Account Management:</strong> Creating, maintaining, and securing your user account, and verifying your identity</li>
            <li><strong>Job Discovery &amp; Recruitment:</strong> Enabling job seekers to discover and apply for relevant opportunities, and enabling recruiters/employers to find and contact suitable candidates</li>
            <li><strong>Professional Networking:</strong> Facilitating connections, mentorship, and professional interactions among users</li>
            <li><strong>Profile Matching:</strong> Using your skills, education, experience, location and preferences to recommend relevant jobs, connections, and content</li>
            <li><strong>Communication:</strong> Sending service-related messages, alerts, job updates, and notification emails (which you may control via your settings)</li>
            <li><strong>Platform Improvement:</strong> Analyzing usage patterns and feedback to improve features, functionality, and user experience</li>
            <li><strong>Security &amp; Fraud Prevention:</strong> Detecting, preventing, and addressing fraud, unauthorized access, security incidents, and technical issues</li>
            <li><strong>Legal Compliance:</strong> Fulfilling our legal obligations, responding to legal processes, and enforcing our terms of service</li>
            <li><strong>Analytics &amp; Research:</strong> Generating anonymized, aggregated insights to understand platform usage trends</li>
        </ul>
        <p className="mt-2">
            We process your personal data only where we have a valid legal basis to do so, including: your consent; performance of a contract with you; compliance with legal obligations; or our legitimate interests that do not override your fundamental rights.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">6. Information Sharing &amp; Disclosure</h2>
        <p>We do not sell, rent, or trade your personal data. We may share your information only in the following circumstances and with appropriate safeguards:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>With Recruiters &amp; Employers:</strong> When you apply for a job, express interest, or enable your profile to be visible to recruiters, relevant profile information (such as your name, skills, education, experience, resume, and contact details) may be shared with the respective employer or recruiter</li>
            <li><strong>With Service Providers:</strong> We engage trusted third-party service providers who assist us in operating the Platform, subject to strict confidentiality and data processing agreements. These include cloud hosting providers, analytics services, email/notification service providers, and payment processors</li>
            <li><strong>Legal Requirements:</strong> We may disclose your data when we believe in good faith that disclosure is necessary to comply with applicable law, regulation, legal process, or enforceable governmental request; to enforce our policies; to protect the rights, property, or safety of RiseFlake, our users, or the public</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, asset sale, or similar corporate transaction, your personal data may be transferred as part of the transaction, subject to applicable data protection safeguards and notice to affected users</li>
            <li><strong>With Your Consent:</strong> We may share your data with other third parties when you explicitly authorize such sharing</li>
        </ul>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7. Third-Party Services &amp; SDKs</h2>
        <p>Our Platform integrates with the following third-party services and software development kits (SDKs), each of which may collect, process, or receive certain data as described below:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Google Firebase:</strong> Used for analytics, push notifications (FCM), crash reporting (Crashlytics), authentication, and real-time database services. May collect device identifiers, crash logs, app usage events, and FCM registration tokens</li>
            <li><strong>Amazon Web Services (AWS):</strong> Used for cloud infrastructure and data storage. Your data may be stored on AWS servers</li>
            <li><strong>Microsoft Azure:</strong> Used for cloud computing services and data processing infrastructure</li>
            <li><strong>Google Cloud Platform:</strong> Used for cloud infrastructure, data storage, and computing services</li>
            <li><strong>Cloudflare:</strong> Used for content delivery, DDoS protection, and performance optimization. May process IP addresses, HTTP request headers, and access logs</li>
            <li><strong>Razorpay:</strong> Used for payment processing, if applicable. May collect payment-related information necessary to process transactions</li>
            <li><strong>Google Analytics:</strong> Used for understanding Platform usage patterns. May collect device information, browsing behavior, session data, and interaction events</li>
        </ul>
        <p className="mt-2">
            Each third-party service operates under its own privacy policy. We encourage you to review their respective privacy policies. We only share the minimum data necessary for each service to function.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8. Cross-Border Data Transfers</h2>
        <p>Your personal data may be stored and processed on servers located outside India, including servers operated by our cloud infrastructure partners (AWS, Azure, Google Cloud) in various global regions. When your data is transferred outside India, we ensure appropriate safeguards are in place, including:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Contractual protections with data processors that include data protection obligations</li>
            <li>Compliance with applicable data transfer provisions under Indian law, including any requirements notified under the DPDP Act, 2023</li>
            <li>Selection of data processing locations that maintain adequate levels of data protection</li>
        </ul>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">9. Data Retention &amp; Account Management</h2>
        <p>We retain your personal data only for as long as necessary to fulfill the purposes described in this policy:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Active Account Data:</strong> Retained for the duration your account remains active, plus a reasonable period thereafter to enable account reactivation</li>
            <li><strong>Post-Deletion:</strong> Upon account deletion request, your personal data will be deleted or anonymized within 90 days, except where retention is required by law</li>
            <li><strong>Usage &amp; Analytics Data:</strong> Retained in anonymized or aggregated form for up to 24 months for analytics and platform improvement purposes</li>
            <li><strong>Legal Compliance Data:</strong> Certain data may be retained longer as required by applicable laws, regulations, or legal proceedings (e.g., financial transaction records as required under Indian tax laws)</li>
            <li><strong>Communication Records:</strong> Retained for up to 12 months after the last interaction, unless a longer period is required by law</li>
            <li><strong>Backup Data:</strong> May persist in encrypted backups for up to 30 days after deletion from primary systems</li>
        </ul>
        <p className="mt-3">We provide the following account management options:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Permanently Delete Account:</strong> You may permanently delete your account and all associated personal data from the Platform. Upon initiating permanent deletion, your data will be irreversibly removed from our primary systems within 90 days. This action cannot be undone. You can initiate this through your account settings or by contacting us at <a href="mailto:privacy@riseflake.com" className="text-indigo-600 hover:underline">privacy@riseflake.com</a></li>
            <li><strong>Hibernate Account:</strong> If you wish to take a break from the Platform without losing your data, you may hibernate (deactivate) your account. While hibernated, your profile will not be visible to recruiters or other users, and you will not receive any communications. Your data will be securely retained, and you can reactivate your account at any time by simply logging back in</li>
        </ul>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10. Data Security</h2>
        <p>We implement industry-standard administrative, technical, and physical security safeguards to protect your personal data against unauthorized access, alteration, disclosure, destruction, or loss. Our security measures include:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Encryption of data in transit (TLS/SSL) and at rest</li>
            <li>Secure authentication mechanisms including password hashing and optional two-factor authentication</li>
            <li>Regular security assessments and vulnerability testing</li>
            <li>Role-based access controls limiting employee access to personal data on a need-to-know basis</li>
            <li>Secure cloud infrastructure with leading providers (AWS, Azure, Google Cloud)</li>
            <li>Incident response procedures and breach notification protocols</li>
        </ul>
        <p className="mt-2">
            While we strive to protect your personal data, no method of electronic storage or transmission over the internet is 100% secure. We cannot guarantee absolute security, and you share your data at your own risk.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">11. Cookies &amp; Tracking Technologies</h2>
        <p>We use the following cookies and similar technologies on our Platform:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for the Platform to function properly, including session management, authentication, and security cookies. These cannot be disabled</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Platform, which pages are most visited, and how users navigate through the Platform. These include Google Analytics cookies</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings to provide a personalized experience (e.g., language, location preferences)</li>
            <li><strong>Performance Cookies:</strong> Help us monitor Platform performance, detect errors, and improve loading speeds</li>
        </ul>
        <p className="mt-2">
            You can manage or disable cookies through your browser or device settings. Please note that disabling essential cookies may affect the functionality of the Platform. For more information, please refer to our Cookie Policy.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">12. Your Rights</h2>
        <p>Under the DPDP Act, 2023, the Information Technology Act, 2000, and other applicable laws, you have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Right to Access:</strong> You may request a summary of the personal data we hold about you and the processing activities related to it</li>
            <li><strong>Right to Correction:</strong> You may request correction or updating of any inaccurate or incomplete personal data. You can also directly update most information through your profile settings</li>
            <li><strong>Right to Erasure:</strong> You may request deletion of your personal data by using the Permanently Delete Account option in your account settings, or by contacting us. Upon such request, we will delete or anonymize your data within 90 days, subject to any legal obligations requiring retention. Alternatively, you may choose to Hibernate your account to temporarily deactivate it without losing your data (see Section 9)</li>
            <li><strong>Right to Withdraw Consent:</strong> Where processing is based on your consent, you may withdraw consent at any time by contacting us at <a href="mailto:privacy@riseflake.com" className="text-indigo-600 hover:underline">privacy@riseflake.com</a> or through the relevant settings in your account. Withdrawal of consent will not affect the lawfulness of processing carried out prior to withdrawal</li>
            <li><strong>Right to Nominate:</strong> Under Section 14 of the DPDP Act, you have the right to nominate another individual to exercise your rights on your behalf in the event of your death or incapacity</li>
            <li><strong>Right to Grievance Redressal:</strong> You have the right to raise a complaint with our Grievance Officer if you believe your data privacy rights have been violated. We are committed to resolving your concerns — please connect with us directly</li>
            <li><strong>Profile Visibility Control:</strong> You may control who can view your profile, resume, and contact information through your privacy settings</li>
            <li><strong>Communication Preferences:</strong> You may opt out of non-essential communications (promotional emails, push notifications) through your account settings</li>
        </ul>
        <p className="mt-2">
            To exercise any of these rights, please contact us at <a href="mailto:privacy@riseflake.com" className="text-indigo-600 hover:underline">privacy@riseflake.com</a>. We will respond to your request within 30 days.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">13. Consent</h2>
        <p>By registering on the Platform or using our services, you consent to the collection, use, storage, and processing of your personal data as described in this Privacy Policy.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Consent for mandatory data is obtained at the time of registration and profile creation</li>
            <li>Consent for optional data (e.g., hobbies, social links, projects) is obtained when you voluntarily provide such information</li>
            <li>You may withdraw your consent at any time by contacting us; however, this may limit your ability to use certain features of the Platform</li>
            <li>Where we process data based on a legal basis other than consent (e.g., contractual necessity or legal obligation), such processing will continue even if consent is withdrawn</li>
        </ul>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">14. Data Breach Notification</h2>
        <p>In the event of a personal data breach that is likely to cause harm to affected users, we will:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Notify the Data Protection Board of India as required under the DPDP Act, 2023</li>
            <li>Notify affected data principals (users) as soon as reasonably practicable</li>
            <li>Take immediate steps to contain the breach and mitigate potential harm</li>
            <li>Maintain records of data breaches and remediation actions taken</li>
        </ul>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">15. Children&apos;s Privacy</h2>
        <p>
            RiseFlake is not intended for individuals under the age of 18. We do not knowingly collect, process, or store personal data from minors. If we become aware that we have collected personal data from an individual under the age of 18, we will take steps to delete such data promptly.
        </p>
        <p className="mt-2">
            If you are a parent or guardian and believe that your child has provided us with personal data, please contact us at <a href="mailto:privacy@riseflake.com" className="text-indigo-600 hover:underline">privacy@riseflake.com</a> so that we can take appropriate action.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">16. Third-Party Links</h2>
        <p>
            The Platform may contain links to third-party websites, applications, or services that are not operated by us (e.g., LinkedIn, GitHub, company websites linked from job postings). We are not responsible for the privacy practices of such third parties. We encourage you to review the privacy policies of any third-party services you interact with.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">17. Mandatory vs. Optional Data</h2>
        <p>
            Certain data fields on the Platform are marked as mandatory (indicated with an asterisk *) and are required for the Platform to function properly (e.g., name, email, phone number). Other fields are optional and you may choose whether to provide them (e.g., social media links, hobbies, certifications, projects). Providing optional information may enhance your profile visibility and job matching experience but is not required.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">18. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make significant changes:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>We will update the &quot;Last Updated&quot; date at the top of this policy</li>
            <li>We will notify you via email, in-app notification, or a prominent notice on the Platform for material changes</li>
            <li>Continued use of the Platform after the effective date of changes constitutes your acceptance of the revised policy</li>
        </ul>
        <p className="mt-2">
            We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your data.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">19. Grievance Officer</h2>
        <p>In accordance with the Information Technology Act, 2000 and the DPDP Act, 2023, we have appointed a Grievance Officer to address your concerns regarding data processing and privacy:</p>
        <div className="bg-slate-50 p-4 rounded-lg mt-3 border border-slate-200">
            <p className="font-semibold text-slate-800">Grievance Officer</p>
            <p className="font-semibold mt-1">Bold India Platforms Private Limited</p>
            <p><strong>Address:</strong> Sn 242/1/2 Baner, Tejaswini Soc, DP Road, N.I.A., Pune, Maharashtra 411045, India</p>
            <p><strong>Email:</strong> <a href="mailto:grievance@riseflake.com" className="text-indigo-600 hover:underline">grievance@riseflake.com</a></p>
            <p><strong>WhatsApp / Company Headquarters:</strong> +91 92252 20170</p>
            <p><strong>Response Time:</strong> We will acknowledge your complaint within 24 hours and resolve it within 30 days from the date of receipt.</p>
        </div>
        <p className="mt-3">
            If you have any issues, concerns, or are unsatisfied with our response, we encourage you to connect with us directly via email at <a href="mailto:grievance@riseflake.com" className="text-indigo-600 hover:underline">grievance@riseflake.com</a> or reach our Company Headquarters via WhatsApp at +91 92252 20170. You may also visit us at our registered office in Pune. We are committed to resolving your concerns and ensuring your experience on RiseFlake is safe and transparent.
        </p>
    </section>

    <section>
        <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">20. Contact Information</h2>
        <p>If you have any questions, concerns, or requests related to this Privacy Policy or our data practices, please contact us:</p>
        <ul className="list-none mt-3 space-y-1">
            <li><strong>Company:</strong> Bold India Platforms Private Limited</li>
            <li><strong>Brand:</strong> RiseFlake</li>
            <li><strong>Registered Office:</strong> Sn 242/1/2 Baner, Tejaswini Soc, DP Road, N.I.A., Pune, Maharashtra 411045, India</li>
            <li><strong>Email:</strong> <a href="mailto:hello@boldindia.in" className="text-indigo-600 hover:underline">hello@boldindia.in</a>, <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a></li>
            <li><strong>Grievance Email:</strong> <a href="mailto:grievance@riseflake.com" className="text-indigo-600 hover:underline">grievance@riseflake.com</a></li>
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
};

export default PrivacyPolicy;