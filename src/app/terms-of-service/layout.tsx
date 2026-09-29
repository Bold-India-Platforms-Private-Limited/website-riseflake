import type { Metadata } from 'next';
import { hreflangAlternates } from '../../lib/config';

export const metadata: Metadata = {
  title: { default: 'Terms of Service', template: '%s | Riseflake Jobportal' },
  description: 'Read the Riseflake Terms of Service. Understand your rights and responsibilities when using the Riseflake platform.',
  alternates: { canonical: 'https://jobportal.riseflake.com/terms-of-service', ...hreflangAlternates('https://jobportal.riseflake.com/terms-of-service') },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
