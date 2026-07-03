import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Read the Riseflake Refund Policy to understand our terms for subscription and payment refunds.',
  alternates: { canonical: 'https://riseflake.com/refund-policy' },
  robots: { index: true, follow: true },
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
