---
'@acronis-platform/design-tokens': patch
'@acronis-platform/tokens-pd': patch
---

Temporary fix (PLTFRM-95408): make the `yellow_1c` `SidebarPrimary` logo and
dividers visible in light mode. Its sidebar container is bright yellow
(`#FADB1F`), but the three leaves below still used the `onBrand` white aliases
(~1.4:1 contrast). They now match `light_gray` / `telstra`:

- `_global.logo.color` → `{palette.blue.14}`
- `Section.container.borderColor` → `{colors.border.onSurface.border}`
- `_global.containerFooter.borderColor` → `{colors.border.onSurface.border}`

Hand-patched in `tiers/components.json` because the Figma Brand collection is
not fixed yet. Each leaf has a `$description` with this note. The next
`/figma-brand-sync` will revert these values unless Figma is updated first.
