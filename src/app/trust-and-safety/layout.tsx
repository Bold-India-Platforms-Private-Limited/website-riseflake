import type { Metadata } from 'next';
import { hreflangAlternates } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Trust & Safety',
  description: 'Learn about Riseflake\'s commitment to trust and safety for all users on the platform.',
  alternates: { canonical: 'https://riseflake.com/trust-and-safety', ...hreflangAlternates('https://riseflake.com/trust-and-safety') },
  robots: { index: true, follow: true },
};

export default function TrustAndSafetyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
