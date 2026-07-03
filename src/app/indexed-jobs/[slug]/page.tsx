import type { Metadata } from 'next';
import IJobDetailClient from "./IJobDetailClient";
import { API_BASE_URL, WEBSITE_BASE_URL } from '@/lib/config';

type PageProps = {
  params: Promise<{ slug: string }>;
};

function unslugifyTitle(slug: string): string {
  // Extract human-readable title from slug (strip trailing -<id> and decode hyphens)
  const parts = slug.split('-');
  // Drop last part if it looks like a numeric/alphanum id
  const withoutId = parts.length > 1 && /^[a-z0-9]{6,}$/i.test(parts[parts.length - 1])
    ? parts.slice(0, -1)
    : parts;
  return withoutId.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_BASE_URL}/indexed-jobs?slug=${slug}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const job = Array.isArray(data.result) ? data.result[0] : data.result;
      if (job) {
        const title = `${job.job_title} at ${job.company_name}`;
        const description = `Apply for ${job.job_title} at ${job.company_name}. ${job.location ? `Location: ${job.location}.` : ''} Find more jobs on Riseflake.`;
        return {
          title,
          description,
          alternates: { canonical: `${WEBSITE_BASE_URL}/indexed-jobs/${slug}` },
          openGraph: { title, description, url: `${WEBSITE_BASE_URL}/indexed-jobs/${slug}` },
          robots: { index: false, follow: true },
        };
      }
    }
  } catch { /* fallback below */ }
  const readableTitle = unslugifyTitle(slug);
  return {
    title: readableTitle,
    alternates: { canonical: `${WEBSITE_BASE_URL}/indexed-jobs/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function IJobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <IJobDetailClient slug={slug} />;
}
