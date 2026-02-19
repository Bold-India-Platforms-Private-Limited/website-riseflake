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
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          [idKey]: Number(jobSlug.split('-').pop() ?? 0) - 1, 
          reason: '__check__' 
        }),
      });
      const data = await res.json();
      setAlreadyReported(data.reportBlocked === true);
    };
    checkReport();
  }, [jobSlug, isInternship]);

  return (
    <ReportButton
      jobSlug={jobSlug}
      isInternship={isInternship}
      alreadyReported={alreadyReported}
      onReported={() => setAlreadyReported(true)}
    />
  );
}
