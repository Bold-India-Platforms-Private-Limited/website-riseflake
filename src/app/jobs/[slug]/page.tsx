import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import ApplyCard from './components/ApplyCard'
import JobDescription from './components/JobDescription'
import JobHeader from './components/JobHeader'
import TagsSection from './components/TagsSection'
import type { JobDetail } from './components/types'
import { API_BASE_URL } from '../../../lib/config'
import Head from 'next/head'

export const dynamicParams = true
export const revalidate = 900

type PageProps = {
  params: Promise<{ slug: string }>
}

type JobResponse = {
  status: boolean
  result: JobDetail
}

const fetchJob = async (slug: string) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${slug}`, { cache: 'force-cache' })

  if (!response.ok) return null
  return (await response.json()) as JobResponse
}

export async function generateStaticParams() {
  // Return empty array to skip build-time generation
  // Pages will be generated on-demand with ISR when first requested
  return []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchJob(slug)
  const job = data?.result

  if (!job) {
    return {
      title: 'Job Details | Riseflake',
      description: 'Explore verified job details on Riseflake.',
    }
  }

  return {
    title: `${job.position} at ${job.company_name} | Riseflake`,
    description: `View details for ${job.position} at ${job.company_name}. Explore skills, requirements, and apply on Riseflake.`,
  }
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const data = await fetchJob(slug)

  if (!data?.status || !data.result) {
    notFound()
  }

  const job = data.result

  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-12 bg-slate-100">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <span>/</span>
            <a href="/jobs" className="hover:text-indigo-600">Jobs</a>
            <span>/</span>
            <span>{job.position}</span>
          </div>

          <JobHeader job={job} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">Role highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Vacancies</p>
                    <p className="font-semibold text-slate-900">{job.job_vacancy ?? 'Not specified'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Eligibility</p>
                    <p className="font-semibold text-slate-900">
                      {job.eligibility === 1 ? 'Eligible' : job.eligibility === 0 ? 'Not eligible' : 'Not specified'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Student status</p>
                    <p className="font-semibold text-slate-900">
                      {job.student_currently_studying === true
                        ? 'Currently studying'
                        : job.student_currently_studying === false
                          ? 'Not studying'
                          : 'Not specified'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Experience</p>
                    <p className="font-semibold text-slate-900">
                      {job.experience_min || job.experience_max
                        ? `${job.experience_min ?? 0} - ${job.experience_max ?? 'N/A'} years`
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
              </section>

              <JobDescription html={job.job_description} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TagsSection title="Categories" tags={job.categories} />
                <TagsSection title="Skills" tags={job.job_skills} />
              </div>

              <TagsSection title="Facilities & Benefits" tags={job.job_facilities} />
            </div>

            <div className="lg:sticky lg:top-24">
              <ApplyCard job={job} />
            </div>
          </div>
        </div>
      </main>
      <Head>
        <title>{job.position} at {job.company_name} | RiseFlake</title>
        <meta name="description" content={job.job_description ?? ''} />
        <link rel="canonical" href={`https://riseflake.com/jobs/${job.slug}`} />
        <meta property="og:title" content={`${job.position} at ${job.company_name} | RiseFlake`} />
        <meta property="og:description" content={job.job_description ?? ''} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://riseflake.com/jobs/${job.slug}`} />
        <meta property="og:site_name" content="RiseFlake" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${job.position} at ${job.company_name} | RiseFlake`} />
        <meta name="twitter:description" content={job.job_description ?? ''} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "JobPosting",
              title: job.position,
              description: job.job_description,
              datePosted: job.created_at,
              validThrough: job.job_deadline,
              employmentType: job.job_type,
              hiringOrganization: {
                "@type": "Organization",
                name: job.company_name,
                logo: job.company_logo,
              },
              jobLocation: {
                "@type": "Place",
                address: job.location_name,
              },
            }),
          }}
        />
      </Head>
    </>
  )
}
