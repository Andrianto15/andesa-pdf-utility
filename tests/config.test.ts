import { getBackendUrl } from '../src/utils/config';

describe('Config - getBackendUrl', () => {
  const originalEnv = process.env.VITE_BACKEND_URL;
  const originalWindow = (globalThis as unknown as { window?: { __ANDESA_BACKEND_URL__?: string } }).window;

  beforeEach(() => {
    delete process.env.VITE_BACKEND_URL;
    if (typeof globalThis.window !== 'undefined') {
      delete (globalThis.window as unknown as { __ANDESA_BACKEND_URL__?: string }).__ANDESA_BACKEND_URL__;
    }
  });

  afterAll(() => {
    if (originalEnv !== undefined) {
      process.env.VITE_BACKEND_URL = originalEnv;
    } else {
      delete process.env.VITE_BACKEND_URL;
    }
    if (originalWindow !== undefined) {
      (globalThis as unknown as { window?: unknown }).window = originalWindow;
    }
  });

  test('should return default URL when no overrides or env variables exist', () => {
    const url = getBackendUrl();
    expect(url).toBe('http://localhost:3001');
  });

  test('should return explicit override when provided', () => {
    const url = getBackendUrl('https://custom-api.example.com');
    expect(url).toBe('https://custom-api.example.com');
  });

  test('should trim whitespace from explicit override', () => {
    const url = getBackendUrl('   https://trimmed-api.example.com   ');
    expect(url).toBe('https://trimmed-api.example.com');
  });

  test('should ignore empty or whitespace-only override and fall back', () => {
    expect(getBackendUrl('')).toBe('http://localhost:3001');
    expect(getBackendUrl('   ')).toBe('http://localhost:3001');
  });

  test('should resolve from process.env.VITE_BACKEND_URL when defined', () => {
    process.env.VITE_BACKEND_URL = 'https://production-backend.example.com';
    const url = getBackendUrl();
    expect(url).toBe('https://production-backend.example.com');
  });

  test('should resolve from window.__ANDESA_BACKEND_URL__ when defined', () => {
    if (typeof globalThis.window === 'undefined') {
      (globalThis as unknown as { window: { __ANDESA_BACKEND_URL__?: string } }).window = {};
    }
    (globalThis.window as unknown as { __ANDESA_BACKEND_URL__?: string }).__ANDESA_BACKEND_URL__ =
      'https://window-injected-api.example.com';

    const url = getBackendUrl();
    expect(url).toBe('https://window-injected-api.example.com');
  });

  test('should prioritize explicit override over environment variable', () => {
    process.env.VITE_BACKEND_URL = 'https://env-api.example.com';
    const url = getBackendUrl('https://override-api.example.com');
    expect(url).toBe('https://override-api.example.com');
  });
});
