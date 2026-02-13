"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { FaShareAlt } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/config";

interface JobDetail {
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
  job_description?: string;
  // Add more fields as needed
}

function unslugify(slug: string) {
  // Extract id from slug
  const match = slug.match(/-(\d+)$/);
  if (!match) return { id: null, title: slug };
  const id = parseInt(match[1], 10);
  const title = slug.replace(/-(\d+)$/, "").replace(/-/g, " ");
  return { id, title };
}

const API_URL = `${API_BASE_URL}/indexed-jobs`;

const IJobDetailClient = ({ slug }: { slug: string }) => {
  const [job, setJob] = useState<JobDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { id } = unslugify(slug);
    if (!id) return;
    const fetchJob = async () => {
      const res = await fetch(`${API_URL}?id=${id}`);
      const data = await res.json();
      if (data.result && Array.isArray(data.result)) {
        setJob(data.result.find((j: any) => j.id === id) || null);
      } else if (data.result && data.result.id === id) {
        setJob(data.result);
      }
    };
    fetchJob();
  }, [slug]);

  const handleShare = () => {
    const url = `${window.location.origin}/ijobs/${slug}`;
    if (navigator.share) {
      navigator.share({
        title: job?.job_title,
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

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="max-w-3xl mx-auto py-16 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <span className="cursor-pointer hover:text-blue-700" onClick={() => router.push("/")}>Home</span>
          <span className="mx-2">/</span>
          <span className="cursor-pointer hover:text-blue-700" onClick={() => router.push("/ijobs")}>iJobs</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-semibold">{job.job_title}</span>
        </nav>
        <div className="bg-white rounded-lg shadow p-8 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
            title="Share"
            onClick={handleShare}
          >
            <FaShareAlt size={22} />
          </button>
          <div className="flex items-center gap-4 mb-4">
            {job.company_logo && (
              <img
                src={job.company_logo}
                alt={job.company_name}
                className="w-16 h-16 rounded-full object-cover border"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold mb-1">{job.job_title}</h1>
              <div className="text-gray-600">{job.company_name}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-gray-500 text-sm mb-4">
            {job.location && <span>{job.location}</span>}
            {job.location && <span>•</span>}
            {job.experience && <span>Experience: {job.experience}</span>}
            {job.experience && <span>•</span>}
            <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-end mt-2">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 font-semibold"
              onClick={() => handleApply(job.apply_url)}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IJobDetailClient;
