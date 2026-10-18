import fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';
import { escapeHtml, showToast } from '../src/utils/format';
import { renderToolWorkspace } from '../src/components/toolWorkspace';
import { TOOLS_LIST } from '../src/tools';
import type { UploadedFileItem } from '../src/types';

describe('Security Hardening & XSS Defense (Phase 1)', () => {
  const rootDir = process.cwd();

  describe('escapeHtml utility', () => {
    test('should properly escape HTML special characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
      expect(escapeHtml("Tom & 'Jerry'")).toBe('Tom &amp; &#039;Jerry&#039;');
      expect(escapeHtml('')).toBe('');
      expect(escapeHtml(null as unknown as string)).toBe('');
    });

    test('should neutralize image onerror injection', () => {
      const malicious = '<img src=x onerror="alert(document.cookie)">';
      const sanitized = escapeHtml(malicious);
      expect(sanitized).not.toContain('<img');
      expect(sanitized).toContain('&lt;img');
      expect(sanitized).toContain('&quot;alert(document.cookie)&quot;');
    });
  });

  describe('Workspace file name XSS prevention', () => {
    const maliciousName = '<img src=x onerror="alert(1)">.pdf';
    const maliciousItem: UploadedFileItem = {
      id: 'sec-1',
      file: new File(['dummy'], maliciousName, { type: 'application/pdf' }),
      sizeFormatted: '120 KB',
      pageCount: 2,
    };

    test('should sanitize malicious file name in merge controls', () => {
      const mergeTool = TOOLS_LIST.find((t) => t.id === 'merge')!;
      const html = renderToolWorkspace(mergeTool, [maliciousItem], false, '', 0, null);

      expect(html).not.toContain('<img src=x onerror="alert(1)">.pdf');
      expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;.pdf');
    });

    test('should sanitize malicious file name in split, compress, sign, and standard controls', () => {
      const splitTool = TOOLS_LIST.find((t) => t.id === 'split')!;
      const compressTool = TOOLS_LIST.find((t) => t.id === 'compress')!;
      const signTool = TOOLS_LIST.find((t) => t.id === 'sign')!;
      const wordTool = TOOLS_LIST.find((t) => t.id === 'word-to-pdf')!;

      [splitTool, compressTool, signTool, wordTool].forEach((tool) => {
        const html = renderToolWorkspace(tool, [maliciousItem], false, '', 0, null);
        expect(html).not.toContain('<img src=x onerror="alert(1)">.pdf');
        expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;.pdf');
      });
    });

    test('should sanitize aria-labels to prevent attribute breakout', () => {
      const breakoutName = '" onfocus="alert(1)" x="';
      const breakoutItem: UploadedFileItem = {
        id: 'sec-2',
        file: new File(['dummy'], breakoutName, { type: 'application/pdf' }),
        sizeFormatted: '50 KB',
      };
      const mergeTool = TOOLS_LIST.find((t) => t.id === 'merge')!;
      const html = renderToolWorkspace(mergeTool, [breakoutItem], false, '', 0, null);

      expect(html).not.toContain('aria-label="Geser " onfocus="alert(1)" x=" ke atas"');
      expect(html).toContain('&quot; onfocus=&quot;alert(1)&quot; x=&quot;');
    });
  });

  describe('Result view & Markdown preview XSS prevention', () => {
    test('should escape HTML tags inside markdownText preview', () => {
      const mdTool = TOOLS_LIST.find((t) => t.id === 'pdf-to-markdown')!;
      const maliciousMarkdown = '# Judul\n\n</pre><script>alert("pwned")</script><img src=x onerror=alert(1)>';
      const dummyBlob = new Blob(['dummy'], { type: 'text/markdown' });

      const html = renderToolWorkspace(mdTool, [], false, '', 0, dummyBlob, {
        filename: '<svg onload=alert(1)>.md',
        markdownText: maliciousMarkdown,
      });

      expect(html).not.toContain('</pre><script>alert("pwned")</script>');
      expect(html).not.toContain('<img src=x onerror=alert(1)>');
      expect(html).toContain('&lt;/pre&gt;&lt;script&gt;alert(&quot;pwned&quot;)&lt;/script&gt;');
      expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
      // Check filename escaping
      expect(html).not.toContain('<svg onload=alert(1)>.md');
      expect(html).toContain('&lt;svg onload=alert(1)&gt;.md');
    });
  });

  describe('Toast notification XSS prevention', () => {
    let mockContainer: { appendChild: jest.Mock };

    beforeEach(() => {
      mockContainer = {
        appendChild: jest.fn(),
      };
      (globalThis as unknown as { document: unknown }).document = {
        getElementById: jest.fn((id: string) => (id === 'toast-container' ? mockContainer : null)),
        createElement: jest.fn(() => ({
          className: '',
          innerHTML: '',
          classList: { remove: jest.fn(), add: jest.fn() },
          remove: jest.fn(),
        })),
      };
      (globalThis as unknown as { requestAnimationFrame: unknown }).requestAnimationFrame = jest.fn();
    });

    afterEach(() => {
      delete (globalThis as unknown as Record<string, unknown>).document;
      delete (globalThis as unknown as Record<string, unknown>).requestAnimationFrame;
    });

    test('should escape HTML inside toast message', () => {
      showToast('<b onmouseover="alert(1)">Pesan Berbahaya</b>', 'error');
      expect(mockContainer.appendChild).toHaveBeenCalled();
      const appendedToast = mockContainer.appendChild.mock.calls[0][0];
      expect(appendedToast.innerHTML).not.toContain('<b onmouseover="alert(1)">Pesan Berbahaya</b>');
      expect(appendedToast.innerHTML).toContain('&lt;b onmouseover=&quot;alert(1)&quot;&gt;Pesan Berbahaya&lt;/b&gt;');
    });
  });

  describe('Content Security Policy Header in index.html', () => {
    test('index.html must include Content-Security-Policy meta tag', () => {
      const htmlPath = path.resolve(rootDir, 'index.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');

      expect(htmlContent).toContain('http-equiv="Content-Security-Policy"');
      expect(htmlContent).toContain("default-src 'self'");
      expect(htmlContent).toContain("object-src 'none'");
    });
  });

  describe('PDF.js & Input Boundary Hardening', () => {
    test('src/utils/pdf.ts should enforce isEvalSupported: false', () => {
      const pdfUtilPath = path.resolve(rootDir, 'src/utils/pdf.ts');
      const content = fs.readFileSync(pdfUtilPath, 'utf8');

      expect(content).toContain('isEvalSupported: false');
    });

    test('parsePageRangeString should safely handle invalid, negative, or non-finite inputs', async () => {
      const { parsePageRangeString } = await import('../src/tools/split');

      expect(parsePageRangeString('', 10)).toEqual([]);
      expect(parsePageRangeString(null as unknown as string, 10)).toEqual([]);
      expect(parsePageRangeString('1-5', 0)).toEqual([]);
      expect(parsePageRangeString('1-5', -5)).toEqual([]);
      expect(parsePageRangeString('1-5', NaN)).toEqual([]);
      expect(parsePageRangeString('malicious,invalid-range', 5)).toEqual([]);
    });

    test('applySignatureToPdf should reject malformed signatureDataUrl', async () => {
      const { applySignatureToPdf } = await import('../src/tools/sign');
      const dummyPdfFile = new File(
        [
          '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 100 100] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF',
        ],
        'test.pdf',
        { type: 'application/pdf' }
      );

      await expect(
        applySignatureToPdf(dummyPdfFile, [
          {
            pageIndex: 0,
            normX: 0.1,
            normY: 0.1,
            normWidth: 0.2,
            normHeight: 0.1,
            signatureDataUrl: 'invalid-no-comma-data',
          },
        ])
      ).rejects.toThrow('Format data tanda tangan tidak valid');
    });
  });
});
