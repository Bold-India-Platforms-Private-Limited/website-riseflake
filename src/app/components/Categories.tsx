'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wifi,
  BrainCircuit,
  Code2,
  GitBranch,
  Palette,
  Megaphone,
  Sparkles,
  Settings2,
  BarChart3,
  Monitor,
  X,
  ChevronRight,
} from "lucide-react";

interface Category {
  id: number;
  cat: string;
  count: string;
  icon: React.ReactElement;
  gradient: string;
  iconColor: string;
}

const category: Category[] = [
  { id: 1,  cat: "Remote",            count: "Available jobs", icon: <Wifi />,          gradient: "from-emerald-400 to-teal-500",    iconColor: "#10b981" },
  { id: 2,  cat: "Machine Learning",  count: "Available jobs", icon: <BrainCircuit />,  gradient: "from-violet-500 to-purple-600",   iconColor: "#8b5cf6" },
  { id: 3,  cat: "MERN Developer",    count: "Available jobs", icon: <Code2 />,         gradient: "from-blue-400 to-indigo-500",     iconColor: "#3b82f6" },
  { id: 4,  cat: "Backend Developer", count: "Available jobs", icon: <GitBranch />,     gradient: "from-orange-400 to-red-500",      iconColor: "#f97316" },
  { id: 5,  cat: "UI UX Designer",    count: "Available jobs", icon: <Palette />,       gradient: "from-pink-400 to-rose-500",       iconColor: "#ec4899" },
  { id: 6,  cat: "Marketing",         count: "Available jobs", icon: <Megaphone />,     gradient: "from-amber-400 to-yellow-500",    iconColor: "#f59e0b" },
  { id: 7,  cat: "AI",                count: "Available jobs", icon: <Sparkles />,      gradient: "from-cyan-400 to-sky-500",        iconColor: "#06b6d4" },
  { id: 8,  cat: "Engineering",       count: "Available jobs", icon: <Settings2 />,     gradient: "from-slate-500 to-zinc-600",      iconColor: "#64748b" },
  { id: 9,  cat: "Data Science",      count: "Available jobs", icon: <BarChart3 />,     gradient: "from-green-400 to-emerald-600",   iconColor: "#22c55e" },
  { id: 10, cat: "Software & IT",     count: "Available jobs", icon: <Monitor />,       gradient: "from-indigo-500 to-blue-600",     iconColor: "#6366f1" },
];

const Categories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const firstRow  = category.slice(0, 5);
  const secondRow = category.slice(5, 10);
  const mobileVisible = category.slice(0, 7);

  const CategoryCard = ({ item, size = "md" }: { item: Category; size?: "sm" | "md" }) => (
    <div
      onClick={() => setIsModalOpen(true)}
      className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-transparent ${size === "md" ? "p-5" : "p-4"}`}
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3.5 overflow-hidden flex-1">
          {/* Icon bubble */}
          <div
            className={`relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${size === "md" ? "w-12 h-12" : "w-10 h-10"}`}
          >
            <span className={`text-white ${size === "md" ? "[&>svg]:h-5 [&>svg]:w-5" : "[&>svg]:h-4 [&>svg]:w-4"}`}>
              {item.icon}
            </span>
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)' }} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-slate-900 transition-colors">
              {item.cat}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{item.count}</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 mb-20 mt-8 md:px-12">
      <div className="mb-8 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Categories
        </h2>
        <p className="mt-2 text-slate-500 text-sm md:text-base">Browse jobs by your area of expertise</p>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col gap-4">
        <div className="grid grid-cols-5 gap-4">
          {firstRow.map((item) => <CategoryCard key={item.id} item={item} />)}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {secondRow.map((item) => <CategoryCard key={item.id} item={item} />)}
        </div>
      </div>

      {/* Mobile View - icon grid */}
      <div className="block md:hidden">
        <div className="grid grid-cols-4 gap-4 mb-4 max-w-[92%] mx-auto">
          {mobileVisible.map((item) => (
            <button
              key={item.id}
              onClick={() => setIsModalOpen(true)}
              className="aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl transition-all duration-200 active:scale-95 hover:scale-105 border border-slate-100 bg-white shadow-sm"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} shadow-md [&>svg]:h-5 [&>svg]:w-5 text-white`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight px-1 truncate w-full text-center">{item.cat.split(" ")[0]}</span>
            </button>
          ))}

          {/* More button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-sm active:scale-95 transition-all duration-200"
          >
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            </div>
            <span className="text-[10px] font-semibold text-indigo-500">More</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex z-50 items-end md:items-stretch md:justify-end"
          style={{ animation: 'fadeIn 0.2s ease' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl md:rounded-none md:rounded-tl-3xl md:rounded-bl-3xl p-6 md:p-8 max-h-[80vh] md:max-h-screen md:h-screen md:w-[480px] overflow-y-auto shadow-2xl"
            style={{ animation: 'slideUp 0.3s ease' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">All Categories</h3>
                <p className="text-sm text-slate-500 mt-0.5">Find your perfect role</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {category.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-transparent hover:shadow-md bg-white cursor-pointer transition-all duration-200"
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push("/jobs");
                  }}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-md shrink-0 [&>svg]:h-5 [&>svg]:w-5 text-white group-hover:scale-110 transition-transform duration-200`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">{item.cat}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.count}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Categories;