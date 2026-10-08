import { readFileAsArrayBuffer } from '../utils/format';
import { loadPdf } from '../utils/pdf';

export async function convertPdfToMarkdown(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<{ markdown: string; pageCount: number; wordCount: number }> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await loadPdf(buffer);
  const numPages = pdfDoc.numPages;

  let fullMarkdown = `# ${file.name.replace(/\.[^/.]+$/, '')}\n\n`;

  for (let i = 1; i <= numPages; i++) {
    onProgress?.(i, numPages);
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items as Array<any>;

    if (items.length === 0) continue;

    // Hitung rata-rata ukuran font untuk deteksi heading
    const heights = items.map((it) => Math.abs(it.transform[0] || it.height || 12));
    const avgHeight = heights.reduce((a, b) => a + b, 0) / (heights.length || 1);

    fullMarkdown += `\n---\n\n### Halaman ${i}\n\n`;

    let lastY: number | null = null;
    let currentLine = '';

    for (const item of items) {
      if (!('str' in item)) continue;
      const str = item.str;
      if (!str.trim()) continue;

      const y = item.transform[5];
      const itemHeight = Math.abs(item.transform[0] || item.height || avgHeight);

      if (lastY !== null && Math.abs(y - lastY) > itemHeight * 0.8) {
        // Baris baru
        fullMarkdown += formatLine(currentLine, avgHeight) + '\n\n';
        currentLine = '';
      }

      currentLine += (currentLine ? ' ' : '') + str;
      lastY = y;
    }

    if (currentLine) {
      fullMarkdown += formatLine(currentLine, avgHeight) + '\n\n';
    }
  }

  const words = fullMarkdown.trim().split(/\s+/).filter(Boolean).length;
  return {
    markdown: fullMarkdown.trim(),
    pageCount: numPages,
    wordCount: words,
  };
}

function formatLine(text: string, _avgHeight: number): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  // Bersihkan karakter aneh
  return trimmed;
}
