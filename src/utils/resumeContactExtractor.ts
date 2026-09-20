// Client-side, on-device resume text extraction + contact-field heuristics for
// the homepage "Drop your CV" widget. The file itself never leaves the browser —
// only the three extracted fields below are ever sent anywhere (see DropCvSection).

export type ExtractedContact = {
  fullName: string;
  email: string;
  mobileNo: string;
};

const SUPPORTED_EXTENSIONS = ['.pdf', '.docx'];

export function isSupportedResumeFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return extractTextFromPdf(file);
  if (name.endsWith('.docx')) return extractTextFromDocx(file);
  throw new Error('Please upload a PDF or DOCX file.');
}

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  // Contact details always sit on page 1 (occasionally spill to page 2) —
  // capping pages keeps parsing fast on long resumes.
  const pageCount = Math.min(pdf.numPages, 3);
  const lines: string[] = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    let lastY: number | null = null;
    let currentLine = '';

    for (const item of content.items as Array<{ str: string; transform: number[] }>) {
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        if (currentLine.trim()) lines.push(currentLine.trim());
        currentLine = item.str;
      } else {
        currentLine += (currentLine ? ' ' : '') + item.str;
      }
      lastY = y;
    }
    if (currentLine.trim()) lines.push(currentLine.trim());
  }

  return lines.join('\n');
}

async function extractTextFromDocx(file: File): Promise<string> {
  const JSZip = (await import('jszip')).default;
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const documentXml = await zip.file('word/document.xml')?.async('text');
  if (!documentXml) {
    throw new Error("Couldn't read that .docx file — it may be corrupted.");
  }

  const withLineBreaks = documentXml.replace(/<\/w:p>/g, '\n');
  const withoutTags = withLineBreaks.replace(/<[^>]+>/g, '');
  const decoded = withoutTags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

  return decoded
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// Indian mobile numbers: 10 digits starting 6-9, optionally prefixed with +91/91.
// Resumes often break the 10 digits with a space or hyphen (e.g. "98765 43210"),
// so each digit after the first may have one separator before it.
const MOBILE_REGEX = /(?:\+?91[-\s]?)?[6-9](?:[-\s]?\d){9}/;

const NAME_LINE_BLOCKLIST =
  /resume|curriculum vitae|\bcv\b|profile|objective|summary|contact|address|linkedin|github|portfolio|email|phone|mobile/i;

export function extractContactFromText(text: string): ExtractedContact {
  const emailMatch = text.match(EMAIL_REGEX);
  const email = emailMatch ? emailMatch[0].toLowerCase() : '';

  const mobileMatch = text.match(MOBILE_REGEX);
  let mobileNo = '';
  if (mobileMatch) {
    let digits = mobileMatch[0].replace(/[-\s+]/g, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    mobileNo = digits;
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let fullName = '';
  for (const line of lines.slice(0, 8)) {
    if (line.includes('@')) continue;
    if (/\d{4,}/.test(line)) continue;
    if (NAME_LINE_BLOCKLIST.test(line)) continue;
    if (line.length > 45) continue;

    const words = line.split(/\s+/).filter(Boolean);
    if (words.length < 1 || words.length > 5) continue;

    const alphaRatio = (line.match(/[a-zA-Z\s.]/g) || []).length / line.length;
    if (alphaRatio < 0.85) continue;

    fullName = line;
    break;
  }

  return { fullName, email, mobileNo };
}
