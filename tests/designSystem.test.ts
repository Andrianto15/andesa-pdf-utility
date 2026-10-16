import fs from 'fs';
import path from 'path';

describe('Design System Documentation & Token Verification', () => {
  const rootDir = process.cwd();

  test('DESIGN.md should exist at root with valid YAML frontmatter tokens', () => {
    const designMdPath = path.resolve(rootDir, 'DESIGN.md');
    expect(fs.existsSync(designMdPath)).toBe(true);

    const content = fs.readFileSync(designMdPath, 'utf8');
    expect(content.startsWith('---')).toBe(true);

    // Frontmatter keys
    expect(content).toContain('name: Andesa PDF Utility');
    expect(content).toContain('colors:');
    expect(content).toContain('typography:');
    expect(content).toContain('rounded:');
    expect(content).toContain('spacing:');
    expect(content).toContain('components:');
  });

  test('DESIGN.md should include all 8 canonical sections in exact order', () => {
    const designMdPath = path.resolve(rootDir, 'DESIGN.md');
    const content = fs.readFileSync(designMdPath, 'utf8');

    const canonicalSections = [
      '## Overview',
      '## Colors',
      '## Typography',
      '## Layout',
      '## Elevation & Depth',
      '## Shapes',
      '## Components',
      "## Do's and Don'ts",
    ];

    let lastIndex = -1;
    for (const section of canonicalSections) {
      const currentIndex = content.indexOf(section);
      expect(currentIndex).toBeGreaterThan(-1);
      expect(currentIndex).toBeGreaterThan(lastIndex);
      lastIndex = currentIndex;
    }
  });

  test('.impeccable/design.json sidecar should exist with schemaVersion 2 and required structures', () => {
    const jsonPath = path.resolve(rootDir, '.impeccable/design.json');
    expect(fs.existsSync(jsonPath)).toBe(true);

    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    expect(json.schemaVersion).toBe(2);
    expect(json.title).toContain('Andesa PDF Utility');
    expect(json.extensions).toBeDefined();
    expect(json.extensions.colorMeta).toBeDefined();
    expect(json.extensions.typographyMeta).toBeDefined();
    expect(json.extensions.shadows).toBeInstanceOf(Array);
    expect(json.extensions.motion).toBeInstanceOf(Array);
    expect(json.extensions.breakpoints).toBeInstanceOf(Array);
    expect(json.components).toBeInstanceOf(Array);
    expect(json.narrative).toBeDefined();
    expect(json.narrative.northStar).toBe('The Precision Document Lab');
    expect(json.narrative.dos).toBeInstanceOf(Array);
    expect(json.narrative.donts).toBeInstanceOf(Array);
  });

  test('src/style.css should define @theme tokens binding semantic CSS variables', () => {
    const cssPath = path.resolve(rootDir, 'src/style.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    expect(css).toContain('@theme');
    expect(css).toContain('--color-bg-main: var(--bg-main);');
    expect(css).toContain('--color-bg-card: var(--bg-card);');
    expect(css).toContain('--color-border-card: var(--border-card);');
    expect(css).toContain('--color-text-main: var(--text-main);');
    expect(css).toContain('--color-text-muted: var(--text-muted);');
  });
});
