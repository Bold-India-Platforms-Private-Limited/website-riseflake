import { Award, TrendingUp, Clock, Utensils, HeartPulse, FileCheck, Laptop, Gift, DollarSign, GraduationCap, Bus, Home } from "lucide-react";

type TagsSectionProps = {
  title: string
  tags: string[] | null | undefined
}

const GRADIENTS = [
  'bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-400',
  'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400',
  'bg-gradient-to-r from-green-400 via-blue-300 to-purple-400',
  'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400',
  'bg-gradient-to-r from-indigo-400 via-blue-300 to-green-300',
  'bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400',
  'bg-gradient-to-r from-fuchsia-400 via-pink-300 to-rose-400',
  'bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-400',
  'bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-400',
  'bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400',
  'bg-gradient-to-r from-red-400 via-pink-300 to-fuchsia-400',
  'bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400',
  'bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400',
  'bg-gradient-to-r from-lime-400 via-green-300 to-emerald-400',
  'bg-gradient-to-r from-amber-400 via-orange-300 to-red-400',
  'bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400',
  'bg-gradient-to-r from-pink-400 via-fuchsia-300 to-purple-400',
  'bg-gradient-to-r from-green-400 via-emerald-300 to-lime-400',
  'bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400',
  'bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400',
];

function getRandomGradient(idx: number) {
  // Use tag index for deterministic random, so SSR/CSR match
  return GRADIENTS[idx % GRADIENTS.length];
}

const FACILITY_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  "Certificate / Experience Letter": { icon: <Award size={16} />, color: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
  "ESOPs / Equity": { icon: <TrendingUp size={16} />, color: 'bg-gradient-to-r from-purple-400 to-pink-500' },
  "Flexible Working Hours": { icon: <Clock size={16} />, color: 'bg-gradient-to-r from-blue-400 to-cyan-400' },
  "Free Meals / Snacks": { icon: <Utensils size={16} />, color: 'bg-gradient-to-r from-orange-400 to-yellow-500' },
  "Health Insurance / Mediclaim": { icon: <HeartPulse size={16} />, color: 'bg-gradient-to-r from-pink-400 to-red-500' },
  "Job Offer on Completion (PPO)": { icon: <FileCheck size={16} />, color: 'bg-gradient-to-r from-green-400 to-emerald-500' },
  "Laptop / Equipment Provided": { icon: <Laptop size={16} />, color: 'bg-gradient-to-r from-gray-400 to-gray-600' },
  "Performance Bonus / Incentives": { icon: <Gift size={16} />, color: 'bg-gradient-to-r from-fuchsia-400 to-pink-400' },
  "Stipend / Salary": { icon: <DollarSign size={16} />, color: 'bg-gradient-to-r from-amber-400 to-yellow-500' },
  "Training and Mentorship": { icon: <GraduationCap size={16} />, color: 'bg-gradient-to-r from-indigo-400 to-blue-500' },
  "Travel / Cab Facility": { icon: <Bus size={16} />, color: 'bg-gradient-to-r from-sky-400 to-blue-400' },
  "Work From Home": { icon: <Home size={16} />, color: 'bg-gradient-to-r from-teal-400 to-green-400' },
};

export default function TagsSection({ title, tags }: TagsSectionProps) {
  // Filter out raw numeric DB IDs that the API may return instead of resolved names
  const displayTags = (tags ?? []).filter(tag => !/^\d+$/.test(tag.trim()))

  if (!displayTags.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600">Not specified</p>
      </div>
    )
  }

  const isFacilities = title.toLowerCase().includes('facil');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag, idx) => {
          if (isFacilities && FACILITY_ICONS[tag]) {
            const { icon, color } = FACILITY_ICONS[tag];
            return (
              <span
                key={tag}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-medium text-white shadow-sm ${color}`}
                style={{ backgroundClip: 'padding-box' }}
              >
                {icon}
                {tag}
              </span>
            );
          }
          // fallback to gradient for other tags
          return (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium text-white shadow-sm ${getRandomGradient(idx)}`}
              style={{ backgroundClip: 'padding-box' }}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  )
}
