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

const PRESETS = [
  'Fake or scam listing',
  'Misleading salary / compensation',
  'Position already filled',
  'Duplicate listing',
  'Inappropriate content',
];

const extractId = (slug: string) => {
  const parts = slug.split('-');
  const last = parts[parts.length - 1];
  return !isNaN(Number(last)) ? Number(last) - 1 : null;
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
  const label = isInternship ? 'Internship' : 'Job';

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
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setReason('');
    setError('');
    setSuccess(false);
  };

  return (
    <>
      <button
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
        onClick={() => setOpen(true)}
        disabled={alreadyReported}
        title={alreadyReported ? 'Already reported from this IP' : `Report this ${label.toLowerCase()}`}
      >
        <FaFlag className="w-3 h-3 flex-shrink-0" />
        {alreadyReported ? 'Reported' : `Report ${label}`}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={e => { if (e.target === e.currentTarget) handleClose() }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                  <FaFlag className="w-3 h-3 text-red-500" />
                </span>
                <h2 className="text-sm font-semibold text-slate-800">Report {label}</h2>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Quick presets */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Quick select</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map(p => (
                    <button
                      key={p}
                      onClick={() => setReason(p)}
                      className={`text-xs rounded-full border px-3 py-1 transition-colors ${
                        reason === p
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom reason */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Or describe the issue</p>
                <textarea
                  className="w-full border border-slate-200 rounded-xl p-3 resize-none text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition"
                  rows={3}
                  placeholder="Enter your reason..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && <p className="text-xs text-red-600 text-center">{error}</p>}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                  onClick={handleReport}
                  disabled={loading || !reason.trim()}
                >
                  {loading ? 'Submitting…' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportButton;
