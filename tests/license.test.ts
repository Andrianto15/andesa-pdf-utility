import fs from 'fs';
import path from 'path';

describe('License and Legal Verification', () => {
  const rootDir = process.cwd();
  const licensePath = path.resolve(rootDir, 'LICENSE');
  const packageJsonPath = path.resolve(rootDir, 'package.json');

  test('LICENSE file must exist in repository root', () => {
    expect(fs.existsSync(licensePath)).toBe(true);
  });

  test('LICENSE file should be valid MIT license with 2026 copyright notice', () => {
    const licenseText = fs.readFileSync(licensePath, 'utf8');

    expect(licenseText).toContain('MIT License');
    expect(licenseText).toContain('Copyright (c) 2026 Andrian Tonur Iskandar');
    expect(licenseText).toContain('Permission is hereby granted, free of charge');
    expect(licenseText).toContain('without restriction, including without limitation the rights');
    expect(licenseText).toContain('and/or sell');
  });

  test('package.json should specify MIT license', () => {
    const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    expect(packageJsonContent.license).toBe('MIT');
  });
});
