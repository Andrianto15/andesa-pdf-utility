import fs from 'fs';
import path from 'path';
import {
  isValidDocxBuffer,
  isValidPdfBuffer,
  getAllowedCorsOrigins,
  buildLibreOfficeArgs,
} from '../server/src/index.js';

describe('Server Security Hardening & Isolation (Phase 2)', () => {
  const rootDir = process.cwd();

  describe('File Signature / Magic Bytes Validation', () => {
    test('isValidDocxBuffer should validate ZIP PK headers and reject invalid buffers', () => {
      // Valid PK\x03\x04
      const validDocx = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
      expect(isValidDocxBuffer(validDocx)).toBe(true);

      // Invalid text/script buffer disguised as docx
      const fakeDocx = Buffer.from('<?xml version="1.0"?>');
      expect(isValidDocxBuffer(fakeDocx)).toBe(false);

      // Empty or truncated buffer
      expect(isValidDocxBuffer(Buffer.from([]))).toBe(false);
      expect(isValidDocxBuffer(null as unknown as Buffer)).toBe(false);
    });

    test('isValidPdfBuffer should validate %PDF headers and reject invalid buffers', () => {
      // Valid %PDF-
      const validPdf = Buffer.from('%PDF-1.7\n%...');
      expect(isValidPdfBuffer(validPdf)).toBe(true);

      // Invalid HTML or executable buffer disguised as pdf
      const fakePdf = Buffer.from('<html onload="alert(1)">');
      expect(isValidPdfBuffer(fakePdf)).toBe(false);

      // Empty or truncated buffer
      expect(isValidPdfBuffer(Buffer.from([]))).toBe(false);
      expect(isValidPdfBuffer(null as unknown as Buffer)).toBe(false);
    });
  });

  describe('LibreOffice Execution Isolation & Hardening Flags', () => {
    test('buildLibreOfficeArgs should isolate UserInstallation to temp directory and include safety flags', () => {
      const tempDir = '/tmp/andesa-pdf-test123';
      const inputPath = '/tmp/andesa-pdf-test123/input.docx';
      const args = buildLibreOfficeArgs({ tempDir, inputPath, format: 'pdf' });

      // Profile isolation
      expect(args.some((arg: string) => arg.startsWith('-env:UserInstallation='))).toBe(true);
      expect(args.some((arg: string) => arg.includes('/tmp/andesa-pdf-test123/user_profile'))).toBe(true);

      // Hardening safety flags
      expect(args).toContain('--headless');
      expect(args).toContain('--norestore');
      expect(args).toContain('--nofirststartwizard');
      expect(args).toContain('--nologo');
      expect(args).toContain('--nodefault');
      expect(args).toContain('--convert-to');
      expect(args).toContain('pdf');
      expect(args).toContain(inputPath);
    });

    test('buildLibreOfficeArgs should include infilter option when converting pdf to docx', () => {
      const tempDir = '/tmp/andesa-pdf-test456';
      const inputPath = '/tmp/andesa-pdf-test456/input.pdf';
      const args = buildLibreOfficeArgs({
        tempDir,
        inputPath,
        format: 'docx',
        inFilter: 'writer_pdf_import',
      });

      expect(args).toContain('--infilter=writer_pdf_import');
      expect(args).toContain('--convert-to');
      expect(args).toContain('docx');
    });
  });

  describe('CORS Origin Whitelisting', () => {
    test('getAllowedCorsOrigins should use standard localhost origins by default', () => {
      const origins = getAllowedCorsOrigins(undefined);
      expect(origins).toContain('http://localhost:5173');
      expect(origins).toContain('http://localhost:3000');
      expect(origins).not.toContain('*');
    });

    test('getAllowedCorsOrigins should parse comma-separated custom origins', () => {
      const origins = getAllowedCorsOrigins('https://andesa.id, https://pdf.andesa.id');
      expect(origins).toEqual(['https://andesa.id', 'https://pdf.andesa.id']);
    });
  });

  describe('Dockerfile Security Configuration', () => {
    test('server/Dockerfile should run as non-root user node', () => {
      const dockerfilePath = path.resolve(rootDir, 'server/Dockerfile');
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');

      expect(dockerfileContent).toContain('USER node');
      expect(dockerfileContent).toContain('chown -R node:node /app');
    });
  });
});
