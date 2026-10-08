import fs from 'fs';
import path from 'path';
import { renderHeader } from '../src/components/header';
import { renderFooter } from '../src/components/footer';
import { renderHero } from '../src/components/hero';

describe('Branding and Identity Verification (Andesa PDF)', () => {
  const rootDir = process.cwd();

  test('Header component should display Andesa PDF brand name and Tanpa Batas & Free branding', () => {
    const headerHtml = renderHeader();
    expect(headerHtml).toContain('Andesa PDF');
    expect(headerHtml).toContain('Tanpa Batas');
    expect(headerHtml).toContain('Free');
    expect(headerHtml).not.toContain('DA-PDF');
    expect(headerHtml).not.toContain('Client-Side');
    expect(headerHtml).not.toContain('Zero Server');
  });

  test('Hero component should display Tanpa Batas & Free branding and no zero-server claims', () => {
    const heroHtml = renderHero();
    expect(heroHtml).toContain('Tanpa Batas');
    expect(heroHtml).toContain('Free');
    expect(heroHtml).not.toContain('Tanpa Server Backend');
    expect(heroHtml).not.toContain('Tanpa Pernah Upload ke Server');
    expect(heroHtml).not.toContain('Privasi Dokumen Terjamin 100%');
  });

  test('Footer component should display Andesa PDF brand name, Tanpa Batas & Free branding, and copyright notice', () => {
    const footerHtml = renderFooter();
    expect(footerHtml).toContain('Andesa PDF');
    expect(footerHtml).toContain('Tanpa Batas');
    expect(footerHtml).toContain('Free');
    expect(footerHtml).toContain('2026 Andrian Tonur Iskandar');
    expect(footerHtml).toContain('MIT License');
    expect(footerHtml).not.toContain('DA-PDF');
    expect(footerHtml).not.toContain('Client-Side');
    expect(footerHtml).not.toContain('Zero-Server');
  });

  test('index.html should have Andesa PDF title and description with Tanpa Batas & Free branding', () => {
    const indexHtmlPath = path.resolve(rootDir, 'index.html');
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

    expect(indexHtml).toContain('<title>Andesa PDF - Utilitas PDF Tanpa Batas & Free</title>');
    expect(indexHtml).toContain('Koleksi alat PDF lengkap Andesa PDF');
    expect(indexHtml).not.toContain('DA-PDF');
    expect(indexHtml).not.toContain('100% Client-Side');
    expect(indexHtml).not.toContain('Zero Server');
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
