import { TOOLS_LIST } from '../tools';
import type { ToolCategory, ToolInfo } from '../types';

export function getToolIconSvg(iconName: string): string {
  switch (iconName) {
    case 'merge':
      return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>`;
    case 'split':
      return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"/></svg>`;
    case 'minimize-2':
      return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M4 10h6m0 0V4m0 6L3 3m17 7h-6m0 0V4m0 6l7-7"/></svg>`;
    case 'image':
      return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" stroke-width="2"/><circle cx="9" cy="9" r="2" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 15-3.086-3.086a2 2 0 00-2.828 0L6 21"/></svg>`;
    case 'pen-tool':
      return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`;
    case 'file-text':
      return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;
    case 'file-up':
      return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;
    case 'file-down':
      return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;
    default:
      return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>`;
  }
}

export function renderToolGrid(activeCategory: ToolCategory = 'all'): string {
  const categories: Array<{ id: ToolCategory; label: string }> = [
    { id: 'all', label: 'Semua Alat' },
    { id: 'organize', label: 'Organisir' },
    { id: 'convert', label: 'Konversi' },
    { id: 'security', label: 'Tanda Tangan' },
    { id: 'optimize', label: 'Kompresi' },
  ];

  const filteredTools =
    activeCategory === 'all'
      ? TOOLS_LIST
      : TOOLS_LIST.filter((t) => t.category === activeCategory);

  return `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <!-- Category Tabs (Mobile Scrollable) -->
      <div class="flex items-center justify-start sm:justify-center gap-2 mb-8 overflow-x-auto py-2 no-scrollbar">
        ${categories
          .map(
            (cat) => `
          <button
            data-category="${cat.id}"
            class="category-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[44px] flex items-center justify-center ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-xs'
            }"
          >
            ${cat.label}
          </button>
        `
          )
          .join('')}
      </div>

      <!-- Tools Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        ${filteredTools.map((tool) => renderSingleToolCard(tool)).join('')}
      </div>
    </section>
  `;
}

function renderSingleToolCard(tool: ToolInfo): string {
  return `
    <div
      data-tool-id="${tool.id}"
      class="tool-card group relative p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs"
    >
      <div>
        <!-- Top icon and badge -->
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.accentColor} shadow-md flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
            ${getToolIconSvg(tool.icon)}
          </div>
          ${
            tool.badge
              ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/80">${tool.badge}</span>`
              : ''
          }
        </div>

        <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
          ${tool.title}
        </h3>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
          ${tool.description}
        </p>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
        <span>Buka Alat</span>
        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </div>
    </div>
  `;
}
