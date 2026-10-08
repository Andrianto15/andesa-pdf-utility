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
              <p class="font-bold text-slate-800">Andesa PDF - Toolkit PDF Tanpa Batas & Free</p>
              <p class="text-[11px] text-slate-500 mt-0.5">Solusi utilitas dokumen PDF lengkap, cepat, bebas biaya, dan tanpa batasan kuota.</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-600 font-medium">
            <span class="flex items-center gap-1.5 text-emerald-600">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Tanpa Batas Kuota
            </span>
            <span>•</span>
            <span>Cepat & Presisi</span>
            <span>•</span>
            <span>100% Free</span>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px] text-center sm:text-left">
          <p>&copy; 2026 Andrian Tonur Iskandar. All rights reserved.</p>
          <p>Dilisensikan di bawah <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noreferrer" class="underline hover:text-slate-600 transition-colors">MIT License</a>.</p>
        </div>
      </div>
    </footer>
  `;
}
