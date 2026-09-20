/**
 * Client-side contact-form rate-limit guard.
 *
 * Tracks submissions in localStorage (per browser) as a fast first-line check so the user gets
 * immediate feedback without a network round-trip. The backend's per-IP Redis limiter (5 per
 * 15 min) is the authoritative enforcement layer — this just avoids a wasted request/Turnstile
 * solve.
 *
 * Limit: 5 submissions per UTC calendar day per browser.
 * Storage key: "rf_contact_limit" -> { date: "YYYY-MM-DD", count: number }
 */

const STORAGE_KEY = 'rf_contact_limit'
const MAX_PER_DAY = 5

function todayUTC() {
  return new Date().toISOString().slice(0, 10)
}

function readRecord(): { date: string; count: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: todayUTC(), count: 0 }
    const record = JSON.parse(raw)
    if (record.date !== todayUTC()) return { date: todayUTC(), count: 0 }
    return record
  } catch {
    return { date: todayUTC(), count: 0 }
  }
}

function writeRecord(record: { date: string; count: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Fail silently — backend limiter is the source of truth
  }
}

export function checkContactFormLimit(): { allowed: boolean; message?: string } {
  const record = readRecord()
  if (record.count >= MAX_PER_DAY) {
    return {
      allowed: false,
      message: `You've reached the limit of ${MAX_PER_DAY} messages per day from this device. Please try again tomorrow, or email us directly at hello@riseflake.com.`,
    }
  }
  return { allowed: true }
}

export function incrementContactFormCount() {
  const record = readRecord()
  writeRecord({ date: todayUTC(), count: record.count + 1 })
}
