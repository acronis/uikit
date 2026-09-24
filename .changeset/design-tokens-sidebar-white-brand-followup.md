---
'@acronis-platform/design-tokens': patch
'@acronis-platform/tokens-pd': patch
---

Fix `SidebarPrimary` leaves left invisible on white-background brands — a
follow-up to the telstra divider fix (see the brand-rename changeset).

- **telstra + light_gray `_global.logo.color`**: was
  `{colors.glyph.onBrand.primary}`, an opaque white value assumed against a
  colored/brand sidebar. Both brands' `SidebarPrimary` container is white, so
  the logo was invisible in light mode. Now resolves to `{palette.blue.14}`
  (navy in light mode, near-white in dark mode — matching every other
  brand's dark-mode white-logo treatment).
- **light_gray `Section.container.borderColor` /
  `_global.containerFooter.borderColor`**: same translucent-white-on-white
  divider bug already fixed for telstra — now resolves to
  `{colors.border.onSurface.border}` (opaque).
- **light_gray + yellow_1c `MenuItemExtras` external-link icon / shortcut
  text**: moved from a shared `onBrand` token to brand-specific
  `branding.<brand>.SidebarPrimary` aliases, matching the telstra fix.
- **light_gray + yellow_1c `MenuItem.unselected` icon/label active+hover**:
  re-pointed from the `idle` alias to the `active` alias (a state mismatch
  in the prior data).

No other brand or token path is affected.
