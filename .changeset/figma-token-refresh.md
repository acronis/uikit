---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
'@acronis-platform/ui-react': patch
---

Refresh design tokens from Figma.

Breaking (pre-1.0): rename semantic `status-inverted.*` → `status-strong.*`, `inverted-surface.*` → `inverted.*`, and `border.on-status.*-dark` → `*-strong`; remove `typography.link.*`; remove the `item` component; component tokens now source from the renamed `componentLegacy` Figma group.

Additive: new `ink` palette and `units.size-20`; semantic `glyph.on-status.ai` and the `status-strong` background family; new `sidebar` component.

Regenerated all `tokens-pd` artifacts (CSS, DTCG, Tailwind presets) to match. The Tailwind preset builder now skips unroutable component-tier color tokens with a warning instead of failing the whole build (semantic tokens still must route), so per-component Figma authoring drift can't block generation. A handful of tokens are kept in the tiers/CSS but absent from the Tailwind preset pending Figma cleanup: the duplicated `sidebar.secondary.background-*` (flat vs nested), `switch.{container.color-inactive,toggle.color-on,toggle.color-off}`, and the unmodeled `*/label/typography` string tokens.

`ui-react`: re-theme the `Switch` component to the renamed switch tokens (`--ui-switch-background-*`/`-circle-*` → `--ui-switch-container-color-*`/`-toggle-color-*`) so it keeps rendering after the rename; visual-regression baselines updated accordingly.
