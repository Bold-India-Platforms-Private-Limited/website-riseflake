"use client"

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Pagination from "./components/Pagination";
import MobileFilters from "./components/MobileFilters";
import { FaShareAlt } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/config";

interface Job {
  id: number;
  job_title: string;
  company_name: string;
  company_logo: string | null;
  location: string;
  apply_url: string;
  experience: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

const API_URL = `${API_BASE_URL}/ijobs`;

function slugify(title: string, id: number) {
  return (
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") +
    "-" +
    id
  );
}

const IJobsClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Initialize state from searchParams (SSR-safe)
  const getParam = (key: string, fallback = "") => searchParams.get(key) || fallback;
  const getAllParam = (key: string) => {
    // next/navigation searchParams only supports getAll in client, so fallback to []
    try { return searchParams.getAll(key); } catch { return []; }
  };
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(() => parseInt(getParam("page", "1"), 10));
  const [limit, ] = useState(() => parseInt(getParam("limit", "15"), 10));
  const [total, setTotal] = useState(0);
  const [, setHasMore] = useState(false);
  const [filters, setFilters] = useState(() => ({
    companyName: getParam("company_name"),
    position: getParam("position"),
    location: getParam("location"),
    categories: getParam("categories"),
    jobTypes: getAllParam("job_type"),
    workplaceTypes: getAllParam("workplace_type"),
    experience: getParam("experience"),
  }));
  const [search, setSearch] = useState(getParam("search"));
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  useEffect(() => {
    setLastUpdated(new Date());
    const interval = setInterval(() => setLastUpdated(new Date()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  // Sync state to URL params and fetch jobs (client only)
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set("page", String(page));
    if (limit !== 15) params.set("limit", String(limit));
    if (filters.companyName) params.set("company_name", filters.companyName);
    if (filters.position) params.set("position", filters.position);
    if (filters.location) params.set("location", filters.location);
    if (filters.categories) params.set("categories", filters.categories);
    filters.jobTypes.forEach((jt: string) => params.append("job_type", jt));
    filters.workplaceTypes.forEach((wt: string) => params.append("workplace_type", wt));
    if (filters.experience) params.set("experience", filters.experience);
    if (search) params.set("search", search);
    // Only run on client
    if (typeof window !== "undefined") {
      const url = params.toString() ? `/indexed-jobs?${params.toString()}` : '/indexed-jobs';
      window.history.replaceState(null, '', url);
    }
    // Fetch jobs
    const fetchJobs = async () => {
      const apiUrl = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
      const res = await fetch(apiUrl);
      const data = await res.json();
      setJobs(data.result || []);
      setTotal(data.total || 0);
      setHasMore(data.hasMore || false);
    };
    fetchJobs();
  }, [page, limit, filters, search]);

  // When user changes filters/search/page, update state and URL
  // (Handlers below already call setPage(1) as needed)

  const handleShare = (job: Job) => {
    const slug = slugify(job.job_title, job.id);
    const url = `${window.location.origin}/indexed-jobs/${slug}`;
    if (navigator.share) {
      navigator.share({
        title: job.job_title,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleApply = (applyUrl: string) => {
    if (/^mailto:/i.test(applyUrl)) {
      window.open(applyUrl, "_blank");
    } else if (/^[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(applyUrl)) {
      window.open(`mailto:${applyUrl}`, "_blank");
    } else {
      window.open(applyUrl, "_blank");
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        {/* Mobile Filters and Search */}
        {/* Mobile search bar and filters button */}
        <div className="lg:hidden px-4 flex flex-1 items-center gap-3 sticky top-0 z-30 bg-gray-50">
          <div className="shrink-0">
            <MobileFilters
              filters={filters}
              onApply={f => { setFilters(f); setPage(1); }}
              onReset={() => { setFilters({ companyName: "", position: "", location: "", categories: "", jobTypes: [], workplaceTypes: [], experience: "" }); setPage(1); }}
            />
          </div>
          <form className="flex-1 -mt-4 bg-white" onSubmit={e => { e.preventDefault(); setPage(1); }}>
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
            />
          </form>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 py-8 grid grid-cols-12 gap-6">
          {/* Left Filters (Desktop) */}
          <aside className="col-span-12 md:col-span-3 hidden md:block lg:sticky lg:top-[80px] lg:self-start">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-base font-semibold text-slate-900 mb-2">Filters</h2>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setPage(1);
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  placeholder="Position"
                  value={filters.position}
                  onChange={e => setFilters(f => ({ ...f, position: e.target.value }))}
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-700 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-base text-slate-700 shadow-sm"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Experience Range (years)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={filters.experience || 0}
                      onChange={e => setFilters(f => ({ ...f, experience: e.target.value }))}
                      className="w-full"
                    />
                    <span className="text-sm font-medium text-slate-600">{filters.experience || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    className="flex-1 rounded bg-slate-200 py-2 text-base font-semibold text-slate-700"
                    onClick={() => { setFilters({ companyName: '', position: '', location: '', categories: '', jobTypes: [], workplaceTypes: [], experience: '' }); setPage(1); }}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded bg-[#414FEA] py-2 text-base font-semibold text-white"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </div>
          </aside>
          {/* Middle Job Cards */}
          <main className="col-span-12 md:col-span-6">
            {/* Desktop search bar above card list */}
            <div className="mb-6 gap-2 items-center hidden lg:flex">
              <form className="flex-1" onSubmit={e => { e.preventDefault(); setPage(1); }}>
                <div className="relative">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, etc."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 pl-11 text-base text-slate-700 shadow-sm"
                  />
                </div>
              </form>
            </div>
            <div className="space-y-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="relative bg-white rounded-lg shadow p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/indexed-jobs/${slugify(job.job_title, job.id)}`)}
                >
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
                    title="Share"
                    onClick={e => { e.stopPropagation(); handleShare(job); }}
                  >
                    <FaShareAlt size={20} />
                  </button>
                  <div className="flex items-center gap-4">
                    {job.company_logo && (
                      <img
                        src={job.company_logo}
                        alt={job.company_name}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    )}
                    <div>
                      <h3
                        className="text-xl font-bold hover:text-blue-700"
                      >
                        {job.job_title}
                      </h3>
                      <div className="text-gray-600 text-sm">{job.company_name}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-500 text-sm">
                    {job.location && <span>{job.location}</span>}
                    {job.location && <span>•</span>}
                    {job.experience && <span>Experience: {job.experience}</span>}
                    {job.experience && <span>•</span>}
                    <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                    <button
                      className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
                      onClick={e => { e.stopPropagation(); handleApply(job.apply_url); }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
          {/* Right Banners */}
          <aside className="col-span-12 md:col-span-3 lg:sticky lg:top-[80px] lg:self-start">
            <div className="bg-white rounded-lg shadow p-4 mb-6 min-h-[200px] flex items-center justify-center">
              <span className="text-gray-400">Banner 1</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 min-h-[200px] flex items-center justify-center">
              <span className="text-gray-400">Banner 2</span>
            </div>
          </aside>
        </div>
        {/* Full-width Pagination below grid */}
        <div className="max-w-[1200px] mx-auto mt-8">
          <Pagination
            page={page}
            limit={limit}
            total={total}
          />
        </div>
      </div>
      <footer className="mt-6 rounded-2xl px-6 py-4 text-center text-xs text-slate-600">
        <p className="font-semibold text-slate-900">
          Updated On: {lastUpdated ? formatTimestamp(lastUpdated) : '—'} IST
        </p>
        <p className="mt-1 text-slate-500">The data on this page gets updated every 15 minutes.</p>
        <p className="mt-1 text-slate-500">
          Best Viewed in Chrome, Opera, Mozilla, EDGE & Safari.
        </p>
      </footer>
    </div>
  );
};

export default IJobsClient;
