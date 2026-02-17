
import { API_BASE_URL } from '../../lib/config';
import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch jobs and internships in parallel
  const [jobsRes, internshipsRes] = await Promise.all([
    fetch(`${API_BASE_URL}/jobs?limit=10000`),
    fetch(`${API_BASE_URL}/internships?limit=10000`),
  ]);
  if (!jobsRes.ok || !internshipsRes.ok) {
    return new NextResponse('Failed to fetch jobs or internships', { status: 500 });
  }
  const jobsData = await jobsRes.json();
  const internshipsData = await internshipsRes.json();
  // Exclude indexed jobs (slugs that start with 'indexed-jobs' or match the indexed-jobs pattern)
  const jobs = (jobsData.result || []).filter((job: any) => (job.visibility_status === 2 || job.visibility_status === 3) && !(job.slug && job.slug.startsWith('indexed-jobs')));
  const internships = (internshipsData.result || []).filter((item: any) => item.visibility_status === 2 || item.visibility_status === 3);

  const today = new Date();
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? today.toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
  };

  let jobRows = jobs.map((job: any) => `\n      <tr>\n        <td><a href=\"https://riseflake.com/jobs/${job.slug}\" target=\"_blank\">https://riseflake.com/jobs/${job.slug}</a></td>\n        <td>${formatDate(job.updated_at || job.created_at)}</td>\n        <td>daily</td>\n        <td>0.9</td>\n      </tr>`).join('');
  if (jobs.length === 0) {
    jobRows = `<tr><td colspan=\"4\" style=\"color:red\">No jobs found. jobs.length=0. Sample data: ${JSON.stringify(jobsData.result?.slice(0,2) ?? [])}</td></tr>`;
  }

  let internshipRows = internships.map((item: any) => `\n      <tr>\n        <td><a href=\"https://riseflake.com/internships/${item.slug}\" target=\"_blank\">https://riseflake.com/internships/${item.slug}</a></td>\n        <td>${formatDate(item.updated_at || item.created_at)}</td>\n        <td>daily</td>\n        <td>0.9</td>\n      </tr>`).join('');
  if (internships.length === 0) {
    internshipRows = `<tr><td colspan=\"4\" style=\"color:red\">No internships found. internships.length=0. Sample data: ${JSON.stringify(internshipsData.result?.slice(0,2) ?? [])}</td></tr>`;
  }

  const html = `<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Jobs & Internships Sitemap</title>\n  <style>\n    table { border-collapse: collapse; width: 100%; margin-bottom: 32px; }\n    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }\n    th { background: #f4f4f4; }\n    tr:nth-child(even) { background: #fafafa; }\n  </style>\n</head>\n<body>\n  <h1>Active Jobs Sitemap</h1>\n  <p>jobs.length: ${jobs.length}</p>\n  <table>\n    <thead>\n      <tr>\n        <th>URL</th>\n        <th>Last Modified</th>\n        <th>Changefreq</th>\n        <th>Priority</th>\n      </tr>\n    </thead>\n    <tbody>${jobRows}\n    </tbody>\n  </table>\n  <h1>Active Internships Sitemap</h1>\n  <p>internships.length: ${internships.length}</p>\n  <table>\n    <thead>\n      <tr>\n        <th>URL</th>\n        <th>Last Modified</th>\n        <th>Changefreq</th>\n        <th>Priority</th>\n      </tr>\n    </thead>\n    <tbody>${internshipRows}\n    </tbody>\n  </table>\n</body>\n</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
