import type { Metadata } from 'next';
import { hreflangAlternates, WEBSITE_BASE_URL } from '../../lib/config';

export const metadata: Metadata = {
  title: { default: 'Cookie Policy', template: '%s | Riseflake Jobportal' },
  description: 'Understand how Riseflake uses cookies and similar technologies to improve your experience.',
  alternates: { canonical: `${WEBSITE_BASE_URL}/cookie-policy`, ...hreflangAlternates(`${WEBSITE_BASE_URL}/cookie-policy`) },
  robots: { index: true, follow: true },
};

export default function CookiePolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
