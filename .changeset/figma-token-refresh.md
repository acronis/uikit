---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
'@acronis-platform/ui-react': patch
---

Refresh design tokens from Figma.

Breaking (pre-1.0): rename semantic `status-inverted.*` → `status-strong.*`, `inverted-surface.*` → `inverted.*`, and `border.on-status.*-dark` → `*-strong`; remove the `item` component; component tokens now source from the renamed `componentLegacy` Figma group.

Additive: new `ink` palette and `units.size-20`; semantic `glyph.on-status.ai`, the `status-strong` background family, the `background.status.ai{,-hover,-pressed}` and `background.brand.primary-focus` colors, and the `typography.link.default` / `link.default-underline` styles; new `sidebar` component.

The `colors.background.ai.*` gradients keep their intended **horizontal** (`90deg`) orientation. (The Figma `Ai/*` paint styles currently report a 90°-rotated/vertical transform that doesn't match the intended visual; since these gradients are hardcoded in the emitter, the horizontal orientation is pinned there. The Figma styles should be re-oriented to horizontal to make Figma and tokens agree.)

Regenerated all `tokens-pd` artifacts (CSS, DTCG, Tailwind presets) to match. The Tailwind preset builder now skips unroutable component-tier color tokens with a warning instead of failing the whole build (semantic tokens still must route), so per-component Figma authoring drift can't block generation. A handful of tokens are kept in the tiers/CSS but absent from the Tailwind preset pending Figma cleanup: the duplicated `sidebar.secondary.background-*` (flat vs nested), `switch.{container.color-inactive,toggle.color-on,toggle.color-off}`, and the unmodeled `*/label/typography` string tokens.

`ui-react`: re-theme the `Switch` and `Tooltip` components to the renamed switch / tooltip tokens (`--ui-switch-background-*`/`-circle-*` → `container-color-*`/`toggle-color-*`; `--ui-tooltip-background`/`-global-*`/`-label` → `container-color`/`container-*`/`label-color`) so they keep rendering after the rename. The `Tag` AI variant now resolves its background (`--ui-background-status-ai`, newly added). Visual-regression baselines updated accordingly.
