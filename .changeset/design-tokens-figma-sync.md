---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Sync design tokens with Figma.

Renames the transparent palette primitives to split the numeric suffix onto its
own path segment (`palette.transparent.white.fixed-100` →
`palette.transparent.white.fixed.100`), repointing 28 semantic colour tokens at
the new names. Adds the `headings/section` text style and the `font-size.20`
primitive it aliases, and drops the `body/heading` and `note/heading` text styles
removed from Figma. Adds `Timeline.connectorColor`, `Timeline.gap` and title
text-style tokens for `Alert` and `Toast`. Refreshes Figma scope and publishing
metadata across 138 primitive and component tokens.

Corrects the dark-mode value of `palette.transparent.dark.fixed.90`, which was not
mode-invariant despite the `fixed` name — it now matches its light value. This is
the only resolved value the sync changes, and it reaches two consumers:
`--ui-background-backdrop-screen` and `--ui-loading-screen-container-color` both go
from `rgb(109 114 120 / 0.898)` to `rgb(25 27 35 / 0.898)` in dark mode, so the
screen scrim behind dialogs and the full-screen loading surface render darker.

Note: `Timeline.connectorColor` ships as a CSS variable and in the tiers, but is
omitted from the Tailwind preset — its Figma scope is `ALL_SCOPES`, so it cannot
be routed to a namespace.
