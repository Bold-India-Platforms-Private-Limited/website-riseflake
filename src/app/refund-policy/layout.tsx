import type { Metadata } from 'next';
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: { default: 'Refund Policy', template: '%s | Riseflake Jobportal' },
  description: 'Read the Riseflake Refund Policy to understand our terms for subscription and payment refunds.',
  alternates: { canonical: `${WEBSITE_BASE_URL}/refund-policy`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/refund-policy`) },
  robots: { index: true, follow: true },
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
