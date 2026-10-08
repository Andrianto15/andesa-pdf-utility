export function renderHeader(): string {
  return `
    <header class="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" id="nav-logo" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 shadow-md shadow-indigo-500/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="m9 15 2 2 4-4"/>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-xl tracking-tight text-slate-900">Andesa PDF</span>
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Client-Side</span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium hidden sm:block">Zero Server • Zero Leak • 100% Gratis</p>
          </div>
        </a>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="hidden sm:inline">100% Privasi di Browser</span>
            <span class="sm:hidden">Lokal</span>
          </div>

          <a href="https://github.com" target="_blank" rel="noreferrer" class="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors" title="Lihat Kode Sumber">
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
