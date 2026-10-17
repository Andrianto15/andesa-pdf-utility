import fs from 'fs';
import path from 'path';
import { renderHeader } from '../src/components/header';
import { renderHero } from '../src/components/hero';
import { renderFooter } from '../src/components/footer';
import { renderToolGrid } from '../src/components/toolGrid';
import { renderToolWorkspace } from '../src/components/toolWorkspace';
import { TOOLS_LIST } from '../src/tools';

describe('Steel Blue Theme Palette & Harmonization Verification', () => {
  const rootDir = process.cwd();

  test('DESIGN.md frontmatter should define Steel Blue #4682b4 and harmonized tokens', () => {
    const designMd = fs.readFileSync(path.resolve(rootDir, 'DESIGN.md'), 'utf8');
    expect(designMd).toContain('primary: "#4682b4"');
    expect(designMd).toContain('primary-hover: "#36648b"');
    expect(designMd).toContain('accent: "#0ea5e9"');
    expect(designMd).toContain('Steel Blue Accent');
    expect(designMd).toContain('#4682b4');
    expect(designMd).not.toContain('#4f46e5');
  });

  test('.impeccable/design.json should have canonical Steel Blue #4682b4', () => {
    const jsonPath = path.resolve(rootDir, '.impeccable/design.json');
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    expect(json.extensions.colorMeta.primary.canonical).toBe('#4682b4');
    expect(json.extensions.colorMeta.primary.displayName).toContain('Steel Blue');
    expect(json.extensions.colorMeta.primary.tonalRamp).toContain('#4682b4');
  });

  test('src/style.css should declare steelblue color tokens in @theme and :root', () => {
    const css = fs.readFileSync(path.resolve(rootDir, 'src/style.css'), 'utf8');

    expect(css).toContain('--color-steelblue-500: #4682b4;');
    expect(css).toContain('--color-steelblue-600: #3b6e9a;');
    expect(css).toContain('--color-primary: #4682b4;');
    expect(css).toContain('--color-primary-hover: #36648b;');
    expect(css).toContain('--color-accent: #0ea5e9;');
    expect(css).toContain('outline: 2px solid #4682b4;');
    expect(css).toContain('border-color: #4682b4 !important;');
    expect(css).toContain('background-color: #f0f6fa !important;');
    expect(css).not.toContain('#4f46e5');
  });

  test('index.html should reference Steel Blue favicon stroke and selection', () => {
    const html = fs.readFileSync(path.resolve(rootDir, 'index.html'), 'utf8');

    expect(html).toContain("stroke='%234682B4'");
    expect(html).toContain('selection:bg-steelblue-500/20');
    expect(html).toContain('selection:text-steelblue-900');
    expect(html).not.toContain('%234f46e5');
    expect(html).not.toContain('selection:bg-indigo-500');
  });

  test('UI Components should render steelblue classes and eliminate all legacy indigo classes', () => {
    const headerHtml = renderHeader();
    const heroHtml = renderHero();
    const footerHtml = renderFooter();
    const gridHtml = renderToolGrid('all');

    expect(headerHtml).toContain('bg-steelblue-600');
    expect(headerHtml).toContain('text-steelblue-700');
    expect(headerHtml).not.toContain('indigo');

    expect(heroHtml).toContain('text-steelblue-600');
    expect(heroHtml).not.toContain('indigo');

    expect(footerHtml).toContain('bg-steelblue-50');
    expect(footerHtml).toContain('text-steelblue-600');
    expect(footerHtml).not.toContain('indigo');

    expect(gridHtml).toContain('bg-steelblue-600');
    expect(gridHtml).toContain('text-steelblue-700');
    expect(gridHtml).not.toContain('indigo');
  });

  test('Tool workspace should use steelblue theme classes across dropzone and progress', () => {
    const mergeTool = TOOLS_LIST.find((t) => t.id === 'merge')!;
    const dropzoneHtml = renderToolWorkspace(mergeTool, [], false, '', 0, null);

    expect(dropzoneHtml).toContain('hover:border-steelblue-500');
    expect(dropzoneHtml).toContain('bg-steelblue-50');
    expect(dropzoneHtml).toContain('text-steelblue-600');
    expect(dropzoneHtml).toContain('bg-steelblue-600');
    expect(dropzoneHtml).not.toContain('indigo');
  });

  test('Tool registry should map merge and split to refined steelblue accents', () => {
    const mergeTool = TOOLS_LIST.find((t) => t.id === 'merge')!;
    const splitTool = TOOLS_LIST.find((t) => t.id === 'split')!;

    expect(mergeTool.accentColor).toBe('bg-steelblue-600');
    expect(splitTool.accentColor).toBe('bg-steelblue-700');
  });

  test('PRD.md should document Steel Blue #4682b4 in Design & UX section', () => {
    const prd = fs.readFileSync(path.resolve(rootDir, 'docs/PRD.md'), 'utf8');
    expect(prd).toContain('Steel Blue (`#4682b4`');
    expect(prd).not.toContain('aksen Indigo (`#4f46e5`)');
  });

  test('UI Components should render dark mode utility classes across all surfaces', () => {
    const headerHtml = renderHeader();
    const heroHtml = renderHero();
    const footerHtml = renderFooter();
    const gridHtml = renderToolGrid('all');
    const mergeTool = TOOLS_LIST.find((t) => t.id === 'merge')!;
    const workspaceHtml = renderToolWorkspace(mergeTool, [], false, '', 0, null);

    // Header dark mode & accessibility
    expect(headerHtml).toContain('dark:bg-slate-900/90');
    expect(headerHtml).toContain('dark:border-slate-800');
    expect(headerHtml).toContain('id="btn-theme-toggle"');
    expect(headerHtml).toContain('aria-label="Lihat kode sumber Andesa PDF di GitHub"');

    // Hero dark mode
    expect(heroHtml).toContain('dark:text-slate-100');
    expect(heroHtml).toContain('dark:bg-slate-800/90');
    expect(heroHtml).toContain('dark:border-slate-700');

    // Grid dark mode
    expect(gridHtml).toContain('dark:bg-slate-800/90');
    expect(gridHtml).toContain('dark:border-slate-700/80');

    // Workspace dark mode
    expect(workspaceHtml).toContain('dark:bg-slate-800/90');
    expect(workspaceHtml).toContain('dark:bg-slate-800/80');

    // Footer dark mode
    expect(footerHtml).toContain('dark:bg-slate-900');
    expect(footerHtml).toContain('dark:border-slate-800');
  });

  test('style.css should provide dark mode styling for glass panels and scrollbars', () => {
    const css = fs.readFileSync(path.resolve(rootDir, 'src/style.css'), 'utf8');
    expect(css).toContain('.dark .glass-panel');
    expect(css).toContain('.dark .glass-card');
    expect(css).toContain('.dark ::-webkit-scrollbar-track');
    expect(css).toContain('.dark .drag-over');
  });
});
