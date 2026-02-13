import IJobDetailClient from "./IJobDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function IJobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <IJobDetailClient slug={slug} />
};
