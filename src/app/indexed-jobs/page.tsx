import type { Metadata } from 'next';
import IJobsClient from "./IJobsClient";
import { Suspense } from "react";

// noindex — this page aggregates 3rd-party jobs; exclude from Google index
export const metadata: Metadata = {
  title: 'Indexed Jobs - Curated Job Listings',
  description: 'Explore indexed jobs curated from multiple sources. Discover new opportunities and apply easily on Riseflake.',
  keywords: 'indexed jobs, job listings, curated jobs, apply jobs, riseflake',
  robots: {
    index: false,
    follow: true,
  },
};

export default function IndexedJobsPage() {
  return (
    <Suspense>
      <IJobsClient />
    </Suspense>
  );
}
