import { jest } from '@jest/globals';
import {
  calculatePageSlices,
  convertWordToPdf,
  checkBackendHealth,
  convertWordToPdfViaServer,
} from '../src/tools/wordToPdf';

describe('Word to PDF - calculatePageSlices', () => {
  test('should return a single slice when total height fits within page height', () => {
    const slices = calculatePageSlices(800, 1000);
    expect(slices).toEqual([{ startY: 0, height: 800 }]);
  });

  test('should return a single slice when total height is within 5% tolerance', () => {
    const slices = calculatePageSlices(1040, 1000);
    expect(slices).toEqual([{ startY: 0, height: 1040 }]);
  });

  test('should slice multi-page documents accurately without gaps or overlaps', () => {
    const slices = calculatePageSlices(2500, 1000);
    expect(slices).toEqual([
      { startY: 0, height: 1000 },
      { startY: 1000, height: 1000 },
      { startY: 2000, height: 500 },
    ]);
  });

  test('should handle exact multiples of page height', () => {
    const slices = calculatePageSlices(2000, 1000);
    expect(slices).toEqual([
      { startY: 0, height: 1000 },
      { startY: 1000, height: 1000 },
    ]);
  });

  test('should handle zero or negative dimensions safely', () => {
    expect(calculatePageSlices(0, 1000)).toEqual([{ startY: 0, height: 0 }]);
    expect(calculatePageSlices(1000, 0)).toEqual([{ startY: 0, height: 0 }]);
    expect(calculatePageSlices(-100, 1000)).toEqual([{ startY: 0, height: 0 }]);
  });
});

describe('Word to PDF - Backend Integration & Health', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('checkBackendHealth should return available when backend returns ok and libreoffice', async () => {
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', engine: 'libreoffice' }),
    } as Response);

    const result = await checkBackendHealth('http://localhost:3001');
    expect(result.available).toBe(true);
    expect(result.engine).toBe('libreoffice');
  });

  test('checkBackendHealth should return unavailable when backend fails or errors', async () => {
    global.fetch = jest.fn<typeof fetch>().mockRejectedValue(new Error('Connection refused'));

    const result = await checkBackendHealth('http://localhost:3001');
    expect(result.available).toBe(false);
    expect(result.engine).toBe('unavailable');
  });

  test('convertWordToPdfViaServer should throw readable error on failed response', async () => {
    global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: 'LibreOffice tidak tersedia' }),
    } as unknown as Response);

    const dummyFile = new File(['dummy'], 'sample.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    await expect(convertWordToPdfViaServer(dummyFile, 'http://localhost:3001')).rejects.toThrow(
      'LibreOffice tidak tersedia'
    );
  });
});

describe('Word to PDF - Module Exports', () => {
  test('convertWordToPdf should be defined as a function', () => {
    expect(typeof convertWordToPdf).toBe('function');
  });
});
