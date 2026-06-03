import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Riseflake',
  description: 'Understand how Riseflake uses cookies and similar technologies to improve your experience.',
  alternates: { canonical: 'https://riseflake.com/cookie-policy' },
};

export default function CookiePolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
