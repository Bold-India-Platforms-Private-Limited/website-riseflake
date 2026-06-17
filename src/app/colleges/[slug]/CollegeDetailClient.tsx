"use client";

import Navbar from "../../components/Navbar";
import Link from "next/link";

const MANAGEMENT_TYPES: Record<number, string> = {
  1: "Local body",
  2: "Private Aided (Government Aided)",
  3: "Private Un-Aided",
  4: "State government",
  5: "University",
};
const OWNERSHIP_TYPES: Record<number, string> = {
  1: "Government",
  2: "Individual / Private Organization",
  3: "Society",
  4: "Trust",
  5: "Company Act",
  6: "Section 8 Company",
  7: "Section 25 Company",
  8: "Others",
};
const LOCATION_CATEGORIES: Record<number, string> = {
  1: "Rural",
  2: "Urban",
};

function mapValue(obj: Record<number, string>, value: unknown): string | null {
  if (value == null) return null;
  const key = typeof value === "string" ? Number(value) : (value as number);
  return obj[key] ?? (typeof value === "string" ? value : null);
}

export type CollegeDetail = {
  id?: number;
  college_name: string;
  college_logo?: string | null;
  university_type?: string | null;
  college_type?: string | null;
  management_type?: number | string | null;
  ownership_type?: number | string | null;
  location_category?: number | string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  slug?: string;
  affiliated_university?: string | null;
  website?: string | null;
};

export default function CollegeDetailClient({ college }: { college: CollegeDetail }) {
  const locationParts = [college.city, college.state, college.country].filter(Boolean);
  const locationStr = locationParts.join(", ");

  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-6 bg-slate-100 min-h-[60vh] pt-16">
        <div className="max-w-2xl mx-auto">
          <nav className="mb-8 mt-4 text-xs text-slate-500 flex items-center gap-2">
            <Link href="/" className="hover:underline text-slate-500">Home</Link>
            <span>/</span>
            <Link href="/colleges" className="hover:underline text-slate-500">Colleges</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{college.college_name}</span>
          </nav>

          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-5">
                <div className={`flex flex-shrink-0 h-24 w-24 min-w-[96px] min-h-[96px] max-w-[96px] max-h-[96px] items-center justify-center overflow-hidden rounded-xl ${college.college_logo ? "bg-slate-100" : "bg-gradient-to-br from-indigo-100 to-purple-100 text-slate-700"}`}>
                  {college.college_logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={college.college_logo}
                      alt={`${college.college_name} logo`}
                      className="h-24 w-24 min-w-[96px] min-h-[96px] max-w-[96px] max-h-[96px] object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold uppercase">
                      {college.college_name.slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900 break-words">{college.college_name}</h1>
                  {college.university_type && (
                    <p className="mt-1 text-sm text-slate-500">{college.university_type}</p>
                  )}
                  {locationStr && (
                    <p className="mt-1 text-sm text-slate-400">{locationStr}</p>
                  )}
                </div>
              </div>

              {/* Key facts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {college.college_type && (
                  <div>
                    <div className="text-xs text-slate-400">College Type</div>
                    <div className="font-medium text-slate-700">{college.college_type}</div>
                  </div>
                )}
                {college.management_type != null && (
                  <div>
                    <div className="text-xs text-slate-400">Management Type</div>
                    <div className="font-medium text-slate-700">
                      {mapValue(MANAGEMENT_TYPES, college.management_type) ?? String(college.management_type)}
                    </div>
                  </div>
                )}
                {college.ownership_type != null && (
                  <div>
                    <div className="text-xs text-slate-400">Ownership Type</div>
                    <div className="font-medium text-slate-700">
                      {mapValue(OWNERSHIP_TYPES, college.ownership_type) ?? String(college.ownership_type)}
                    </div>
                  </div>
                )}
                {college.location_category != null && (
                  <div>
                    <div className="text-xs text-slate-400">Location Category</div>
                    <div className="font-medium text-slate-700">
                      {mapValue(LOCATION_CATEGORIES, college.location_category) ?? String(college.location_category)}
                    </div>
                  </div>
                )}
                {college.affiliated_university && (
                  <div>
                    <div className="text-xs text-slate-400">Affiliated University</div>
                    <div className="font-medium text-slate-700">{college.affiliated_university}</div>
                  </div>
                )}
                {college.website && (
                  <div>
                    <div className="text-xs text-slate-400">Official Website</div>
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 hover:underline break-all"
                    >
                      {college.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Looking for jobs or internships from <strong>{college.college_name}</strong>?{" "}
                  <Link href="/jobs" className="text-indigo-600 hover:underline font-medium">
                    Browse all openings →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
