# Changelog - 17-10-2026

## Versi 0.1.4

### Impeccable Adapt & Responsive Design
- **Safe Area Insets & Layar Ponsel**:
  - Menambahkan konfigurasi `viewport-fit=cover` pada meta viewport di `index.html` untuk adaptasi layar berponi (notch) dan sudut melengkung.
  - Menerapkan padding safe area CSS `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)`, `env(safe-area-inset-right)` pada `body` dan kontainer floating toast di `src/style.css`.
- **Adaptasi Input Sentuh (Coarse Pointer)**:
  - Menambahkan aturan media query `@media (pointer: coarse)` di `src/style.css` untuk memastikan target sentuh interaktif seperti handle pengubah ukuran tanda tangan (`#sign-resize-handle`) memenuhi standar ukuran minimum 44x44px pada layar sentuh.
- **Arsitektur Adaptif Tema Gelap**:
  - Mengintegrasikan fondasi variabel CSS tema gelap (`--bg-main`, `--bg-card`, `--border-card`, `--text-main`, `--text-muted`) dengan sistem `@media (prefers-color-scheme: dark)` dan kelas `.dark` di `src/style.css`.
- **Pengujian Unit & Dokumentasi**:
  - Menambahkan test suite baru `tests/adapt.test.ts` (4 unit test baru, total 14 test suite dan 72 test lulus 100%).
  - Memperbarui dokumen spesifikasi `docs/PRD.md` Bagian 8 (Design & UX Requirements).

## Versi 0.1.5

### Impeccable Document & Design System Tokens
- **Spesifikasi DESIGN.md Kanonikal**:
  - Membuat `DESIGN.md` pada root project dengan header YAML frontmatter (`name`, `description`, `colors`, `typography`, `rounded`, `spacing`, `components`) dan 8 seksi kanonikal Impeccable (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts).
  - Mendokumentasikan Creative North Star *"The Precision Document Lab"*, aturan kontras legibilitas, dan panduan layout responsif.
- **Sidecar Ekstensi (.impeccable/design.json)**:
  - Membuat `.impeccable/design.json` (schemaVersion 2) untuk menampung metadata token tingkat lanjut (`colorMeta` dengan tonal ramps, `typographyMeta`, `shadows`, `motion`, `breakpoints`), komponen HTML/CSS preview, serta narasi prinsip desain.
- **Konsolidasi Token CSS (@theme)**:
  - Menambahkan blok `@theme` Tailwind CSS v4 di `src/style.css` untuk mengekspos token semantik `--color-bg-main`, `--color-bg-card`, `--color-border-card`, `--color-text-main`, dan `--color-text-muted`.
- **Pengujian Unit & PRD**:
  - Menambahkan test suite `tests/designSystem.test.ts` (4 unit test baru, total 15 test suite dan 76 test lulus 100%).
  - Memperbarui `docs/PRD.md` dengan Bagian 16 (Design System & Design Tokens).

### Impeccable Quieter & Visual Noise Reduction
- **Tipografi Solid & Eliminasi Teks Gradien**:
  - Mengganti teks gradien klise AI `bg-clip-text text-transparent` pada judul utama hero dengan tipografi solid kontras tinggi (`text-indigo-600` dan `text-slate-900`).
- **Palet Warna Tonal & Tenang (10% Accent Rule)**:
  - Menyederhanakan `accentColor` di `src/tools/index.ts` dari gradien dua warna jenuh (`from-*-500 to-*-600`) menjadi warna solid fungsional yang terdefinisi konsisten (`bg-indigo-600`, `bg-sky-600`, dll.).
  - Mengganti logo mark dan tombol aksi workspace menjadi bayangan netral alami (`shadow-xs` / `hover:shadow-sm`) alih-alih bayangan glow neon berwarna jenuh.
- **Pembersihan Elemen Dekorasi Berlebih**:
  - Mengganti blur blob multi-warna ungu/indigo di background hero dengan ambient tint monokrom yang tenang.
  - Menghapus animasi `animate-pulse` konstan pada indikator status header.
- **Pengujian Unit & PRD**:
  - Menambahkan test suite `tests/quieter.test.ts` (5 unit test baru, total 16 test suite dan 81 test lulus 100%).
  - Memperbarui `docs/PRD.md` dengan Bagian 17 (Quieter Design Standards).

### Impeccable Polish & Contrast Optimization
- **Optimasi Rasio Kontras (WCAG AA ≥ 4.5:1)**:
  - Mengeliminasi teks kelas `text-slate-400` pada footer copyright dan hint placeholder kanvas tanda tangan, ditingkatkan ke `text-slate-500` (rasio kontras 4.6:1).
  - Meningkatkan keterbacaan interaktif pada link lisensi footer dengan `hover:text-slate-800`.
