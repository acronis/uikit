---
'@acronis-platform/design-tokens': major
'@acronis-platform/tokens-pd': major
---

**Breaking:** rename the `light-gray` and `yellow-1c` brand keys to
`light_gray` and `yellow_1c`.

Every other brand uses an underscore consistently in both its `branding.*`
primitive key and its `values.<brand>` key. `light-gray`/`yellow-1c` were the
only two exceptions: their `branding.*` primitive key was already
underscored, but their `values.<brand>` key stayed hyphenated (a data-entry
mistake). A brand-name mapping that assumes underscore for every brand fails
to resolve these two — this is a real bug, not just a naming
inconsistency.

Consumers must update any reference to these two brand ids:

- `light-gray` → `light_gray`
- `yellow-1c` → `yellow_1c`

This renames the generated `tokens-pd` artifact paths accordingly:
`css/light-gray.css` → `css/light_gray.css`, `css/<Component>/light-gray.css`
→ `css/<Component>/light_gray.css`, `bundles/light-gray.css` →
`bundles/light_gray.css`, `dtcg/{semantics,components}-light-gray.json` →
`dtcg/{semantics,components}-light_gray.json`, and equivalently for
`yellow-1c` → `yellow_1c`. The rename itself changes no token value for
either brand — only the key. (This release's separate
`design-tokens-sidebar-white-brand-followup` changeset does change several
`light_gray`/`yellow_1c` `SidebarPrimary` values — an unrelated fix, not part
of this rename.)

**Fix (non-breaking):** also included in this release — the telstra
(magenta) brand's `SidebarPrimary` section divider and footer border both
resolved to `{colors.border.onBrand.border}`, a translucent white value
meant for a colored/brand background. telstra's sidebar background is
white, so both dividers were effectively invisible. Both now resolve to
`{colors.border.onSurface.border}` (opaque), matching the corrected Figma
source. Also corrects two related `MenuItemExtras` leaves (external-link
icon and shortcut text color) that the same Figma export changed from a
shared `onBrand` token to telstra-specific `branding.telstra.SidebarPrimary`
aliases. No other brand or token path is affected.
