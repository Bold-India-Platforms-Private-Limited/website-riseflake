
import type { Metadata } from 'next';
import CollegeDetailClient from './CollegeDetailClient';

export const revalidate = 3600; // ISR: 1 hour

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.riseflake.com/api/v1/website';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_BASE}/colleges/${slug}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const college = json.result;
      if (college) {
        return {
          title: `${college.college_name} | Riseflake`,
          description: `View jobs, internships, and opportunities from ${college.college_name} on Riseflake.`,
          alternates: { canonical: `https://riseflake.com/colleges/${slug}` },
        };
      }
    }
  } catch { /* fallback below */ }
  return {
    title: 'College Details | Riseflake',
    alternates: { canonical: `https://riseflake.com/colleges/${slug}` },
  };
}

// SSR wrapper to inject canonical and schema.org College JSON-LD
export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  // Fetch college details for SEO
  let college: any = null;
  try {
    const res = await fetch(`${API_BASE}/colleges/${slug}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      college = json.result;
    }
  } catch (error) {
    console.error('Error fetching college details:', error);
  }

  const canonicalUrl = `https://riseflake.com/colleges/${slug}`;
  const collegeSchema = college ? {
    "@context": "https://schema.org/",
    "@type": "CollegeOrUniversity",
    name: college.college_name,
    url: canonicalUrl,
    logo: college.college_logo || undefined,
    description: `View detailed information about ${college.college_name} on Riseflake.`,
    // Add more fields as needed
  } : null;

  return (
    <>
      {collegeSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }}
        />
      )}
      <CollegeDetailClient slug={slug} />
    </>
  );
}
