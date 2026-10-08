import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { readFileAsArrayBuffer } from '../utils/format';

export async function splitPdf(
  file: File,
  pageIndices: number[], // 0-based
  mode: 'single' | 'zip' = 'single',
  onProgress?: (current: number, total: number) => void
): Promise<{ blob: Blob; filename: string }> {
  if (pageIndices.length === 0) {
    throw new Error('Pilih minimal 1 halaman untuk diekstrak');
  }

  const buffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  if (mode === 'single') {
    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => newDoc.addPage(page));
    const pdfBytes = await newDoc.save();
    return {
      blob: new Blob([pdfBytes as any], { type: 'application/pdf' }),
      filename: `${baseName}-extracted.pdf`,
    };
  } else {
    // Mode zip: tiap halaman jadi 1 file PDF
    const zip = new JSZip();
    const total = pageIndices.length;

    for (let i = 0; i < total; i++) {
      onProgress?.(i + 1, total);
      const pageIdx = pageIndices[i];
      const singlePageDoc = await PDFDocument.create();
      const [copiedPage] = await singlePageDoc.copyPages(srcDoc, [pageIdx]);
      singlePageDoc.addPage(copiedPage);
      const bytes = await singlePageDoc.save();
      zip.file(`${baseName}-page-${pageIdx + 1}.pdf`, bytes);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return {
      blob: zipBlob,
      filename: `${baseName}-split-pages.zip`,
    };
  }
}

export function parsePageRangeString(rangeStr: string, maxPages: number): number[] {
  const parts = rangeStr.split(',').map((s) => s.trim()).filter(Boolean);
  const selected = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(maxPages, Math.max(start, end));
        for (let p = from; p <= to; p++) {
          selected.add(p - 1); // 0-based
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        selected.add(page - 1);
      }
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}
