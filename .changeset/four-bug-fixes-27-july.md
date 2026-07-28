---
'@acronis-platform/ui-react': patch
---

Fix three low-risk bugs: `Link`'s hover underline position no longer diverges from `ButtonGhost` (removed a stray `text-underline-position` override); `FilterSearchFilters` forwards passthrough props (e.g. `data-testid`) to its trigger button again; and a global `font-family` fallback prevents shadow-DOM consumers from rendering with a serif UA default.
