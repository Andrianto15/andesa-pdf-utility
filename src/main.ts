import './style.css';
import { TOOLS_LIST } from './tools';
import type { ToolCategory, ToolId, ToolInfo, UploadedFileItem } from './types';
import { formatBytes, downloadBlob, readFileAsDataURL, showToast, readFileAsArrayBuffer } from './utils/format';
import { loadPdf, renderPageThumbnail, renderPageToCanvas } from './utils/pdf';
import { renderHeader } from './components/header';
import { renderHero } from './components/hero';
import { renderToolGrid } from './components/toolGrid';
import { renderToolWorkspace } from './components/toolWorkspace';
import { renderFooter } from './components/footer';

// Import tool handlers
import { mergePdfs } from './tools/merge';
import { splitPdf, parsePageRangeString } from './tools/split';
import { convertImagesToPdf, type ImageToPdfOptions } from './tools/jpgToPdf';
import { applySignatureToPdf, type SignaturePlacement } from './tools/sign';
import { convertPdfToMarkdown } from './tools/pdfToMarkdown';
import { compressPdf, type CompressionLevel } from './tools/compress';
import { convertWordToPdf } from './tools/wordToPdf';
import { convertPdfToWord } from './tools/pdfToWord';

// Application State
interface AppState {
  currentTool: ToolInfo | null;
  activeCategory: ToolCategory;
  files: UploadedFileItem[];
  isProcessing: boolean;
  progressText: string;
  progressPercent: number;
  resultBlob: Blob | null;
  resultDetails?: { filename: string; originalSize?: number; newSize?: number; markdownText?: string };
  // Tool-specific sub-states
  splitSelectedPages: Set<number>;
  splitMode: 'single' | 'zip';
  compressLevel: CompressionLevel;
  jpgOptions: ImageToPdfOptions;
  signTargetPage: number;
  signPenColor: string;
  signBoxNorm: { x: number; y: number; w: number; h: number };
  signatureDataUrl: string | null;
}

const state: AppState = {
  currentTool: null,
  activeCategory: 'all',
  files: [],
  isProcessing: false,
  progressText: '',
  progressPercent: 0,
  resultBlob: null,
  splitSelectedPages: new Set([0]),
  splitMode: 'single',
  compressLevel: 'recommended',
  jpgOptions: { pageSize: 'a4', orientation: 'auto', margin: 0 },
  signTargetPage: 0,
  signPenColor: '#000000',
  signBoxNorm: { x: 0.1, y: 0.7, w: 0.3, h: 0.15 },
  signatureDataUrl: null,
};

// Render Orchestrator
function renderApp(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const html = `
    ${renderHeader()}
    <main class="flex-grow">
      ${
        state.currentTool
          ? renderToolWorkspace(
              state.currentTool,
              state.files,
              state.isProcessing,
              state.progressText,
              state.progressPercent,
              state.resultBlob,
              state.resultDetails
            )
          : `
            ${renderHero()}
            ${renderToolGrid(state.activeCategory)}
          `
      }
    </main>
    ${renderFooter()}
  `;

  app.innerHTML = html;
  bindEvents();
}

// Event Bindings
function bindEvents(): void {
  // Navigation Logo & Home Button
  document.getElementById('nav-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    selectTool(null);
  });

  document.getElementById('btn-back-to-home')?.addEventListener('click', () => {
    selectTool(null);
  });

  // Category Tabs
  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const cat = target.dataset.category as ToolCategory;
      if (cat) {
        state.activeCategory = cat;
        renderApp();
      }
    });
  });

  // Tool Card Click
  document.querySelectorAll('.tool-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const toolId = target.dataset.toolId as ToolId;
      const tool = TOOLS_LIST.find((t) => t.id === toolId);
      if (tool) {
        selectTool(tool);
      }
    });
  });

  if (state.currentTool) {
    bindWorkspaceEvents();
  }
}

