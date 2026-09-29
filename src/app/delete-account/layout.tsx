import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Delete Your Account', template: '%s | Riseflake Jobportal' },
  description: 'Request deletion of your Riseflake account and personal data.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://jobportal.riseflake.com/delete-account' },
};

export default function DeleteAccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
