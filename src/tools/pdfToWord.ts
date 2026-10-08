import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { readFileAsArrayBuffer } from '../utils/format';
import { loadPdf } from '../utils/pdf';
import { checkBackendHealth } from './wordToPdf';

export interface PdfToWordOptions {
  preferServer?: boolean;
  backendUrl?: string;
}

export async function convertPdfToWordViaServer(
  file: File,
  backendUrl = 'http://localhost:3001',
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  onProgress?.(1, 3);
  const formData = new FormData();
  formData.append('file', file);

  onProgress?.(2, 3);
  const response = await fetch(`${backendUrl}/api/convert/pdf-to-word`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMsg);
  }

  onProgress?.(3, 3);
  return await response.blob();
}

export async function convertPdfToWordClient(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await loadPdf(buffer);
  const numPages = pdfDoc.numPages;

  const docChildren: Paragraph[] = [];

  for (let i = 1; i <= numPages; i++) {
    onProgress?.(i, numPages);
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items as Array<any>;

    if (items.length === 0) continue;

    if (i > 1) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `--- Halaman ${i} ---`,
              italics: true,
              color: '888888',
              size: 18,
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );
    }

    const heights = items.map((it) => Math.abs(it.transform[0] || it.height || 12));
    const avgHeight = heights.reduce((a, b) => a + b, 0) / (heights.length || 1);

    let lastY: number | null = null;
    let currentLine = '';
    let isCurrentHeader = false;

    for (const item of items) {
      if (!('str' in item)) continue;
      const str = item.str;
      if (!str.trim()) continue;

      const y = item.transform[5];
      const itemHeight = Math.abs(item.transform[0] || item.height || avgHeight);

      if (lastY !== null && Math.abs(y - lastY) > itemHeight * 0.8) {
        if (currentLine.trim()) {
          docChildren.push(createWordParagraph(currentLine.trim(), isCurrentHeader));
        }
        currentLine = '';
        isCurrentHeader = itemHeight > avgHeight * 1.35;
      }

      currentLine += (currentLine ? ' ' : '') + str;
      lastY = y;
    }

    if (currentLine.trim()) {
      docChildren.push(createWordParagraph(currentLine.trim(), isCurrentHeader));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren.length > 0 ? docChildren : [
          new Paragraph({
            children: [new TextRun({ text: 'Dokumen PDF tidak memiliki teks yang terbaca.' })],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

function createWordParagraph(text: string, isHeader: boolean): Paragraph {
  if (isHeader) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text,
          bold: true,
          size: 26,
        }),
      ],
      spacing: { before: 180, after: 80 },
    });
  }

  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
      }),
    ],
    spacing: { after: 100 },
  });
}

export async function convertPdfToWord(
  file: File,
  onProgress?: (current: number, total: number) => void,
  options?: PdfToWordOptions
): Promise<Blob> {
  const backendUrl =
    options?.backendUrl ||
    (typeof window !== 'undefined' && (window as unknown as { __ANDESA_BACKEND_URL__?: string }).__ANDESA_BACKEND_URL__) ||
    'http://localhost:3001';
  const preferServer = options?.preferServer !== false;

  if (preferServer) {
    try {
      const health = await checkBackendHealth(backendUrl);
      if (health.available) {
        return await convertPdfToWordViaServer(file, backendUrl, onProgress);
      }
    } catch {
      // Fallback to client converter
    }
  }

  return await convertPdfToWordClient(file, onProgress);
}
