import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import ApplyCard from './components/ApplyCard'
import JobDescription from './components/JobDescription'
import JobHeader from './components/JobHeader'
import TagsSection from './components/TagsSection'
import type { JobDetail } from './components/types'
import { API_BASE_URL } from '../../../lib/config'
import React from 'react'

export const dynamicParams = true
export const revalidate = 900

type InternshipResponse = {
  status: boolean
  result: JobDetail
}

const fetchInternship = async (slug: string) => {
  const response = await fetch(`${API_BASE_URL}/internships/${slug}`, { cache: 'force-cache' })
  if (response.status === 410) {
    return { expired: true }
  }
  if (!response.ok) return null
  return (await response.json()) as InternshipResponse
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params?: Promise<{ slug: string }> }): Promise<Metadata> {
  const awaitedParams = params ? await params : { slug: '' };
  const { slug } = awaitedParams;
  const data = await fetchInternship(slug);
  const internship = (data && 'result' in data) ? (data as InternshipResponse).result : undefined;

  if (!internship) {
    return {
      title: 'Internship Details | Riseflake',
      description: 'Explore verified internship details on Riseflake.',
    };
  }

  return {
    title: `${internship.position} at ${internship.company_name} | Riseflake`,
    description: `View details for ${internship.position} at ${internship.company_name}. Explore skills, requirements, and apply on Riseflake.`,
  };
}

export default async function InternshipDetailsPage({ params }: { params?: Promise<{ slug: string }> }) {
  const awaitedParams = params ? await params : { slug: '' };
  const { slug } = awaitedParams;
  const data = await fetchInternship(slug);

  if (!data || (data && 'expired' in data)) {
    notFound()
  }
  const internship = (data as InternshipResponse).result;

  const canonicalUrl = `https://riseflake.com/internships/${internship.slug}`;
  const jobPostingSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: internship.position,
    description: internship.job_description,
    datePosted: internship.created_at ? new Date(internship.created_at).toISOString().slice(0, 10) : undefined,
    employmentType: internship.job_type,
    hiringOrganization: {
      "@type": "Organization",
      name: internship.company_name
    }
  };

  return (
    <>
      {/* Canonical tag and JobPosting schema for SEO */}
      <head>
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }} />
      </head>
      <Navbar bgTransparent />
      <main className="px-4 sm:px-6 lg:px-8 py-2 bg-slate-100 pt-16">
        <div className="max-w-[1200px] mx-auto">
          <JobHeader job={internship} />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <JobDescription html={internship.job_description} />
              <TagsSection title="Skills" tags={internship.job_skills} />
              <TagsSection title="Facilities" tags={internship.job_facilities} />
            </div>
            <div className="lg:col-span-1">
              <ApplyCard job={internship} />
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
