import * as pdfjsLib from 'pdfjs-dist';

// Gunakan CDN worker yang stabil dan cocok persis dengan versi pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function loadPdf(data: ArrayBuffer | Uint8Array) {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(data),
    cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
  });
  return await loadingTask.promise;
}

export async function renderPageToCanvas(
  pdfDoc: any,
  pageNumber: number,
  scale = 1.0
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  if (!context) throw new Error('Failed to get 2d context');

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  return { canvas, width: viewport.width, height: viewport.height };
}

export async function renderPageThumbnail(
  pdfDoc: any,
  pageNumber: number,
  targetWidth = 200
): Promise<string> {
  const page = await pdfDoc.getPage(pageNumber);
  const unscaledViewport = page.getViewport({ scale: 1.0 });
  const scale = targetWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  if (!context) throw new Error('Canvas context unavailable');

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  return canvas.toDataURL('image/jpeg', 0.8);
}
