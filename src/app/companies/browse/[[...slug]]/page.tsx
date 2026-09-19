import type { Metadata } from 'next'
import { buildCompanyBrowseMetadata, companyBrowseStaticParams, renderCompanyBrowsePage } from '../../../components/seo/companyBrowseHelpers'

// Static export: only the manifest's facet landings (and the hub) exist.
export const dynamicParams = false

type Props = {
  params: Promise<{ slug?: string[] }>
}

export function generateStaticParams() {
  return companyBrowseStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildCompanyBrowseMetadata(await params)
}

export default async function CompaniesBrowsePage({ params }: Props) {
  return renderCompanyBrowsePage(await params)
}