function selectTool(tool: ToolInfo | null): void {
  state.currentTool = tool;
  state.files = [];
  state.isProcessing = false;
  state.progressText = '';
  state.progressPercent = 0;
  state.resultBlob = null;
  state.resultDetails = undefined;
  state.splitSelectedPages = new Set([0]);
  state.signatureDataUrl = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

function bindWorkspaceEvents(): void {
  const tool = state.currentTool;
  if (!tool) return;

  // File Upload Handlers (Dropzone & Browse)
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
  const btnBrowse = document.getElementById('btn-browse');
  const fileAddMore = document.getElementById('file-add-more') as HTMLInputElement | null;
  const btnClearFiles = document.getElementById('btn-clear-files');
  const btnResetAll = document.getElementById('btn-reset-all');

  btnBrowse?.addEventListener('click', () => fileInput?.click());
  dropzone?.addEventListener('click', (e) => {
    if (e.target !== btnBrowse) fileInput?.click();
  });

  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer?.files) {
        handleIncomingFiles(Array.from(e.dataTransfer.files));
      }
    });
  }

  fileInput?.addEventListener('change', () => {
    if (fileInput.files) {
      handleIncomingFiles(Array.from(fileInput.files));
    }
  });

  fileAddMore?.addEventListener('change', () => {
    if (fileAddMore.files) {
      handleIncomingFiles(Array.from(fileAddMore.files), true);
    }
  });

  btnClearFiles?.addEventListener('click', () => {
    state.files = [];
    renderApp();
  });

  btnResetAll?.addEventListener('click', () => {
    state.files = [];
    renderApp();
  });

  // Action Run Button
  document.getElementById('btn-process-action')?.addEventListener('click', () => {
    executeToolAction();
  });

  // Result View Buttons
  document.getElementById('btn-download-result')?.addEventListener('click', () => {
    if (state.resultBlob && state.resultDetails) {
      downloadBlob(state.resultBlob, state.resultDetails.filename);
      showToast('Unduhan berkas dimulai!', 'success');
    }
  });

  document.getElementById('btn-copy-markdown')?.addEventListener('click', () => {
    if (state.resultDetails?.markdownText) {
      navigator.clipboard.writeText(state.resultDetails.markdownText);
      showToast('Markdown berhasil disalin ke clipboard!', 'success');
    }
  });

  document.getElementById('btn-process-another')?.addEventListener('click', () => {
    state.resultBlob = null;
    state.resultDetails = undefined;
    state.files = [];
    renderApp();
  });

  // Specific Tool Controls
  if (tool.id === 'merge') {
    bindMergeControls();
  } else if (tool.id === 'split') {
    bindSplitControls();
  } else if (tool.id === 'compress') {
    bindCompressControls();
  } else if (tool.id === 'jpg-to-pdf') {
    bindJpgToPdfControls();
  } else if (tool.id === 'sign') {
    bindSignControls();
  }
}

// Merge Handlers
function bindMergeControls(): void {
  document.querySelectorAll('[data-move-up]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.moveUp;
      const idx = state.files.findIndex((f) => f.id === id);
      if (idx > 0) {
        const temp = state.files[idx];
        state.files[idx] = state.files[idx - 1];
        state.files[idx - 1] = temp;
        renderApp();
      }
    });
  });

  document.querySelectorAll('[data-move-down]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.moveDown;
      const idx = state.files.findIndex((f) => f.id === id);
      if (idx !== -1 && idx < state.files.length - 1) {
        const temp = state.files[idx];
        state.files[idx] = state.files[idx + 1];
        state.files[idx + 1] = temp;
        renderApp();
      }
    });
  });

  document.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.remove;
      state.files = state.files.filter((f) => f.id !== id);
      renderApp();
    });
  });
}

