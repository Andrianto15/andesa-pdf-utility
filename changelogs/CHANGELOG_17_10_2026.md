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
