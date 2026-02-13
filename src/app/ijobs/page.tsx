import IJobsClient from "./IJobsClient";
import { Suspense } from "react";

export default function IJobsPage() {
  return (
    <Suspense>
      <IJobsClient />
    </Suspense>
  );
}
