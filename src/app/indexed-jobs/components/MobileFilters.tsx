
const MobileFilters = ({ filters, onApply, onReset }: MobileFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("position");
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove("body-scroll-lock");
      return;
    }
    document.body.classList.add("body-scroll-lock");
    return () => {
      document.body.classList.remove("body-scroll-lock");
    };
  }, [isOpen]);

  const handleInput = (key: string, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(localFilters);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-[26px] border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
        >
          <FiFilter className="h-4 w-4" />
          Filters
        </button>
      </div>
      <div
        className={`fixed inset-0 z-50 transition ${
          isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        ></div>
        <div
          className={`absolute left-0 top-0 flex h-dvh w-full flex-col bg-white transition-transform duration-200 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Find roles</p>
              <h2 className="text-base font-semibold text-slate-900">Filter jobs</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 shadow-sm"
              aria-label="Close filters"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
          <div className="border-b border-slate-100 px-5">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3">
              <button
                type="button"
                onClick={() => setActiveTab("position")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  activeTab === "position"
                    ? "bg-[#414FEA] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Position
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("location")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  activeTab === "location"
                    ? "bg-[#414FEA] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Location
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("experience")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                  activeTab === "experience"
                    ? "bg-[#414FEA] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Experience
              </button>
            </div>
          </div>
          <form onSubmit={handleApply} className="flex flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className={activeTab === "position" ? "space-y-4" : "hidden"}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Position</label>
                <input
                  type="text"
                  name="position"
                  value={localFilters.position}
                  onChange={e => handleInput("position", e.target.value)}
                  placeholder="Search by position"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                />
              </div>
              <div className={activeTab === "location" ? "space-y-4" : "hidden"}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</label>
                <input
                  type="text"
                  name="location"
                  value={localFilters.location}
                  onChange={e => handleInput("location", e.target.value)}
                  placeholder="City, state, country, or Remote"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                />
              </div>
              <div className={activeTab === "experience" ? "space-y-4" : "hidden"}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Experience Range (years)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={localFilters.experienceMin || ""}
                    onChange={e => handleInput("experienceMin", e.target.value)}
                    className="w-16 border rounded px-2 py-1"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={localFilters.experienceMax || ""}
                    onChange={e => handleInput("experienceMax", e.target.value)}
                    className="w-16 border rounded px-2 py-1"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { onReset(); setIsOpen(false); }}
                  className="flex-1 rounded-none border border-slate-200 bg-white py-2.5 text-center text-base font-semibold text-slate-700"
                >
                  Reset all
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-none bg-[#414FEA] py-2.5 text-base font-semibold text-white shadow-sm"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
import React, { useState, useEffect } from "react";
import { FiFilter, FiX } from "react-icons/fi";

type TabKey = "position" | "location" | "experience";

interface Filters {
  position: string;
  location: string;
  experienceMin: string;
  experienceMax: string;
}

interface MobileFiltersProps {
  filters: Filters;
  onApply: (filters: Filters) => void;
  onReset: () => void;
}
