/**
 * Current calendar period for SEO titles/descriptions.
 *
 * Titles like "Internships in India 2025" go stale and read as outdated. Call
 * this from `generateMetadata()` (NOT a top-level `export const metadata` object
 * — those are evaluated once at module load and would freeze the date) so the
 * month/year refresh on every ISR revalidation.
 */
export function currentPeriod(now: Date = new Date()) {
  const year = now.getFullYear()
  const month = now.toLocaleString('en-US', { month: 'long', timeZone: 'Asia/Kolkata' })
  return {
    year,
    month,
    /** "September 2026" */
    monthYear: `${month} ${year}`,
  }
}
