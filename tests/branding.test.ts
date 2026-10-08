import fs from 'fs';
import path from 'path';
import { renderHeader } from '../src/components/header';
import { renderFooter } from '../src/components/footer';

describe('Branding and Identity Verification (Andesa PDF)', () => {
  const rootDir = process.cwd();

  test('Header component should display Andesa PDF brand name', () => {
    const headerHtml = renderHeader();
    expect(headerHtml).toContain('Andesa PDF');
    expect(headerHtml).not.toContain('DA-PDF');
  });

  test('Footer component should display Andesa PDF brand name', () => {
    const footerHtml = renderFooter();
    expect(footerHtml).toContain('Andesa PDF');
    expect(footerHtml).not.toContain('DA-PDF');
  });

  test('index.html should have Andesa PDF title and description', () => {
    const indexHtmlPath = path.resolve(rootDir, 'index.html');
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

    expect(indexHtml).toContain('<title>Andesa PDF - Utilitas PDF 100% Client-Side');
    expect(indexHtml).toContain('Koleksi alat PDF lengkap Andesa PDF');
    expect(indexHtml).not.toContain('DA-PDF');
  });

  test('package.json should have package name andesa-pdf', () => {
    const pkgPath = path.resolve(rootDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    expect(pkg.name).toBe('andesa-pdf');
  });

  test('PRD and README should consistently reference Andesa PDF', () => {
    const readmeContent = fs.readFileSync(path.resolve(rootDir, 'README.md'), 'utf8');
    const prdContent = fs.readFileSync(path.resolve(rootDir, 'docs/PRD.md'), 'utf8');

    expect(readmeContent).toContain('# Andesa PDF');
    expect(prdContent).toContain('## Andesa PDF');
  });
});
