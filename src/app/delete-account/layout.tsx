import { WEBSITE_BASE_URL } from '@/lib/config'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Delete Your Account', template: '%s | Riseflake Jobportal' },
  description: 'Request deletion of your Riseflake account and personal data.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${WEBSITE_BASE_URL}/delete-account` },
};

export default function DeleteAccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
