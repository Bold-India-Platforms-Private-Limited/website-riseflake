import type { Metadata } from 'next';
import { hreflangAlternates } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Regulatory & Other Info',
  description: 'Company details, Grievance Officer, Data Protection contact and regulatory disclosures for Riseflake, operated by Bold India Platforms Private Limited.',
  alternates: { canonical: 'https://jobportal.riseflake.com/regulatory-info', ...hreflangAlternates('https://jobportal.riseflake.com/regulatory-info') },
  robots: { index: true, follow: true },
};

export default function RegulatoryInfoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
