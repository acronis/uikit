---
'@acronis-platform/ui-react': minor
---

feat(scroll-area): add `viewportRef`, `viewportProps`, `isolate`, scrollbar `z-[60]`

`ScrollArea.Root` is `overflow: hidden` and never scrolls, so its `ref` always
reports `scrollTop: 0` and `scrollHeight === clientHeight`. Anything that needs
to measure or drive the scrolling element — a TanStack virtualizer, an
`IntersectionObserver`, a programmatic `scrollTo` — must reach the `Viewport`
instead.

New props on `ScrollAreaProps`:

- **`viewportRef`** — forwards a `ref` to `ScrollAreaPrimitive.Viewport`
- **`viewportProps`** — forwards extra props (`onScroll`, `tabIndex`, `data-*`)
  to the `Viewport`; includes a `data-*` index signature so callers can stamp
  the scrolling element without losing type safety

Additional fixes bundled in the same change:

- **`isolate`** on `Root` — creates a stacking context so `z-index` values
  inside the scroll area compete only with each other, not with the whole
  document
- **`z-[60]`** on `ScrollBar` — sticky table headers typically stack to `z-50`;
  the scrollbar must sit above them inside the isolated root or it disappears
  behind the header during scroll

All changes are additive and backwards-compatible: the two new props default to
absent (no change in render), `isolate` only affects elements that set
`z-index` inside the scroll area, and `z-[60]` only matters relative to other
elements inside the same isolated root.
