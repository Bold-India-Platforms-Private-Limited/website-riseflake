import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Riseflake - Our Story & Mission | Job Portal & Professional Networking',
  description: 'Learn about Riseflake — the job portal and professional networking platform helping students and professionals find their next career opportunity.',
  alternates: { canonical: 'https://riseflake.com/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
