import React from 'react';

export default function DownloadAppCard() {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5 h-fit shadow-sm mt-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Download app for realtime notification</p>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Mobile App</h3>
        <p className="text-sm text-slate-600 mb-4">Download Riseflake App</p>
        <p className="text-xs text-slate-500 mb-2">Realtime job alerts, applied job updates, and recruiter messages.</p>
        <ul className="text-xs text-slate-500 mb-4 list-disc list-inside space-y-1">
          <li>Job Alerts</li>
          <li>Applied Jobs</li>
          <li>Recruiter Msg</li>
        </ul>
        <div className="flex gap-3">
          <a href="https://play.google.com/store/apps/details?id=com.riseflake.app" target="_blank" rel="noopener noreferrer">
            <img src="https://riseflake.com/download-on-the-play-store.png" alt="Download on Google Play" className="h-10" />
          </a>
          <a href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" rel="noopener noreferrer">
            <img src="https://riseflake.com/download-on-the-app-store.svg" alt="Download on the App Store" className="h-10" />
          </a>
        </div>
      </div>
    </aside>
  );
}
