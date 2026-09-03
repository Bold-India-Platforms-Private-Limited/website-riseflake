import type { Metadata } from 'next'
import {
  buildBrowseMetadata, renderBrowsePage, browseStaticParams,
} from '../../../components/seo/browsePageHelpers'

export const dynamicParams = true
export const revalidate = 1800

type Props = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
}

export function generateStaticParams() {
  return browseStaticParams('jobs')
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return buildBrowseMetadata('jobs', await params, await searchParams)
}

export default async function JobsBrowsePage({ params, searchParams }: Props) {
  return renderBrowsePage('jobs', await params, await searchParams)
}
