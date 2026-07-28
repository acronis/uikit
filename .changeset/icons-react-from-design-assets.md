---
'@acronis-platform/icons-react': major
---

**Strict, design-driven `size` axis.** The `size` prop now accepts only the dimensions `@acronis-platform/design-assets` defines for a pack — today `16 | 24` (default `24`). Arbitrary sizes and `size={32}` are removed; there is no scaling of one master to any pixel size. The allowed union is **generated per pack from the design data** (not hardcoded), so when design overrides the dimensions for a pack/group/asset the types follow with no code change. Size a different box with CSS.

This comes from making design-assets the single source of truth for icons: the generator now reuses the canonical resolver + executor from `@acronis-platform/style-dictionary` (build-time only — the published output imports nothing from it) instead of a bespoke generator over `@acronis-platform/icons-svg-next`.

- **Per-dimension, rule-faithful artwork.** Each component carries a per-dimension artwork map resolved from design-assets (`values.<dimension>` + its `scale`/`stroke`/`color` rules, applied by the shared executor). A dimension with distinct artwork renders its own geometry rather than the canonical scaled.
- **Stroke widths are derived from the design rules, not a hardcoded constant.** Each stroke pack's per-size stroke is now the executor's output of the design `scale`/`stroke` rules. The resolved values match the design (and the prior release): `2` user units at `24`, and `2.4` at `16` (`stroke-1-6` compensated by `scale-16` for the 24→16 downscale, i.e. the 1.6px design stroke — see Figma `components/Icon/_global/sm/stroke` = 1.6).
- **Icon set follows design-assets.** Pack membership and a few names differ from the old icons-svg-next set (e.g. `box-com` → `box-logo`); audit imports that pin specific icons to specific packs.

Unchanged: named exports (`ChevronDownIcon`), the four per-pack subpaths, the `icons` registry, `IconName`, and the `SvgIcon` base. Each pack now exports its own `IconProps` (with the pack's generated `IconSize`).
