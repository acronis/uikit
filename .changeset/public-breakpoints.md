---
'@acronis-platform/ui-react': minor
---

Publicly export `BREAKPOINT_LG/XL/2XL/3XL/4XL`, `ROOT_FONT_SIZE_PX`, and `getViewportWidth` from `src/lib/breakpoints.ts`, and add hand-authored `--ui-breakpoint-*` CSS custom properties for sizing elements outside `@media`/`@container` conditions (which can't read custom properties). Breakpoints were previously internal-only despite being usable by consumers. `ROOT_FONT_SIZE_PX` assumes the default, unoverridden `html { font-size }` (16px) — this package sets none.
