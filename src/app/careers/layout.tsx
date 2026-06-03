import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers at Riseflake - Join Our Team | Job Portal & Networking Platform',
  description: 'Explore career opportunities at Riseflake. Help us build the next generation job portal and professional networking platform.',
  alternates: { canonical: 'https://riseflake.com/careers' },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
