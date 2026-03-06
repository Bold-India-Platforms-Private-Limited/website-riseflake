"use client";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

export default function Disclaimer() {
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
                  <span className="font-semibold text-indigo-600">Disclaimer</span>
                </nav>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Disclaimer</h1>
              </div>
            </div>
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 md:hidden">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" onClick={() => router.back()} aria-label="Go back">
                <FiArrowLeft color="black" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900">Disclaimer</h1>
            </div>
            <div className="h-px w-full bg-slate-200 md:hidden"></div>
            <div className="flex flex-col min-h-[60vh] justify-between space-y-8 px-6 py-6 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              <section>
                <p className="mb-2"><strong>Version 1.0</strong></p>
                <p><strong>Last Updated:</strong> March 05, 2026 &nbsp;|&nbsp; <strong>Effective Date:</strong> March 05, 2026</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. General Disclaimer</h2>
                <p>
                  RiseFlake (operated by Bold India Platforms Private Limited, CIN: U85499PN2025PTC246360) (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is an online intermediary platform designed to facilitate connections between job seekers, employers, recruiters, and professionals within the Indian employment ecosystem.
                </p>
                <p className="mt-2">
                  We provide services through our website (www.riseflake.com) and mobile applications available on the Google Play Store and Apple App Store (collectively, the &quot;Services&quot;).
                </p>
                <p className="mt-2">
                  This Disclaimer and Disclosure (&quot;Disclosure&quot;) outlines important limitations, disclosures, and clarifications regarding the nature of our Services, your use of the Platform, and the relationships formed through it. By using RiseFlake, you acknowledge and agree to the terms set forth in this Disclosure, along with our Terms of Service, Privacy Policy, and Refund Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Platform Nature &amp; Role Disclosure</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">2.1 Intermediary Status</h3>
                <p>RiseFlake operates solely as an intermediary platform under the Information Technology Act, 2000 and related rules. We provide a digital venue for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Job seekers to create profiles, upload resumes, and search for employment opportunities</li>
                  <li>Employers and recruiters to post job openings and search for potential candidates</li>
                  <li>Professionals to network and connect within their industry</li>
                  <li>Users to access career resources, market insights, and professional development tools</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">2.2 NOT an Employment Agency</h3>
                <p>We explicitly disclose that we are NOT:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>An employment agency, recruitment firm, or headhunter</li>
                  <li>An employer of any job seeker or user</li>
                  <li>A party to employment contracts or agreements</li>
                  <li>A guarantor of employment outcomes or hiring success</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">2.3 No Endorsement or Verification</h3>
                <p>We do NOT:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Endorse, recommend, or guarantee any user, employer, or job seeker</li>
                  <li>Verify the authenticity, accuracy, or completeness of user profiles, job postings, or credentials</li>
                  <li>Conduct background checks, reference checks, or employment verification</li>
                  <li>Validate company legitimacy, financial standing, or business practices</li>
                  <li>Assess workplace safety, employment conditions, or corporate culture</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. User Content &amp; Information Disclaimer</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">3.1 User-Generated Content</h3>
                <p>
                  All content posted by users (including but not limited to job postings, profiles, resumes, reviews, messages, and comments) is created and published by users themselves. We are not the author, editor, or publisher of such content.
                </p>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">3.2 No Content Verification</h3>
                <p>We do not verify, monitor, or endorse:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Educational qualifications, certifications, or degrees listed in profiles</li>
                  <li>Employment history, work experience, or skills claimed by users</li>
                  <li>Salary information, benefits, or compensation details in job postings</li>
                  <li>Company information, size, industry, or financial data</li>
                  <li>Job availability, position requirements, or hiring timelines</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">3.3 User Responsibility</h3>
                <p>Users are solely responsible for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>The accuracy, truthfulness, and completeness of all information they provide</li>
                  <li>Conducting independent verification of information received through the Platform</li>
                  <li>Ensuring compliance with applicable laws in their content and interactions</li>
                  <li>The consequences of sharing personal or sensitive information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4. Job Market &amp; Employment Disclaimers</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">4.1 No Employment Guarantees</h3>
                <p>We explicitly DISCLAIM any guarantee, warranty, or promise regarding:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Job placement, employment, or hiring outcomes for any user</li>
                  <li>Interview opportunities, callbacks, or recruitment processes</li>
                  <li>Suitability, qualifications, or match between job seekers and employers</li>
                  <li>Job availability, position longevity, or hiring freezes</li>
                  <li>Market conditions, employment trends, or industry demand</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">4.2 Employer Disclosures</h3>
                <p>Employers and recruiters using the Platform acknowledge and disclose that:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>They are solely responsible for legal compliance in hiring practices</li>
                  <li>They must conduct independent verification of candidate credentials</li>
                  <li>They bear full responsibility for employment terms, conditions, and relationships</li>
                  <li>They must comply with all applicable labor laws, including anti-discrimination statutes</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">4.3 Job Seeker Disclosures</h3>
                <p>Job seekers using the Platform acknowledge and disclose that:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>They are solely responsible for verifying employer legitimacy and job authenticity</li>
                  <li>They must exercise caution when sharing personal information or attending interviews</li>
                  <li>They should never pay fees for job applications, interviews, or placements</li>
                  <li>They are responsible for due diligence on potential employers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">5. Professional Networking &amp; Community Disclaimers</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">5.1 Network Connections</h3>
                <p>The professional networking features of RiseFlake are designed to facilitate industry connections. However, we DISCLAIM responsibility for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>The quality, authenticity, or professionalism of connections made</li>
                  <li>Content shared in professional discussions, groups, or forums</li>
                  <li>Business relationships, partnerships, or collaborations formed through the Platform</li>
                  <li>Professional advice, recommendations, or endorsements exchanged between users</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">5.2 User Interactions</h3>
                <p>Users interact at their own risk. We are not responsible for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Misconduct, harassment, or unprofessional behavior by users</li>
                  <li>Business disputes, conflicts, or disagreements arising from connections</li>
                  <li>Unsolicited communications, spam, or inappropriate contact</li>
                  <li>Reliance on professional advice or information exchanged on the Platform</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">5.3 Community Guidelines</h3>
                <p>
                  While we provide community guidelines and safety measures (as detailed in our Trust &amp; Safety policy), we do not actively monitor all interactions. Users must exercise judgment and report inappropriate behavior.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">6. Third-Party Content &amp; External Links</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">6.1 Third-Party Content</h3>
                <p>The Platform may display, link to, or integrate with:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Job postings from external career portals or company websites</li>
                  <li>News articles, industry reports, or market analyses from third-party sources</li>
                  <li>Training materials, courses, or certifications from external providers</li>
                  <li>Tools, assessments, or services offered by third-party vendors</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">6.2 No Endorsement</h3>
                <p>We do NOT:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Endorse, recommend, or guarantee third-party content, services, or products</li>
                  <li>Verify the accuracy, reliability, or quality of third-party information</li>
                  <li>Assume responsibility for third-party websites, services, or their content</li>
                  <li>Guarantee the security, privacy, or terms of third-party integrations</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">6.3 External Links</h3>
                <p>
                  Links to external websites are provided for convenience only. Users access third-party sites at their own risk and should review their terms and privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">7. Career Resources &amp; Advice Disclaimer</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">7.1 Informational Purpose Only</h3>
                <p>
                  All career resources, advice articles, resume tips, interview guides, and professional development content provided on RiseFlake are for general informational purposes only.
                </p>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">7.2 Not Professional Advice</h3>
                <p>Such content DOES NOT constitute:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Professional career counseling or employment advice</li>
                  <li>Legal advice regarding employment contracts or workplace rights</li>
                  <li>Financial advice regarding compensation, benefits, or negotiations</li>
                  <li>Guaranteed strategies for employment success</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">7.3 Individual Results May Vary</h3>
                <p>
                  Career outcomes are influenced by numerous factors beyond our control, including market conditions, individual qualifications, interview performance, and employer preferences.
                </p>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">7.4 User Discretion Advised</h3>
                <p>Users should:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Apply judgment and personal circumstances to any advice or resources</li>
                  <li>Consult qualified professionals for specific career or legal advice</li>
                  <li>Verify information through multiple sources</li>
                  <li>Adapt general advice to their specific situation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">8. Data &amp; Analytics Disclaimers</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">8.1 Market Data &amp; Insights</h3>
                <p>Any employment market data, salary information, industry trends, or hiring analytics displayed on the Platform:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Are based on aggregated, anonymized user data and third-party sources</li>
                  <li>May not reflect real-time market conditions or complete industry data</li>
                  <li>Should not be relied upon for critical employment or business decisions</li>
                  <li>May contain estimates, approximations, or statistical projections</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">8.2 Accuracy Limitations</h3>
                <p>We do NOT guarantee:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>The accuracy, completeness, or timeliness of market data</li>
                  <li>That salary ranges reflect actual compensation offered or received</li>
                  <li>That hiring trends predict individual employment outcomes</li>
                  <li>The statistical significance or methodology of displayed analytics</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">8.3 Recommendation Algorithms</h3>
                <p>
                  Job recommendations, match scores, and suggested connections are generated by automated algorithms based on available data. These are suggestions only and do not represent endorsements or guarantees of suitability.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">9. Security &amp; Privacy Disclosures</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">9.1 Security Measures</h3>
                <p>While we implement industry-standard security measures (as detailed in our Privacy Policy), we DISCLAIM guarantees regarding:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>100% prevention of unauthorized access, data breaches, or security incidents</li>
                  <li>Security of information transmitted over public networks or user devices</li>
                  <li>Protection against all forms of cyber attacks, malware, or hacking attempts</li>
                  <li>Recovery of lost or compromised data</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">9.2 User Responsibility</h3>
                <p>Users are responsible for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Maintaining the security of their account credentials</li>
                  <li>Using secure internet connections and updated devices</li>
                  <li>Exercising caution when sharing sensitive information</li>
                  <li>Reporting suspicious activity or security concerns to <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a></li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">9.3 Privacy Limitations</h3>
                <p>Our Privacy Policy outlines data practices, but users should understand that:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Information shared publicly on profiles may be accessible to other users and recruiters</li>
                  <li>We cannot control how other users handle information shared with them</li>
                  <li>Certain data may be retained as required by law (as detailed in Section 9 of our Privacy Policy)</li>
                  <li>Complete anonymity cannot be guaranteed in all interactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">10. Financial &amp; Transaction Disclosures</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">10.1 Free Platform</h3>
                <p>
                  RiseFlake currently provides all its services completely free of charge to all users. There are no paid plans, subscriptions, premium tiers, or in-app purchases available on the Platform at this time. Since no payments are collected, no refunds are applicable. For more details, refer to our Refund Policy.
                </p>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">10.2 No Financial Transactions Between Users</h3>
                <p>
                  RiseFlake does NOT facilitate, process, or guarantee financial transactions between users. Any financial arrangements (including salary payments, consulting fees, or business transactions) are solely between the involved parties.
                </p>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">10.3 Warning Against Payment Requests</h3>
                <p>Users are advised:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>NEVER send money or make payments to other users through or outside the Platform</li>
                  <li>NEVER pay for job applications, interviews, training, background checks, or employment offers</li>
                  <li>Report immediately any user requesting payment for employment-related services</li>
                  <li>Be cautious of &quot;advance fee&quot; scams, MLM schemes, or fraudulent financial requests</li>
                  <li>Legitimate employers do not charge candidates for hiring</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">10.4 Future Paid Services</h3>
                <p>
                  If RiseFlake introduces paid services in the future, all fees will be clearly disclosed before purchase, payment processing will use secure third-party gateways (e.g., Razorpay), and these Terms will be updated accordingly with advance notice to users.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">11. Legal Compliance &amp; Regulatory Disclosures</h2>
                <h3 className="font-semibold text-slate-700 mt-4 mb-2">11.1 User Legal Responsibility</h3>
                <p>Users are solely responsible for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Compliance with all applicable employment, labor, and workplace laws</li>
                  <li>Adherence to anti-discrimination, equal opportunity, and diversity regulations</li>
                  <li>Following industry-specific regulations and professional standards</li>
                  <li>Tax compliance for employment income or business transactions</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">11.2 Platform Compliance</h3>
                <p>While we strive for legal compliance:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>We do not provide legal advice or compliance guarantees</li>
                  <li>We cannot monitor all user activities for legal compliance</li>
                  <li>Users must independently ensure their activities comply with applicable laws</li>
                  <li>We cooperate with lawful authorities as required by applicable regulations</li>
                </ul>

                <h3 className="font-semibold text-slate-700 mt-4 mb-2">11.3 Jurisdictional Variations</h3>
                <p>
                  Employment laws vary by state, region, and country. Users must understand and comply with laws applicable to their specific location and circumstances.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">12. Risk Acknowledgement &amp; User Acceptance</h2>
                <p>By using RiseFlake, you ACKNOWLEDGE AND ACCEPT the following risks:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Employment Risk:</strong> No guarantee of employment, interviews, or hiring outcomes</li>
                  <li><strong>Information Risk:</strong> Potential inaccuracies in user content, job postings, or profiles</li>
                  <li><strong>Interaction Risk:</strong> Possibility of unprofessional, fraudulent, or harmful user interactions</li>
                  <li><strong>Market Risk:</strong> Fluctuations in job market conditions and employment opportunities</li>
                  <li><strong>Technology Risk:</strong> Service interruptions, technical failures, or platform changes</li>
                  <li><strong>Security Risk:</strong> Potential data exposure, unauthorized access, or privacy breaches</li>
                  <li><strong>Legal Risk:</strong> Responsibility for legal compliance in employment activities</li>
                </ul>
                <p className="mt-4 font-semibold text-slate-800">
                  You agree to use RiseFlake with appropriate caution, diligence, and professional judgment.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">13. Changes to This Disclosure</h2>
                <p>We reserve the right to modify, update, or change this Disclaimer and Disclosure at any time. Material changes will be communicated through:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Email notification to registered users</li>
                  <li>In-app notifications and announcements</li>
                  <li>Updated &quot;Last Updated&quot; date at the top of this document</li>
                </ul>
                <p className="mt-4">
                  Your continued use of RiseFlake after changes to this Disclosure constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">14. Contact for Clarifications</h2>
                <p>For questions, concerns, or clarifications regarding this Disclaimer and Disclosure, please contact us:</p>
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
                <p className="mt-4">
                  For urgent concerns regarding fraudulent activity, safety issues, or legal violations, please report through the Platform or contact us at <a href="mailto:support@riseflake.com" className="text-indigo-600 hover:underline">support@riseflake.com</a> or via WhatsApp at +91 92252 20170.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">15. Final Acknowledgement</h2>
                <p className="font-semibold text-slate-800 uppercase mb-2">BY USING RISEFLAKE, YOU EXPLICITLY ACKNOWLEDGE THAT:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You have read, understood, and agree to this Disclaimer and Disclosure</li>
                  <li>You understand RiseFlake&apos;s role as an intermediary platform only</li>
                  <li>You accept all risks associated with using the Platform</li>
                  <li>You are solely responsible for your employment decisions and interactions</li>
                  <li>You will conduct independent verification of all important information</li>
                  <li>You will exercise professional judgment and due diligence</li>
                  <li>You will not hold RiseFlake liable for employment outcomes or user conduct</li>
                  <li>You understand that all services are currently provided free of charge</li>
                </ul>
                <p className="mt-6 font-semibold text-red-600">
                  If you do not agree with any part of this Disclaimer and Disclosure, you must immediately discontinue use of RiseFlake.
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
