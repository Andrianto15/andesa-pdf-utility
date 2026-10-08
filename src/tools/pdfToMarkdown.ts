import { readFileAsArrayBuffer } from '../utils/format';
import { loadPdf } from '../utils/pdf';

export interface PdfToMarkdownOptions {
  detectHeadings?: boolean;
  smartParagraphs?: boolean;
  includePageBreaks?: boolean;
}

export interface PdfToMarkdownResult {
  markdown: string;
  pageCount: number;
  wordCount: number;
  charCount: number;
}

interface PdfRawItem {
  str?: string;
  transform?: number[];
  width?: number;
  height?: number;
  fontName?: string;
}

interface TextSpan {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isMono: boolean;
}

interface TextLine {
  y: number;
  items: TextSpan[];
  text: string;
  avgFontSize: number;
  maxFontSize: number;
  isAllBold: boolean;
  isAllItalic: boolean;
  isMono: boolean;
}

interface FormattedBlock {
  type: 'heading' | 'list' | 'code' | 'paragraph';
  text: string;
  y: number;
  fontSize: number;
}

interface SimplePdfDoc {
  numPages: number;
  getPage: (pageNum: number) => Promise<{
    getTextContent: () => Promise<{
      items: unknown[];
      styles?: Record<string, { fontFamily?: string } | undefined>;
    }>;
  }>;
}

export async function convertPdfToMarkdown(
  file: File | ArrayBuffer | Uint8Array,
  onProgress?: (current: number, total: number) => void,
  options: PdfToMarkdownOptions = {},
  pdfLoader: (buffer: ArrayBuffer | Uint8Array) => Promise<SimplePdfDoc> = loadPdf as unknown as (
    b: ArrayBuffer | Uint8Array
  ) => Promise<SimplePdfDoc>
): Promise<PdfToMarkdownResult> {
  const {
    detectHeadings = true,
    smartParagraphs = true,
    includePageBreaks = true,
  } = options;

  const buffer =
    file instanceof Uint8Array || file instanceof ArrayBuffer
      ? file
      : await readFileAsArrayBuffer(file);

  const pdfDoc = await pdfLoader(buffer);
  const numPages = pdfDoc.numPages;

  let fullMarkdown = '';
  if (file instanceof File) {
    const docTitle = file.name.replace(/\.[^/.]+$/, '').trim();
    if (docTitle) {
      fullMarkdown = `# ${docTitle}\n\n`;
    }
  }

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress?.(pageNum, numPages);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const rawItems = (textContent.items || []) as PdfRawItem[];

    if (rawItems.length === 0) continue;

    const pageMarkdown = extractPageMarkdown(rawItems, textContent.styles, {
      detectHeadings,
      smartParagraphs,
    });

    if (!pageMarkdown.trim()) continue;

    if (pageNum > 1 && includePageBreaks && fullMarkdown.trim()) {
      fullMarkdown += '\n\n---\n\n';
    }

    fullMarkdown += pageMarkdown;
  }

  const trimmed = fullMarkdown.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  return {
    markdown: trimmed,
    pageCount: numPages,
    wordCount,
    charCount: trimmed.length,
  };
}

