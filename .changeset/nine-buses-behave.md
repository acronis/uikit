---
'@acronis-platform/tokens-pd': minor
---

Add static `.ui-*` layout & text-flow utility classes: flex (`ui-flex`, `ui-flex-row/col`, `ui-grow`/`ui-shrink`, …), grid (`ui-grid`, `ui-grid-cols-*`, `ui-col-span-*`, …), flex/grid alignment (`ui-items-*`, `ui-justify-*`, `ui-content-*`, `ui-self-*`), non-flex alignment (`ui-text-left/center/right`, `ui-align-*`, `ui-float-*`, `ui-clear-*`), text wrapping/overflow (`ui-whitespace-*`, `ui-break-*`, `ui-truncate`, `ui-line-clamp-*`), and display (`ui-block`, `ui-hidden`, …) — mirroring Tailwind's own bounded utility groups wholesale for framework-agnostic consumers who don't extend the Tailwind preset. Typography (font-size/weight/family) stays owned by `.ui-typography-*` and is out of scope.