// Split Handlers
async function bindSplitControls(): Promise<void> {
  const fileItem = state.files[0];
  if (!fileItem) return;

  const modeRadios = document.querySelectorAll('input[name="split-mode"]');
  modeRadios.forEach((r) => {
    r.addEventListener('change', (e) => {
      state.splitMode = (e.target as HTMLInputElement).value as 'single' | 'zip';
    });
  });

  const rangeInput = document.getElementById('split-range-input') as HTMLInputElement | null;
  rangeInput?.addEventListener('input', () => {
    const selected = parsePageRangeString(rangeInput.value, fileItem.pageCount || 1);
    state.splitSelectedPages = new Set(selected);
    updateSplitThumbnailCheckboxes();
  });

  document.getElementById('btn-select-all-pages')?.addEventListener('click', () => {
    const max = fileItem.pageCount || 1;
    state.splitSelectedPages = new Set(Array.from({ length: max }, (_, i) => i));
    if (rangeInput) rangeInput.value = `1-${max}`;
    updateSplitThumbnailCheckboxes();
  });

  document.getElementById('btn-clear-pages')?.addEventListener('click', () => {
    state.splitSelectedPages.clear();
    if (rangeInput) rangeInput.value = '';
    updateSplitThumbnailCheckboxes();
  });

  // Render Thumbnails in Background
  const grid = document.getElementById('split-thumbnails-grid');
  if (grid) {
    try {
      const buffer = await readFileAsArrayBuffer(fileItem.file);
      const pdfDoc = await loadPdf(buffer);
      const numPages = pdfDoc.numPages;
      fileItem.pageCount = numPages;

      grid.innerHTML = '';
      for (let i = 1; i <= numPages; i++) {
        const pageIdx = i - 1;
        const thumbUrl = await renderPageThumbnail(pdfDoc, i, 160);
        const card = document.createElement('div');
        const isChecked = state.splitSelectedPages.has(pageIdx);

        card.className = `split-thumb-card relative rounded-xl border p-1 cursor-pointer transition-all ${
          isChecked ? 'border-indigo-500 bg-indigo-500/10 shadow-md' : 'border-white/10 bg-white/5 opacity-70'
        }`;
        card.dataset.pageIndex = `${pageIdx}`;
        card.innerHTML = `
          <img src="${thumbUrl}" class="w-full rounded-lg object-contain bg-white" />
          <div class="flex items-center justify-between mt-1 px-1 text-[11px]">
            <span class="font-bold text-white">Hal. ${i}</span>
            <input type="checkbox" ${isChecked ? 'checked' : ''} class="thumb-checkbox pointer-events-none" />
          </div>
        `;

        card.addEventListener('click', () => {
          if (state.splitSelectedPages.has(pageIdx)) {
            state.splitSelectedPages.delete(pageIdx);
          } else {
            state.splitSelectedPages.add(pageIdx);
          }
          if (rangeInput) {
            rangeInput.value = Array.from(state.splitSelectedPages)
              .sort((a, b) => a - b)
              .map((p) => p + 1)
              .join(', ');
          }
          updateSplitThumbnailCheckboxes();
        });

        grid.appendChild(card);
      }
    } catch (err: any) {
      grid.innerHTML = `<div class="col-span-full py-4 text-center text-xs text-rose-400">Gagal render thumbnail: ${err.message}</div>`;
    }
  }
}

function updateSplitThumbnailCheckboxes(): void {
  document.querySelectorAll('.split-thumb-card').forEach((card) => {
    const el = card as HTMLElement;
    const pageIdx = parseInt(el.dataset.pageIndex || '-1', 10);
    const cb = el.querySelector('.thumb-checkbox') as HTMLInputElement | null;
    const isSelected = state.splitSelectedPages.has(pageIdx);

    if (cb) cb.checked = isSelected;
    if (isSelected) {
      el.classList.add('border-indigo-500', 'bg-indigo-500/10', 'shadow-md');
      el.classList.remove('border-white/10', 'bg-white/5', 'opacity-70');
    } else {
      el.classList.remove('border-indigo-500', 'bg-indigo-500/10', 'shadow-md');
      el.classList.add('border-white/10', 'bg-white/5', 'opacity-70');
    }
  });
}

