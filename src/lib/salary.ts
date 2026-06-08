/**
 * Shared salary formatting utilities.
 *
 * DB schema reference:
 *   salary_type  ENUM  'FIXED' | 'RANGE' | 'FIXED_INCENTIVE' | 'UNPAID'
 *   salary_period       'MONTH' | 'YEAR' | 'HOUR' | 'WEEK'
 *   currency            ISO-4217 3-letter code, e.g. 'INR', 'USD', 'EUR'
 *   fixed_amount        numeric string (for FIXED and FIXED_INCENTIVE)
 *   min_amount          numeric string (for RANGE)
 *   max_amount          numeric string (for RANGE)
 *   incentive_details   TEXT – JSON array of label strings, e.g. '["Sales plan","ESOP"]'
 *   is_salary_hidden    boolean
 *   is_negotiable       boolean
 */

// ─── Currency ─────────────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  SGD: 'S$',
  CAD: 'CA$',
  AUD: 'A$',
  JPY: '¥',
  CNY: '¥',
  MYR: 'RM ',
  SAR: 'SR ',
}

export function currencySymbol(code: string | null | undefined): string {
  if (!code) return '₹'
  return CURRENCY_SYMBOLS[code.toUpperCase()] ?? `${code} `
}

// ─── Period ───────────────────────────────────────────────────────────────────

const PERIOD_LABELS: Record<string, string> = {
  MONTH:  '/mo',
  YEAR:   '/yr',
  HOUR:   '/hr',
  WEEK:   '/wk',
  // legacy lowercase variants just in case
  month:  '/mo',
  year:   '/yr',
  hour:   '/hr',
  week:   '/wk',
  // fully written variants (old data)
  monthly:   '/mo',
  yearly:    '/yr',
  annually:  '/yr',
  hourly:    '/hr',
  weekly:    '/wk',
}

export function periodLabel(period: string | null | undefined): string {
  if (!period) return ''
  return PERIOD_LABELS[period] ?? `/${period.toLowerCase()}`
}

// ─── Amount ───────────────────────────────────────────────────────────────────

/** Compact display: 150000 → "1.5L", 55000 → "55K", 5000 → "5K" */
export function formatAmount(val: string | number | null | undefined): string {
  const n = typeof val === 'number' ? val : parseFloat(String(val ?? ''))
  if (isNaN(n)) return String(val ?? '')
  if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(n % 10_00_000 === 0 ? 0 : 1)}Cr`
  if (n >= 1_00_000)  return `${(n / 1_00_000).toFixed(n % 1_00_000 === 0 ? 0 : 1)}L`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`
  return String(n)
}

// ─── Incentive details parser ──────────────────────────────────────────────────

/** Parse incentive_details TEXT → string[]. Handles JSON array or plain text. */
export function parseIncentiveDetails(raw: string | null | undefined): string[] {
  if (!raw) return []
  const trimmed = raw.trim()
  // Try JSON array
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean)
    } catch { /* fall through */ }
  }
  // Comma-separated or newline-separated plain text
  return trimmed
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// ─── Main formatter ───────────────────────────────────────────────────────────

export type SalaryInfo = {
  /** Primary display string, e.g. "₹55K/mo" */
  display: string
  /** Short label for the header, e.g. "Salary", "Salary + Incentives", "Unpaid" */
  label: string
  /** true for FIXED_INCENTIVE — triggers incentive section */
  hasIncentives: boolean
  /** Parsed list of incentive labels (only set when hasIncentives) */
  incentiveItems: string[]
  /** Gradient class for the ApplyCard header */
  gradient: string
}

export function formatSalaryInfo(job: {
  salary_type: string | null
  fixed_amount: string | null
  min_amount: string | null
  max_amount: string | null
  incentive_details: string | null
  is_salary_hidden: boolean | null
  is_negotiable: boolean | null
  currency: string | null
  salary_period: string | null
}): SalaryInfo | null {
  // Hidden salary
  if (job.is_salary_hidden) return null

  const sym    = currencySymbol(job.currency)
  const period = periodLabel(job.salary_period)
  const type   = job.salary_type?.toUpperCase()

  // ── UNPAID ────────────────────────────────────────────────────────────────
  if (type === 'UNPAID') {
    return {
      display: 'Unpaid / Voluntary',
      label: 'Compensation',
      hasIncentives: false,
      incentiveItems: [],
      gradient: 'from-slate-500 to-slate-600',
    }
  }

  // ── FIXED ─────────────────────────────────────────────────────────────────
  if (type === 'FIXED' && job.fixed_amount && parseFloat(job.fixed_amount) > 0) {
    return {
      display: `${sym}${formatAmount(job.fixed_amount)}${period}`,
      label: 'Salary',
      hasIncentives: false,
      incentiveItems: [],
      gradient: 'from-emerald-600 to-teal-600',
    }
  }

  // ── FIXED_INCENTIVE ───────────────────────────────────────────────────────
  if (type === 'FIXED_INCENTIVE' && job.fixed_amount && parseFloat(job.fixed_amount) > 0) {
    const items = parseIncentiveDetails(job.incentive_details)
    return {
      display: `${sym}${formatAmount(job.fixed_amount)}${period}`,
      label: items.length > 0 ? 'Salary + Incentives' : 'Salary',
      hasIncentives: items.length > 0,
      incentiveItems: items,
      gradient: 'from-amber-500 to-orange-500',
    }
  }

  // ── RANGE ─────────────────────────────────────────────────────────────────
  if (type === 'RANGE' && job.min_amount && job.max_amount) {
    return {
      display: `${sym}${formatAmount(job.min_amount)} – ${formatAmount(job.max_amount)}${period}`,
      label: 'Salary Range',
      hasIncentives: false,
      incentiveItems: [],
      gradient: 'from-emerald-600 to-teal-600',
    }
  }

  // ── Negotiable fallback ───────────────────────────────────────────────────
  if (job.is_negotiable) {
    return {
      display: 'Negotiable',
      label: 'Salary',
      hasIncentives: false,
      incentiveItems: [],
      gradient: 'from-indigo-500 to-violet-600',
    }
  }

  return null
}

// ─── Card-level one-liner (for job/internship list cards) ─────────────────────

/** Returns a compact salary string for list cards, or null if nothing to show. */
export function formatSalaryChip(job: {
  salary_type?: string | null
  fixed_amount?: string | null
  min_amount?: string | null
  max_amount?: string | null
  is_salary_hidden?: boolean | null
  is_negotiable?: boolean | null
  currency?: string | null
  salary_period?: string | null
}): string | null {
  if (job.is_salary_hidden) return null

  const sym    = currencySymbol(job.currency)
  const period = periodLabel(job.salary_period)
  const type   = job.salary_type?.toUpperCase()

  if (type === 'UNPAID') return 'Unpaid'
  if ((type === 'FIXED' || type === 'FIXED_INCENTIVE') && job.fixed_amount && parseFloat(job.fixed_amount) > 0) {
    const suffix = type === 'FIXED_INCENTIVE' ? ' + incentives' : ''
    return `${sym}${formatAmount(job.fixed_amount)}${period}${suffix}`
  }
  if (type === 'RANGE' && job.min_amount && job.max_amount) {
    return `${sym}${formatAmount(job.min_amount)}–${formatAmount(job.max_amount)}${period}`
  }
  if (job.is_negotiable) return 'Negotiable'
  return null
}