- **Pengujian Unit & PRD**:
  - Menambahkan test suite `tests/polish.test.ts` (3 unit test baru, total 17 test suite dan 84 test lulus 100%).
  - Memperbarui `docs/PRD.md` dengan Bagian 18 (Contrast Polish & Visual Quality Standards).

### Impeccable Typography & Type Ramp Synchronization (P2 Audit Resolution)
- **Sinkronisasi Font Monospace & Dokumen**:
  - Mendaftarkan `JetBrains Mono` sebagai `mono font` formal di `DESIGN.md` dan `.impeccable/design.json`, menyelaraskan font deklarasi Google Fonts di `index.html`.
  - Mendaftarkan font dokumen standar reader PDF (`Helvetica`, `Courier New`, `Times New Roman`) ke dalam token tipografi `document`.
- **Standarisasi Rampa Tipografi Micro & Nano**:
  - Mendefinisikan token ukuran `micro` (0.6875rem / 11px) dan `nano` (0.625rem / 10px) untuk melegitimasi ukuran teks metadata, status badge, dan subtext footer dalam token sistem desain.
  - Memperbarui assertions di `tests/designSystem.test.ts` untuk memvalidasi token tipografi baru.

## Versi 0.1.6

### Impeccable Card Heading & Palette Polish (P3 Audit Resolution)
- **Otoritas Tipografi Judul**:
  - Mengubah hover judul kartu alat dari `group-hover:text-indigo-600` menjadi `group-hover:text-slate-950` di `src/components/toolGrid.ts`, menuntaskan peringatan palette detector dan mempertahankan hierarki visual tenang.
- **Pembersihan Advisories & Token Formal**:
  - Mendaftarkan `#cbd5e1` (`neutral-border-hover`) dan `#94a3b8` (`neutral-muted-hover`) serta radius `xs: 4px` ke dalam token `DESIGN.md`, menghasilkan 0 advisory warnings pada scan detector.
  - Memperbarui `docs/PRD.md` Bagian 19 (Card Heading & Palette Polish Standards).

## Versi 0.2.0

### Steel Blue Theme & Color Palette Harmonization
- **Palet Warna Utama Steel Blue (`#4682b4`)**:
  - Mengubah warna tema utama dari indigo (`#4f46e5`) menjadi Steel Blue (`#4682b4`) dengan turunan hover `#36648b` dan active `#31587d`.
  - Mengonfigurasi skala rampa warna `@theme` Tailwind CSS v4 (`--color-steelblue-50` hingga `--color-steelblue-950`) di `src/style.css`.
  - Menyelaraskan token semantik CSS `:root` (`--color-primary: #4682b4`, `--color-primary-hover: #36648b`, `--color-accent: #0ea5e9`).
- **Harmonisasi Warna Sekunder & Aksesibilitas**:
  - Menyelaraskan aksen sekunder ke Sky Glow (`#0ea5e9` / dark `#38bdf8`) dan netral slate dengan undertone sejuk.
  - Memperbarui `:focus-visible` outline menjadi `#4682b4` dan drag-over dropzone tint (`#4682b4` border & `#f0f6fa` background).
  - Menyesuaikan SVG favicon stroke (`%234682B4`) dan selection highlight (`selection:bg-steelblue-500/20`) di `index.html`.
  - Memperbarui seluruh komponen UI (`header.ts`, `hero.ts`, `footer.ts`, `toolGrid.ts`, `toolWorkspace.ts`, `format.ts`, `main.ts`, `tools/index.ts`) dari kelas utilitas `indigo` ke `steelblue`.
- **Dokumentasi & Sistem Desain**:
  - Memperbarui token warna dan narasi spesifikasi di `DESIGN.md` dan `.impeccable/design.json`.
  - Memperbarui dokumen `docs/PRD.md` Bagian 8 (Design & UX Requirements).
- **Pengujian Unit & QA**:
  - Menambahkan test suite baru `tests/theme.test.ts` (8 unit test baru memvalidasi token, rampa warna, CSS variables, dan komponen UI).
  - Memperbarui `tests/quieter.test.ts` untuk assertions kelas warna baru (`text-steelblue-600` dan `bg-steelblue-600`).
  - Total 18 test suites dan 92 tests lulus 100% tanpa error, lolos build Vite & linter (`eslint . --fix`).

