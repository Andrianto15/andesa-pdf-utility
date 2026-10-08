export function getBackendUrl(override?: string): string {
  if (override && override.trim()) {
    return override.trim();
  }

  try {
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      typeof import.meta.env.VITE_BACKEND_URL === 'string' &&
      import.meta.env.VITE_BACKEND_URL.trim()
    ) {
      return import.meta.env.VITE_BACKEND_URL.trim();
    }
  } catch {
    // Fallback for runtimes without import.meta.env support
  }

  if (typeof window !== 'undefined') {
    const win = window as unknown as { __ANDESA_BACKEND_URL__?: string };
    if (typeof win.__ANDESA_BACKEND_URL__ === 'string' && win.__ANDESA_BACKEND_URL__.trim()) {
      return win.__ANDESA_BACKEND_URL__.trim();
    }
  }

  if (
    typeof process !== 'undefined' &&
    process.env &&
    typeof process.env.VITE_BACKEND_URL === 'string' &&
    process.env.VITE_BACKEND_URL.trim()
  ) {
    return process.env.VITE_BACKEND_URL.trim();
  }

  return 'http://localhost:3001';
}
