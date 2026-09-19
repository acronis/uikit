---
'@acronis-platform/tokens-pd': minor
---

Add the remaining no-argument utility classes from PLTFRM-94106: list-style (`ui-list-disc/decimal/none/inside/outside`), cursor (`ui-cursor-help/move/pointer/not-allowed/...`), resize (`ui-resize-none/x/y`), child spacing (`ui-space-y-*` generated from the spacing scale, `ui-divide-y` using the established divider token), border-width per side (`ui-border-t-0`, `ui-border-x-0`, `ui-border-y`, and the full 7-direction × 5-width scale), and `ui-underline-offset-4` (not covered by `.ui-typography-*`, which never emits `text-decoration` properties).
