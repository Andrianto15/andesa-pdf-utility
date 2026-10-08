import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { renderAsync } from 'docx-preview';
import { readFileAsArrayBuffer } from '../utils/format';

export async function convertWordToPdf(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const buffer = await readFileAsArrayBuffer(file);
  onProgress?.(1, 3);

  // Buat offscreen container sementara untuk rendering docx-preview
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '794px'; // ~A4 width @96dpi
  container.style.background = '#ffffff';
  container.style.color = '#000000';
  document.body.appendChild(container);

  try {
    await renderAsync(buffer, container, undefined, {
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
    });

    onProgress?.(2, 3);

    // Ekstrak teks dan struktur halaman dari elemen yang dirender
    const sections = container.querySelectorAll('section.docx, article');
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const elementsToProcess = sections.length > 0 ? Array.from(sections) : [container];

    for (let sIdx = 0; sIdx < elementsToProcess.length; sIdx++) {
      const sec = elementsToProcess[sIdx] as HTMLElement;
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { width, height } = page.getSize();

      const margin = 50;
      let currentY = height - margin;

      // Ambil semua elemen teks/paragraf
      const paragraphs = sec.querySelectorAll('p, h1, h2, h3, h4, li');
      const textNodes = paragraphs.length > 0 ? Array.from(paragraphs) : [sec];

      for (const el of textNodes) {
        const text = (el.textContent || '').trim();
        if (!text) continue;

        const tagName = el.tagName.toLowerCase();
        const isHeader = tagName.startsWith('h');
        const activeFont = isHeader ? fontBold : font;
        const fontSize = isHeader ? (tagName === 'h1' ? 18 : 14) : 10;
        const lineHeight = fontSize * 1.35;

        // Bungkus baris teks jika melebihi lebar halaman
        const maxWidth = width - margin * 2;
        const words = text.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = activeFont.widthOfTextAtSize(testLine, fontSize);

          if (textWidth > maxWidth && currentLine) {
            if (currentY - lineHeight < margin) {
              // Halaman baru jika melebihi batas bawah
              const newPage = pdfDoc.addPage([width, height]);
              currentY = height - margin;
              newPage.drawText(currentLine, {
                x: margin,
                y: currentY,
                size: fontSize,
                font: activeFont,
                color: rgb(0.1, 0.1, 0.1),
              });
            } else {
              page.drawText(currentLine, {
                x: margin,
                y: currentY,
                size: fontSize,
                font: activeFont,
                color: rgb(0.1, 0.1, 0.1),
              });
            }
            currentY -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          if (currentY - lineHeight >= margin) {
            page.drawText(currentLine, {
              x: margin,
              y: currentY,
              size: fontSize,
              font: activeFont,
              color: rgb(0.1, 0.1, 0.1),
            });
            currentY -= lineHeight + (isHeader ? 6 : 4);
          }
        }
      }
    }

    onProgress?.(3, 3);
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } finally {
    document.body.removeChild(container);
  }
}
