import fs from 'fs';
import path from 'path';
import { renderHero } from '../src/components/hero';
import { renderHeader } from '../src/components/header';
import { renderToolGrid } from '../src/components/toolGrid';
import { TOOLS_LIST } from '../src/tools';

describe('Quieter Design & Reduced Visual Noise Verification', () => {
  const rootDir = process.cwd();

  test('Hero component should avoid AI-cliche gradient text and use solid crisp typography', () => {
    const heroHtml = renderHero();

    expect(heroHtml).not.toContain('bg-clip-text');
    expect(heroHtml).not.toContain('text-transparent');
    expect(heroHtml).not.toContain(['from', 'indigo-600 via-indigo-700 to-purple-600'].join('-'));
    expect(heroHtml).toContain('text-steelblue-600');
  });

  test('Header component should use solid logo mark and calm status indicator without pulse animation', () => {
    const headerHtml = renderHeader();

    expect(headerHtml).not.toContain(['bg-gradient-to-tr from', 'indigo-600 to-indigo-500'].join('-'));
    expect(headerHtml).not.toContain('shadow-indigo-500/20');
    expect(headerHtml).not.toContain('animate-pulse');
    expect(headerHtml).toContain('bg-steelblue-600');
  });

  test('Tool grid and cards should not use clashing gradient icons or aggressive colored shadows', () => {
    const gridHtml = renderToolGrid('all');

    expect(gridHtml).not.toContain('shadow-indigo-500/10');
    expect(gridHtml).not.toContain('bg-gradient-to-tr');
    expect(gridHtml).toContain('hover:shadow-md');
  });

  test('Tools registry should define refined solid/tonal accentColor without gradient stops', () => {
    for (const tool of TOOLS_LIST) {
      expect(tool.accentColor).not.toContain('from-');
      expect(tool.accentColor).not.toContain('to-');
      expect(tool.accentColor.startsWith('bg-')).toBe(true);
    }
  });

  test('Hero source file should not use saturated multi-color blur blobs', () => {
    const heroFilePath = path.resolve(rootDir, 'src/components/hero.ts');
    const heroCode = fs.readFileSync(heroFilePath, 'utf8');

    expect(heroCode).not.toContain(['from', 'indigo-200/50 to-purple-200/40'].join('-'));
  });
});
