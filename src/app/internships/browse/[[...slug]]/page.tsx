import type { Metadata } from 'next'
import { browseStaticParams, buildBrowseMetadata, renderBrowsePage } from '../../../components/seo/browsePageHelpers'

// Static export: only the manifest's facet landings (and the hub) exist.
export const dynamicParams = false

type Props = {
  params: Promise<{ slug?: string[] }>
}

export function generateStaticParams() {
  return browseStaticParams('internships')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildBrowseMetadata('internships', await params)
}

export default async function InternshipsBrowsePage({ params }: Props) {
  return renderBrowsePage('internships', await params)
}
