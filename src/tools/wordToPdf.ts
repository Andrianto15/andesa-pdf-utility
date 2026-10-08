import { PDFDocument } from 'pdf-lib';
import { renderAsync } from 'docx-preview';
import html2canvas from 'html2canvas';
import { readFileAsArrayBuffer } from '../utils/format';
import { getBackendUrl } from '../utils/config';

export interface PageSlice {
  startY: number;
  height: number;
}

export interface WordToPdfOptions {
  preferServer?: boolean;
  backendUrl?: string;
}

export interface BackendHealthResponse {
  available: boolean;
  engine: string;
}

export function calculatePageSlices(totalHeight: number, pageHeight: number): PageSlice[] {
  if (totalHeight <= 0 || pageHeight <= 0) {
    return [{ startY: 0, height: 0 }];
  }

  if (totalHeight <= pageHeight * 1.05) {
    return [{ startY: 0, height: totalHeight }];
  }

  const slices: PageSlice[] = [];
  let currentY = 0;
  while (currentY < totalHeight) {
    const remaining = totalHeight - currentY;
    const sliceHeight = Math.min(pageHeight, remaining);
    slices.push({ startY: currentY, height: sliceHeight });
    currentY += sliceHeight;
  }

  return slices;
}

export async function checkBackendHealth(
  backendUrl?: string
): Promise<BackendHealthResponse> {
  const targetUrl = getBackendUrl(backendUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);
  if (typeof (timeoutId as unknown as { unref?: () => void }).unref === 'function') {
    (timeoutId as unknown as { unref: () => void }).unref();
  }

  try {
    const res = await fetch(`${targetUrl}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!res.ok) {
      return { available: false, engine: 'unavailable' };
    }

    const data = await res.json();
    return {
      available: data.status === 'ok' && data.engine === 'libreoffice',
      engine: data.engine || 'unavailable',
    };
  } catch {
    return { available: false, engine: 'unavailable' };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function convertWordToPdfViaServer(
  file: File,
  backendUrl?: string,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const targetUrl = getBackendUrl(backendUrl);
  onProgress?.(1, 3);
  const formData = new FormData();
  formData.append('file', file);

  onProgress?.(2, 3);
  const response = await fetch(`${targetUrl}/api/convert/word-to-pdf`, {
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

export async function convertWordToPdfClient(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const buffer = await readFileAsArrayBuffer(file);
  onProgress?.(1, 4);

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  wrapper.style.width = '1000px';
  wrapper.style.height = '1000px';
  wrapper.style.overflow = 'hidden';
  wrapper.style.opacity = '0';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.zIndex = '-99999';

  const container = document.createElement('div');
  container.style.width = '794px';
  container.style.background = '#ffffff';
  container.style.color = '#000000';
  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  try {
    await renderAsync(buffer, container, undefined, {
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: false,
      useBase64URL: true,
    });

    onProgress?.(2, 4);

    const sections = container.querySelectorAll('section.docx, article');
    const elementsToProcess: HTMLElement[] =
      sections.length > 0 ? (Array.from(sections) as HTMLElement[]) : [container];

    const pdfDoc = await PDFDocument.create();
    const a4Width = 595.28;
    const a4Height = 841.89;
    const a4Ratio = a4Height / a4Width;

    for (let i = 0; i < elementsToProcess.length; i++) {
      const sectionEl = elementsToProcess[i];
      const canvas = await html2canvas(sectionEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const targetPageHeight = Math.round(canvasWidth * a4Ratio);

      const slices = calculatePageSlices(canvasHeight, targetPageHeight);

      for (const slice of slices) {
        if (slice.height <= 0) continue;

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvasWidth;
        sliceCanvas.height = targetPageHeight;

        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            slice.startY,
            canvasWidth,
            slice.height,
            0,
            0,
            canvasWidth,
            slice.height
          );
        }

        const dataUrl = sliceCanvas.toDataURL('image/jpeg', 0.95);
        const image = await pdfDoc.embedJpg(dataUrl);
        const pdfPage = pdfDoc.addPage([a4Width, a4Height]);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: a4Width,
          height: a4Height,
        });
      }

      onProgress?.(2 + Math.round(((i + 1) / elementsToProcess.length) * 1), 4);
    }

    onProgress?.(4, 4);
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  } finally {
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}

export async function convertWordToPdf(
  file: File,
  onProgress?: (current: number, total: number) => void,
  options?: WordToPdfOptions
): Promise<Blob> {
  const backendUrl = getBackendUrl(options?.backendUrl);
  const preferServer = options?.preferServer !== false;

  if (preferServer) {
    try {
      const health = await checkBackendHealth(backendUrl);
      if (health.available) {
        return await convertWordToPdfViaServer(file, backendUrl, onProgress);
      }
    } catch {
      // Fallback to client converter
    }
  }

  return await convertWordToPdfClient(file, onProgress);
}
