import type { Metadata } from 'next';
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: { default: 'Trust & Safety', template: '%s | Riseflake Jobportal' },
  description: 'Learn about Riseflake\'s commitment to trust and safety for all users on the platform.',
  alternates: { canonical: `${WEBSITE_BASE_URL}/trust-and-safety`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/trust-and-safety`) },
  robots: { index: true, follow: true },
};

export default function TrustAndSafetyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
