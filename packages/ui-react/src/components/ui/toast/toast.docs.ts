// Curated prop surface for the docs `<AutoTypeTable>`. The runtime `ToasterProps`
// types `portalContainer` via Base UI's portal props (a noisy union); this
// companion documents the caller-facing shape. The imperative `toast(...)` API is
// documented in the page body. (The runtime type lives in toast.tsx; never bundled.)

/** Props for `<Toaster>` — the toast region rendered once near the app root. */
export interface ToasterProps {
  /** Default auto-dismiss delay in ms for toasts that don't set one (default 5000). */
  timeout?: number;
  /** Max toasts shown at once; the oldest is dropped past the limit (default 3). */
  limit?: number;
  /**
   * Portal container for the toast stack. Pass a shadow-root mount for
   * isolated-style previews (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: HTMLElement | null;
}
