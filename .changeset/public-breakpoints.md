---
'@acronis-platform/ui-react': minor
---

Publicly export `BREAKPOINT_SM/MD/LG/XL/2XL/3XL/4XL` and `getViewportWidth` from `src/lib/breakpoints.ts`, and add hand-authored `--ui-breakpoint-*` CSS custom properties for sizing elements outside `@media`/`@container` conditions (which can't read custom properties). Breakpoints were previously internal-only despite being usable by consumers.
