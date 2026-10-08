import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer } from '../utils/format';
import type { UploadedFileItem } from '../types';

export async function mergePdfs(
  items: UploadedFileItem[],
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  if (items.length < 2) {
    throw new Error('Minimal butuh 2 file PDF untuk digabungkan');
  }

  const mergedDoc = await PDFDocument.create();
  const total = items.length;

  for (let i = 0; i < total; i++) {
    onProgress?.(i + 1, total);
    const item = items[i];
    const buffer = await readFileAsArrayBuffer(item.file);
    const donorDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedDoc.copyPages(donorDoc, donorDoc.getPageIndices());

    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }
  }

  const pdfBytes = await mergedDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
