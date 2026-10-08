import { parsePageRangeString } from '../src/tools/split';

describe('Split PDF Utilities', () => {
  test('parsePageRangeString should correctly parse single and range format', () => {
    const result = parsePageRangeString('1-3, 5', 10);
    expect(result).toEqual([0, 1, 2, 4]);
  });

  test('parsePageRangeString should sort pages and handle out-of-order ranges', () => {
    const result = parsePageRangeString('7-9, 2, 4', 10);
    expect(result).toEqual([1, 3, 6, 7, 8]);
  });

  test('parsePageRangeString should clamp to maxPages', () => {
    const result = parsePageRangeString('1-100', 5);
    expect(result).toEqual([0, 1, 2, 3, 4]);
  });

  test('parsePageRangeString should return empty array for empty or invalid input', () => {
    expect(parsePageRangeString('', 10)).toEqual([]);
    expect(parsePageRangeString('abc, xyz', 10)).toEqual([]);
  });
});
