"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../lib/config";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export type CollegeDetail = {
  id: number;
  college_name: string;
  college_logo?: string | null;
  university_type?: string | null;
  college_type?: string | null;
  management_type?: string | null;
  ownership_type?: string | null;
  location_category?: string | null;
  [key: string]: any;
};

type CollegeDetailResponse = {
  status: boolean;
  result: CollegeDetail;
};

const MANAGEMENT_TYPES = {
  1: "Local body",
  2: "Private Aided (Government Aided)",
  3: "Private Un-Aided",
  4: "State government",
  5: "University"
};
const OWNERSHIP_TYPES = {
  1: "Government",
  2: "Individual / Private Organization",
  3: "Society",
  4: "Trust",
  5: "Company Act",
  6: "Section 8 Company",
  7: "Section 25 Company",
  8: "Others"
};
const LOCATION_CATEGORIES = {
  1: "Rural",
  2: "Urban"
};

export default function CollegeDetailClient({ slug }: { slug: string }) {
  const [data, setData] = useState<CollegeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    fetch(`${API_BASE_URL}/colleges/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch college details");
        return res.json();
      })
      .then((json: CollegeDetailResponse) => {
        setData(json.result);
      })
      .catch(() => {
        setHasError(true);
        setData(null);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  // Helper to map values
  const getMappedValue = (obj: any, value: any) => {
    if (typeof value === 'number' && obj[value]) return obj[value];
    if (typeof value === 'string' && obj[value]) return obj[value];
    if (typeof value === 'string' && obj[Number(value)]) return obj[Number(value)];
    return value;
  };

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
            <span className="text-slate-900 font-semibold">{data?.college_name || '—'}</span>
          </nav>
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {isLoading ? (
              <div className="text-center py-12">Loading college details...</div>
            ) : hasError || !data ? (
              <div className="text-center py-12 text-red-500">Unable to load college details.</div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className={`flex flex-shrink-0 h-24 w-24 min-w-[96px] min-h-[96px] max-w-[96px] max-h-[96px] items-center justify-center overflow-hidden rounded-xl ${data.college_logo ? 'bg-slate-100' : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-slate-700'}`}>
                    {data.college_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={data.college_logo} alt={data.college_name + ' logo'} className="h-24 w-24 min-w-[96px] min-h-[96px] max-w-[96px] max-h-[96px] object-cover" />
                    ) : (
                      <span className="text-xl font-semibold uppercase">{data.college_name.slice(0, 2)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 break-words">{data.college_name}</h1>
                    <p className="mt-1 text-sm text-slate-500">{data.university_type || 'College'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.college_type && (
                    <div>
                      <div className="text-xs text-slate-400">College Type</div>
                      <div className="font-medium text-slate-700">{data.college_type}</div>
                    </div>
                  )}
                  {data.management_type && (
                    <div>
                      <div className="text-xs text-slate-400">Management Type</div>
                      <div className="font-medium text-slate-700">{getMappedValue(MANAGEMENT_TYPES, data.management_type)}</div>
                    </div>
                  )}
                  {data.ownership_type && (
                    <div>
                      <div className="text-xs text-slate-400">Ownership Type</div>
                      <div className="font-medium text-slate-700">{getMappedValue(OWNERSHIP_TYPES, data.ownership_type)}</div>
                    </div>
                  )}
                  {data.location_category && (
                    <div>
                      <div className="text-xs text-slate-400">Location Category</div>
                      <div className="font-medium text-slate-700">{getMappedValue(LOCATION_CATEGORIES, data.location_category)}</div>
                    </div>
                  )}
                </div>
                {/* Add more details as needed */}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
