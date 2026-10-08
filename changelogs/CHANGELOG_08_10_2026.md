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

### Perbaikan Konversi Word ke PDF (High-Fidelity Rendering)
- Memperbaiki bug kritis penumpukan teks (superimposed/overlapping text) di mana seluruh baris halaman berikutnya menimpa halaman pertama pada `src/tools/wordToPdf.ts`.
- Mengimplementasikan pipeline visual rendering presisi tinggi: `docx-preview` -> `html2canvas` (2x DPI) -> `pdf-lib`.
- Menjaga keutuhan tata letak dokumen Word asli: tabel, garis border, kolom, heading, warna teks, margin, dan tanda tangan (sign-off).
- Menambahkan algoritma vertical page slicing otomatis (`calculatePageSlices`) agar dokumen Word multi-halaman terpotong rapi per halaman A4 tanpa teks hilang atau tumpang tindih.
- Menambahkan unit test suite baru `tests/wordToPdf.test.ts` untuk memverifikasi kalkulasi pemotongan halaman dan interface modul.
- Memperbarui dokumentasi kebutuhan produk `docs/PRD.md` Bagian US-07 dan Arsitektur Teknis.

### Backend Microservice Word ke PDF (LibreOffice Native Engine)
- Menambahkan backend service di folder `server/` berbasis Node.js Express + LibreOffice headless (`soffice`).
- Menyediakan endpoint REST API `POST /api/convert/word-to-pdf` untuk konversi dokumen DOCX dengan fidelity visual 99% (render tabel, font, margin, dan tanda tangan native).
- Menyediakan endpoint health check `GET /api/health` untuk mendeteksi kesiapan LibreOffice engine di server.
- Menyediakan `server/Dockerfile` (Debian node:20-slim + libreoffice + font packages) dan root `docker-compose.yml` untuk deployment lokal / server via container.
- Mengintegrasikan arsitektur hybrid pada client `src/tools/wordToPdf.ts`: memprioritaskan backend LibreOffice jika tersedia, dan otomatis melakukan fallback ke client-side renderer jika backend offline.
- Menambahkan unit test integrasi backend dan error handling di `tests/wordToPdf.test.ts` (33 unit test lulus).
- Memperbarui `docs/PRD.md` Bagian 6 (US-07) dan Bagian 7 (Arsitektur Teknis Hybrid).

## Versi 0.1.1

### Backend Microservice PDF ke Word (LibreOffice Native Engine)
- Menambahkan endpoint REST API `POST /api/convert/pdf-to-word` pada `server/src/index.js` menggunakan LibreOffice headless dengan filter import `writer_pdf_import`.
- Menjaga keutuhan tata letak dokumen Word hasil konversi dari PDF: tabel, teks multi-kolom, styling heading, dan penataan paragraf.
- Memperbarui `server/Dockerfile` dengan penambahan paket `libreoffice-draw` untuk kelengkapan PDF import filter di lingkungan Debian Linux.
- Mengimplementasikan arsitektur hybrid pada `src/tools/pdfToWord.ts`: memprioritaskan pemrosesan di server microservice jika aktif, dan otomatis melakukan fallback ke client-side extractor (`convertPdfToWordClient`) jika server offline/tidak terjangkau.
- Menambahkan konfigurasi Jest polyfill `DOMMatrix` di `tests/setup.cjs` untuk kompatibilitas pengujian modul PDF di lingkungan Node.js.
- Menambahkan unit test suite `tests/pdfToWord.test.ts` (40 unit test total lulus 100%).
- Memperbarui dokumen spesifikasi `docs/PRD.md` Bagian US-08 dan Arsitektur Teknis.

### Rebranding: Tanpa Batas & Free (Peniadaan Klaim 100% No-Backend)
- Menghapus klaim mutlak "100% client-side", "Zero Server", "Zero Leak", dan "Tanpa Server Backend" dari seluruh komponen antarmuka pengguna seiring diterapkannya arsitektur hybrid backend.
- Memperbarui branding utama menjadi **Tanpa Batas & Free**:
  - Header (`src/components/header.ts`): badge `Tanpa Batas`, subjudul `Tanpa Batas • Bebas Biaya • 100% Free`, dan pill status `Tanpa Batas & Free`.
  - Footer (`src/components/footer.ts`): label `Andesa PDF - Toolkit PDF Tanpa Batas & Free` dan tag `Tanpa Batas Kuota`.
  - Hero (`src/components/hero.ts`): badge `Toolkit PDF Lengkap Tanpa Batas & 100% Free`, heading `Tanpa Batas dan Bebas Biaya`, dan pills fokus kebebasan kuota serta presisi konversi.
  - Workspace (`src/components/toolWorkspace.ts`): label info `Tanpa Batas & Free`, pembersihan teks "100% lokal", dan pembaruan fallback filename menjadi `dokumen-andesa.pdf`.
  - Registry Alat (`src/tools/index.ts`): pembaruan badge `Tanpa Batas` dan deskripsi modul Word ke PDF.
- Memperbarui metadata halaman `index.html` (title `Andesa PDF - Utilitas PDF Tanpa Batas & Free` dan deskripsi).
- Memperbarui dokumen `README.md` dan `docs/PRD.md` (Bagian 1, 3, dan 15) mencerminkan arsitektur hybrid dan positioning "Tanpa Batas dan Free".
- Menambahkan pengujian branding pada `tests/branding.test.ts` untuk memastikan tidak ada sisa klaim zero-server/client-side pada header, hero, footer, dan index.html (41 unit test lolos 100%).

## Versi 0.1.2

