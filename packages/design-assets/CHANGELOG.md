# @acronis-platform/design-assets

## 0.4.1

### Patch Changes

- [#597](https://github.com/acronis/uikit/pull/597) [`43c6085`](https://github.com/acronis/uikit/commit/43c608573c6d008ef380363ef673f914ce4a28de) Thanks [@marta-sampedro](https://github.com/marta-sampedro)! - Fix the `stroke-mono` group's `16` dimension: add the missing `scale-16` rule
  (`$values["16"]` is now `["current-color", "scale-16", "stroke-1-6"]`). Without
  `scale-16`, `stroke-1-6` resolved to 1.6 user units in the 24 viewBox, rendering
  a ~1.067px stroke at 16px instead of the design's 1.6px — thinner than the
  prior set and inconsistent with `stroke-multi` (which already carried
  `scale-16`). It now resolves to 2.4 user units (= 1.6px visual), matching the
  Figma `components/Icon/_global/sm/stroke` = 1.6 variable. Consumers generating
  from this pack (e.g. `@acronis-platform/icons-react`) get the corrected 16px
  stroke.

## 0.4.0

### Minor Changes

- [#242](https://github.com/acronis/uikit/pull/242) [`a85d629`](https://github.com/acronis/uikit/commit/a85d6291933854a99af8825b985c325bfb80725c) Thanks [@leonid](https://github.com/leonid)! - Add the `search` (magnifier) icon to the `icons-solid-mono` pack. The asset
  already existed upstream in `icons-svg` but wasn't promoted into `design-assets`,
  so no React component was generated. It now generates `SearchIcon`, exported from
  `@acronis-platform/icons-react/solid-mono`.

## 0.3.0

### Minor Changes

- [#79](https://github.com/acronis/uikit/pull/79) [`40d3d53`](https://github.com/acronis/uikit/commit/40d3d535ed21da9b5c80142e7f496bc22e19dde9) Thanks [@heygabecom](https://github.com/heygabecom)! - Rename the design-data packages to disambiguate them as design-only data: `@acronis-platform/tokens` → `@acronis-platform/design-tokens` and `@acronis-platform/assets` → `@acronis-platform/design-assets`. Update your dependencies and imports to the new package names.

## 0.2.0

### Minor Changes

- [#74](https://github.com/acronis/uikit/pull/74) [`bbeafee`](https://github.com/acronis/uikit/commit/bbeafeef7a7e417cfdf454e259d3055b813de4c2) Thanks [@heygabecom](https://github.com/heygabecom)! - Add the `@acronis-platform/design-assets` design-data package — DTCG-divergent JSON manifests for icons and illustrations, plus the bundled SVG binaries they reference. Validated with ajv against `schemas/pack.schema.json` and `schemas/rule.schema.json`. Data-only (no build, no runtime API), consumed via its `exports` map.
