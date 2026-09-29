import type { Metadata } from 'next';
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: { default: 'Terms of Service', template: '%s | Riseflake Jobportal' },
  description: 'Read the Riseflake Terms of Service. Understand your rights and responsibilities when using the Riseflake platform.',
  alternates: { canonical: `${WEBSITE_BASE_URL}/terms-of-service`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/terms-of-service`) },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
