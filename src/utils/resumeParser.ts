// Fully client-side resume parsing — no network calls.
// A PDF/DOCX file dropped by the user is read and scanned entirely in the
// browser to pull out a best-guess name, email and mobile number.

export type ParsedContact = {
  name: string | null
  email: string | null
  mobile: string | null
}

type Line = {
  text: string
  /** Approximate font size in points — used to spot the name (usually the biggest text up top). */
  fontSize: number
  bold: boolean
}

export const RESUME_MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const RESUME_ACCEPTED_EXTENSIONS = ['.pdf', '.docx']

export class ResumeParseError extends Error {
  code: 'UNSUPPORTED_FORMAT' | 'FILE_TOO_LARGE' | 'EMPTY_FILE' | 'PARSE_FAILED' | 'NO_CONTACT_FOUND'
  constructor(code: ResumeParseError['code'], message: string) {
    super(message)
    this.code = code
    this.name = 'ResumeParseError'
  }
}

export function isAcceptedResumeFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return RESUME_ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))
}

// ─── PDF text extraction (pdfjs-dist, worker served locally so it works offline) ───
async function extractLinesFromPdf(file: File): Promise<Line[]> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const buffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: buffer }).promise

  // Contact details always live on page 1 (occasionally page 2) — cap pages for speed.
  const maxPages = Math.min(pdf.numPages, 3)
  const lines: Line[] = []
  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const styles = (content.styles ?? {}) as Record<string, { fontFamily?: string }>
    lines.push(...groupTextItemsIntoLines(content.items as PdfTextItem[], styles))
  }
  return lines
}

type PdfTextItem = { str?: string; transform?: number[]; fontName?: string }

function groupTextItemsIntoLines(items: PdfTextItem[], styles: Record<string, { fontFamily?: string }>): Line[] {
  const rows: { y: number; parts: string[]; maxSize: number; bold: boolean }[] = []
  for (const item of items) {
    const str = item.str
    if (!str || !str.trim() || !item.transform) continue
    const y = Math.round(item.transform[5])
    // Font size ≈ magnitude of the glyph-space x basis vector after transform.
    const size = Math.hypot(item.transform[0], item.transform[1]) || 0
    const family = item.fontName ? styles[item.fontName]?.fontFamily ?? '' : ''
    const isBold = /bold|black|heavy/i.test(family)

    let row = rows.find((r) => Math.abs(r.y - y) < 3)
    if (!row) {
      row = { y, parts: [], maxSize: 0, bold: false }
      rows.push(row)
    }
    row.parts.push(str)
    row.maxSize = Math.max(row.maxSize, size)
    row.bold = row.bold || isBold
  }
  // pdf.js reports the y-axis bottom-up, so higher y = higher on the page.
  rows.sort((a, b) => b.y - a.y)
  return rows
    .map((r) => ({ text: r.parts.join(' ').replace(/\s+/g, ' ').trim(), fontSize: r.maxSize, bold: r.bold }))
    .filter((l) => l.text.length > 0)
}

// ─── DOCX text extraction (docx = a zip of XML; unzip client-side with jszip) ───
async function extractLinesFromDocx(file: File): Promise<Line[]> {
  const { default: JSZip } = await import('jszip')
  const buffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(buffer)
  const docXml = await zip.file('word/document.xml')?.async('text')
  if (!docXml) throw new ResumeParseError('PARSE_FAILED', 'Could not read this document.')
  return docxXmlToLines(docXml)
}

const DEFAULT_DOCX_FONT_SIZE_PT = 11