### Penambahan Copyright Footer & Konsistensi Identitas
- Menambahkan baris copyright resmi di bagian bawah footer (`src/components/footer.ts`):
  - Copyright notice: `© 2026 Andrian Tonur Iskandar. All rights reserved.`
  - Tautan lisensi MIT: `MIT License`.
  - Tata letak responsif mobile-first (`flex-col sm:flex-row`), pemusatan di viewport sempit, serta spasi padding rapi.
- Sinkronisasi versi package `0.1.2` pada `package.json` dan `package-lock.json`.
- Memperbarui unit test `tests/branding.test.ts` untuk memvalidasi teks copyright dan lisensi pada komponen footer.
- Memperbarui dokumentasi spesifikasi identitas `docs/PRD.md` Bagian 15.

### Optimasi Fitur PDF to Markdown (Rekonstruksi Spasial & Tipografi)
- Mengoptimalkan modul konversi PDF ke Markdown (`src/tools/pdfToMarkdown.ts`):
  - Pengurutan teks spasial (Y descending, X ascending) berdasarkan toleransi baseline baris visual untuk menjamin urutan baca (reading order) yang akurat.
  - Rekonstruksi struktur heading otomatis (`#`, `##`, `###`) dengan menghitung font size dominan dokumen dan mendeteksi bobot font (bold).
  - Smart paragraph joining: menyambungkan baris yang terputus akibat word wrap menjadi paragraf yang koheren, de-hyphenation kata terpotong di akhir baris (`-`), dan pemisahan paragraf hanya jika terdapat jeda baris vertikal yang signifikan.
  - Normalisasi list item: konversi simbol bullet (`•`, `●`, `▪`, dll.) menjadi format standar `- item` serta perapian numbered list (`1.`, `2.`).
  - Deteksi dan pembungkusan teks monospace (`Courier`, `Consolas`, dll.) ke dalam blok kode Markdown (```).
  - Penambahan opsi pemrosesan: `smartParagraphs`, `detectHeadings`, dan `includePageBreaks`.
  - Penambahan metrik ekstraksi dokumen: `pageCount`, `wordCount`, dan `charCount`.
- Memperbarui antarmuka workspace (`src/components/toolWorkspace.ts` & `src/main.ts`):
  - Panel kontrol konfigurasi optimasi Markdown (mobile-first, responsive grid): toggle Gabungkan Paragraf, Deteksi Heading, dan Pemisah Halaman (`---`).
  - Tampilan pratinjau hasil Markdown dilengkapi badge statistik (jumlah halaman, kata, karakter) dan tombol Salin ke Clipboard.
- Meningkatkan kompatibilitas utilitas (`src/utils/format.ts` & `src/utils/pdf.ts`):
  - Penggunaan `file.arrayBuffer()` modern dengan fallback `FileReader`.
  - Penambahan polyfill `Promise.withResolvers` dan `Promise.try` untuk keandalan eksekusi pdf.js.
- Menambahkan test suite komprehensif `tests/pdfToMarkdown.test.ts` (13 pengujian unit baru, 54 unit test total lulus 100%).
- Memperbarui dokumentasi spesifikasi `docs/PRD.md` Bagian US-05.

## Versi 0.1.3

### Penambahan GitHub Status Badges pada README.md
- Menambahkan status badges resmi (Shields.io) pada bagian header `README.md`:
  - **App Version**: Terhubung secara dinamis via metadata GitHub repository `Andrianto15/andesa-pdf-utility`.
  - **NPM Version**: Menampilkan versi npm dengan tautan ke registry package `andesa-pdf`.
  - **License**: Menampilkan lisensi MIT dengan tautan ke berkas `LICENSE`.
  - **Test Suite**: Menampilkan status passing unit test Jest (55 test passed).
  - **Tech Stack**: Badges untuk Node.js (>=18), TypeScript (5.x), Vite (6.x), dan Tailwind CSS (4.x).
  - **Komunitas**: Badge `PRs welcome` terhubung ke pull requests GitHub.
- Memperbarui URL clone repositori pada panduan instalasi `README.md` menjadi `https://github.com/Andrianto15/andesa-pdf-utility.git`.
- Menambahkan unit test suite verifikasi badges di `tests/readme.test.ts`.
- Memperbarui spesifikasi dokumentasi proyek pada `docs/PRD.md` Bagian 13.

## Versi 0.1.4

### Konfigurasi Environment Variables Frontend & Standarisasi Resolusi Backend URL
- Menambahkan berkas template environment `.env.example` dan berkas `.env` lokal dengan konfigurasi variabel `VITE_BACKEND_URL`.
- Memperbarui `.gitignore` agar mengabaikan `.env` dan `.env.*` untuk keamanan, dengan pengecualian `.env.example`.
- Membuat helper konfigurasi terpusat `src/utils/config.ts` (`getBackendUrl`) dengan hirarki resolusi bertingkat:
  1. Parameter override fungsi eksplisit (`options.backendUrl`).
  2. Vite build/runtime environment variable (`import.meta.env.VITE_BACKEND_URL`).
  3. Variabel injeksi global window (`window.__ANDESA_BACKEND_URL__`).
  4. Node/Jest environment variable (`process.env.VITE_BACKEND_URL`).
  5. Fallback lokal default (`http://localhost:3001`).
- Mengintegrasikan modul `src/tools/wordToPdf.ts` dan `src/tools/pdfToWord.ts` menggunakan helper `getBackendUrl`.
- Menambahkan test suite `tests/config.test.ts` (7 pengujian unit baru, total 62 pengujian unit lulus 100%).
- Memperbarui `README.md` (status badge tests 62 passed & instruksi penyalinan `.env.example`).
- Memperbarui dokumen spesifikasi arsitektur `docs/PRD.md` Bagian 7.
