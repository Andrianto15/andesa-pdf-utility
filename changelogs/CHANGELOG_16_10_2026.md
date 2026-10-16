# Changelog - 16-10-2026

## Versi 0.1.4

### Impeccable Hardening & Aksesibilitas (WCAG 2.1 AA)
- **Navigasi Keyboard Penuh**:
  - Menambahkan semantik `role="button"`, `tabindex="0"`, dan `aria-label` deskriptif pada seluruh kartu katalog alat (`toolGrid.ts`).
  - Mengimplementasikan keyboard activation listener (`Enter` dan `Space`) di `main.ts`.
  - Menambahkan visual focus rings kontras tinggi (`:focus-visible`) di `style.css`.
- **Semantik ARIA & Keterhubungan Form**:
  - Menambahkan `role="tablist"` pada wadah tab kategori dan `role="tab"` dengan `aria-selected` pada tombol kategori filter.
  - Menghubungkan eksplisit `<label for="...">` dengan `id` kontrol formulir (`split-range-input`, `jpg-page-size`, `jpg-orientation`, `jpg-margin`, `sign-page-select`).
  - Menambahkan `aria-label` deskriptif pada input berkas tersembunyi, tombol swatch warna tanda tangan (hitam, biru, merah), serta tombol aksi pemindahan dan penghapusan berkas.
- **Teks Alternatif (Alt) & Penanganan Gambar Rusak**:
  - Menambahkan atribut `alt` pada pratinjau berkas gambar JPG dan thumbnail ekstraksi halaman PDF.
  - Memberikan nilai default transparan SVG data URI pada `#overlay-signature-img` untuk mencegah peringatan gambar rusak (*broken-image box*) saat kanvas belum ditandatangani.
- **Interaksi Tanda Tangan Digital & Resize Affordance**:
  - Memfungsikan handle pengubah ukuran tanda tangan (`#sign-resize-handle`) dengan gesture sentuh mobile minimum 44px, pointer capture, serta penyesuaian ukuran melalui tombol panah keyboard.
- **Sensitivitas Gerakan Pengguna**:
  - Menambahkan media query `@media (prefers-reduced-motion: reduce)` pada `style.css` untuk kenyamanan pengguna dengan gangguan vestibular.
- **Pengujian Unit & Dokumentasi**:
  - Menambahkan test suite baru `tests/hardening.test.ts` (4 unit test baru, total 66 test lulus 100%).
  - Memperbarui dokumen spesifikasi `docs/PRD.md` Bagian 8 (Design & UX Requirements).

### Impeccable Optimize & Manajemen Memori
- **Eliminasi DOM Thrashing pada Progress Tracker**:
  - Mengubah fungsi `updateProgress()` di `main.ts` agar memperbarui node DOM secara langsung (`#progress-text`, `#progress-percent`, `#progress-bar-fill`) tanpa memicu re-render global `app.innerHTML` via `renderApp()`. Menghindari layout reflow berulang dan mempertahankan 60fps saat dokumen dengan puluhan halaman diproses.
- **Pelepasan Memori Blob Object URL (`URL.revokeObjectURL`)**:
  - Mengimplementasikan helper `revokeFilePreviews()` dan `clearUploadedFiles()` yang memanggil `URL.revokeObjectURL()` saat file dihapus tunggal, berkas dibersihkan, alat diganti, atau alur kerja di-reset.
- **Pencegahan Kebocoran Event Listener Window pada Canvas TTD**:
  - Menggantikan event listener mouse dan touch global pada `window` dengan Pointer Events terpadu (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) langsung di elemen canvas tanda tangan menggunakan `setPointerCapture(e.pointerId)`.
- **Pengujian Unit & Dokumentasi**:
  - Menambahkan test suite baru `tests/optimization.test.ts` (total 13 test suite, 68 test lulus 100%).
  - Memperbarui dokumen spesifikasi `docs/PRD.md` Bagian 7 (Memory Management & Runtime Performance Optimization).

