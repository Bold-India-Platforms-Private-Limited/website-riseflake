import { Metadata } from 'next';
import CollegeDetailClient from './CollegeDetailClient';

export const revalidate = 3600; // ISR: 1 hour

export async function generateMetadata(): Promise<Metadata> {
  // Optionally fetch college details for SEO
  return {
    title: `College Details | Riseflake`,
    description: `View detailed information about this college on Riseflake.`,
  };
}

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CollegeDetailClient slug={resolvedParams.slug} />;
}
