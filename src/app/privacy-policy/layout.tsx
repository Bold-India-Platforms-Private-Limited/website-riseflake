import type { Metadata } from 'next';
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: { default: 'Privacy Policy - How We Protect Your Data', template: '%s | Riseflake Jobportal' },
  description: 'Read the Riseflake Privacy Policy to understand how we collect, use, and protect your personal information.',
  alternates: { canonical: `${WEBSITE_BASE_URL}/privacy-policy`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/privacy-policy`) },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
