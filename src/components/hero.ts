export function renderHero(): string {
  return `
    <section class="relative pt-8 pb-6 sm:pt-14 sm:pb-10 text-center overflow-hidden">
      <!-- Background Ambient Tint -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gradient-to-tr from-indigo-200/50 to-purple-200/40 blur-[100px] rounded-full pointer-events-none"></div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-5 shadow-xs">
          <svg class="w-4 h-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Privasi Dokumen Terjamin 100% di Memori Browser
        </div>

        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
          Solusi Dokumen PDF Anda,<br class="hidden sm:inline"/>
          <span class="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">Tanpa Pernah Upload ke Server</span>
        </h1>

        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-7 leading-relaxed">
          Gabungkan, pisahkan, kompres, konversi Word dan Markdown, hingga tanda tangan dokumen. Cepat, aman di peramban, dan tanpa batas kuota.
        </p>

        <!-- Feature pills -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-medium text-slate-700">
          <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>Tanpa Server Backend</span>
          </div>
          <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>Tanpa Batasan File</span>
          </div>
          <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>100% Gratis & Bebas Iklan</span>
          </div>
        </div>
      </div>
    </section>
  `;
}