// Compress Handlers
function bindCompressControls(): void {
  document.querySelectorAll('input[name="compress-level"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      state.compressLevel = (e.target as HTMLInputElement).value as CompressionLevel;
    });
  });
}

// JPG Handlers
function bindJpgToPdfControls(): void {
  const sizeSelect = document.getElementById('jpg-page-size') as HTMLSelectElement | null;
  const orientSelect = document.getElementById('jpg-orientation') as HTMLSelectElement | null;
  const marginSelect = document.getElementById('jpg-margin') as HTMLSelectElement | null;

  sizeSelect?.addEventListener('change', () => {
    state.jpgOptions.pageSize = sizeSelect.value as any;
  });
  orientSelect?.addEventListener('change', () => {
    state.jpgOptions.orientation = orientSelect.value as any;
  });
  marginSelect?.addEventListener('change', () => {
    state.jpgOptions.margin = parseInt(marginSelect.value, 10);
  });

  document.querySelectorAll('[data-remove-img]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.removeImg;
      state.files = state.files.filter((f) => f.id !== id);
      renderApp();
    });
  });
}

// Sign Handlers
async function bindSignControls(): Promise<void> {
  const fileItem = state.files[0];
  if (!fileItem) return;

  const canvas = document.getElementById('signature-pad-canvas') as HTMLCanvasElement | null;
  const hint = document.getElementById('sign-placeholder-hint');
  const overlayImg = document.getElementById('overlay-signature-img') as HTMLImageElement | null;
  const dragBox = document.getElementById('draggable-signature-box') as HTMLElement | null;
  const pdfCanvas = document.getElementById('sign-pdf-canvas') as HTMLCanvasElement | null;
  const pageSelect = document.getElementById('sign-page-select') as HTMLSelectElement | null;

  // Signature Pad Drawing Canvas Logic
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = state.signPenColor;
    }

    let isDrawing = false;
    let hasDrawn = false;

    const startDraw = (x: number, y: number) => {
      if (!ctx) return;
      isDrawing = true;
      hasDrawn = true;
      hint?.classList.add('hidden');
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (x: number, y: number) => {
      if (!isDrawing || !ctx) return;
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDraw = () => {
      if (!isDrawing) return;
      isDrawing = false;
      if (hasDrawn && canvas) {
        state.signatureDataUrl = canvas.toDataURL('image/png');
        if (overlayImg) overlayImg.src = state.signatureDataUrl;
      }
    };

    canvas.addEventListener('mousedown', (e) => {
      const r = canvas.getBoundingClientRect();
      startDraw(e.clientX - r.left, e.clientY - r.top);
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const r = canvas.getBoundingClientRect();
      draw(e.clientX - r.left, e.clientY - r.top);
    });
    window.addEventListener('mouseup', stopDraw);

    // Touch events for mobile
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const r = canvas.getBoundingClientRect();
      startDraw(touch.clientX - r.left, touch.clientY - r.top);
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const r = canvas.getBoundingClientRect();
      draw(touch.clientX - r.left, touch.clientY - r.top);
    });
    canvas.addEventListener('touchend', stopDraw);
  }

  // Clear Signature
  document.getElementById('btn-clear-signature')?.addEventListener('click', () => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      hint?.classList.remove('hidden');
      state.signatureDataUrl = null;
      if (overlayImg) overlayImg.src = '';
    }
  });

  // Color selection
  const setPenColor = (color: string) => {
    state.signPenColor = color;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.strokeStyle = color;
    }
  };
  document.getElementById('sign-color-black')?.addEventListener('click', () => setPenColor('#000000'));
  document.getElementById('sign-color-blue')?.addEventListener('click', () => setPenColor('#1d4ed8'));
  document.getElementById('sign-color-red')?.addEventListener('click', () => setPenColor('#dc2626'));

  // Upload PNG Signature
  const uploadPngInput = document.getElementById('sign-upload-png') as HTMLInputElement | null;
  uploadPngInput?.addEventListener('change', async () => {
    if (uploadPngInput.files && uploadPngInput.files[0]) {
      const url = await readFileAsDataURL(uploadPngInput.files[0]);
      state.signatureDataUrl = url;
      if (overlayImg) overlayImg.src = url;
      hint?.classList.add('hidden');
      showToast('Gambar tanda tangan PNG dimuat', 'success');
    }
  });

  // Render PDF Target Page on Preview Canvas
  const loadPagePreview = async (pageIdx: number) => {
    state.signTargetPage = pageIdx;
    try {
      const buffer = await readFileAsArrayBuffer(fileItem.file);
      const pdfDoc = await loadPdf(buffer);
      fileItem.pageCount = pdfDoc.numPages;
      const { canvas: rendered, width, height } = await renderPageToCanvas(pdfDoc, pageIdx + 1, 1.2);

      if (pdfCanvas) {
        pdfCanvas.width = width;
        pdfCanvas.height = height;
        const ctx = pdfCanvas.getContext('2d');
        ctx?.drawImage(rendered, 0, 0);
      }
    } catch (err: any) {
      showToast('Gagal memuat pratinjau halaman PDF: ' + err.message, 'error');
    }
  };

  pageSelect?.addEventListener('change', () => {
    loadPagePreview(parseInt(pageSelect.value, 10));
  });

  loadPagePreview(state.signTargetPage);

  // Draggable Box Logic
  if (dragBox && pdfCanvas) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    dragBox.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).id === 'sign-resize-handle') return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = dragBox.offsetLeft;
      initialTop = dragBox.offsetTop;
      dragBox.setPointerCapture(e.pointerId);
    });

    dragBox.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const wrapper = document.getElementById('sign-preview-wrapper');
      if (!wrapper) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const maxLeft = wrapper.clientWidth - dragBox.offsetWidth;
      const maxTop = wrapper.clientHeight - dragBox.offsetHeight;

      const newLeft = Math.max(0, Math.min(maxLeft, initialLeft + deltaX));
      const newTop = Math.max(0, Math.min(maxTop, initialTop + deltaY));

      dragBox.style.left = `${newLeft}px`;
      dragBox.style.top = `${newTop}px`;

      // Update Normalized Coordinates
      state.signBoxNorm.x = newLeft / wrapper.clientWidth;
      state.signBoxNorm.y = newTop / wrapper.clientHeight;
      state.signBoxNorm.w = dragBox.offsetWidth / wrapper.clientWidth;
      state.signBoxNorm.h = dragBox.offsetHeight / wrapper.clientHeight;
    });

    const stopDrag = () => {
      isDragging = false;
    };
    dragBox.addEventListener('pointerup', stopDrag);
    dragBox.addEventListener('pointercancel', stopDrag);
  }
}

