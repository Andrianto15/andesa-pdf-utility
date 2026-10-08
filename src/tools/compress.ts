import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer } from '../utils/format';
import { loadPdf, renderPageToCanvas } from '../utils/pdf';

export type CompressionLevel = 'extreme' | 'recommended' | 'light';

export interface CompressOptions {
  level: CompressionLevel;
}

const COMPRESSION_CONFIGS: Record<CompressionLevel, { scale: number; quality: number; label: string }> = {
  extreme: { scale: 1.0, quality: 0.45, label: 'Ekstrem (Ukuran Terkecil)' },
  recommended: { scale: 1.3, quality: 0.68, label: 'Rekomendasi (Kualitas Baik)' },
  light: { scale: 1.6, quality: 0.85, label: 'Ringan (Kualitas Tertinggi)' },
};

export async function compressPdf(
  file: File,
  options: CompressOptions,
  onProgress?: (current: number, total: number) => void
): Promise<{ blob: Blob; originalSize: number; newSize: number; savingsPercent: number }> {
  const originalSize = file.size;
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await loadPdf(buffer);
  const numPages = pdfDoc.numPages;

  const config = COMPRESSION_CONFIGS[options.level];
  const newPdfDoc = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    onProgress?.(i, numPages);
    const { canvas } = await renderPageToCanvas(pdfDoc, i, config.scale);

    // Dapatkan JPEG blob terkompresi dari canvas
    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Gagal kompresi halaman canvas'));
        },
        'image/jpeg',
        config.quality
      );
    });

    const jpegBuffer = await jpegBlob.arrayBuffer();
    const embeddedJpg = await newPdfDoc.embedJpg(jpegBuffer);

    // Kembalikan ke rasio ukuran asli halaman dalam PDF poin (1 pt = 1/72 inch)
    const originalPage = await pdfDoc.getPage(i);
    const originalViewport = originalPage.getViewport({ scale: 1.0 });

    const page = newPdfDoc.addPage([originalViewport.width, originalViewport.height]);
    page.drawImage(embeddedJpg, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });
  }

  const pdfBytes = await newPdfDoc.save();
  const newSize = pdfBytes.byteLength;
  const savingsPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  return {
    blob: new Blob([pdfBytes as any], { type: 'application/pdf' }),
    originalSize,
    newSize,
    savingsPercent,
  };
}
