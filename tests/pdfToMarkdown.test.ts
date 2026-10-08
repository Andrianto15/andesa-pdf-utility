import { extractPageMarkdown, convertPdfToMarkdown } from '../src/tools/pdfToMarkdown';

describe('PDF to Markdown - Line Grouping & Extraction', () => {
  test('should extract simple single line text', () => {
    const rawItems = [
      { str: 'Halo', transform: [12, 0, 0, 12, 50, 700], width: 30, height: 12 },
      { str: 'Dunia', transform: [12, 0, 0, 12, 85, 700], width: 35, height: 12 },
    ];

    const result = extractPageMarkdown(rawItems);
    expect(result).toBe('Halo Dunia');
  });

  test('should sort out-of-order items spatially by Y descending and X ascending', () => {
    const rawItems = [
      // Second line item 2
      { str: 'bawah.', transform: [12, 0, 0, 12, 100, 650], width: 40, height: 12 },
      // First line
      { str: 'Baris atas.', transform: [12, 0, 0, 12, 50, 700], width: 70, height: 12 },
      // Second line item 1
      { str: 'Baris', transform: [12, 0, 0, 12, 50, 650], width: 40, height: 12 },
    ];

    const result = extractPageMarkdown(rawItems);
    expect(result).toContain('Baris atas.');
    expect(result).toContain('Baris bawah.');
    expect(result.indexOf('Baris atas.')).toBeLessThan(result.indexOf('Baris bawah.'));
  });
});

describe('PDF to Markdown - Heading & Typography Detection', () => {
  test('should detect H1 when font size is significantly larger than body text', () => {
    const rawItems = [
      // H1 line (fontSize 22 vs body 12)
      { str: 'Judul Utama Dokumen', transform: [22, 0, 0, 22, 50, 750], width: 180, height: 22 },
      // Body paragraph
      {
        str: 'Ini adalah kalimat isi paragraf pertama dengan ukuran normal.',
        transform: [12, 0, 0, 12, 50, 710],
        width: 300,
        height: 12,
      },
    ];

    const result = extractPageMarkdown(rawItems, {}, { detectHeadings: true });
    expect(result).toContain('# Judul Utama Dokumen');
    expect(result).toContain('Ini adalah kalimat isi paragraf pertama dengan ukuran normal.');
  });

  test('should detect H2 when font size is moderately larger than body text', () => {
    const rawItems = [
      // H2 line (fontSize 16 vs body 12)
      { str: 'Sub Judul Sekunder', transform: [16, 0, 0, 16, 50, 740], width: 140, height: 16 },
      // Body paragraph
      {
        str: 'Paragraf penjelasan di bawah subjudul dengan teks standar.',
        transform: [12, 0, 0, 12, 50, 700],
        width: 300,
        height: 12,
      },
    ];

    const result = extractPageMarkdown(rawItems, {}, { detectHeadings: true });
    expect(result).toContain('## Sub Judul Sekunder');
  });

  test('should detect H3 when line is bold title', () => {
    const rawItems = [
      // Bold title (fontSize 13 vs body 12, bold font)
      {
        str: 'Bagian Sub Bab',
        transform: [13, 0, 0, 13, 50, 740],
        width: 100,
        height: 13,
        fontName: 'Helvetica-Bold',
      },
      // Body paragraph
      {
        str: 'Isi teks dokumen di bawah sub bab yang cukup panjang.',
        transform: [12, 0, 0, 12, 50, 700],
        width: 300,
        height: 12,
        fontName: 'Helvetica',
      },
    ];

    const styles = {
      'Helvetica-Bold': { fontFamily: 'Helvetica, Arial, Bold' },
      Helvetica: { fontFamily: 'Helvetica, Arial' },
    };

    const result = extractPageMarkdown(rawItems, styles, { detectHeadings: true });
    expect(result).toContain('### Bagian Sub Bab');
  });

  test('should not generate headings when detectHeadings is false', () => {
    const rawItems = [
      { str: 'Judul Besar', transform: [24, 0, 0, 24, 50, 750], width: 120, height: 24 },
      { str: 'Isi paragraf biasa.', transform: [12, 0, 0, 12, 50, 710], width: 150, height: 12 },
    ];

    const result = extractPageMarkdown(rawItems, {}, { detectHeadings: false });
    expect(result).not.toContain('# Judul Besar');
    expect(result).toContain('Judul Besar');
  });
});

