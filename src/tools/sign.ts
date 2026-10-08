import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer } from '../utils/format';

export interface SignaturePlacement {
  pageIndex: number; // 0-based
  normX: number; // 0 to 1 relative to page width
  normY: number; // 0 to 1 relative to page height from top
  normWidth: number; // 0 to 1
  normHeight: number; // 0 to 1
  signatureDataUrl: string; // PNG Data URL
}

export async function applySignatureToPdf(
  file: File,
  placements: SignaturePlacement[]
): Promise<Blob> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  for (const placement of placements) {
    const page = pdfDoc.getPage(placement.pageIndex);
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    // Decode base64 PNG data URL
    const base64Data = placement.signatureDataUrl.split(',')[1];
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const pngImage = await pdfDoc.embedPng(imageBytes);

    const pdfW = placement.normWidth * pageWidth;
    const pdfH = placement.normHeight * pageHeight;
    const pdfX = placement.normX * pageWidth;
    // PDF origin (0,0) is at bottom-left, web is top-left
    const pdfY = pageHeight - (placement.normY * pageHeight + pdfH);

    page.drawImage(pngImage, {
      x: pdfX,
      y: Math.max(0, pdfY),
      width: pdfW,
      height: pdfH,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
