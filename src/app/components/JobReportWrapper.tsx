'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../lib/config';
import ReportButton from './ReportButton';

export default function JobReportWrapper({ jobSlug, isInternship = false }: { jobSlug: string; isInternship?: boolean }) {
  const [alreadyReported, setAlreadyReported] = useState(false);

  useEffect(() => {
    const checkReport = async () => {
      const endpoint = isInternship ? `${API_BASE_URL}/report-internship` : `${API_BASE_URL}/report-job`;
      const idKey = isInternship ? 'internship_id' : 'job_id';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [idKey]: Number(jobSlug.split('-').pop() ?? 0) - 1,
            reason: '__check__'
          }),
        });
        if (!res.ok) return;
        const data = await res.json();
        setAlreadyReported(data.reportBlocked === true);
      } catch {
        // backend unreachable — silently skip, report button stays enabled
      }
    };
    checkReport();
  }, [jobSlug, isInternship]);

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <ReportButton
        jobSlug={jobSlug}
        isInternship={isInternship}
        alreadyReported={alreadyReported}
        onReported={() => setAlreadyReported(true)}
      />
      <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Page refreshes every 15 min
      </span>
    </div>
  );
}