describe('PDF to Markdown - Lists & Code Formatting', () => {
  test('should normalize bullet glyphs into markdown list syntax', () => {
    const rawItems = [
      { str: '• Item satu', transform: [12, 0, 0, 12, 50, 700], width: 80, height: 12 },
      { str: '● Item dua', transform: [12, 0, 0, 12, 50, 680], width: 80, height: 12 },
      { str: '▪ Item tiga', transform: [12, 0, 0, 12, 50, 660], width: 80, height: 12 },
    ];

    const result = extractPageMarkdown(rawItems);
    expect(result).toContain('- Item satu');
    expect(result).toContain('- Item dua');
    expect(result).toContain('- Item tiga');
  });

  test('should format numbered list items properly', () => {
    const rawItems = [
      { str: '1. Langkah pertama', transform: [12, 0, 0, 12, 50, 700], width: 120, height: 12 },
      { str: '2. Langkah kedua', transform: [12, 0, 0, 12, 50, 680], width: 120, height: 12 },
    ];

    const result = extractPageMarkdown(rawItems);
    expect(result).toContain('1. Langkah pertama');
    expect(result).toContain('2. Langkah kedua');
  });

  test('should wrap monospace text lines in code blocks', () => {
    const rawItems = [
      {
        str: 'const x = 42;',
        transform: [11, 0, 0, 11, 50, 700],
        width: 100,
        height: 11,
        fontName: 'Courier',
      },
    ];

    const styles = {
      Courier: { fontFamily: 'Courier New, monospace' },
    };

    const result = extractPageMarkdown(rawItems, styles);
    expect(result).toContain('```\nconst x = 42;\n```');
  });
});

describe('PDF to Markdown - Paragraph Joining & De-hyphenation', () => {
  test('should join wrapped lines belonging to the same paragraph', () => {
    const rawItems = [
      {
        str: 'Ini adalah kalimat baris pertama yang bersambung ke baris',
        transform: [12, 0, 0, 12, 50, 700],
        width: 280,
        height: 12,
      },
      {
        str: 'kedua tanpa jeda paragraf baru.',
        transform: [12, 0, 0, 12, 50, 684],
        width: 180,
        height: 12,
      },
    ];

    const result = extractPageMarkdown(rawItems, {}, { smartParagraphs: true });
    expect(result).toBe('Ini adalah kalimat baris pertama yang bersambung ke baris kedua tanpa jeda paragraf baru.');
  });

  test('should de-hyphenate wrapped words across lines', () => {
    const rawItems = [
      {
        str: 'Dokumen ini menjelaskan implementa-',
        transform: [12, 0, 0, 12, 50, 700],
        width: 250,
        height: 12,
      },
      {
        str: 'si sistem utilitas PDF modern.',
        transform: [12, 0, 0, 12, 50, 684],
        width: 200,
        height: 12,
      },
    ];

    const result = extractPageMarkdown(rawItems, {}, { smartParagraphs: true });
    expect(result).toBe('Dokumen ini menjelaskan implementasi sistem utilitas PDF modern.');
  });

  test('should preserve separate paragraphs when vertical gap is large', () => {
    const rawItems = [
      {
        str: 'Paragraf satu selesai di sini.',
        transform: [12, 0, 0, 12, 50, 700],
        width: 200,
        height: 12,
      },
      {
        str: 'Paragraf dua dimulai setelah jarak baris yang cukup jauh.',
        transform: [12, 0, 0, 12, 50, 650],
        width: 320,
        height: 12,
      },
    ];

    const result = extractPageMarkdown(rawItems, {}, { smartParagraphs: true });
    expect(result).toBe('Paragraf satu selesai di sini.\n\nParagraf dua dimulai setelah jarak baris yang cukup jauh.');
  });
});

describe('PDF to Markdown - End-to-End Document Conversion Flow', () => {
  test('should convert multi-page PDF document and track progress', async () => {
    const mockPdfDoc = {
      numPages: 2,
      getPage: async (pageNum: number) => ({
        getTextContent: async () => ({
          items: [
            {
              str: pageNum === 1 ? 'Judul Dokumen A' : 'Paragraf isi di halaman kedua.',
              transform: [pageNum === 1 ? 24 : 12, 0, 0, pageNum === 1 ? 24 : 12, 50, 550],
              width: 150,
              height: pageNum === 1 ? 24 : 12,
            },
          ],
          styles: {},
        }),
      }),
    };

    const mockLoader = async () => mockPdfDoc;
    const dummyFile = new File(['dummy content'], 'dokumen-uji.pdf', { type: 'application/pdf' });

    const progressLogs: Array<{ current: number; total: number }> = [];
    const result = await convertPdfToMarkdown(
      dummyFile,
      (c, t) => progressLogs.push({ current: c, total: t }),
      { includePageBreaks: true, detectHeadings: true },
      mockLoader
    );

    expect(result.pageCount).toBe(2);
    expect(result.markdown).toContain('# dokumen-uji');
    expect(result.markdown).toContain('Judul Dokumen A');
    expect(result.markdown).toContain('---');
    expect(result.markdown).toContain('Paragraf isi di halaman kedua.');
    expect(result.wordCount).toBeGreaterThan(0);
    expect(result.charCount).toBeGreaterThan(0);
    expect(progressLogs.length).toBe(2);
    expect(progressLogs[0]).toEqual({ current: 1, total: 2 });
    expect(progressLogs[1]).toEqual({ current: 2, total: 2 });
  });
});
