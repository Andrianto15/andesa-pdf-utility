import assert from 'node:assert';
import { PDFDocument } from 'pdf-lib';

function parsePageRangeString(rangeStr, maxPages) {
  const parts = rangeStr.split(',').map((s) => s.trim()).filter(Boolean);
  const selected = new Set();

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(maxPages, Math.max(start, end));
        for (let p = from; p <= to; p++) {
          selected.add(p - 1);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        selected.add(page - 1);
      }
    }
  }

  return Array.from(selected).sort((a, b) => a - b);
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function runSelfCheck() {
  console.log('--- Menjalankan Self-Check Logika Core Andesa PDF ---');

  // 1. Uji parsing rentang halaman split
  const range1 = parsePageRangeString('1-3, 5', 10);
  assert.deepStrictEqual(range1, [0, 1, 2, 4], 'parsePageRangeString gagal parsing 1-3, 5');

  const range2 = parsePageRangeString('8-10, 2', 10);
  assert.deepStrictEqual(range2, [1, 7, 8, 9], 'parsePageRangeString gagal parsing urutan');

  const rangeEmpty = parsePageRangeString('', 5);
  assert.deepStrictEqual(rangeEmpty, [], 'parsePageRangeString gagal menangani string kosong');
  console.log('✓ parsePageRangeString logic passed');

  // 2. Uji formatBytes
  assert.strictEqual(formatBytes(0), '0 Bytes');
  assert.strictEqual(formatBytes(1024), '1 KB');
  assert.strictEqual(formatBytes(1048576), '1 MB');
  console.log('✓ formatBytes logic passed');

  // 3. Uji manipulasi dokumen PDF
  const doc1 = await PDFDocument.create();
  doc1.addPage([200, 200]);
  const bytes1 = await doc1.save();
  assert(bytes1.length > 0, 'Gagal menghasilkan bytes PDF');

  const doc2 = await PDFDocument.create();
  doc2.addPage([300, 300]);
  const bytes2 = await doc2.save();

  // Uji merge di memori
  const merged = await PDFDocument.create();
  const d1 = await PDFDocument.load(bytes1);
  const d2 = await PDFDocument.load(bytes2);
  const pages1 = await merged.copyPages(d1, d1.getPageIndices());
  const pages2 = await merged.copyPages(d2, d2.getPageIndices());
  pages1.forEach((p) => merged.addPage(p));
  pages2.forEach((p) => merged.addPage(p));
  assert.strictEqual(merged.getPageCount(), 2, 'Jumlah halaman merge harus 2');

  const mergedBytes = await merged.save();
  assert(mergedBytes.length > bytes1.length, 'Ukuran file merge harus valid');
  console.log('✓ PDF in-memory manipulation logic passed');

  console.log('Semua self-check berhasil 100%!');
}

runSelfCheck().catch((err) => {
  console.error('Self check failed:', err);
  process.exit(1);
});
