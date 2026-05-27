import '@testing-library/jest-dom';

// happy-dom@20.x + vitest@4.x stopped auto-attaching `localStorage` to
// the window in our setup (window exists, but window.localStorage is
// undefined). Install a minimal in-memory polyfill so spec files can
// rely on the standard Web Storage API. Falls through cleanly if a
// future happy-dom/vitest release restores native localStorage.
if (
  typeof window !== 'undefined' &&
  typeof window.localStorage === 'undefined'
) {
  const store = new Map<string, string>();
  const localStorage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => (store.has(key) ? (store.get(key) ?? null) : null),
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, String(value));
    },
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorage,
    configurable: true,
  });
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorage,
    configurable: true,
  });
}
