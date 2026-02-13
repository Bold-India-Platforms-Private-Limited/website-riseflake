import IJobDetailClient from "./IJobDetailClient";

export default function IJobDetailPage({ params }: { params: { slug: string } }) {
  return <IJobDetailClient slug={params.slug} />;
}
