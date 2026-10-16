import fs from 'fs';
import path from 'path';
import { renderToolWorkspace } from '../src/components/toolWorkspace';
import { TOOLS_LIST } from '../src/tools';
import type { UploadedFileItem } from '../src/types';

describe('Performance Optimization Verification', () => {
  const rootDir = process.cwd();

  test('Tool workspace should render dedicated IDs for progress text, percent, and bar fill to avoid DOM thrashing', () => {
    const mergeTool = TOOLS_LIST.find((t) => t.id === 'merge')!;
    const dummyFiles: UploadedFileItem[] = [
      {
        id: 'f-1',
        file: new File(['content1'], 'doc1.pdf', { type: 'application/pdf' }),
        sizeFormatted: '120 KB',
      },
    ];

    const processingHtml = renderToolWorkspace(
      mergeTool,
      dummyFiles,
      true,
      'Memproses halaman 1 dari 5...',
      20,
      null
    );

    expect(processingHtml).toContain('id="progress-container"');
    expect(processingHtml).toContain('id="progress-text"');
    expect(processingHtml).toContain('id="progress-percent"');
    expect(processingHtml).toContain('id="progress-bar-fill"');
    expect(processingHtml).toContain('Memproses halaman 1 dari 5...');
    expect(processingHtml).toContain('20%');
  });

  test('main.ts should contain object URL revocation and pointer event capture without window listeners', () => {
    const mainTsPath = path.resolve(rootDir, 'src/main.ts');
    const mainTs = fs.readFileSync(mainTsPath, 'utf8');

    // Object URL revocation helpers
    expect(mainTs).toContain('revokeFilePreviews');
    expect(mainTs).toContain('clearUploadedFiles');
    expect(mainTs).toContain('removeUploadedFile');
    expect(mainTs).toContain('URL.revokeObjectURL(item.previewUrl)');

    // Pointer events on canvas instead of window listeners
    expect(mainTs).toContain("canvas.addEventListener('pointerdown'");
    expect(mainTs).toContain("canvas.addEventListener('pointermove'");
    expect(mainTs).toContain("canvas.addEventListener('pointerup'");
    expect(mainTs).toContain('canvas.setPointerCapture(e.pointerId)');
    expect(mainTs).not.toContain("window.addEventListener('mousemove'");
    expect(mainTs).not.toContain("window.addEventListener('mouseup'");

    // Direct DOM progress updates
    expect(mainTs).toContain("document.getElementById('progress-text')");
    expect(mainTs).toContain("document.getElementById('progress-percent')");
    expect(mainTs).toContain("document.getElementById('progress-bar-fill')");
  });
});
