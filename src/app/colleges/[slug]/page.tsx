
import CollegeDetailClient from './CollegeDetailClient';

export const revalidate = 3600; // ISR: 1 hour

// SSR wrapper to inject canonical and schema.org College JSON-LD
export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  // Fetch college details for SEO
  let college: any = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/colleges/${slug}`);
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
      <head>
        <link rel="canonical" href={canonicalUrl} />
        {collegeSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }} />
        )}
      </head>
      <CollegeDetailClient slug={slug} />
    </>
  );
}
