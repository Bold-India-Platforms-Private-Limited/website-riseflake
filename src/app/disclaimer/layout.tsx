import type { Metadata } from 'next';
import { hreflangAlternates } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Read the Riseflake disclaimer regarding the accuracy and completeness of information on our platform.',
  alternates: { canonical: 'https://riseflake.com/disclaimer', ...hreflangAlternates('https://riseflake.com/disclaimer') },
  robots: { index: true, follow: true },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
