import fs from 'fs';
import path from 'path';

describe('README Verification', () => {
  const rootDir = process.cwd();
  const readmePath = path.resolve(rootDir, 'README.md');

  test('README.md file must exist in repository root', () => {
    expect(fs.existsSync(readmePath)).toBe(true);
  });

  test('README.md should include core project details and privacy highlights', () => {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    expect(readmeContent).toContain('Andesa PDF');
    expect(readmeContent.toLowerCase()).toContain('client-side');
    expect(readmeContent).toContain('MIT');
  });

  test('README.md should document essential developer scripts', () => {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    expect(readmeContent).toContain('npm run dev');
    expect(readmeContent).toContain('npm run build');
    expect(readmeContent).toContain('npm test');
    expect(readmeContent).toContain('npm run lint');
  });
});
