import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jobs | Riseflake',
  description: 'Browse verified job opportunities, filter by location, job type, and company, and discover roles tailored to your career goals.',
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
