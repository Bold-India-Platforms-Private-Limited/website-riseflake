'use client';

import React, { useState } from 'react';
import { API_BASE_URL } from '../../lib/config';
import { FaFlag } from 'react-icons/fa';

interface ReportButtonProps {
  jobSlug: string;
  isInternship?: boolean;
  alreadyReported: boolean;
  onReported: () => void;
}

const extractId = (slug: string) => {
  const parts = slug.split('-');
  const last = parts[parts.length - 1];
  if (!isNaN(Number(last))) {
    return Number(last) - 1;
  }
  return null;
};

const ReportButton: React.FC<ReportButtonProps> = ({ jobSlug, isInternship, alreadyReported, onReported }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const id = extractId(jobSlug);
  const endpoint = isInternship ? `${API_BASE_URL}/report-internship` : `${API_BASE_URL}/report-job`;
  const idKey = isInternship ? 'internship_id' : 'job_id';

  const handleReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [idKey]: id, reason }),
      });
      const data = await res.json();
      if (data.status) {
        setSuccess(true);
        onReported();
        setOpen(false);
      } else {
        setError(data.message || 'Failed to report.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 shadow-md text-xs sm:text-sm"
        onClick={() => setOpen(true)}
        disabled={alreadyReported}
        title={alreadyReported ? 'Already reported from this IP' : 'Report this listing'}
        style={{ minWidth: 0 }}
      >
        <FaFlag className="text-red-500 w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">Report</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-md mx-auto flex flex-col" style={{ minWidth: 0 }}>
            <h2 className="text-lg font-semibold mb-2 text-center">Report {isInternship ? 'Internship' : 'Job'}</h2>
            <textarea
              className="w-full border rounded-lg p-2 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-200"
              rows={3}
              placeholder="Enter your reason..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              disabled={loading}
              style={{ fontSize: 16 }}
            />
            {error && <div className="text-red-600 mb-2 text-center text-sm">{error}</div>}
            {success && <div className="text-green-600 mb-2 text-center text-sm">Reported successfully!</div>}
            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-2">
              <button className="px-3 py-1.5 rounded-full bg-gray-200 w-full sm:w-auto" onClick={() => setOpen(false)} disabled={loading}>Cancel</button>
              <button
                className="px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 w-full sm:w-auto"
                onClick={handleReport}
                disabled={loading || !reason.trim()}
              >
                {loading ? 'Reporting...' : 'Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportButton;
