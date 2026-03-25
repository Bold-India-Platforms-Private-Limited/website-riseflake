import Head from 'next/head';
import InfoPageLayout from '@/components/legal/InfoPageLayout';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const ContactUsPage = () => {
  return (
    <>
      <Head>
        <title>Contact Us | Resume Riseflake</title>
      </Head>

      <div className="hidden md:block">
        <LandingNavbar />
      </div>

      <InfoPageLayout
        hideMobileHeader
        title="Contact Us"
        breadcrumbLabel="Contact Us"
        intro="Get in touch with the Resume Riseflake team at Bold India Platforms. This page currently contains placeholder contact details and will be updated soon."
        sections={[
          {
            heading: 'Support Email',
            body: 'support@riseflake.com— For account issues, builder access, and payment-related queries.',
          },
          {
            heading: 'Business Inquiries',
            body: 'business@riseflake.com— For partnerships, integrations, and enterprise collaboration requests.',
          },
          {
            heading: 'Working Hours',
            body: 'Monday to Saturday, 10:00 AM to 7:00 PM IST (placeholder). Responses may take 24–48 business hours.',
          },
          {
            heading: 'Company',
            body: 'Bold India Platforms | Product: Riseflake | Module: Resume Riseflake.',
          },
        ]}
      />

      <LandingFooter />
    </>
  );
};

export default ContactUsPage;
