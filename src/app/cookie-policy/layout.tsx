import type { Metadata } from 'next';
import { hreflangAlternates } from '../../lib/config';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Understand how Riseflake uses cookies and similar technologies to improve your experience.',
  alternates: { canonical: 'https://riseflake.com/cookie-policy', ...hreflangAlternates('https://riseflake.com/cookie-policy') },
  robots: { index: true, follow: true },
};

export default function CookiePolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
