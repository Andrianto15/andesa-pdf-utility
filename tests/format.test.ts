import { formatBytes } from '../src/utils/format';

describe('Format Utilities', () => {
  test('formatBytes should format 0 bytes properly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  test('formatBytes should format KB, MB, and GB properly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  test('formatBytes should respect decimal precision', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
    expect(formatBytes(1536, 0)).toBe('2 KB');
  });
});
