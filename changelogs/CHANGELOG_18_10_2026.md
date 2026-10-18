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

## Versi 0.2.4

### Security Hardening: Frontend XSS Defense, Content Security Policy & Backend Isolation
- **Implementasi Sanitasi HTML (`escapeHtml`)**:
  - Menambahkan fungsi `escapeHtml()` di `src/utils/format.ts` untuk memfilter karakter khusus (`&`, `<`, `>`, `"`, `'`).
  - Mencegah DOM XSS pada `src/components/toolWorkspace.ts` dengan sanitasi nama berkas di seluruh modul (merge, split, compress, sign, convert, result view) serta atribut ARIA `aria-label`.
  - Mengamankan pratinjau teks Markdown hasil ekstraksi PDF (`<pre>`) dari injeksi tag skrip dan HTML.
  - Sanitasi pesan toast notifikasi dan pesan galat render thumbnail di `src/main.ts`.
- **Content Security Policy (CSP)**:
  - Memasang meta tag CSP di `index.html` dengan pembatasan domain script, fonts, cdnjs PDF worker, connect-src, dan object-src.
- **Isolasi Profil LibreOffice & Safety Flags**:
  - Mengisolasi profil LibreOffice per-request dengan argumen `-env:UserInstallation=file://${tempDir}/user_profile` untuk mencegah bentrok lock file dan state collision saat konversi paralel.
  - Menambahkan flags keamanan: `--headless`, `--norestore`, `--nofirststartwizard`, `--nologo`, `--nodefault`.
- **Validasi File Signature / Magic Bytes**:
  - Memverifikasi byte header berkas sebelum diproses: DOCX diverifikasi memiliki ZIP header (`PK\x03\x04`), dan PDF diverifikasi memiliki header `%PDF`. Mencegah berkas palsu/malformed dilempar ke parser LibreOffice.
- **CORS Whitelisting**:
  - Mengganti wildcard `cors()` dengan validator whitelist asal (`CORS_ORIGIN` atau default origin localhost port 5173/3000).
- **Proteksi DoS & Pembatas Konkurensi**:
  - Menerapkan semaphore konkurensi (`MAX_CONCURRENT_CONVERSIONS`) yang mengembalikan HTTP 503 saat server sedang memproses kapasitas penuh, mencegah kehabisan memori V8 dan lonjakan CPU 100%.
- **Sanitasi Error Output**:
  - Menghilangkan kebocoran stderr dan path direktori internal pada respons HTTP 500, menggantikannya dengan pesan kesalahan yang aman dan mencatat detail log ke console server.
- **Container Hardening**:
  - Memperbarui `server/Dockerfile` agar container dijalankan dengan hak akses non-root (`USER node` UID 1000).
- **Pengujian Unit Keamanan**:
  - Menambahkan test suite baru `tests/security.test.ts` dan `tests/serverSecurity.test.ts` (100% pass) untuk validasi mitigasi XSS, CSP, magic bytes, isolasi proses LibreOffice, CORS whitelist, dan konfigurasi Dockerfile non-root.
- **Proteksi Boundary & Evaluasi Aman PDF.js (Phase 3)**:
  - Mengonfigurasi `isEvalSupported: false` pada PDF.js `loadPdf()` untuk mencegah evaluasi skrip dinamis saat membaca berkas PDF.
  - Memperketat validasi batas input pada `parsePageRangeString()` dan pemeriksaan rentang halaman aktif pada `splitPdf()`.
  - Memvalidasi format payload data URL tanda tangan dan memvalidasi batas indeks halaman target pada `applySignatureToPdf()`.
  - Menambahkan pengujian ketahanan batas input dan verifikasi konfigurasi PDF.js pada `tests/security.test.ts`.