### Impeccable Audit P1 Hardening: Dark Mode System & Accessibility
- **Sistem Tema Gelap Responsif & Toggle Persisten**:
  - Menambahkan tombol toggle tema interaktif pada header (`#btn-theme-toggle`) dengan ikon matahari/bulan adaptif dan target sentuh minimal 44px (`min-h-[44px] min-w-[44px]`).
  - Menyediakan script inline pencegah FOUC (*Flash of Unstyled Content*) di `index.html` dan sinkronisasi state ke `localStorage` (`andesa-theme`).
  - Mengimplementasikan varian styling `dark:` lengkap di seluruh komponen UI: header, hero, katalog alat (`toolGrid`), panel kerja alat (`toolWorkspace`), footer, kontainer glassmorphism (`.glass-panel`, `.glass-card`), serta scrollbar kustom.
  - Memastikan rasio kontras teks tema gelap memenuhi WCAG AA/AAA (>11:1) dengan kelas `dark:text-slate-300` dan `dark:text-slate-100`.
- **Aksesibilitas Reduced Motion Terarah (Non-Destructive Reduced Motion)**:
  - Menggantikan aturan blanket kill `0.01ms` pada `@media (prefers-reduced-motion: reduce)` di `src/style.css` dengan transisi non-moving terarah (`transition-duration: 0.15s`, `transform: none`), sambil mempertahankan durasi `0.01ms` untuk animasi berputar `.animate-spin`.
- **Semantik Aksesibilitas Header & Toast**:
  - Menambahkan accessible `aria-label="Lihat kode sumber Andesa PDF di GitHub"` pada link GitHub di `src/components/header.ts`.
  - Menambahkan atribut `role="status"` dan `aria-live="polite"` pada `#toast-container` di `index.html`.
- **Pengujian Unit & QA**:
  - Menambahkan assertions dark mode dan accessibility di `tests/theme.test.ts` dan `tests/hardening.test.ts`.
  - Seluruh 18 test suite (94 tests) lulus 100%.

### Impeccable Audit P2 Resolution: Mobile Controls & Interaction Optimization
- **Standarisasi Target Sentuh Mobile (WCAG 2.5.5 ≥ 44x44px)**:
  - Meningkatkan ukuran tombol kontrol urutan file merge (`min-h-[44px] min-w-[44px]`).
  - Menyediakan pembungkus tap target 44x44px (`w-11 h-11`) pada ketiga swatch pemilih warna tinta tanda tangan (`sign-color-black`, `sign-color-blue`, `sign-color-red`).
  - Menstandarkan target sentuh 44px pada tombol aksi workspace: pemilih semua halaman (`#btn-select-all-pages`), reset halaman (`#btn-clear-pages`), bersihkan goresan (`#btn-clear-signature`), dan salin markdown (`#btn-copy-markdown`).
- **Live Regions & Semantik ARIA Lengkap pada Kontainer Progres**:
  - Menambahkan `role="status"` dan `aria-live="polite"` pada `#progress-container`.
  - Menambahkan `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"`, dan pembaruan dinamis `aria-valuenow` saat proses berjalan di `src/main.ts`.
- **Atribut ARIA Lengkap Slider Resizer Tanda Tangan**:
  - Menambahkan `aria-valuemin="48"`, `aria-valuemax="800"`, dan `aria-valuenow="180"` pada `#sign-resize-handle`.
  - Menyinkronkan nilai `aria-valuenow` secara realtime saat pengguna mengubah ukuran tanda tangan via pointer atau tombol keyboard panah.
- **Optimasi Kinerja Pratinjau Dokumen**:
  - Mengimplementasikan caching instans `PDFDocumentProxy` pada state pratinjau tanda tangan (`cachedSignPdfDoc`) untuk mengeliminasi pembacaan ulang file berulang saat berpindah halaman pratinjau.
- **Pengujian Unit & QA**:
  - Menambahkan assertions live regions, progressbar role, dan target sentuh 44px di `tests/hardening.test.ts`.
  - Seluruh 18 test suite (96 tests) lulus 100%.

### Impeccable Audit P3 Resolution: Typography & Antipattern Elimination
- **Migrasi Tipografi ke Public Sans**:
  - Mengganti font `Plus Jakarta Sans` dengan `Public Sans` di `index.html`, `src/style.css`, dan `DESIGN.md`.
  - Mengeliminasi peringatan `overused-font` pada scanner mechanical `impeccable detect`.
- **Formalisasi Palet Warna**:
  - Mendaftarkan warna dark mode tambahan (`dark-muted-thumb`, `dark-muted-hover`, `dark-drag-bg`, `black`) ke dalam `DESIGN.md`.
  - Menghasilkan 0 defect, 0 warning, dan 0 advisory pada scan `impeccable detect`.
- **Pengujian Unit & QA**:
  - Menambahkan pengujian `Public Sans` dan ketiadaan font klise di `tests/designSystem.test.ts`.
  - Seluruh 18 test suite (97 tests) lulus 100%.








