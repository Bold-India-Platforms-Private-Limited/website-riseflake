import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Riseflake - How We Protect Your Data',
  description: 'Read the Riseflake Privacy Policy to understand how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://riseflake.com/privacy-policy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
