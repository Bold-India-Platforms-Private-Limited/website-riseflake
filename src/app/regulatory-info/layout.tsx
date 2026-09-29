import type { Metadata } from 'next';
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: { default: 'Regulatory & Other Info', template: '%s | Riseflake Jobportal' },
  description: 'Company details, Grievance Officer, Data Protection contact and regulatory disclosures for Riseflake, operated by Bold India Platforms Private Limited.',
  alternates: { canonical: `${WEBSITE_BASE_URL}/regulatory-info`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/regulatory-info`) },
  robots: { index: true, follow: true },
};

export default function RegulatoryInfoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
