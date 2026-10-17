export function renderHeader(): string {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return `
    <header class="border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" id="nav-logo" class="flex items-center gap-3 group" aria-label="Beranda Andesa PDF">
          <div class="w-10 h-10 rounded-xl bg-steelblue-600 shadow-xs flex items-center justify-center text-white group-hover:bg-steelblue-700 transition-colors">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="m9 15 2 2 4-4"/>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">Andesa PDF</span>
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-steelblue-50 dark:bg-steelblue-950 text-steelblue-700 dark:text-steelblue-300 border border-steelblue-200 dark:border-steelblue-800">Tanpa Batas</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-300 font-medium hidden sm:block">Tanpa Batas • Bebas Biaya • 100% Free</p>
          </div>
        </a>

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="hidden sm:inline">Tanpa Batas & Free</span>
            <span class="sm:hidden">Free</span>
          </div>

          <button
            type="button"
            id="btn-theme-toggle"
            aria-label="${isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}"
            title="${isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}"
            class="p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <!-- Sun icon (for dark mode) -->
            <svg class="w-5 h-5 ${isDark ? 'block' : 'hidden'}" id="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <!-- Moon icon (for light mode) -->
            <svg class="w-5 h-5 ${isDark ? 'hidden' : 'block'}" id="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <a
            href="https://github.com/Andrianto15/andesa-pdf-utility"
            target="_blank"
            rel="noreferrer"
            aria-label="Lihat kode sumber Andesa PDF di GitHub"
            title="Lihat Kode Sumber di GitHub"
            class="p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  `;
}
