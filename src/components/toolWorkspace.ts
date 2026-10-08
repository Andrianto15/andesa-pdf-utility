import { getToolIconSvg } from './toolGrid';
import type { ToolInfo, UploadedFileItem } from '../types';
import { formatBytes } from '../utils/format';

export function renderToolWorkspace(
  tool: ToolInfo,
  files: UploadedFileItem[],
  isProcessing: boolean,
  progressText: string,
  progressPercent: number,
  resultBlob: Blob | null,
  resultDetails?: { filename: string; originalSize?: number; newSize?: number; markdownText?: string }
): string {
  return `
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Back Navigation Bar -->
      <div class="flex items-center justify-between mb-6">
        <button
          id="btn-back-to-home"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-xs sm:text-sm font-semibold cursor-pointer border border-slate-200/80 shadow-xs min-h-[44px]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          <span>Kembali ke Katalog</span>
        </button>

        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-medium text-slate-500">Proses Lokal di Memori</span>
        </div>
      </div>

      <!-- Tool Header Banner -->
      <div class="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
        <div class="flex items-center gap-4 sm:gap-5">
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${tool.accentColor} shadow-md flex-shrink-0 flex items-center justify-center text-white">
            ${getToolIconSvg(tool.icon)}
          </div>
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">${tool.title}</h1>
              ${tool.badge ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80">${tool.badge}</span>` : ''}
            </div>
            <p class="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">${tool.description}</p>
          </div>
        </div>
      </div>

      <!-- Main Workspace Container -->
      ${
        resultBlob
          ? renderResultView(tool, resultBlob, resultDetails)
          : files.length === 0
          ? renderUploadDropzone(tool)
          : renderToolControlPanel(tool, files, isProcessing, progressText, progressPercent)
      }
    </section>
  `;
}

function renderUploadDropzone(tool: ToolInfo): string {
  return `
    <div
      id="dropzone"
      class="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-8 sm:p-14 text-center bg-white hover:bg-indigo-50/[0.3] transition-all duration-300 cursor-pointer group shadow-xs"
    >
      <input
        type="file"
        id="file-input"
        class="hidden"
        accept="${tool.accept}"
        ${tool.multiple ? 'multiple' : ''}
      />
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-indigo-100/70 transition-all duration-300 shadow-xs">
        <svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
      </div>

      <h3 class="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
        Pilih atau Tarik File ke Sini
      </h3>
      <p class="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
        ${tool.multiple ? 'Dapat memilih beberapa file sekaligus.' : 'Pilih 1 file untuk diproses.'}
        Format didukung: <span class="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono text-xs">${tool.accept}</span>
      </p>

      <button
        id="btn-browse"
        class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer inline-flex items-center gap-2 min-h-[44px]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Pilih File dari Perangkat
      </button>

      <div class="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500">
        <span class="flex items-center gap-1.5 text-emerald-600 font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          Tanpa Batas & Free
        </span>
        <span>•</span>
        <span>Maksimal 100MB per file</span>
        <span>•</span>
        <span>Tanpa Registrasi</span>
      </div>
    </div>
  `;
}

function renderToolControlPanel(
  tool: ToolInfo,
  files: UploadedFileItem[],
  isProcessing: boolean,
  progressText: string,
  progressPercent: number
): string {
  return `
    <div class="space-y-6">
      <!-- File Management / Configuration Card -->
      <div class="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
        <div class="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <h3 class="font-bold text-slate-900 text-base sm:text-lg">Dokumen Siap Diproses (${files.length})</h3>
          </div>
          ${
            tool.multiple
              ? `
            <label class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer border border-slate-200 transition-colors inline-flex items-center gap-1.5 min-h-[40px]">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              <span>Tambah File</span>
              <input type="file" id="file-add-more" class="hidden" accept="${tool.accept}" multiple />
            </label>
          `
              : `
            <button id="btn-clear-files" class="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer min-h-[40px] px-2">Ganti File</button>
          `
          }
        </div>

        <!-- Tool Specific Interactive Body -->
        <div id="tool-custom-body" class="mb-6">
          ${renderSpecificToolControls(tool, files)}
        </div>

        <!-- Processing Progress Bar -->
        ${
          isProcessing
            ? `
          <div class="mt-6 pt-5 border-t border-slate-100">
            <div class="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ${progressText || 'Sedang memproses...'}
              </span>
              <span>${progressPercent}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
            </div>
          </div>
        `
            : ''
        }

        <!-- Action Button -->
        <div class="mt-6 pt-5 border-t border-slate-100 flex items-center justify-end gap-3 sm:gap-4">
          <button
            id="btn-reset-all"
            ${isProcessing ? 'disabled' : ''}
            class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            Batal
          </button>
          <button
            id="btn-process-action"
            ${isProcessing ? 'disabled' : ''}
            class="px-6 sm:px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 min-h-[44px]"
          >
            <span>${tool.actionText}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderSpecificToolControls(tool: ToolInfo, files: UploadedFileItem[]): string {
  switch (tool.id) {
    case 'merge':
      return renderMergeControls(files);
    case 'split':
      return renderSplitControls(files[0]);
    case 'compress':
      return renderCompressControls(files[0]);
    case 'jpg-to-pdf':
      return renderJpgToPdfControls(files);
    case 'sign':
      return renderSignControls(files[0]);
    case 'pdf-to-markdown':
    case 'word-to-pdf':
    case 'pdf-to-word':
      return renderStandardSingleFileControls(files[0]);
    default:
      return '';
  }
}

