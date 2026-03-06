"use client";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

export default function TrustAndSafety() {
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
                  <span className="font-semibold text-indigo-600">Trust & Safety</span>
                </nav>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Trust & Safety</h1>
              </div>
            </div>
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" onClick={() => router.back()} aria-label="Go back">
                <FiArrowLeft color="black" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900">Trust & Safety</h1>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-6 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section>
                <p className="mb-2"><strong>Version 1.0</strong></p>
                <p><strong>Last Updated:</strong> March 05, 2026 &nbsp;|&nbsp; <strong>Effective Date:</strong> March 05, 2026</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Our Commitment to Trust &amp; Safety</h2>
                <p>
                  At RiseFlake, operated by Bold India Platforms Private Limited, we are committed to creating a safe, trustworthy, and professional environment for all users. Our Trust &amp; Safety policies are designed to protect job seekers, employers, and recruiters from fraudulent activities, harassment, and inappropriate behavior on our website (www.riseflake.com) and mobile applications available on the Google Play Store and Apple App Store (collectively, the &quot;Platform&quot;).
                </p>
                <p className="mt-2">
                  We believe that trust is the foundation of any professional networking and employment platform. Every user deserves a safe space to build their career, find talent, and grow professionally.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Community Guidelines</h2>
                <p>All users of RiseFlake are expected to adhere to our community guidelines:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Professionalism:</strong> Maintain professional conduct in all communications and interactions on the Platform, including chat messages, job applications, and profile content.</li>
                  <li><strong>Honesty &amp; Integrity:</strong> Provide accurate and truthful information in profiles, job postings, resumes, certificates, projects, and applications. Misrepresenting your qualifications, experience, or identity is strictly prohibited.</li>
                  <li><strong>Respect:</strong> Treat all users with respect and dignity, regardless of their background, identity, or beliefs.</li>
                  <li><strong>No Discrimination:</strong> Do not discriminate based on race, religion, caste, gender, age, disability, sexual orientation, or any other protected characteristic.</li>
                  <li><strong>No Harassment:</strong> Harassment, bullying, threats, stalking, or abusive behavior of any kind will not be tolerated — whether through chat, job postings, or any other feature.</li>
                  <li><strong>Privacy:</strong> Respect the privacy of other users and do not share their personal information without explicit consent. Do not misuse contact details obtained through the Platform.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Prohibited Activities</h2>
                <p>The following activities are strictly prohibited on our Platform:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Fraudulent Job Postings:</strong> Posting fake, misleading, or non-existent job listings, or misrepresenting employment opportunities, compensation, or job roles.</li>
                  <li><strong>Advance Fee Fraud:</strong> Requesting payment from job seekers for job applications, training, background checks, equipment, registration, or any processing fees. Legitimate employers never charge candidates for hiring.</li>
                  <li><strong>Identity Theft &amp; Impersonation:</strong> Impersonating another person, company, recruiter, or organization. Using someone else&apos;s identity, credentials, or brand name without authorization.</li>
                  <li><strong>Spamming:</strong> Sending unsolicited bulk messages, advertisements, promotional content, or irrelevant communications to other users.</li>
                  <li><strong>Phishing &amp; Scams:</strong> Attempting to collect sensitive information (passwords, OTPs, bank details, Aadhaar numbers) through deceptive means, fake websites, or social engineering.</li>
                  <li><strong>Inappropriate Content:</strong> Posting content that is offensive, obscene, sexually explicit, defamatory, violent, or illegal.</li>
                  <li><strong>Data Scraping &amp; Harvesting:</strong> Unauthorized collection, scraping, crawling, or harvesting of user data, profiles, or job postings from the Platform using bots, scripts, or automated tools.</li>
                  <li><strong>Account Manipulation:</strong> Creating fake accounts, multiple accounts, buying/selling accounts, or using automation tools to manipulate Platform features.</li>
                  <li><strong>MLM &amp; Pyramid Schemes:</strong> Promoting multi-level marketing, pyramid schemes, or any scheme that requires recruitment fees or investment from job seekers.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4. Verification &amp; Authentication</h2>
                <p>We implement multiple verification measures to ensure the authenticity of users and content on the Platform:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Email Verification:</strong> All users must verify their email addresses during registration to activate their accounts.</li>
                  <li><strong>Phone Verification:</strong> Mobile number verification is required for account activation and security purposes.</li>
                  <li><strong>Company Verification:</strong> Employers and recruiters may be asked to provide valid business information and documentation to verify their organization&apos;s legitimacy.</li>
                  <li><strong>Profile Completeness:</strong> Users are encouraged to complete their profiles fully and accurately, which helps build trust within the community.</li>
                  <li><strong>Ongoing Monitoring:</strong> We continuously monitor accounts and activities for suspicious patterns that may indicate fraudulent or unauthorized use.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5. Content Moderation</h2>
                <p>We actively monitor and moderate content on the Platform to maintain quality and safety:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Automated Filters:</strong> Technology-powered systems detect and flag inappropriate content, spam, suspicious activity, and policy violations in real time.</li>
                  <li><strong>Manual Review:</strong> Our moderation team reviews flagged content and user reports to make informed decisions on enforcement.</li>
                  <li><strong>Job Posting Review:</strong> Job postings are reviewed to ensure compliance with our policies, including checks for discriminatory language, misleading descriptions, and fraudulent intent.</li>
                  <li><strong>User Reports:</strong> Users can report violations directly through the Platform, and our team will investigate and take appropriate action promptly.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">6. Reporting Violations</h2>
                <p>If you encounter any violations of our Trust &amp; Safety policies, please report them immediately. Your reports help us keep the Platform safe for everyone:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>In-App Reporting:</strong> Use the &quot;Report&quot; button available on job postings, profiles, and messages to flag content or users directly</li>
                  <li><strong>Email:</strong> Contact our Trust &amp; Safety team at <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a></li>
                  <li><strong>WhatsApp:</strong> Reach our Company Headquarters at +91 92252 20170</li>
                  <li>Provide detailed information about the violation, including screenshots, profile links, and any relevant context</li>
                </ul>
                <p className="mt-2">All reports are treated as confidential — your identity will not be shared with the reported user.</p>
                <p className="mt-2">We aim to acknowledge reports within 24 hours and take action within 48 hours for urgent safety matters.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7. Enforcement Actions</h2>
                <p>Violations of our Trust &amp; Safety policies may result in the following actions, depending on the severity and frequency of the violation:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Warning:</strong> First-time or minor violations may result in a formal warning with guidance on complying with our policies.</li>
                  <li><strong>Content Removal:</strong> Violating content (job postings, messages, profile content) will be removed from the Platform immediately.</li>
                  <li><strong>Feature Restriction:</strong> Specific features (such as messaging or job posting) may be temporarily restricted for users who violate guidelines.</li>
                  <li><strong>Account Suspension:</strong> Temporary suspension of account access for serious or repeated violations.</li>
                  <li><strong>Account Termination:</strong> Permanent ban from the Platform for severe violations, fraud, illegal activities, or repeated policy breaches.</li>
                  <li><strong>Legal Action:</strong> In cases involving criminal activity, fraud, data theft, or harassment, we may report the matter to law enforcement authorities and pursue legal remedies.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8. User Safety Tips</h2>
                <p>Protect yourself while using RiseFlake. Here are essential safety tips for all users:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Never share your password, OTP, Aadhaar number, PAN card number, bank account details, or sensitive financial information with anyone — including people claiming to be from RiseFlake.</li>
                  <li>Verify employers independently before applying — check company websites, LinkedIn profiles, and official registrations.</li>
                  <li>Be cautious of job offers that seem too good to be true, promise unusually high salaries with minimal qualifications, or require immediate action.</li>
                  <li>Never pay fees for job applications, interviews, training, background checks, or equipment. Legitimate employers do not charge candidates.</li>
                  <li>Research companies independently before attending interviews — visit their official website and verify their physical address.</li>
                  <li>Meet safely for interviews in professional, well-known locations (offices, co-working spaces) or use video interviews. Avoid meeting at private residences or isolated locations.</li>
                  <li>Report immediately any suspicious behavior, requests for money, or attempts to collect personal information.</li>
                  <li>Keep communications on the Platform whenever possible — this helps us protect you and investigate reports.</li>
                  <li>Use strong passwords and enable additional security settings on your account.</li>
                  <li>Be wary of external links shared in messages — do not click on suspicious URLs that could be phishing attempts.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">9. Data Privacy &amp; Security</h2>
                <p>We take data privacy and security seriously. Our commitment includes:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Your personal information is protected with industry-standard encryption (TLS/SSL) both in transit and at rest.</li>
                  <li>We do not sell, rent, or trade your personal data to third parties.</li>
                  <li>You have full control over your profile visibility and privacy settings.</li>
                  <li>You can choose to Permanently Delete your account or Hibernate (deactivate) your account at any time.</li>
                  <li>We comply with the Digital Personal Data Protection Act, 2023 and other applicable Indian data protection laws.</li>
                </ul>
                <p className="mt-2 text-sm italic">For complete details on how we handle your data, please refer to our Privacy Policy.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10. Protection Against Fraud</h2>
                <p>We employ multiple measures to detect and prevent fraudulent activities on the Platform:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Technology-powered fraud detection systems that monitor patterns and flag suspicious activity.</li>
                  <li>Verification of employer identities and business credentials before enabling recruitment features.</li>
                  <li>Real-time monitoring of suspicious patterns, unusual account behavior, and bulk messaging.</li>
                  <li>User education and awareness through safety tips, notifications, and in-app alerts.</li>
                  <li>Collaboration with law enforcement agencies and cybercrime authorities when criminal activity is identified.</li>
                  <li>Proactive removal of confirmed fraudulent accounts and job postings.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">11. Appeals Process</h2>
                <p>If you believe your account was unfairly restricted, suspended, or terminated, or if your content was wrongly removed, you have the right to appeal our decision:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Submit an appeal via email to <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a> with the subject line &quot;Trust &amp; Safety Appeal&quot;.</li>
                  <li>You may also reach us via WhatsApp at +91 92252 20170.</li>
                  <li>Include your registered email address, a description of the action taken, and why you believe it was unjustified.</li>
                  <li>Our Trust &amp; Safety team will review your appeal within 5–7 business days.</li>
                  <li>You will be notified of the outcome via email. Our decision on the appeal will be final.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">12. Continuous Improvement</h2>
                <p>We are committed to continuously improving our Trust &amp; Safety measures to stay ahead of evolving threats and provide the best possible experience:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Regular updates to our policies based on user feedback, emerging threats, and industry best practices.</li>
                  <li>Investment in advanced security technologies and detection systems.</li>
                  <li>Ongoing training and development for our moderation and safety teams.</li>
                  <li>Collaboration with industry experts, safety organizations, and cybersecurity professionals.</li>
                  <li>Transparent communication with users about policy changes and safety updates.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">13. Contact Trust &amp; Safety Team</h2>
                <p>For any questions, concerns, or reports related to trust and safety on RiseFlake, please contact us:</p>
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
                <p className="mt-8 font-semibold text-slate-800">
                  We are here to help. If you ever feel unsafe or encounter suspicious activity, please do not hesitate to reach out — your safety is our priority.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
