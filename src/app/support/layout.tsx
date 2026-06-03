import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Center | Riseflake - Get Help',
  description: 'Find answers to your questions and get help from the Riseflake support team.',
  alternates: { canonical: 'https://riseflake.com/support' },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
