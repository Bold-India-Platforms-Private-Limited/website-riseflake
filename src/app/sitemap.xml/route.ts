import { API_BASE_URL } from '../../lib/config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Fetch all jobs (assume API returns all jobs with job_status and visibility_status)
  const res = await fetch(`${API_BASE_URL}/jobs?limit=10000`);
  if (!res.ok) {
    return new NextResponse('Failed to fetch jobs', { status: 500 });
  }
  const data = await res.json();
  const jobs = (data.result || []).filter(
    (job: any) => job.job_status === 'live' && job.visibility_status === 2
  );

  const today = new Date();
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? today.toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
  };

  const urls = jobs.map((job: any) => `  <url>\n    <loc>https://riseflake.com/jobs/${job.slug}</loc>\n    <lastmod>${formatDate(job.updated_at || job.created_at)}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
