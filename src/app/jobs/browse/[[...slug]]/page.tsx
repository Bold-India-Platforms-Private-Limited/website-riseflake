import type { Metadata } from 'next'
import { browseStaticParams, buildBrowseMetadata, renderBrowsePage } from '../../../components/seo/browsePageHelpers'

// Static export: only the manifest's facet landings (and the hub) exist.
export const dynamicParams = false

type Props = {
  params: Promise<{ slug?: string[] }>
}

export function generateStaticParams() {
  return browseStaticParams('jobs')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildBrowseMetadata('jobs', await params)
}

export default async function JobsBrowsePage({ params }: Props) {
  return renderBrowsePage('jobs', await params)
}
