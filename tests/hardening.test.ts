import fs from 'fs';
import path from 'path';
import { renderToolGrid } from '../src/components/toolGrid';
import { renderToolWorkspace } from '../src/components/toolWorkspace';
import { TOOLS_LIST } from '../src/tools';
import type { UploadedFileItem } from '../src/types';

describe('Accessibility & Interface Hardening Verification', () => {
  const rootDir = process.cwd();

  test('Tool grid should have accessible tablist, tab roles, and keyboard-operable cards', () => {
    const gridHtml = renderToolGrid('all');

    // Tablist container
    expect(gridHtml).toContain('role="tablist"');
    expect(gridHtml).toContain('aria-label="Filter kategori alat"');
    expect(gridHtml).toContain('role="tab"');
    expect(gridHtml).toContain('aria-selected="true"');

    // Tool cards accessibility
    expect(gridHtml).toContain('role="button"');
    expect(gridHtml).toContain('tabindex="0"');
    expect(gridHtml).toContain('aria-label="Gabungkan PDF: Satukan beberapa file PDF menjadi satu dokumen utuh dengan urutan yang fleksibel."');
    expect(gridHtml).toContain('focus-visible:ring-2');
  });

  test('Tool workspace should provide accessible labels, alt text, and interactive controls', () => {
    const signTool = TOOLS_LIST.find((t) => t.id === 'sign')!;
    const dummyFile: UploadedFileItem = {
      id: 'test-1',
      file: new File(['dummy'], 'test.pdf', { type: 'application/pdf' }),
      sizeFormatted: '100 KB',
      pageCount: 3,
    };

    const signHtml = renderToolWorkspace(signTool, [dummyFile], false, '', 0, null);

    // Form labels and associations
    expect(signHtml).toContain('for="sign-page-select"');
    expect(signHtml).toContain('id="sign-page-select"');

    // Color swatch aria-labels
    expect(signHtml).toContain('aria-label="Pilih tinta hitam"');
    expect(signHtml).toContain('aria-label="Pilih tinta biru"');
    expect(signHtml).toContain('aria-label="Pilih tinta merah"');

    // Signature resize handle accessibility
    expect(signHtml).toContain('id="sign-resize-handle"');
    expect(signHtml).toContain('role="slider"');
    expect(signHtml).toContain('aria-label="Ubah ukuran tanda tangan"');
    expect(signHtml).toContain('tabindex="0"');

    // Signature preview overlay img
    expect(signHtml).toContain('id="overlay-signature-img"');
    expect(signHtml).toContain('alt="Pratinjau tanda tangan"');
    expect(signHtml).toContain('src="data:image/svg+xml');
  });

  test('JPG to PDF workspace should have alt tags and explicit label associations', () => {
    const jpgTool = TOOLS_LIST.find((t) => t.id === 'jpg-to-pdf')!;
    const dummyImg: UploadedFileItem = {
      id: 'img-1',
      file: new File(['img'], 'photo.jpg', { type: 'image/jpeg' }),
      sizeFormatted: '500 KB',
      previewUrl: 'blob:http://localhost/dummy',
    };

    const jpgHtml = renderToolWorkspace(jpgTool, [dummyImg], false, '', 0, null);

    expect(jpgHtml).toContain('for="jpg-page-size"');
    expect(jpgHtml).toContain('for="jpg-orientation"');
    expect(jpgHtml).toContain('for="jpg-margin"');
    expect(jpgHtml).toContain('alt="Pratinjau berkas gambar 1"');
    expect(jpgHtml).toContain('aria-label="Hapus gambar 1"');
  });

  test('style.css should include focus-visible rings and prefers-reduced-motion media query', () => {
    const cssPath = path.resolve(rootDir, 'src/style.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    expect(css).toContain(':focus-visible');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('transition-duration: 0.15s !important');
    expect(css).toContain('transform: none !important');
    expect(css).toContain('animation-duration: 0.01ms !important');
  });
});
