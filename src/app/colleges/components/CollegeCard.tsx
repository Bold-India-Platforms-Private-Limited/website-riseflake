import Link from 'next/link';

export type CollegeListItem = {
  id: number;
  college_name: string;
  college_logo?: string | null;
  slug?: string;
  [key: string]: any;
};

const placeholderPalette = [
  'from-sky-200 to-blue-100 text-slate-700',
  'from-emerald-200 to-teal-100 text-slate-700',
  'from-amber-200 to-orange-100 text-slate-700',
  'from-rose-200 to-pink-100 text-slate-700',
  'from-violet-200 to-purple-100 text-slate-700',
  'from-lime-200 to-green-100 text-slate-700',
];

const getPlaceholderStyle = (name: string) => {
  const normalized = name.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) % placeholderPalette.length;
  }
  return placeholderPalette[hash] ?? placeholderPalette[0];
};

function generateSlug(collegeName: string, collegeId: number) {
  if (!collegeName) return collegeId.toString();
  return (
    collegeName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + collegeId
  );
}

export default function CollegeCard({ college }: { college: CollegeListItem }) {
  const slug = college.slug || generateSlug(college.college_name, college.id);
  return (
    <Link
      href={`/colleges/${slug}`}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md lg:p-7"
    >
      <div className="flex items-center gap-4 lg:gap-5">
        <div
          className={`flex flex-shrink-0 h-12 w-12 items-center justify-center overflow-hidden rounded-xl lg:h-20 lg:w-20 lg:min-w-[80px] lg:min-h-[80px] lg:max-w-[80px] lg:max-h-[80px] ${
            college.college_logo ? 'bg-slate-100' : `bg-gradient-to-br ${getPlaceholderStyle(college.college_name)}`
          }`}
        >
          {college.college_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={college.college_logo} alt={`${college.college_name} logo`} className="h-20 w-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] object-cover" />
          ) : (
            <span className="text-sm font-semibold uppercase lg:text-base">
              {college.college_name.slice(0, 2)}
            </span>
          )}
        </div>
        <div>
          <h3
            className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 lg:text-lg line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              maxWidth: '260px',
            }}
          >
            {college.college_name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 lg:text-sm">
            {college.university_type || 'College'}
          </p>
        </div>
      </div>
      <span className="text-slate-400 transition group-hover:text-indigo-600">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 lg:h-8 lg:w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </span>
    </Link>
  );
}
