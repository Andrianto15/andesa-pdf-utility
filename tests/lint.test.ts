import fs from 'fs';
import path from 'path';

describe('Lint Configuration Verification', () => {
  const rootDir = process.cwd();
  const eslintConfigPath = path.resolve(rootDir, 'eslint.config.js');
  const pkgPath = path.resolve(rootDir, 'package.json');

  test('eslint.config.js must exist in repository root', () => {
    expect(fs.existsSync(eslintConfigPath)).toBe(true);
  });

  test('package.json should include lint scripts', () => {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    expect(pkg.scripts).toBeDefined();
    expect(pkg.scripts.lint).toBe('eslint .');
    expect(pkg.scripts['lint:fix']).toBe('eslint . --fix');
    expect(pkg.scripts['fix:lint']).toBe('npm run lint:fix');
  });

  test('package.json should include eslint devDependencies', () => {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    expect(pkg.devDependencies).toBeDefined();
    expect(pkg.devDependencies.eslint).toBeDefined();
    expect(pkg.devDependencies['typescript-eslint']).toBeDefined();
  });
});
