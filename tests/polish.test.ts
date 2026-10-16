import fs from 'fs';
import path from 'path';
import { renderFooter } from '../src/components/footer';
import { renderToolWorkspace } from '../src/components/toolWorkspace';
import { TOOLS_LIST } from '../src/tools';
import type { UploadedFileItem } from '../src/types';

describe('Polish and Contrast Quality Verification', () => {
  const rootDir = process.cwd();

  test('Footer component should use text-slate-500 for WCAG AA contrast compliance and no text-slate-400', () => {
    const footerHtml = renderFooter();

    expect(footerHtml).not.toContain('text-slate-400');
    expect(footerHtml).toContain('text-slate-500 text-[11px]');
    expect(footerHtml).toContain('hover:text-slate-800');
  });

  test('Signature workspace hint should use text-slate-500 for legible contrast', () => {
    const signTool = TOOLS_LIST.find((t) => t.id === 'sign')!;
    const dummyFile: UploadedFileItem = {
      id: 'f-polish',
      file: new File(['polish'], 'test.pdf', { type: 'application/pdf' }),
      sizeFormatted: '12 KB',
      pageCount: 1,
    };

    const html = renderToolWorkspace(signTool, [dummyFile], false, '', 0, null);

    expect(html).not.toContain('text-slate-400');
    expect(html).toContain('id="sign-placeholder-hint"');
    expect(html).toContain('text-slate-500 text-xs');
  });

  test('No component source file should use substandard text-slate-400 for body or metadata text', () => {
    const componentsDir = path.resolve(rootDir, 'src/components');
    const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.ts'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      expect(content).not.toContain('text-slate-400');
    }
  });
});
