import { TOOLS_LIST } from '../src/tools';

describe('Tools Registry', () => {
  test('should register 8 tools in total', () => {
    expect(TOOLS_LIST.length).toBe(8);
  });

  test('each tool should have unique id, non-empty title, and valid category', () => {
    const ids = new Set<string>();
    const validCategories = new Set(['organize', 'convert', 'security', 'optimize']);

    for (const tool of TOOLS_LIST) {
      expect(tool.id).toBeTruthy();
      expect(ids.has(tool.id)).toBe(false);
      ids.add(tool.id);

      expect(tool.title.length).toBeGreaterThan(0);
      expect(tool.description.length).toBeGreaterThan(0);
      expect(validCategories.has(tool.category)).toBe(true);
      expect(tool.accept).toBeTruthy();
    }
  });

  test('should include core tools: merge, split, compress, jpg-to-pdf, sign', () => {
    const toolIds = TOOLS_LIST.map((t) => t.id);
    expect(toolIds).toContain('merge');
    expect(toolIds).toContain('split');
    expect(toolIds).toContain('compress');
    expect(toolIds).toContain('jpg-to-pdf');
    expect(toolIds).toContain('sign');
    expect(toolIds).toContain('pdf-to-markdown');
    expect(toolIds).toContain('word-to-pdf');
    expect(toolIds).toContain('pdf-to-word');
  });
});
