import { PDFDocument } from 'pdf-lib';
import { readFileAsArrayBuffer } from '../utils/format';
import type { UploadedFileItem } from '../types';

export interface ImageToPdfOptions {
  pageSize: 'a4' | 'fit' | 'letter';
  orientation: 'portrait' | 'landscape' | 'auto';
  margin: number;
}

const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612.0, height: 792.0 },
};

export async function convertImagesToPdf(
  items: UploadedFileItem[],
  options: ImageToPdfOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  if (items.length === 0) {
    throw new Error('Pilih minimal 1 gambar');
  }

  const pdfDoc = await PDFDocument.create();
  const total = items.length;

  for (let i = 0; i < total; i++) {
    onProgress?.(i + 1, total);
    const item = items[i];
    const file = item.file;
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    const isJpg = file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');

    let embeddedImage;
    if (isPng) {
      const buffer = await readFileAsArrayBuffer(file);
      embeddedImage = await pdfDoc.embedPng(buffer);
    } else if (isJpg) {
      const buffer = await readFileAsArrayBuffer(file);
      embeddedImage = await pdfDoc.embedJpg(buffer);
    } else {
      // Format lain seperti WEBP -> render ke canvas jadi PNG
      const pngBuffer = await convertBlobToPngBuffer(file);
      embeddedImage = await pdfDoc.embedPng(pngBuffer);
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let targetWidth: number;
    let targetHeight: number;

    if (options.pageSize === 'fit') {
      targetWidth = imgWidth + options.margin * 2;
      targetHeight = imgHeight + options.margin * 2;
    } else {
      const base = PAGE_SIZES[options.pageSize];
      let isLandscape = false;
      if (options.orientation === 'landscape') {
        isLandscape = true;
      } else if (options.orientation === 'auto') {
        isLandscape = imgWidth > imgHeight;
      }

      targetWidth = isLandscape ? base.height : base.width;
      targetHeight = isLandscape ? base.width : base.height;
    }

    const page = pdfDoc.addPage([targetWidth, targetHeight]);
    const availWidth = targetWidth - options.margin * 2;
    const availHeight = targetHeight - options.margin * 2;

    const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight, 1.0);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const x = options.margin + (availWidth - drawWidth) / 2;
    const y = options.margin + (availHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

function convertBlobToPngBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas 2D unavailable'));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Failed to create blob'));
        blob.arrayBuffer().then(resolve).catch(reject);
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = URL.createObjectURL(file);
  });
}
