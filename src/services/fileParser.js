import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();
} catch (e) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

/**
 * Clean and normalize raw extracted text from PDF/DOCX
 */
export function cleanExtractedText(text) {
  if (!text) return '';
  return text
    // Replace multiple spaces with a single space
    .replace(/[ \t]+/g, ' ')
    // Replace more than 2 consecutive newlines with 2
    .replace(/\n{3,}/g, '\n\n')
    // Remove null bytes or non-printable characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Extract plain text from PDF file (Client-side, 100% private)
 */
export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by line position roughly
    let lastY;
    let text = '';
    for (const item of textContent.items) {
      if (lastY === undefined || Math.abs(item.transform[5] - lastY) > 5) {
        text += '\n' + item.str;
      } else {
        text += (text.endsWith(' ') || item.str.startsWith(' ') ? '' : ' ') + item.str;
      }
      lastY = item.transform[5];
    }

    fullText += (fullText ? '\n\n' : '') + text.trim();
  }

  return cleanExtractedText(fullText);
}

/**
 * Extract plain text from Word .docx file (Client-side, 100% private)
 */
export async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return cleanExtractedText(result.value);
}

/**
 * Fallback reader for legacy .doc or plain text
 */
export async function extractTextFromDocOrTxt(file) {
  const text = await file.text();
  // Filter readable printable characters for legacy .doc files
  const printable = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
  return cleanExtractedText(printable);
}

/**
 * Master parser: detects file type and extracts resume text
 */
export async function parseResumeFile(file) {
  if (!file) throw new Error('No file provided');

  const fileName = file.name.toLowerCase();
  let extractedText = '';

  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    extractedText = await extractTextFromPdf(file);
  } else if (
    fileName.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    extractedText = await extractTextFromDocx(file);
  } else if (fileName.endsWith('.doc') || file.type === 'application/msword') {
    try {
      extractedText = await extractTextFromDocx(file);
    } catch {
      extractedText = await extractTextFromDocOrTxt(file);
    }
  } else if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.rtf')) {
    extractedText = await file.text();
  } else {
    // Try generic text reader
    extractedText = await file.text();
  }

  if (!extractedText || extractedText.length < 20) {
    throw new Error(
      'Could not extract text from this document. The file might be an image scan or password-protected. Please upload a text-based PDF or Word document.'
    );
  }

  return cleanExtractedText(extractedText);
}
