import { jest } from '@jest/globals';
import {
  convertPdfToWord,
  convertPdfToWordViaServer,
  convertPdfToWordClient,
} from '../src/tools/pdfToWord';

describe('PDF to Word - Module Exports', () => {
  test('convertPdfToWord should be defined as a function', () => {
    expect(typeof convertPdfToWord).toBe('function');
  });

  test('convertPdfToWordViaServer should be defined as a function', () => {
    expect(typeof convertPdfToWordViaServer).toBe('function');
  });

  test('convertPdfToWordClient should be defined as a function', () => {
    expect(typeof convertPdfToWordClient).toBe('function');
  });
});

describe('PDF to Word - Backend Integration', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('convertPdfToWordViaServer should return docx blob on successful response', async () => {
    const mockBlob = new Blob(['mock docx content'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    } as unknown as Response);

    const dummyFile = new File(['%PDF-1.4 mock content'], 'sample.pdf', {
      type: 'application/pdf',
    });

    const progressUpdates: number[] = [];
    const result = await convertPdfToWordViaServer(
      dummyFile,
      'http://localhost:3001',
      (curr, total) => progressUpdates.push(curr / total)
    );

    expect(result).toBe(mockBlob);
    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/convert/pdf-to-word',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  test('convertPdfToWordViaServer should throw error when server returns non-ok response', async () => {
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Konversi LibreOffice gagal' }),
    } as unknown as Response);

    const dummyFile = new File(['%PDF-1.4 mock content'], 'test.pdf', {
      type: 'application/pdf',
    });

    await expect(
      convertPdfToWordViaServer(dummyFile, 'http://localhost:3001')
    ).rejects.toThrow('Konversi LibreOffice gagal');
  });

  test('convertPdfToWord should use server when backend is healthy', async () => {
    const mockBlob = new Blob(['mock docx'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    global.fetch = jest
      .fn<typeof fetch>()
      .mockImplementation(async (input) => {
        const url = String(input);
        if (url.includes('/api/health')) {
          return {
            ok: true,
            json: async () => ({ status: 'ok', engine: 'libreoffice' }),
          } as Response;
        }
        if (url.includes('/api/convert/pdf-to-word')) {
          return {
            ok: true,
            blob: async () => mockBlob,
          } as unknown as Response;
        }
        return { ok: false } as Response;
      });

    const dummyFile = new File(['%PDF-1.4'], 'input.pdf', { type: 'application/pdf' });
    const result = await convertPdfToWord(dummyFile);

    expect(result).toBe(mockBlob);
  });

  test('convertPdfToWord should attempt health check and fall back when backend is unavailable', async () => {
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 503,
    } as Response);

    const dummyFile = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    try {
      await convertPdfToWord(dummyFile, undefined, { preferServer: true, backendUrl: 'http://localhost:3001' });
    } catch {
      // client converter fallback attempted
    }
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/health'),
      expect.anything()
    );
  });
});

