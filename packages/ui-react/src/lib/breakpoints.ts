// Mirrors the design team's viewport breakpoint scale pinned in
// `src/styles/index.css`'s `@theme` block (`--breakpoint-lg/xl/2xl/3xl/4xl`)
// and its hand-authored `:root`/`:host` `--ui-breakpoint-*` block.
// Expressed in the SAME rem values as that file (not pre-converted to px)
// so the two stay a direct, diffable match. Only the design team's actual
// overrides are exposed here — `sm`/`md` are intentionally omitted because
// they're Tailwind's stock, unoverridden defaults (640px/768px), not a real
// design-team value.
//
// KEEP THESE TWO FILES IN SYNC — if any of the overridden breakpoints
// (lg/xl/2xl/3xl/4xl) ever gets an explicit value changed in one file (the
// `@theme` override, the `--ui-breakpoint-*` `:root` block, or these JS
// constants), update the other two in the same change. They can't be
// unified into a single source at runtime: Tailwind v4's `@theme`
// breakpoints are compile-time-only (verified against this package's built
// CSS — the rem values appear only inside the generated `@media` rules,
// never as a `:root` custom property), so there is no live CSS variable for
// `getComputedStyle` to read here instead.
// `ROOT_FONT_SIZE_PX` assumes the default, unoverridden `html { font-size }`
// (16px) — this package sets none.
export const ROOT_FONT_SIZE_PX = 16;

export const BREAKPOINT_LG = 64 * ROOT_FONT_SIZE_PX; // --breakpoint-lg: 64rem (1024px)
export const BREAKPOINT_XL = 80 * ROOT_FONT_SIZE_PX; // --breakpoint-xl: 80rem (1280px)
export const BREAKPOINT_2XL = 90 * ROOT_FONT_SIZE_PX; // --breakpoint-2xl: 90rem (1440px)
export const BREAKPOINT_3XL = 105 * ROOT_FONT_SIZE_PX; // --breakpoint-3xl: 105rem (1680px)
export const BREAKPOINT_4XL = 120 * ROOT_FONT_SIZE_PX; // --breakpoint-4xl: 120rem (1920px)

/** SSR-safe `window.innerWidth` read — `undefined` when there is no `window` (e.g. SSR). */
export function getViewportWidth(): number | undefined {
  return typeof window === 'undefined' ? undefined : window.innerWidth;
}
