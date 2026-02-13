import IJobsClient from "./IJobsClient";
import { Suspense } from "react";

export default function IndexedJobsPage() {
  return (
    <Suspense>
      <IJobsClient />
    </Suspense>
  );
}
