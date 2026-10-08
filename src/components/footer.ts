export function renderFooter(): string {
  return `
    <footer class="mt-auto border-t border-slate-200 bg-white py-10 text-slate-500 text-xs transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div class="flex flex-col sm:flex-row items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <div>
              <p class="font-bold text-slate-800">Andesa PDF - Client-Side PDF Toolkit</p>
              <p class="text-[11px] text-slate-500 mt-0.5">Privasi dokumen tanpa kompromi. Tidak ada pelacakan, tidak ada transmisi data file.</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-600 font-medium">
            <span class="flex items-center gap-1.5 text-emerald-600">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Zero-Server Architecture
            </span>
            <span>•</span>
            <span>WebAssembly & PDF.js</span>
            <span>•</span>
            <span>100% Gratis</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
