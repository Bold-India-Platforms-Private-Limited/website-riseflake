import { API_BASE_URL } from '../../lib/config';
import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch all jobs (assume API returns all jobs with job_status and visibility_status)
  const res = await fetch(`${API_BASE_URL}/jobs?limit=10000`);
  if (!res.ok) {
    return new NextResponse('Failed to fetch jobs', { status: 500 });
  }
  const data = await res.json();
  const jobs = (data.result || []).filter(
    (job: any) => (job.visibility_status === 2 || job.visibility_status === 3)
  );

  const today = new Date();
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? today.toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
  };


  let rows = jobs.map((job: any) => `\n      <tr>\n        <td><a href=\"https://riseflake.com/jobs/${job.slug}\" target=\"_blank\">https://riseflake.com/jobs/${job.slug}</a></td>\n        <td>${formatDate(job.updated_at || job.created_at)}</td>\n        <td>daily</td>\n        <td>0.9</td>\n      </tr>`).join('');
  if (jobs.length === 0) {
    rows = `<tr><td colspan=\"4\" style=\"color:red\">No jobs found. jobs.length=0. Sample data: ${JSON.stringify(data.result?.slice(0,2) ?? [])}</td></tr>`;
  }

  const html = `<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Job Sitemap</title>\n  <style>\n    table { border-collapse: collapse; width: 100%; }\n    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }\n    th { background: #f4f4f4; }\n    tr:nth-child(even) { background: #fafafa; }\n  </style>\n</head>\n<body>\n  <h1>Active Jobs Sitemap</h1>\n  <p>jobs.length: ${jobs.length}</p>\n  <table>\n    <thead>\n      <tr>\n        <th>URL</th>\n        <th>Last Modified</th>\n        <th>Changefreq</th>\n        <th>Priority</th>\n      </tr>\n    </thead>\n    <tbody>${rows}\n    </tbody>\n  </table>\n</body>\n</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
