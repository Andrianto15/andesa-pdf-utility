# Andesa PDF

Aplikasi web utilitas PDF _all-in-one_ yang **tanpa batas dan 100% free**. Pengolah dokumen lengkap, cepat, dan tanpa batasan kuota file.

---

## Fitur Utama

- **Merge PDF**: Gabungkan beberapa file PDF menjadi satu dengan urutan sesuai keinginan.
- **Split PDF**: Pisahkan dokumen berdasarkan rentang halaman atau ekstrak per halaman.
- **Kompres PDF**: Perkecil ukuran file dokumen menggunakan canvas downsampling langsung di memori.
- **Tanda Tangan (Sign) PDF**: Buat dan bubuhkan tanda tangan digital langsung pada halaman PDF.
- **JPG / PNG to PDF**: Konversi gambar menjadi dokumen PDF rapi dengan opsi ukuran & margin.
- **PDF to Markdown**: Ekstrak teks dan struktur paragraf dari PDF ke format Markdown (.md).
- **Word (.docx) to PDF**: Konversi dokumen Word (.docx) ke file PDF.
- **PDF to Word (.docx)**: Ekstrak isi teks dokumen PDF ke format Word (.docx).

---

## Keandalan & Fleksibilitas

Andesa PDF dirancang untuk kemudahan dan fleksibilitas pemrosesan dokumen:

- **Tanpa Batas Kuota**: Bebas mengolah dan mengonversi berkas dokumen kapan saja secara gratis.
- **Engine Fleksibel**: Mendukung pemrosesan instan client-side di peramban serta arsitektur hybrid microservice untuk konversi Word berpresisi tinggi.
- **Tanpa Akun**: Tidak memerlukan registrasi, login, atau token API.

---

## Tech Stack

- **Framework & Bundler**: Vite, TypeScript
- **Styling**: Tailwind CSS
- **PDF & Dokumen Processing**: `pdf-lib`, `pdfjs-dist`, `docx`, `docx-preview`, `jszip`
- **Icons**: Lucide Icons
- **Testing**: Jest, `ts-jest`

---

## Memulai Cepat (Quick Start)

### Prasyarat

- Node.js (v18+)
- npm atau pnpm

### Instalasi & Menjalankan

1. Clone repositori:

   ```bash
   git clone https://github.com/username/andesa-pdf.git
   cd andesa-pdf
   ```

2. Pasang dependensi:

   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:

   ```bash
   npm run dev
   ```

4. Bangun untuk produksi:

   ```bash
   npm run build
   ```

5. Jalankan unit test:
   ```bash
   npm test
   ```

6. Jalankan lint & autofix:
   ```bash
   npm run lint
   npm run lint:fix
   ```

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi **[MIT License](LICENSE)** - Copyright (c) 2026 Andrianto Nur Iskandar.