// File Incoming Handler
async function handleIncomingFiles(newFiles: File[], append = false): Promise<void> {
  const tool = state.currentTool;
  if (!tool) return;

  const validFiles = newFiles.filter((f) => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (tool.id === 'jpg-to-pdf') {
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    }
    if (tool.id === 'word-to-pdf') {
      return ext === '.docx';
    }
    return ext === '.pdf';
  });

  if (validFiles.length === 0) {
    showToast('Tipe berkas tidak didukung untuk alat ini', 'error');
    return;
  }

  const items: UploadedFileItem[] = [];

  for (const f of validFiles) {
    let previewUrl: string | undefined;
    let pageCount: number | undefined;

    if (f.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(f);
    } else if (f.name.toLowerCase().endsWith('.pdf')) {
      try {
        const buffer = await readFileAsArrayBuffer(f);
        const pdf = await loadPdf(buffer);
        pageCount = pdf.numPages;
      } catch {
        // Fallback jika tidak bisa render metadata awal
      }
    }

    items.push({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      previewUrl,
      pageCount,
      sizeFormatted: formatBytes(f.size),
    });
  }

  if (tool.multiple && append) {
    state.files = [...state.files, ...items];
  } else {
    state.files = tool.multiple ? items : [items[0]];
  }

  renderApp();
}

