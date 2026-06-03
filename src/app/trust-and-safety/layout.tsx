import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trust & Safety | Riseflake',
  description: 'Learn about Riseflake\'s commitment to trust and safety for all users on the platform.',
  alternates: { canonical: 'https://riseflake.com/trust-and-safety' },
};

export default function TrustAndSafetyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
