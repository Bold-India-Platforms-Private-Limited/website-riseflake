"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CollegeList from "./components/CollegeList";
import Pagination from "../components/Pagination";
import { API_BASE_URL } from "../../lib/config";
import { FiSearch } from "react-icons/fi";

type CollegeListItem = {
  id: number;
  college_name: string;
  college_logo?: string | null;
  slug: string;
  [key: string]: any;
};

type CollegesResponse = {
  status: boolean;
  result: CollegeListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

const fetchColleges = async (params: URLSearchParams) => {
  const url = `${API_BASE_URL}/colleges?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch colleges");
  }
  return (await response.json()) as CollegesResponse;
};

const LAST_UPDATED_KEY = "colleges_last_updated_ts";
const ONE_HOUR = 60 * 60 * 1000;

const getOrInitTimestamp = (): Date => {
  try {
    const stored = localStorage.getItem(LAST_UPDATED_KEY);
    if (stored) {
      const parsed = new Date(stored);
      if (!isNaN(parsed.getTime()) && Date.now() - parsed.getTime() < ONE_HOUR) {
        return parsed;
      }
    }
  } catch {}
  const now = new Date();
  try {
    localStorage.setItem(LAST_UPDATED_KEY, now.toISOString());
  } catch {}
  return now;
};

const persistTimestamp = (date: Date) => {
  try {
    localStorage.setItem(LAST_UPDATED_KEY, date.toISOString());
  } catch {}
};

const CollegesSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
    {[...Array(10)].map((_, index) => (
      <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-200/70 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-slate-200/70 animate-pulse"></div>
              <div className="h-3 w-28 rounded bg-slate-200/70 animate-pulse"></div>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function CollegesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<CollegesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(getOrInitTimestamp());
  }, []);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    return params;
  }, [searchParams]);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setHasError(false);
    fetchColleges(queryParams)
      .then((result) => {
        if (!isActive) return;
        setData(result);
      })
      .catch(() => {
        if (!isActive) return;
        setHasError(true);
        setData(null);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [queryParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated((prev) => {
        if (!prev) return prev;
        if (Date.now() - prev.getTime() >= ONE_HOUR) {
          const next = new Date();
          persistTimestamp(next);
          return next;
        }
        return prev;
      });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const colleges = data?.result ?? [];
  const currentPage = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;
  const totalColleges = data?.total ?? 0;
  const pageSize = data?.limit ?? Number.parseInt(searchParams.get("limit") ?? "20", 10);

  const formatTimestamp = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="order-1 space-y-6">
        <form
          className="mb-2"
          onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams(searchParams.toString());
            const trimmed = searchTerm.trim();
            if (trimmed) {
              params.set("search", trimmed);
            } else {
              params.delete("search");
            }
            params.delete("page");
            router.push(`/colleges?${params.toString()}`);
          }}
        >
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search colleges by name"
              className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 pl-11 text-sm text-slate-700 shadow-sm"
            />
          </div>
        </form>
        {isLoading ? (
          <CollegesSkeleton />
        ) : hasError ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Unable to load colleges</h3>
            <p className="mt-2 text-sm text-slate-600">Please refresh the page or try again in a few moments.</p>
          </div>
        ) : (
          <CollegeList colleges={colleges} />
        )}
      </div>
      <aside className="order-2 hidden lg:block fixed top-24 z-40 w-[320px]" style={{right: 'calc((100vw - 1200px)/2)', maxWidth: '320px'}}>
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Grow your brand</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">List your college on Riseflake</h3>
          <p className="mt-2 text-sm text-slate-600">Reach high-intent students and showcase your campus to 50k+ learners.</p>
          <a
            href="https://app.riseflake.com/home"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Get started
          </a>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Student alerts</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Stay ahead of campus trends</h3>
          <p className="mt-2 text-sm text-slate-600">Weekly insights on admissions, events, and opportunities.</p>
          <a
            href="https://app.riseflake.com/home"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Subscribe
          </a>
        </div>
      </aside>
      {!isLoading && !hasError && totalColleges > 0 && (
        <div className="order-3 lg:col-span-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalColleges}
            pageSize={Number.isNaN(pageSize) ? 20 : pageSize}
            baseQuery={queryParams}
            limitOptionPreset={[20, 50, 100, 500, 1000, 2000, 5000]}
          />
        </div>
      )}
      <footer className="order-4 lg:col-span-2 rounded-2xl px-6 py-4 text-center text-xs text-slate-600">
        <p className="font-semibold text-slate-900">
          Updated On: {lastUpdated ? formatTimestamp(lastUpdated) : "—"} IST
        </p>
        <p className="mt-1 text-slate-500">The data on this page gets updated every 1 hour.</p>
        <p className="mt-1 text-slate-500">Best Viewed in Chrome, Opera, Mozilla, EDGE & Safari.</p>
      </footer>
    </section>
  );
}
