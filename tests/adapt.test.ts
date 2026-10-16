import fs from 'fs';
import path from 'path';
import { renderToolWorkspace } from '../src/components/toolWorkspace';
import { TOOLS_LIST } from '../src/tools';
import type { UploadedFileItem } from '../src/types';

describe('Responsive Adaptation Verification', () => {
  const rootDir = process.cwd();

  test('index.html should have viewport-fit=cover for mobile display notches and safe areas', () => {
    const htmlPath = path.resolve(rootDir, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    expect(html).toContain('viewport-fit=cover');
  });

  test('style.css should support safe area insets and coarse pointer touch target adjustments', () => {
    const cssPath = path.resolve(rootDir, 'src/style.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    expect(css).toContain('env(safe-area-inset-bottom');
    expect(css).toContain('env(safe-area-inset-top');
    expect(css).toContain('@media (pointer: coarse)');
    expect(css).toContain('min-width: 44px !important');
    expect(css).toContain('min-height: 44px !important');
  });

  test('style.css should provide dark mode architecture via CSS custom properties', () => {
    const cssPath = path.resolve(rootDir, 'src/style.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('.dark');
    expect(css).toContain('--bg-main: #090d16');
    expect(css).toContain('--bg-card: #0f172a');
    expect(css).toContain('--border-card: #1e293b');
  });

  test('Signature workspace resize handle should render with minimum touch dimensions and slider semantics', () => {
    const signTool = TOOLS_LIST.find((t) => t.id === 'sign')!;
    const dummyFile: UploadedFileItem = {
      id: 'f-adapt',
      file: new File(['adapt'], 'doc.pdf', { type: 'application/pdf' }),
      sizeFormatted: '50 KB',
      pageCount: 1,
    };

    const html = renderToolWorkspace(signTool, [dummyFile], false, '', 0, null);

    expect(html).toContain('id="sign-resize-handle"');
    expect(html).toContain('role="slider"');
    expect(html).toContain('min-w-[36px]');
    expect(html).toContain('min-h-[36px]');
  });
});
