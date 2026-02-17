export const metadata = {
  title: 'Indexed Jobs | Riseflake - Curated Job Listings',
  description: 'Explore indexed jobs curated from multiple sources. Discover new opportunities and apply easily on Riseflake.',
  keywords: 'indexed jobs, job listings, curated jobs, apply jobs, riseflake',
  robots: 'noindex, follow',
};
import IJobsClient from "./IJobsClient";
import { Suspense } from "react";

export default function IndexedJobsPage() {
  return (
    <>
      {/* Prevent indexing by search engines */}
      <meta name="robots" content="noindex, follow" />
      <Suspense>
        <IJobsClient />
      </Suspense>
    </>
  );
}
