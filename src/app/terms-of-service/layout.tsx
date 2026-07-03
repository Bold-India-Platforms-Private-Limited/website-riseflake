import type { Metadata } from 'next';
import { hreflangAlternates } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Riseflake Terms of Service. Understand your rights and responsibilities when using the Riseflake platform.',
  alternates: { canonical: 'https://riseflake.com/terms-of-service', ...hreflangAlternates('https://riseflake.com/terms-of-service') },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