function docxXmlToLines(xml: string): Line[] {
  const lines: Line[] = []
  const paraRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g
  let paraMatch: RegExpExecArray | null
  while ((paraMatch = paraRegex.exec(xml))) {
    const paraXml = paraMatch[1]
    let text = ''
    let maxSize = DEFAULT_DOCX_FONT_SIZE_PT
    let bold = false

    const runRegex = /<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g
    let runMatch: RegExpExecArray | null
    let sawRun = false
    while ((runMatch = runRegex.exec(paraXml))) {
      sawRun = true
      const runXml = runMatch[1]
      const tRegex = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g
      let tMatch: RegExpExecArray | null
      while ((tMatch = tRegex.exec(runXml))) {
        text += decodeXmlEntities(tMatch[1])
      }
      if (/<w:tab\/>/.test(runXml)) text += '\t'
      if (/<w:br\s*\/>/.test(runXml)) text += '\n'

      const szMatch = runXml.match(/<w:sz\s+w:val="(\d+)"/)
      if (szMatch) maxSize = Math.max(maxSize, parseInt(szMatch[1], 10) / 2)

      const boldMatch = runXml.match(/<w:b(?:\s+w:val="([^"]*)")?\s*\/>/)
      if (boldMatch && boldMatch[1] !== '0' && boldMatch[1]?.toLowerCase() !== 'false') bold = true
    }

    if (!sawRun) continue
    text = text.trim()
    if (text) lines.push({ text, fontSize: maxSize, bold })
  }
  return lines
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

// ─── Contact info heuristics ───
const EMAIL_REGEX = /[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/

function findEmail(text: string): string | null {
  const match = text.match(EMAIL_REGEX)
  return match ? match[0].toLowerCase() : null
}

function findMobile(text: string): string | null {
  const candidates = text.match(/(\+?\d[\d\s-]{8,14}\d)/g) || []

  // Prefer a clean 10-digit Indian mobile number (optionally with a +91/0 prefix).
  for (const raw of candidates) {
    let digits = raw.replace(/\D/g, '')
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
    if (digits.length === 10 && /^[6-9]/.test(digits)) return digits
  }

  // Fall back to any other plausible phone-length digit run.
  for (const raw of candidates) {
    const digits = raw.replace(/\D/g, '')
    if (digits.length >= 10 && digits.length <= 13) return digits
  }
  return null
}

/**
 * Contact info (and the name in particular) is always near the top of a resume,
 * so we search that block first and only fall back to the full document if the
 * header block didn't contain a match — this keeps us from grabbing a stray
 * phone-shaped number or email from an "Experience" or "References" section.
 */
function extractField(lines: Line[], finder: (text: string) => string | null, headerLineCount = 12): string | null {
  const headerText = lines.slice(0, headerLineCount).map((l) => l.text).join('\n')
  const fromHeader = finder(headerText)
  if (fromHeader) return fromHeader
  return finder(lines.map((l) => l.text).join('\n'))
}

const NAME_STOPWORDS = [
  'resume', 'curriculum', 'vitae', 'contact', 'email', 'phone', 'mobile', 'address',
  'objective', 'summary', 'profile', 'about', 'linkedin', 'github', 'portfolio',
  'skills', 'education', 'experience', 'projects', 'certifications', 'certificate',
  'declaration', 'reference', 'hobbies', 'interests', 'languages', 'strengths',
  'achievements', 'awards', 'qualification', 'training', 'publications',
  'personal details', 'career', 'employment', 'academic', 'www', 'http',
]

const NAME_WORD_RE = /^[A-Za-z][A-Za-z.'-]*$/

function looksLikeNameLine(line: string, email: string | null): boolean {
  if (!line) return false
  const lower = line.toLowerCase()
  if (email && lower.includes(email.toLowerCase())) return false
  if (/[@\d]/.test(line)) return false
  if (line.length < 3 || line.length > 45) return false
  if (NAME_STOPWORDS.some((w) => lower.includes(w))) return false

  const words = line.split(/\s+/).filter(Boolean)
  if (words.length < 1 || words.length > 5) return false
  if (!words.every((w) => NAME_WORD_RE.test(w))) return false

  const capitalized = words.filter((w) => /^[A-Z]/.test(w) || w === w.toUpperCase())
  return capitalized.length / words.length >= 0.6
}

function toTitleCase(line: string): string {
  return line
    .split(/\s+/)
    .map((w) => (w === w.toUpperCase() && w.length > 1 ? w[0] + w.slice(1).toLowerCase() : w))
    .join(' ')
}

/**
 * Scores each candidate line in the resume header and picks the best one, combining:
 *  - font size (the name is almost always the biggest text on the page)
 *  - boldness (names are commonly bolded)
 *  - position (closer to the very top of the document wins)
 *  - word-count fit (a 2–3 word title-case line looks the most like "First Last")
 * This beats "first line that looks like a name" because job titles, taglines
 * and section headers can also pattern-match a bare word-shape check.
 */
function extractName(lines: Line[], email: string | null): string | null {
  const window = lines.slice(0, 20)
  const maxFontSize = Math.max(1, ...window.map((l) => l.fontSize))

  let bestLine: Line | null = null
  let bestScore = -Infinity
  for (let index = 0; index < window.length; index++) {
    const line = window[index]
    if (!looksLikeNameLine(line.text, email)) continue

    const words = line.text.split(/\s+/).filter(Boolean)
    const wordCountScore = words.length === 2 || words.length === 3 ? 2 : words.length === 1 ? 0.5 : 1

    const score =
      (line.fontSize / maxFontSize) * 5 +
      Math.max(0, 5 - index) +
      (line.bold ? 1.5 : 0) +
      wordCountScore

    if (score > bestScore) {
      bestScore = score
      bestLine = line
    }
  }

  return bestLine ? toTitleCase(bestLine.text) : null
}

export async function parseResumeFile(file: File): Promise<ParsedContact> {
  if (!isAcceptedResumeFile(file)) {
    throw new ResumeParseError('UNSUPPORTED_FORMAT', 'Please upload a PDF or DOCX file.')
  }
  if (file.size > RESUME_MAX_FILE_SIZE) {
    throw new ResumeParseError('FILE_TOO_LARGE', 'File is larger than 5MB.')
  }
  if (file.size === 0) {
    throw new ResumeParseError('EMPTY_FILE', 'This file looks empty.')
  }

  const name = file.name.toLowerCase()
  let lines: Line[]
  try {
    lines = name.endsWith('.pdf') ? await extractLinesFromPdf(file) : await extractLinesFromDocx(file)
  } catch (err) {
    if (err instanceof ResumeParseError) throw err
    throw new ResumeParseError('PARSE_FAILED', "We couldn't read this file. Try a different PDF/DOCX export of your resume.")
  }

  const email = extractField(lines, findEmail)
  const mobile = extractField(lines, findMobile)
  const extractedName = extractName(lines, email)

  if (!email && !mobile && !extractedName) {
    throw new ResumeParseError('NO_CONTACT_FOUND', 'ATS unable to scan contact information from this resume.')
  }

  return { name: extractedName, email, mobile }
}
