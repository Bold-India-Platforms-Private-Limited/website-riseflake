import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | Riseflake',
  description: 'Read the Riseflake disclaimer regarding the accuracy and completeness of information on our platform.',
  alternates: { canonical: 'https://riseflake.com/disclaimer' },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
