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

Note: `Timeline.connectorColor` ships as a CSS variable and in the tiers, but is
omitted from the Tailwind preset — its Figma scope is `ALL_SCOPES`, so it cannot
be routed to a namespace.
