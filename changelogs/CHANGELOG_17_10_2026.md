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
