import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete Your Account',
  description: 'Request deletion of your Riseflake account and personal data.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://riseflake.com/delete-account' },
};

export default function DeleteAccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