// Execution Pipeline
async function executeToolAction(): Promise<void> {
  const tool = state.currentTool;
  if (!tool || state.files.length === 0) return;

  state.isProcessing = true;
  state.progressPercent = 10;
  state.progressText = 'Menyiapkan berkas...';
  renderApp();

  const updateProgress = (current: number, total: number) => {
    state.progressPercent = Math.min(95, Math.round((current / total) * 90) + 10);
    state.progressText = `Memproses halaman/bagian ${current} dari ${total}...`;
    renderApp();
  };

  try {
    const primaryFile = state.files[0].file;
    const baseName = primaryFile.name.replace(/\.[^/.]+$/, '');

    switch (tool.id) {
      case 'merge': {
        const blob = await mergePdfs(state.files, updateProgress);
        state.resultBlob = blob;
        state.resultDetails = {
          filename: `andesa-pdf-gabungan-${Date.now()}.pdf`,
          newSize: blob.size,
        };
        break;
      }

      case 'split': {
        const selected = Array.from(state.splitSelectedPages).sort((a, b) => a - b);
        if (selected.length === 0) {
          throw new Error('Pilih minimal 1 halaman untuk diekstrak');
        }
        const { blob, filename } = await splitPdf(primaryFile, selected, state.splitMode, updateProgress);
        state.resultBlob = blob;
        state.resultDetails = { filename, newSize: blob.size };
        break;
      }

      case 'compress': {
        const res = await compressPdf(primaryFile, { level: state.compressLevel }, updateProgress);
        state.resultBlob = res.blob;
        state.resultDetails = {
          filename: `${baseName}-terkompresi.pdf`,
          originalSize: res.originalSize,
          newSize: res.newSize,
        };
        break;
      }

      case 'jpg-to-pdf': {
        const blob = await convertImagesToPdf(state.files, state.jpgOptions, updateProgress);
        state.resultBlob = blob;
        state.resultDetails = {
          filename: `andesa-pdf-gambar-${Date.now()}.pdf`,
          newSize: blob.size,
        };
        break;
      }

      case 'sign': {
        if (!state.signatureDataUrl) {
          throw new Error('Silakan goreskan tanda tangan atau upload file PNG terlebih dahulu');
        }
        const placement: SignaturePlacement = {
          pageIndex: state.signTargetPage,
          normX: state.signBoxNorm.x,
          normY: state.signBoxNorm.y,
          normWidth: state.signBoxNorm.w,
          normHeight: state.signBoxNorm.h,
          signatureDataUrl: state.signatureDataUrl,
        };
        const blob = await applySignatureToPdf(primaryFile, [placement]);
        state.resultBlob = blob;
        state.resultDetails = {
          filename: `${baseName}-tertandatangani.pdf`,
          newSize: blob.size,
        };
        break;
      }

      case 'pdf-to-markdown': {
        const { markdown } = await convertPdfToMarkdown(primaryFile, updateProgress);
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        state.resultBlob = blob;
        state.resultDetails = {
          filename: `${baseName}.md`,
          markdownText: markdown,
          newSize: blob.size,
        };
        break;
      }

      case 'word-to-pdf': {
        const blob = await convertWordToPdf(primaryFile, updateProgress);
        state.resultBlob = blob;
        state.resultDetails = {
          filename: `${baseName}-converted.pdf`,
          newSize: blob.size,
        };
        break;
      }

      case 'pdf-to-word': {
        const blob = await convertPdfToWord(primaryFile, updateProgress);
        state.resultBlob = blob;
        state.resultDetails = {
          filename: `${baseName}-converted.docx`,
          newSize: blob.size,
        };
        break;
      }
    }

    state.progressPercent = 100;
    state.progressText = 'Selesai!';
    showToast('Proses selesai dengan sukses!', 'success');
  } catch (err: any) {
    showToast(err.message || 'Terjadi kesalahan saat memproses dokumen', 'error');
  } finally {
    state.isProcessing = false;
    renderApp();
  }
}

// Initial Launch
renderApp();
