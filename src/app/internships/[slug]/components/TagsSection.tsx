import { Award, TrendingUp, Clock, Utensils, HeartPulse, FileCheck, Laptop, Gift, DollarSign, GraduationCap, Bus, Home } from "lucide-react";

type TagsSectionProps = {
  title: string
  tags: string[] | null | undefined
}

// Soft pastel palette: [bg-from, bg-to, text, border]
const CHIP_PALETTE = [
  ['from-violet-50', 'to-indigo-50',  'text-violet-700',  'border-violet-200/70'],
  ['from-sky-50',    'to-blue-50',    'text-sky-700',     'border-sky-200/70'],
  ['from-emerald-50','to-teal-50',    'text-emerald-700', 'border-emerald-200/70'],
  ['from-rose-50',   'to-pink-50',    'text-rose-700',    'border-rose-200/70'],
  ['from-amber-50',  'to-yellow-50',  'text-amber-700',   'border-amber-200/70'],
  ['from-fuchsia-50','to-purple-50',  'text-fuchsia-700', 'border-fuchsia-200/70'],
  ['from-cyan-50',   'to-sky-50',     'text-cyan-700',    'border-cyan-200/70'],
  ['from-lime-50',   'to-green-50',   'text-lime-700',    'border-lime-200/70'],
  ['from-orange-50', 'to-amber-50',   'text-orange-700',  'border-orange-200/70'],
  ['from-indigo-50', 'to-blue-50',    'text-indigo-700',  'border-indigo-200/70'],
]

type FacilityEntry = {
  icon: React.ReactNode
  bg: string
  text: string
  border: string
}

const FACILITY_MAP: Record<string, FacilityEntry> = {
  "Certificate / Experience Letter": { icon: <Award size={14} />, bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-200' },
  "ESOPs / Equity":                  { icon: <TrendingUp size={14} />, bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  "Flexible Working Hours":          { icon: <Clock size={14} />,      bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-200' },
  "Free Meals / Snacks":             { icon: <Utensils size={14} />,   bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  "Health Insurance / Mediclaim":    { icon: <HeartPulse size={14} />, bg: 'bg-rose-100',   text: 'text-rose-800',   border: 'border-rose-200' },
  "Job Offer on Completion (PPO)":   { icon: <FileCheck size={14} />,  bg: 'bg-emerald-100',text: 'text-emerald-800',border: 'border-emerald-200' },
  "Laptop / Equipment Provided":     { icon: <Laptop size={14} />,     bg: 'bg-slate-100',  text: 'text-slate-700',  border: 'border-slate-200' },
  "Performance Bonus / Incentives":  { icon: <Gift size={14} />,       bg: 'bg-fuchsia-100',text: 'text-fuchsia-800',border: 'border-fuchsia-200' },
  "Stipend / Salary":                { icon: <DollarSign size={14} />, bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-200' },
  "Training and Mentorship":         { icon: <GraduationCap size={14} />, bg: 'bg-indigo-100',text: 'text-indigo-800',border: 'border-indigo-200' },
  "Travel / Cab Facility":           { icon: <Bus size={14} />,        bg: 'bg-sky-100',    text: 'text-sky-800',    border: 'border-sky-200' },
  "Work From Home":                  { icon: <Home size={14} />,       bg: 'bg-teal-100',   text: 'text-teal-800',   border: 'border-teal-200' },
}

// Fallback for unrecognised facilities
const FALLBACK_FACILITY_COLORS = [
  { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
  { bg: 'bg-cyan-100',   text: 'text-cyan-800',   border: 'border-cyan-200' },
  { bg: 'bg-lime-100',   text: 'text-lime-800',   border: 'border-lime-200' },
  { bg: 'bg-pink-100',   text: 'text-pink-800',   border: 'border-pink-200' },
  { bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-200' },
]

export default function TagsSection({ title, tags }: TagsSectionProps) {
  if (!tags || tags.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{title}</h3>
        <p className="text-sm text-slate-500">Not specified</p>
      </div>
    )
  }

  const isFacilities = title.toLowerCase().includes('benefit') || title.toLowerCase().includes('facil')

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">{title}</h3>

      {isFacilities ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => {
            const entry = FACILITY_MAP[tag]
            const { bg, text, border } = entry ?? FALLBACK_FACILITY_COLORS[idx % FALLBACK_FACILITY_COLORS.length]
            const icon = entry?.icon ?? null
            return (
              <span
                key={tag}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border ${bg} ${text} ${border}`}
              >
                {icon && <span className="opacity-80">{icon}</span>}
                {tag}
              </span>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => {
            const [from, to, text, border] = CHIP_PALETTE[idx % CHIP_PALETTE.length]
            return (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full bg-gradient-to-r ${from} ${to} border ${border} px-3 py-1 text-xs font-semibold ${text}`}
              >
                {tag}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
