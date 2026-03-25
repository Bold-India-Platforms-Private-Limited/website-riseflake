import Head from 'next/head';
import InfoPageLayout from '@/components/legal/InfoPageLayout';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const TermsOfServicePage = () => {
  return (
    <>
      <Head>
        <title>Terms of Service | Resume Riseflake</title>
      </Head>

      <LandingNavbar />

      <InfoPageLayout
        hideMobileHeader
        showLegalNav
        title="Terms of Service"
        breadcrumbLabel="Terms of Service"
        intro="Last Updated: March 2026. These Terms of Service ('Terms') constitute a legally binding agreement between you and Bold India Platforms Private Limited ('Company', 'we', 'us', or 'our') regarding your access to and use of Riseflake.com and Riseflake Resume Builder application."
        sections={[
          {
            heading: '1. Acceptance of Terms & Services',
            body: 'By creating an account, making a payment, or using Riseflake Resume Builder, you acknowledge that you have read, understood, and agreed to be bound by these Terms. Our services include providing a digital platform for resume creation, AI-based content suggestions, and ATS optimization templates. We reserve the right to modify these terms at any time without prior notice.',
          },
          {
            heading: '2. "No Refund" Policy & Payment Terms',
            body: 'Riseflake Resume Builder operates on a prepaid subscription model. ONCE A PAYMENT IS SUCCESSFULLY PROCESSED, NO REFUNDS WILL BE ISSUED UNDER ANY CIRCUMSTANCES. This includes, but is not limited to: change of mind, inability to use the product due to technical issues on the user side, or dissatisfaction with the resume outcome. Our products are digital in nature and are considered "used" immediately upon plan activation or first resume download.',
          },
          {
            heading: '3. ATS Score & Job Guarantees Disclaimer',
            body: 'CRITICAL DISCLAIMER: Riseflake is a tool to assist in resume building. We DO NOT give any guarantee, express or implied, for a 100% or "Perfect" ATS (Applicant Tracking System) score. ATS algorithms vary by company and software provider; therefore, our "ATS-friendly" claim refers to industry best practices only. WE DO NOT GUARANTEE job shortlisting, hiring results, job interviews, recruitment calls, or any form of employment outcome. You acknowledge that your career success depends on factors beyond our control.',
          },
          {
            heading: '4. Subscription Limits & Expiration',
            body: 'Each plan comes with specific quotas (e.g., number of downloads, AI edits). Use the "Download" button carefully; each click that generates a file consumes your plan limit. Once your plan expires (based on the validity period of 1 month, 3 months, or as specified), you will lose access to premium features and must renew to continue. We do not offer automatic extensions or data backup guarantees after plan expiration.',
          },
          {
            heading: '5. Prohibited Use of Platform',
            body: 'You agree not to: (a) Use Riseflake for any illegal or fraudulent activities. (b) Attempt to reverse engineer, decompile, or steal the source code of the platform. (c) Use automated bots to scrape or generate resumes. (d) Share your account credentials with others. Account sharing will result in immediate termination without refund.',
          },
          {
            heading: '6. Intellectual Property Rights',
            body: 'All designs, templates, software, and AI content generation logic are the exclusive intellectual property of Bold India Platforms Private Limited. You are granted a limited, non-exclusive license to use the generated resumes for your personal job search only. Commercial resale of our templates is strictly prohibited.',
          },
          {
            heading: '7. Limitation of Liability',
            body: 'To the maximum extent permitted by law, Bold India Platforms Private Limited shall not be liable for any indirect, incidental, or consequential damages resulting from your use or inability to use the service. Our total liability for any claim shall not exceed the amount you paid for your current active plan.',
          },
          {
            heading: '8. Termination of Service',
            body: 'We reserve the right to suspend or terminate your access to Riseflake for violation of these terms or for any behavior that we deem harmful to our brand, other users, or business operations. No refunds will be provided in the event of termination due to a violation of these terms.',
          },
          {
            heading: '9. Governing Law & Jurisdiction',
            body: 'These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.',
          },
          {
            heading: '10. Official Company Details',
            body: (
              <div className="space-y-6 mt-4">
                <p>By using this website, you confirm your acceptance of these terms. For any legal inquiries, please contact us at:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 underline underline-offset-4">Entity Information</h4>
                    <p className="font-semibold">Bold India Platforms Private Limited</p>
                    <p>CIN: U85499PN2025PTC246360</p>
                    <p>Brand Name: Riseflake.com</p>
                    <p>Product: Riseflake Resume Builder</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 underline underline-offset-4">Statutory Office</h4>
                    <p>Sn 242/1/2 Baner, Tejaswini Soc</p>
                    <p>DP Road, N.I.A., Pune</p>
                    <p>Maharashtra, India - 411045</p>
                  </div>
                  <div className="md:col-span-2 border-t border-slate-200 pt-4 flex flex-wrap gap-x-8 gap-y-2">
                    <p><span className="font-bold">Email:</span> hello@boldindia.in</p>
                    <p><span className="font-bold">Web:</span> www.boldindia.in</p>
                    <p><span className="font-bold">Platform:</span> Riseflake.com</p>
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

export default TermsOfServicePage;
