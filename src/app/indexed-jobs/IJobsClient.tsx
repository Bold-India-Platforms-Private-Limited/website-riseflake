"use client"

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
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

const API_URL = `${API_BASE_URL}/indexed-jobs`;
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(() => parseInt(getParam("page", "1"), 10));
  const [limit, setLimit] = useState(() => parseInt(getParam("limit", "15"), 10));
    // Sync page/limit state with URL params (for Pagination component navigation)
    useEffect(() => {
      const urlPage = parseInt(getParam("page", "1"), 10);
      const urlLimit = parseInt(getParam("limit", "15"), 10);
      if (urlPage !== page) setPage(urlPage);
      if (urlLimit !== limit) setLimit(urlLimit);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);
  const [filters, setFilters] = useState(() => ({
    position: getParam("position"),
    location: getParam("location"),
    experienceMin: getParam("experienceMin"),
    experienceMax: getParam("experienceMax"),
  }));
  const [search, setSearch] = useState(getParam("search", ""));
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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

  // Fetch jobs from backend with filters, search, pagination
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (filters.position) params.set("position", filters.position);
      if (filters.location) params.set("location", filters.location);
      if (filters.experienceMin) params.set("experienceMin", filters.experienceMin);
      if (filters.experienceMax) params.set("experienceMax", filters.experienceMax);
      if (search) params.set("search", search);
      const apiUrl = `${API_URL}?${params.toString()}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      setJobs(data.result || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || Math.max(1, Math.ceil((data.total || 0) / limit)));
      setIsLoading(false);
    };
    fetchJobs();
  }, [page, limit, filters, search]);

  // Loading shimmer for job cards
  function JobsShimmer() {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 animate-pulse flex flex-col gap-2">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="flex-1">
                <div className="h-5 w-32 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-20 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-3/4 bg-slate-100 rounded mb-2" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

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

  // Handlers for search and filters
  // Search bar above card list: update only search state (not filters)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // Always search from first page and update URL
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.position) params.set("position", filters.position);
    if (filters.location) params.set("location", filters.location);
    if (filters.experienceMin) params.set("experienceMin", filters.experienceMin);
    if (filters.experienceMax) params.set("experienceMax", filters.experienceMax);
    params.set("page", "1");
    params.set("limit", String(limit));
    if (typeof window !== "undefined") {
      const url = params.toString() ? `/indexed-jobs?${params.toString()}` : '/indexed-jobs';
      window.history.replaceState(null, '', url);
    }
  };

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
    // Always filter from first page and update URL
    const params = new URLSearchParams();
    if (newFilters.position) params.set("position", newFilters.position);
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.experienceMin) params.set("experienceMin", newFilters.experienceMin);
    if (newFilters.experienceMax) params.set("experienceMax", newFilters.experienceMax);
    if (search) params.set("search", search);
    params.set("page", "1");
    params.set("limit", String(limit));
    if (typeof window !== "undefined") {
      const url = params.toString() ? `/indexed-jobs?${params.toString()}` : '/indexed-jobs';
      window.history.replaceState(null, '', url);
    }
  };

  const handleFilterReset = () => {
    setFilters({ position: "", location: "", experienceMin: "", experienceMax: "" });
    setSearch("");
    setPage(1);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, '', '/indexed-jobs');
    }
  };

  // Use backend pagination and total
  const totalFiltered = total;
  const paginatedJobs = jobs;
  // For Pagination baseQuery
  const [baseQuery, setBaseQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseQuery(new URLSearchParams(window.location.search));
    }
  }, [filters, search, limit, page]);


  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        {/* Mobile Filters and Search */}
        <div className="lg:hidden px-4 flex flex-1 items-center gap-3 sticky top-0 z-30 bg-gray-50">
          <div className="shrink-0">
            <MobileFilters
              filters={filters}
              onApply={handleFilterApply}
              onReset={handleFilterReset}
            />
          </div>
          <form className="flex-1 -mt-4 bg-white" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search by company or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
            />
          </form>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 pt-20 pb-12 grid grid-cols-12 gap-6">
          {/* Left Filters (Desktop) */}
          <aside className="col-span-12 md:col-span-3 hidden md:block lg:sticky lg:top-[80px] lg:self-start">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-base font-semibold text-slate-900 mb-2">Filters</h2>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleFilterApply(filters);
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
                  <div className="flex flex-col gap-2">
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={filters.experienceMin || 0}
                      onChange={e => {
                        let min = Number(e.target.value);
                        let max = Number(filters.experienceMax || min);
                        if (min > max) max = min;
                        setFilters(f => ({ ...f, experienceMin: String(min), experienceMax: String(max) }));
                      }}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={filters.experienceMax || 0}
                      onChange={e => {
                        let max = Number(e.target.value);
                        let min = Number(filters.experienceMin || 0);
                        if (max < min) min = max;
                        setFilters(f => ({ ...f, experienceMin: String(min), experienceMax: String(max) }));
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Min: {filters.experienceMin || 0} yrs</span>
                      <span>Max: {filters.experienceMax || 0} yrs</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    className="flex-1 rounded bg-slate-200 py-2 text-base font-semibold text-slate-700"
                    onClick={handleFilterReset}
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
              <form className="flex-1" onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input
                    type="text"
                    placeholder="Search by company or title..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 pl-11 text-base text-slate-700 shadow-sm"
                  />
                </div>
              </form>
            </div>
            <div className="space-y-6">
              {isLoading ? (
                <JobsShimmer />
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-slate-500 text-lg font-semibold">No jobs found.</div>
              ) : (
                paginatedJobs.map((job) => (
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
                ))
              )}
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
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalFiltered}
            pageSize={limit}
            baseQuery={baseQuery}
          />
        </div>
      </div>
      <footer className="rounded-2xl px-6 py-4 text-center text-xs text-slate-600 bg-slate-100">
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
