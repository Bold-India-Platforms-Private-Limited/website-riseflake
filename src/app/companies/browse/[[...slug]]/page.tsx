import type { Metadata } from 'next'
import {
  buildCompanyBrowseMetadata, renderCompanyBrowsePage, companyBrowseStaticParams,
} from '../../../components/seo/companyBrowseHelpers'

export const dynamicParams = true
export const revalidate = 3600

type Props = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
}

export function generateStaticParams() {
  return companyBrowseStaticParams()
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return buildCompanyBrowseMetadata(await params, await searchParams)
}

export default async function CompaniesBrowsePage({ params, searchParams }: Props) {
  return renderCompanyBrowsePage(await params, await searchParams)
}
