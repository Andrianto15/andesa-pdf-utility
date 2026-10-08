# Changelog - 08-10-2026

## Versi 0.0.0

### Inisialisasi Aplikasi (MVP)
- Implementasi 8 modul utilitas PDF client-side: Merge, Split, Kompres, JPG to PDF, Tanda Tangan (E-Sign), PDF to Markdown, Word to PDF, PDF to Word.
- Zero-server architecture menggunakan `pdf-lib`, `pdfjs-dist`, `docx`, `docx-preview`, `jszip`.

### Rebranding & Light Theme Redesign
- Rebranding nama aplikasi dari PrivaPDF menjadi **DA-PDF**.
- Mengubah tema default menjadi **Light Theme** modern:
  - Latar belakang slate bersih (`#f8fafc`).
  - Permukaan card putih solid (`#ffffff`) dengan border halus (`#e2e8f0`).
  - Teks gelap kontras tinggi (`#0f172a` dan `#64748b`) memenuhi standar WCAG AA.
  - Aksen Indigo (`#4f46e5`) dan status privasi hijau Emerald (`#059669`).
- Penerapan panduan `antislop-ui` dan `antislop-layoutmobile`:
  - Tata letak mobile-first dengan tap target minimal 44px.
  - Reflow responsif untuk katalog kartu alat dan workspace kontrol.
- Setup unit testing suite menggunakan **Jest** dan `ts-jest` pada folder `tests/` dengan 10 unit test lulus (split, formatting, tools registry).
- Pembaruan dokumen `docs/PRD.md` sesuai spesifikasi DA-PDF dan light theme.

### Penambahan Lisensi MIT
- Menambahkan file `LICENSE` resmi berbasis **MIT License** dengan hak cipta Copyright (c) 2026 Andrian Tonur Iskandar.
- Memperbolehkan penggunaan bebas, modifikasi, redistribusi, serta komersialisasi dengan syarat menyertakan *copyright notice*.
- Menambahkan konfigurasi `"license": "MIT"` pada `package.json`.
- Memperbarui dokumentasi `docs/PRD.md` mencakup klausul Licensing & Distribution Policy.
- Menambahkan unit testing Jest `tests/license.test.ts` untuk memvalidasi integritas file lisensi dan konfigurasi package.

## Versi 0.1.0

### Dokumentasi Repositori (README.md)
- Membuat file `README.md` yang ringkas, esensial, dan informatif mencakup:
  - Ringkasan DA-PDF (zero-server, pemrosesan client-side in-browser).
  - Ikhtisar 8 modul MVP (Merge, Split, Kompres, Sign, JPG/PNG to PDF, PDF to Markdown, Word to PDF, PDF to Word).
  - Garansi privasi & keamanan pemrosesan 100% lokal di browser.
  - Tech stack utama (Vite, TypeScript, Tailwind CSS, pdf-lib, pdfjs-dist, docx, jszip, Jest).
  - Panduan instalasi dan menjalankan skrip pengembang (`npm run dev`, `npm run build`, `npm test`).
  - Informasi Lisensi MIT.
- Menambahkan unit testing Jest `tests/readme.test.ts` untuk memvalidasi keberadaan `README.md`, konten privasi/client-side, dan panduan skrip npm.
- Memperbarui `docs/PRD.md` Bagian 13 (Project Documentation).

### Konfigurasi Linting & Autofix (ESLint)
- Konfigurasi ESLint flat configuration (`eslint.config.js`) berbasis `typescript-eslint` dan `@eslint/js`.
- Menambahkan skrip linting di `package.json`:
  - `npm run lint`: pemeriksaan linting statis file TS/JS.
  - `npm run lint:fix`: autofix otomatis error/warning linting.
  - `npm run fix:lint`: alias untuk `npm run lint:fix`.
- Menambahkan panduan skrip linting ke `README.md` dan `docs/PRD.md` Bagian 14.
- Menambahkan unit test Jest `tests/lint.test.ts` serta pembaruan verifikasi di `tests/readme.test.ts`.

### Rebranding Aplikasi: Andesa PDF
- Rebranding menyeluruh dari DA-PDF menjadi **Andesa PDF**.
- Pembaruan komponen UI Header (`src/components/header.ts`) dan Footer (`src/components/footer.ts`).
- Pembaruan tag `<title>` dan `<meta name="description">` pada `index.html`.
- Pembaruan identitas package `"name": "andesa-pdf"` di `package.json` dan `package-lock.json`.
- Pembaruan prefix penamaan berkas hasil ekspor menjadi `andesa-pdf-*.pdf` pada `src/main.ts`.
- Pembaruan skrip self-check `src/self_check.mjs`.
- Sinkronisasi dokumentasi `README.md` dan `docs/PRD.md` (termasuk penambahan Bagian 15: Branding & Identity Standards).
- Penambahan unit test verifikasi identitas merek di `tests/branding.test.ts` dan pembaruan `tests/readme.test.ts`.


