import Head from 'next/head';
import InfoPageLayout from '@/components/legal/InfoPageLayout';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Resume Riseflake</title>
      </Head>

      <LandingNavbar />

      <InfoPageLayout
        hideMobileHeader
        showLegalNav
        title="Privacy Policy"
        breadcrumbLabel="Privacy Policy"
        intro="Last Updated: March 2026. At Riseflake Resume Builder (Riseflake.com), operated by Bold India Platforms Private Limited, we are committed to protecting your privacy. This Privacy Policy describes how we collect, use, and share your personal information when you use our services."
        sections={[
          {
            heading: '1. Information We Collect',
            body: 'We collect several types of information: (a) Personal Data: Your name, email address, phone number, and account credentials. (b) Professional Content: Any information you input into your resumes, including work history, education, skills, and photos. (c) Usage Data: Information on how you interact with our templates, AI suggestions, and the "download" button.',
          },
          {
            heading: '2. How We Use Your Data',
            body: 'Your data is used to: (a) Provide the core resume-building service. (b) Generate AI-powered content suggestions based on your job role. (c) Optimize your resume for ATS-friendly formats. (d) Process payments through our secure third-party gateway. (e) Communicate important plan expiration and renewal alerts.',
          },
          {
            heading: '3. ATS & Recruitment Outcomes Disclaimer',
            body: 'LEGAL NOTICE: While we use advanced templates to improve ATS (Applicant Tracking System) readability, we do not guarantee a 100% ATS score or placement. Data collected to show "ATS Scores" is based on general industry benchmarks and does not guarantee job shortlisting, hires, or interview schedules. We do not share your private resume data with recruiters without your explicit action.',
          },
          {
            heading: '4. No Refund & Plan Usage Policy',
            body: 'We collect payment information only to authorize your selected plan. Please note that we operate a strict "No Refund" policy. Once a plan is active, the digital service is considered delivered. Users must use the download button carefully; each download is logged and constitutes a consumption of your plan quota. Renewal is required once the validity period ends.',
          },
          {
            heading: '5. Cookies & Tracking Technologies',
            body: 'We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
          },
          {
            heading: '6. Third-Party Service Providers',
            body: 'We may employ third-party companies and individuals (e.g., Payment Processors like Razorpay, Hosting via AWS/Vercel) to facilitate our service. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.',
          },
          {
            heading: '7. Data Security & Retention',
            body: 'The security of your data is important to us, but remember that no method of transmission over the Internet is 100% secure. We retain your resume data as long as your account is active or as needed to provide you services. Once your plan expires, we may archive your data for a limited period before deletion.',
          },
          {
            heading: '8. User Rights & Data Deletion',
            body: 'You have the right to access, update, or delete the information we have on you. You can perform most of these actions directly within your profile settings. For a complete data deletion request, please contact us at the email provided below.',
          },
          {
            heading: '9. Changes to This Policy',
            body: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.',
          },
          {
            heading: '10. Official Brand & Company Contact',
            body: (
              <div className="space-y-6 mt-4">
                <p>For any privacy-related concerns or data requests, please reach out to us:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 underline underline-offset-4">Corporate Info</h4>
                    <p className="font-semibold">Bold India Platforms Private Limited</p>
                    <p>CIN: U85499PN2025PTC246360</p>
                    <p>Brand: Riseflake.com</p>
                    <p>Product: Riseflake Resume Builder</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 underline underline-offset-4">Registered Office</h4>
                    <p>Sn 242/1/2 Baner, Tejaswini Soc</p>
                    <p>DP Road, N.I.A., Pune</p>
                    <p>Maharashtra 411045, India</p>
                  </div>
                  <div className="md:col-span-2 border-t border-slate-200 pt-4 flex flex-wrap gap-x-8 gap-y-2">
                    <p><span className="font-bold">Support Email:</span> hello@boldindia.in</p>
                    <p><span className="font-bold">Official Site:</span> www.boldindia.in</p>
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

export default PrivacyPolicyPage;