export function extractPageMarkdown(
  rawItems: PdfRawItem[],
  styles: Record<string, { fontFamily?: string } | undefined> = {},
  options: { detectHeadings?: boolean; smartParagraphs?: boolean } = {}
): string {
  const { detectHeadings = true, smartParagraphs = true } = options;

  const spans: TextSpan[] = [];
  for (const item of rawItems) {
    if (!item || typeof item.str !== 'string') continue;
    if (!item.str && item.str !== ' ') continue;

    const transform = Array.isArray(item.transform) ? item.transform : [1, 0, 0, 1, 0, 0];
    const fontSize = Math.hypot(transform[0] || 0, transform[1] || 0) || item.height || 12;
    const x = transform[4] || 0;
    const y = transform[5] || 0;
    const width = typeof item.width === 'number' ? item.width : item.str.length * fontSize * 0.5;
    const height = typeof item.height === 'number' ? item.height : fontSize;

    const fontName = item.fontName || '';
    const style = styles[fontName];
    const fontFamily = style?.fontFamily || '';
    const fontMeta = `${fontName} ${fontFamily}`.toLowerCase();

    const isBold = /bold|black|heavy|semibold|medium|demi/i.test(fontMeta);
    const isItalic = /italic|oblique/i.test(fontMeta);
    const isMono = /mono|courier|consolas|menlo|code/i.test(fontMeta);

    spans.push({
      str: item.str,
      x,
      y,
      width,
      height,
      fontSize,
      isBold,
      isItalic,
      isMono,
    });
  }

  if (spans.length === 0) return '';

  spans.sort((a, b) => b.y - a.y);

  const lines: Array<{ y: number; items: TextSpan[] }> = [];
  for (const span of spans) {
    const tolerance = Math.max(2.5, span.fontSize * 0.35);
    const line = lines.find((l) => Math.abs(l.y - span.y) <= tolerance);
    if (line) {
      line.items.push(span);
    } else {
      lines.push({ y: span.y, items: [span] });
    }
  }

  lines.sort((a, b) => b.y - a.y);

  const processedLines: TextLine[] = [];
  for (const line of lines) {
    line.items.sort((a, b) => a.x - b.x);

    let text = '';
    let prev: TextSpan | null = null;
    let totalFontSize = 0;
    let maxFontSize = 0;
    let boldWeight = 0;
    let italicWeight = 0;
    let monoWeight = 0;
    let charCount = 0;

    for (const span of line.items) {
      const s = span.str;
      if (!s) continue;

      if (prev) {
        const gap = span.x - (prev.x + prev.width);
        const prevEndsSpace = /\s$/.test(prev.str);
        const currStartsSpace = /^\s/.test(s);
        const isPunctuation = /^[,.:;!?)[\]{}]/.test(s);

        if (gap > span.fontSize * 0.18 && !prevEndsSpace && !currStartsSpace && !isPunctuation) {
          text += ' ';
        }
      }

      text += s;
      const len = s.trim().length;
      if (len > 0) {
        charCount += len;
        totalFontSize += span.fontSize * len;
        if (span.fontSize > maxFontSize) maxFontSize = span.fontSize;
        if (span.isBold) boldWeight += len;
        if (span.isItalic) italicWeight += len;
        if (span.isMono) monoWeight += len;
      }
      prev = span;
    }

    const trimmed = text.trim();
    if (!trimmed) continue;

    processedLines.push({
      y: line.y,
      items: line.items,
      text: trimmed,
      avgFontSize: charCount > 0 ? totalFontSize / charCount : 12,
      maxFontSize: maxFontSize || 12,
      isAllBold: charCount > 0 && boldWeight / charCount >= 0.7,
      isAllItalic: charCount > 0 && italicWeight / charCount >= 0.7,
      isMono: charCount > 0 && monoWeight / charCount >= 0.6,
    });
  }

  if (processedLines.length === 0) return '';

  const fontBuckets = new Map<number, number>();
  for (const line of processedLines) {
    const bucket = Math.round(line.avgFontSize);
    fontBuckets.set(bucket, (fontBuckets.get(bucket) || 0) + line.text.length);
  }

  let dominantSize = 12;
  let maxWeight = 0;
  for (const [size, weight] of fontBuckets.entries()) {
    if (weight > maxWeight) {
      maxWeight = weight;
      dominantSize = size;
    } else if (weight === maxWeight && size < dominantSize) {
      dominantSize = size;
    }
  }
  const bodyFontSize = dominantSize || 12;

  const blocks: FormattedBlock[] = [];
  for (const line of processedLines) {
    const bulletMatch = line.text.match(/^[-*+\u2022\u25cf\u25cb\u25aa\u25ab\u2013\u2014]\s*(.*)$/);
    if (bulletMatch) {
      blocks.push({
        type: 'list',
        text: `- ${bulletMatch[1].trim()}`,
        y: line.y,
        fontSize: line.avgFontSize,
      });
      continue;
    }

    const numberedMatch = line.text.match(/^(\d+[.)]|\([0-9a-zA-Z]\)|[a-zA-Z][.)])\s+(.*)$/);
    if (numberedMatch) {
      const numLabel = numberedMatch[1].replace(/\)$/, '.');
      blocks.push({
        type: 'list',
        text: `${numLabel} ${numberedMatch[2].trim()}`,
        y: line.y,
        fontSize: line.avgFontSize,
      });
      continue;
    }

    if (line.isMono) {
      blocks.push({
        type: 'code',
        text: line.text,
        y: line.y,
        fontSize: line.avgFontSize,
      });
      continue;
    }

    if (detectHeadings && line.text.length <= 140 && !/[,;]$/.test(line.text)) {
      if (line.maxFontSize >= bodyFontSize * 1.5) {
        blocks.push({
          type: 'heading',
          text: `# ${cleanHeading(line.text)}`,
          y: line.y,
          fontSize: line.maxFontSize,
        });
        continue;
      }
      if (line.maxFontSize >= bodyFontSize * 1.25) {
        blocks.push({
          type: 'heading',
          text: `## ${cleanHeading(line.text)}`,
          y: line.y,
          fontSize: line.maxFontSize,
        });
        continue;
      }
      if (
        (line.maxFontSize >= bodyFontSize * 1.1 || (line.isAllBold && line.text.length <= 80)) &&
        !/\.$/.test(line.text)
      ) {
        blocks.push({
          type: 'heading',
          text: `### ${cleanHeading(line.text)}`,
          y: line.y,
          fontSize: line.maxFontSize,
        });
        continue;
      }
    }

    let lineFormatted = line.text;
    if (line.isAllBold && !lineFormatted.startsWith('**')) {
      lineFormatted = `**${lineFormatted}**`;
    } else if (line.isAllItalic && !lineFormatted.startsWith('*')) {
      lineFormatted = `*${lineFormatted}*`;
    }

    blocks.push({
      type: 'paragraph',
      text: lineFormatted,
      y: line.y,
      fontSize: line.avgFontSize,
    });
  }

  let result = '';
  let prevBlock: FormattedBlock | null = null;
  let inCode = false;

  for (const block of blocks) {
    if (block.type === 'code') {
      if (!inCode) {
        result += (result ? '\n\n' : '') + '```\n';
        inCode = true;
      }
      result += block.text + '\n';
      prevBlock = block;
      continue;
    } else if (inCode) {
      result += '```\n\n';
      inCode = false;
    }

    if (block.type === 'heading') {
      result += (result ? '\n\n' : '') + block.text;
      prevBlock = block;
      continue;
    }

    if (block.type === 'list') {
      if (prevBlock?.type === 'list') {
        result += '\n' + block.text;
      } else {
        result += (result ? '\n\n' : '') + block.text;
      }
      prevBlock = block;
      continue;
    }

    if (prevBlock && prevBlock.type === 'paragraph' && smartParagraphs) {
      const gapY = Math.abs(prevBlock.y - block.y);
      const expectedLineHeight = Math.max(10, prevBlock.fontSize * 1.35);

      if (gapY > expectedLineHeight * 1.6) {
        result += '\n\n' + block.text;
      } else {
        if (/[A-Za-z0-9]-$/.test(result.trimEnd())) {
          result = result.trimEnd().replace(/-$/, '') + block.text;
        } else {
          result += ' ' + block.text;
        }
      }
    } else {
      result += (result ? '\n\n' : '') + block.text;
    }

    prevBlock = block;
  }

  if (inCode) {
    result += '```\n';
  }

  return result.trim();
}

function cleanHeading(text: string): string {
  return text.replace(/^#+\s*/, '').trim();
}
