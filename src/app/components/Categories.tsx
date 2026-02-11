import React, { useState } from "react";
import {
  IoHomeOutline,
  IoHardwareChipOutline,
  IoCodeSlashOutline,
  IoGitBranchOutline,
  IoEaselOutline,
  IoBriefcaseOutline,
  IoTerminalOutline,
  IoSettingsOutline,
  IoStatsChartOutline,
  IoLaptopOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  cat: string;
  count: string;
  icon: React.ReactElement;
}

const category: Category[] = [
  { id: 1, cat: "Remote", count: "21.4K+ jobs", icon: <IoHomeOutline /> },
  { id: 2, cat: "Machine Learning", count: "84K+ jobs", icon: <IoHardwareChipOutline /> },
  { id: 3, cat: "MERN Stack Developer", count: "22K+ jobs", icon: <IoCodeSlashOutline /> },
  { id: 4, cat: "Backend Developer", count: "4.5K+ jobs", icon: <IoGitBranchOutline /> },
  { id: 5, cat: "UI UX Designer", count: "239 jobs", icon: <IoEaselOutline /> },
  { id: 6, cat: "Marketing", count: "19.7K+ jobs", icon: <IoBriefcaseOutline /> },
  { id: 7, cat: "AI", count: "2.2K+ jobs", icon: <IoTerminalOutline /> },
  { id: 8, cat: "Engineering", count: "7.8K+ jobs", icon: <IoSettingsOutline /> },
  { id: 9, cat: "Data Science", count: "3.9K+ jobs", icon: <IoStatsChartOutline /> },
  { id: 10, cat: "Software & IT", count: "37.7K+ jobs", icon: <IoLaptopOutline /> },
];

const Categories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  // Use original order
  const firstRow = category.slice(0, 5);
  const secondRow = category.slice(5, 10);
  const mobileVisible = category.slice(0, 7);

  // Desktop colors
  const colors: string[] = [
    "rgba(59, 130, 246, 0.1)",
    "rgba(168, 85, 247, 0.1)",
    "rgba(249, 115, 22, 0.1)",
    "rgba(250, 204, 21, 0.1)"
  ];

  // Mobile view - vibrant diverse colors with matching icon colors
  const mobileColors: { bg: string; icon: string }[] = [
    { bg: "rgba(34, 197, 94, 0.15)", icon: "#16a34a" },
    { bg: "rgba(59, 130, 246, 0.15)", icon: "#2563eb" },
    { bg: "rgba(249, 115, 22, 0.15)", icon: "#ea580c" },
    { bg: "rgba(168, 85, 247, 0.15)", icon: "#9333ea" },
    { bg: "rgba(236, 72, 153, 0.15)", icon: "#db2777" },
    { bg: "rgba(251, 191, 36, 0.15)", icon: "#f59e0b" },
    { bg: "rgba(20, 184, 166, 0.15)", icon: "#0d9488" },
  ];

  const handleCardClick = (): void => {
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mb-20 mt-8 md:px-12">
      <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-10 text-[#18191c] tracking-tight">
        Categories
      </h2>

      {/* Desktop View - Hidden on mobile */}
      <div className="hidden md:block">
        {/* First Row */}
        <div className="grid grid-cols-5 gap-5 mb-5">
          {firstRow.map(({ cat, id, icon }, i) => (
            <div
              key={id}
              onClick={handleCardClick}
              className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-white to-[#fafafa] shadow-sm hover:shadow-xl transition-all duration-300 ease-out cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex justify-between items-center gap-3 relative z-10">
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:rotate-5 transition-all duration-300"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  >
                    {icon}
                  </div>
                  <p className="text-base text-[#18191c] font-semibold whitespace-nowrap overflow-hidden text-ellipsis tracking-tight">
                    {cat}
                  </p>
                </div>
                <IoChevronForwardOutline className="text-xl text-gray-400"/>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-5 gap-5">
          {secondRow.map(({ cat, id, icon }, i) => (
            <div
              key={id}
              onClick={handleCardClick}
              className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-white to-[#fafafa] shadow-sm hover:shadow-xl transition-all duration-300 ease-out cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex justify-between items-center gap-3 relative z-10">
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:rotate-5 transition-all duration-300"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  >
                    {icon}
                  </div>
                  <p className="text-base text-[#18191c] font-semibold whitespace-nowrap overflow-hidden text-ellipsis tracking-tight">
                    {cat}
                  </p>
                </div>
                <IoChevronForwardOutline className="text-xl text-gray-400"/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View - 7 icons + 1 more button */}
      <div className="block md:hidden">
        <div className="grid grid-cols-4 gap-6 mb-4 max-w-[90%] mx-auto">
          {mobileVisible.map(({ id, icon }, index) => (
            <div
              key={id}
              onClick={handleCardClick}
              className="w-full aspect-square border border-gray-200 rounded-2xl p-0 shadow-none transition-transform duration-200 active:scale-95 flex items-center justify-center"
              style={{ backgroundColor: mobileColors[index].bg }}
            >
              <div className="flex items-center justify-center text-3xl" style={{ color: mobileColors[index].icon }}>
                {icon}
              </div>
            </div>
          ))}
          
          {/* 8th card - 3 dots */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="w-full aspect-square border border-gray-200 rounded-2xl p-0 shadow-none transition-transform duration-200 active:scale-95 flex items-center justify-center bg-white"
          >
            <div className="flex items-center justify-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5b4a9f]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#5b4a9f]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#5b4a9f]" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for all categories */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex z-50 animate-fadeIn items-end md:items-stretch md:justify-end"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl md:rounded-none md:rounded-tl-3xl md:rounded-bl-3xl p-6 md:p-8 max-h-[70vh] md:max-h-screen md:h-screen md:w-[450px] md:max-w-[90vw] overflow-y-auto animate-slideUp md:animate-slideLeft md:shadow-[-4px_0_24px_rgba(0,0,0,0.15)] hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5 md:mb-8 md:pb-4 md:border-b md:border-gray-200">
              <h3 className="text-lg md:text-2xl font-semibold md:font-bold text-[#18191c]">
                All Categories
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer text-xl md:text-2xl transition-all duration-200 active:bg-gray-200 md:hover:bg-gray-200 md:hover:scale-105"
              >
                <IoCloseOutline />
              </button>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-2 gap-3.5 md:gap-4">
              {category.map(({ id, cat, count, icon }, i) => (
                <div
                  key={id}
                  className="border border-gray-200 rounded-2xl md:rounded-3xl p-3.5 md:p-5 text-center cursor-pointer transition-all duration-200 bg-white active:shadow-md md:hover:shadow-lg md:hover:-translate-y-1 md:hover:border-gray-300"
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push("/jobs");
                  }}
                >
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-2xl md:text-3xl mx-auto mb-2.5 md:mb-3.5 transition-all duration-300 md:group-hover:scale-110 md:group-hover:rotate-5"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  >
                    {icon}
                  </div>
                  <p className="text-xs md:text-sm font-medium md:font-semibold text-[#18191c] mb-1 leading-tight">
                    {cat}
                  </p>
                  <p className="text-[0.6875rem] md:text-xs text-gray-500">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add keyframe animations to global styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideLeft {
          animation: slideLeft 0.3s ease-out;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default Categories;