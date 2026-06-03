import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Riseflake - Get in Touch | Support & Inquiries',
  description: 'Contact the Riseflake team for support, partnerships, or general inquiries. We are here to help.',
  alternates: { canonical: 'https://riseflake.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