function renderMergeControls(files: UploadedFileItem[]): string {
  return `
    <div class="space-y-3" id="merge-file-list">
      <p class="text-xs text-slate-500 mb-2">Urutan file di bawah menentukan urutan halaman pada dokumen akhir.</p>
      ${files
        .map(
          (item, idx) => `
        <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors" data-file-id="${item.id}">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">${idx + 1}</span>
            <div class="truncate">
              <p class="text-sm font-semibold text-slate-900 truncate">${item.file.name}</p>
              <p class="text-xs text-slate-500">${item.sizeFormatted}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button data-move-up="${item.id}" class="p-2 rounded-lg bg-white hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center" title="Geser ke Atas">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
            </button>
            <button data-move-down="${item.id}" class="p-2 rounded-lg bg-white hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center" title="Geser ke Bawah">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <button data-remove="${item.id}" class="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer border border-rose-200 min-h-[36px] min-w-[36px] flex items-center justify-center" title="Hapus">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

function renderSplitControls(file: UploadedFileItem): string {
  return `
    <div class="space-y-6">
      <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <h4 class="text-sm font-bold text-slate-900">${file.file.name}</h4>
          <p class="text-xs text-slate-500">${file.sizeFormatted} • ${file.pageCount || '?'} Halaman</p>
        </div>
      </div>

      <!-- Mode Split -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-2">Mode Output Ekstraksi</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="p-4 rounded-xl border border-indigo-500 bg-indigo-50/50 cursor-pointer flex items-start gap-3">
            <input type="radio" name="split-mode" value="single" checked class="mt-1" />
            <div>
              <p class="text-sm font-bold text-slate-900">Gabungkan Halaman Terpilih</p>
              <p class="text-xs text-slate-500">Semua halaman terpilih digabung menjadi 1 file PDF baru.</p>
            </div>
          </label>
          <label class="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer flex items-start gap-3">
            <input type="radio" name="split-mode" value="zip" class="mt-1" />
            <div>
              <p class="text-sm font-bold text-slate-900">Pecah Per Halaman (ZIP)</p>
              <p class="text-xs text-slate-500">Setiap halaman menjadi file PDF terpisah di dalam arsip ZIP.</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Input Rentang Halaman -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-2">
          Rentang Halaman (Contoh: <code class="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">1-3, 5</code>)
        </label>
        <input
          type="text"
          id="split-range-input"
          value="1"
          placeholder="Contoh: 1-3, 5"
          class="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-sm focus:border-indigo-600 focus:outline-none min-h-[44px]"
        />
        <p class="text-[11px] text-slate-500 mt-1">Kosongkan atau ketik "1-${file.pageCount || 1}" untuk memilih semua halaman.</p>
      </div>

      <!-- Thumbnails Grid -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Pilih Halaman Secara Visual</h5>
          <div class="flex items-center gap-2 text-xs">
            <button id="btn-select-all-pages" class="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer">Pilih Semua</button>
            <span class="text-slate-300">•</span>
            <button id="btn-clear-pages" class="text-slate-500 hover:text-slate-700 font-semibold cursor-pointer">Reset</button>
          </div>
        </div>
        <div id="split-thumbnails-grid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2 bg-slate-100 rounded-2xl border border-slate-200">
          <div class="col-span-full py-8 text-center text-xs text-slate-500 animate-pulse">Memuat thumbnail halaman...</div>
        </div>
      </div>
    </div>
  `;
}

function renderCompressControls(file: UploadedFileItem): string {
  return `
    <div class="space-y-6">
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
        <div>
          <h4 class="text-sm font-bold text-slate-900">${file.file.name}</h4>
          <p class="text-xs text-slate-500">Ukuran Saat Ini: <span class="text-indigo-600 font-semibold">${file.sizeFormatted}</span></p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Siap Dikompres</span>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Pilih Level Kompresi</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label class="relative p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer flex flex-col justify-between transition-all group shadow-xs">
            <input type="radio" name="compress-level" value="extreme" class="absolute top-4 right-4" />
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Ekstrem</span>
              <h5 class="text-base font-bold text-slate-900 mt-1">Ukuran Terkecil</h5>
              <p class="text-xs text-slate-500 mt-2">Kualitas gambar rendah, kompresi maksimal (~60-80% hemat).</p>
            </div>
          </label>

          <label class="relative p-5 rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 cursor-pointer flex flex-col justify-between transition-all group shadow-sm">
            <input type="radio" name="compress-level" value="recommended" checked class="absolute top-4 right-4" />
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-700">Rekomendasi</span>
              <h5 class="text-base font-bold text-slate-900 mt-1">Kualitas Bagus</h5>
              <p class="text-xs text-slate-500 mt-2">Keseimbangan ideal antara keterbacaan teks dan ukuran (~40-60% hemat).</p>
            </div>
          </label>

          <label class="relative p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer flex flex-col justify-between transition-all group shadow-xs">
            <input type="radio" name="compress-level" value="light" class="absolute top-4 right-4" />
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Ringan</span>
              <h5 class="text-base font-bold text-slate-900 mt-1">Kualitas Tinggi</h5>
              <p class="text-xs text-slate-500 mt-2">Penurunan ukuran moderat dengan kualitas visual nyaris identik.</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  `;
}

function renderJpgToPdfControls(files: UploadedFileItem[]): string {
  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-2">Ukuran Halaman</label>
          <select id="jpg-page-size" class="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-indigo-600 focus:outline-none cursor-pointer min-h-[44px]">
            <option value="a4" selected>A4 (Standar)</option>
            <option value="letter">Letter</option>
            <option value="fit">Sesuai Ukuran Gambar</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-2">Orientasi</label>
          <select id="jpg-orientation" class="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-indigo-600 focus:outline-none cursor-pointer min-h-[44px]">
            <option value="auto" selected>Otomatis (Sesuai Gambar)</option>
            <option value="portrait">Tegak (Portrait)</option>
            <option value="landscape">Mendatar (Landscape)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-2">Margin Halaman</label>
          <select id="jpg-margin" class="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:border-indigo-600 focus:outline-none cursor-pointer min-h-[44px]">
            <option value="0" selected>Tanpa Margin</option>
            <option value="20">Kecil (20pt)</option>
            <option value="40">Sedang (40pt)</option>
          </select>
        </div>
      </div>

      <!-- Images Preview Grid -->
      <div>
        <p class="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Daftar Gambar (${files.length})</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-80 overflow-y-auto p-2 bg-slate-100 rounded-2xl border border-slate-200">
          ${files
            .map(
              (item, idx) => `
            <div class="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-square flex flex-col items-center justify-center shadow-xs">
              <img src="${item.previewUrl || ''}" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button data-remove-img="${item.id}" class="p-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors" title="Hapus">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
              <span class="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-900/80 text-[10px] text-white font-mono">${idx + 1}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function renderSignControls(file: UploadedFileItem): string {
  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
        <div>
          <h4 class="text-sm font-bold text-slate-900">${file.file.name}</h4>
          <p class="text-xs text-slate-500">${file.sizeFormatted} • ${file.pageCount || 1} Halaman</p>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-slate-700">Pilih Halaman Target:</label>
          <select id="sign-page-select" class="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none min-h-[36px]">
            ${Array.from({ length: file.pageCount || 1 }, (_, i) => `<option value="${i}">Halaman ${i + 1}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Canvas Drawing Tool -->
        <div class="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <h5 class="text-xs font-bold uppercase tracking-wider text-slate-700">Buat Tanda Tangan</h5>
              <div class="flex items-center gap-2">
                <button id="sign-color-black" class="w-6 h-6 rounded-full bg-black border-2 border-indigo-600 cursor-pointer" title="Hitam"></button>
                <button id="sign-color-blue" class="w-6 h-6 rounded-full bg-blue-600 border border-slate-300 cursor-pointer" title="Biru"></button>
                <button id="sign-color-red" class="w-6 h-6 rounded-full bg-rose-600 border border-slate-300 cursor-pointer" title="Merah"></button>
              </div>
            </div>

            <!-- Signature Pad Canvas -->
            <div class="relative w-full h-44 bg-slate-50 rounded-xl overflow-hidden border border-slate-300 shadow-inner">
              <canvas id="signature-pad-canvas" class="w-full h-full cursor-crosshair"></canvas>
              <div id="sign-placeholder-hint" class="absolute inset-0 flex items-center justify-center text-slate-400 text-xs pointer-events-none">
                Goreskan tanda tangan di sini
              </div>
            </div>

            <div class="flex items-center justify-between mt-3">
              <button id="btn-clear-signature" class="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer min-h-[36px]">Bersihkan Goresan</button>
              <label class="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer min-h-[36px] flex items-center">
                Upload PNG Transparan
                <input type="file" id="sign-upload-png" class="hidden" accept="image/png" />
              </label>
            </div>
          </div>

          <div class="mt-5 pt-3 border-t border-slate-100">
            <p class="text-xs text-slate-500">💡 Atur posisi kotak tanda tangan di halaman PDF sebelum klik terapkan.</p>
          </div>
        </div>

        <!-- Interactive PDF Page Placement Preview -->
        <div class="lg:col-span-7 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center">
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-700 self-start mb-3">
            Preview & Posisikan Tanda Tangan
          </h5>
          <div id="sign-preview-wrapper" class="relative max-w-full overflow-hidden rounded-xl border border-slate-300 shadow-sm bg-white">
            <canvas id="sign-pdf-canvas" class="max-w-full block"></canvas>
            <!-- Draggable Signature Box Overlay -->
            <div
              id="draggable-signature-box"
              class="absolute top-10 left-10 w-36 h-20 border-2 border-indigo-600 bg-indigo-50/40 cursor-move flex items-center justify-center select-none"
              style="touch-action: none;"
            >
              <img id="overlay-signature-img" class="max-w-full max-h-full pointer-events-none" />
              <div id="sign-resize-handle" class="absolute bottom-0 right-0 w-4 h-4 bg-indigo-600 cursor-se-resize"></div>
            </div>
          </div>
          <p class="text-[11px] text-slate-500 mt-2">Tarik kotak tanda tangan untuk memindahkan posisinya di atas halaman.</p>
        </div>
      </div>
    </div>
  `;
}

function renderStandardSingleFileControls(file: UploadedFileItem): string {
  return `
    <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div>
          <h4 class="text-sm sm:text-base font-bold text-slate-900">${file.file.name}</h4>
          <p class="text-xs text-slate-500">${file.sizeFormatted} • Siap diproses</p>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Siap</span>
    </div>
  `;
}

function renderResultView(
  _tool: ToolInfo,
  _blob: Blob,
  details?: { filename: string; originalSize?: number; newSize?: number; markdownText?: string }
): string {
  const filename = details?.filename || 'dokumen-andesa.pdf';

  return `
    <div class="p-6 sm:p-10 rounded-3xl bg-white border border-emerald-200 text-center shadow-md relative overflow-hidden">
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center mb-5 shadow-xs">
        <svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>

      <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">Dokumen Berhasil Diproses!</h2>
      <p class="text-xs sm:text-sm text-slate-500 mb-6">File Anda siap diunduh langsung tanpa pernah meninggalkan peramban.</p>

      <!-- Details comparison if compression -->
      ${
        details?.originalSize && details?.newSize
          ? `
        <div class="inline-flex items-center gap-4 sm:gap-6 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-sm">
          <div>
            <p class="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Ukuran Awal</p>
            <p class="font-bold text-slate-700">${formatBytes(details.originalSize)}</p>
          </div>
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          <div>
            <p class="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Ukuran Baru</p>
            <p class="font-bold text-emerald-600">${formatBytes(details.newSize)}</p>
          </div>
        </div>
      `
          : ''
      }

      <!-- Markdown Preview Box if tool is pdf-to-markdown -->
      ${
        details?.markdownText
          ? `
        <div class="text-left mb-6 max-w-3xl mx-auto">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-600">Pratinjau Markdown</span>
            <button id="btn-copy-markdown" class="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold cursor-pointer border border-indigo-200">
              Salin ke Clipboard
            </button>
          </div>
          <pre class="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 max-h-60 overflow-y-auto whitespace-pre-wrap">${details.markdownText}</pre>
        </div>
      `
          : ''
      }

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <button
          id="btn-download-result"
          class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span>Unduh ${filename}</span>
        </button>

        <button
          id="btn-process-another"
          class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200 min-h-[44px]"
        >
          Proses Dokumen Lain
        </button>
      </div>
    </div>
  `;
}
