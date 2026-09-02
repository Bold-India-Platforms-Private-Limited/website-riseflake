import Link from 'next/link'

export type PersonCardData = {
  slug: string
  name: string
  photo_url: string | null
  headline: string | null
  profile_type: string
  location: string | null
  current_company: string | null
  current_designation: string | null
  college: string | null
  skills: string[]
  experience_years: number | null
  experience_bucket: string | null
  purposes: number[]
}

const PURPOSE_LABEL: Record<number, string> = {
  1: 'Find Job',
  2: 'Upskill',
  3: 'Mentorship',
  4: 'Events',
}

const BUCKET_LABEL: Record<string, string> = {
  student: 'Student',
  fresher: 'Fresher',
  '0-1': '0–1 yrs',
  '1-3': '1–3 yrs',
  '3-5': '3–5 yrs',
  '5+': '5+ yrs experience',
}

function experienceLabel(d: PersonCardData): string | null {
  if (d.profile_type === 'Professional' && d.experience_years && d.experience_years >= 1) {
    return `${d.experience_years}+ yrs experience`
  }
  return d.experience_bucket ? BUCKET_LABEL[d.experience_bucket] ?? null : null
}

export default function PersonCard({ person }: { person: PersonCardData }) {
  const exp = experienceLabel(person)
  const org = person.current_company ?? person.college ?? null

  return (
    <Link
      href={`/in/${person.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        {person.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.photo_url}
            alt={`${person.name} profile photo`}
            width={56}
            height={56}
            loading="lazy"
            className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700 select-none"
            aria-hidden="true"
          >
            {person.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-indigo-700">
            {person.name}
          </h3>
          {person.headline && (
            <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{person.headline}</p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
              {person.profile_type}
            </span>
            {person.location && <span>📍 {person.location}</span>}
          </div>
        </div>
      </div>

      {(person.skills?.length > 0 || exp) && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          {person.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {person.skills.slice(0, 6).map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {exp && <span>{exp}</span>}
            {!person.current_company && org && <span>🎓 {org}</span>}
            {person.purposes?.length > 0 && (
              <span>Looking for: {person.purposes.map((p) => PURPOSE_LABEL[p]).filter(Boolean).join(' · ')}</span>
            )}
          </div>
        </div>
      )}

      <span className="mt-4 text-sm font-medium text-indigo-600 group-hover:underline">
        View profile →
      </span>
    </Link>
  )
}
