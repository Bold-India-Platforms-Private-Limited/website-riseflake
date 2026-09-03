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

const TAKEDOWN = 'Remove / delete this listing (official recruiter or company)';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const extractId = (slug: string) => {
  const parts = slug.split('-');
  const last = parts[parts.length - 1];
  return !isNaN(Number(last)) ? Number(last) - 1 : null;
};

const ReportButton: React.FC<ReportButtonProps> = ({ jobSlug, isInternship, alreadyReported, onReported }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [selected, setSelected] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const id = extractId(jobSlug);
  const endpoint = isInternship ? `${API_BASE_URL}/report-internship` : `${API_BASE_URL}/report-job`;
  const idKey = isInternship ? 'internship_id' : 'job_id';
  const label = isInternship ? 'Internship' : 'Job';
  const isTakedown = selected === TAKEDOWN;

  const pick = (p: string) => {
    setSelected(p);
    setReason(p === TAKEDOWN ? '' : p);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError(isTakedown ? 'Explain your authorisation and why this listing should be removed.' : 'Please provide a reason.');
      return;
    }
    if (isTakedown && !EMAIL_RE.test(workEmail.trim())) {
      setError('Enter your official company / recruiter email so we can verify this request.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body: Record<string, unknown> = { [idKey]: id, reason: reason.trim() };
      if (isTakedown) {
        body.report_type = 'takedown';
        body.requester_email = workEmail.trim();
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.status) {
        if (isTakedown) {
          setDone(data.message || 'Removal request submitted — our team will verify and follow up by email.');
        } else {
          onReported();
          setOpen(false);
        }
      } else {
        setError(data.message || 'Failed to submit.');
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
    setSelected('');
    setWorkEmail('');
    setError('');
    setDone('');
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                  <FaFlag className="w-3 h-3 text-red-500" />
                </span>
                <h2 className="text-sm font-semibold text-slate-800">
                  {isTakedown ? `Request ${label.toLowerCase()} removal` : `Report ${label}`}
                </h2>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {done ? (
              <div className="px-5 py-8 text-center text-sm text-emerald-700 bg-emerald-50">
                {done}
                <div className="mt-4">
                  <button
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-white"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Quick select</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map(p => (
                      <button
                        key={p}
                        onClick={() => pick(p)}
                        className={`text-xs rounded-full border px-3 py-1 transition-colors ${
                          selected === p
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => pick(TAKEDOWN)}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors ${
                    isTakedown ? 'border-indigo-400 bg-indigo-50' : 'border-blue-100 bg-blue-50/40 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <span className={`block text-xs font-semibold ${isTakedown ? 'text-indigo-700' : 'text-blue-900'}`}>
                    Remove / delete this {label.toLowerCase()} post
                  </span>
                  <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">
                    For the official recruiter, company, or an authorised representative who wants this posting taken down.
                  </span>
                </button>

                {isTakedown && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                      This is a takedown request, not a report. Our team will verify that you&apos;re authorised
                      to act for this company before removing the post, and will follow up on the email below.
                    </p>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Official company / recruiter email</label>
                    <input
                      type="email"
                      value={workEmail}
                      onChange={e => setWorkEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                    />
                  </div>
                )}

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                    {isTakedown ? 'Explain your authorisation' : 'Or describe the issue'}
                  </p>
                  <textarea
                    className="w-full border border-slate-200 rounded-xl p-3 resize-none text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition"
                    rows={3}
                    placeholder={isTakedown
                      ? 'Your name and role, the company you represent, and why this post should be removed…'
                      : 'Enter your reason...'}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {error && <p className="text-xs text-red-600 text-center">{error}</p>}

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
                    onClick={handleSubmit}
                    disabled={loading || !reason.trim() || (isTakedown && !workEmail.trim())}
                  >
                    {loading ? 'Submitting…' : isTakedown ? 'Request removal' : 'Submit Report'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReportButton;
