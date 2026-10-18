# Changelog - 18-10-2026

## Versi 0.2.3

### Bugfix: Resolusi Toggle Tema pada Sistem Operasi Default Dark Mode
- **Override Varian Dark Tailwind CSS v4 (@custom-variant)**:
  - Mengintegrasikan direktif `@custom-variant dark (&:where(.dark, .dark *));` pada `src/style.css` untuk mengecualikan perilaku default berbasis media query `@media (prefers-color-scheme: dark)`.
  - Memastikan utilitas `dark:*` (warna latar, batas, teks, dan elemen glassmorphism) hanya aktif saat elemen dokumen memiliki kelas `.dark`, sehingga pengguna dengan sistem operasi bertema gelap dapat beralih ke tema terang (*light mode*) secara mulus tanpa adanya kebocoran gaya.
- **Pembaruan Pengujian & Verifikasi**:
  - Menambahkan pengujian unit baru pada `tests/theme.test.ts` untuk memastikan keberadaan deklarasi `@custom-variant dark` di `src/style.css`.
  - Memvalidasi adaptasi ikon matahari/bulan dan atribut aksesibilitas header (`aria-label`) saat beralih antara `.dark` dan `.light`.
- **Standardisasi Hak Cipta & Legal**:
  - Sinkronisasi penulisan nama pemilik hak cipta menjadi `Andrianto Nur Iskandar` pada `LICENSE`, `src/components/footer.ts`, `docs/PRD.md`, `tests/branding.test.ts`, dan `tests/license.test.ts`.
- **Pembaruan Dokumentasi**:
  - Memperbarui `docs/PRD.md` Bagian 20 (Dark Mode System & Accessibility Hardening) dengan arsitektur varian pemilih kelas tema gelap Tailwind CSS v4.
