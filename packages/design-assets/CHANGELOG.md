# @acronis-platform/design-assets

## 0.3.0

### Minor Changes

- [#79](https://github.com/acronis/uikit/pull/79) [`40d3d53`](https://github.com/acronis/uikit/commit/40d3d535ed21da9b5c80142e7f496bc22e19dde9) Thanks [@heygabecom](https://github.com/heygabecom)! - Rename the design-data packages to disambiguate them as design-only data: `@acronis-platform/tokens` → `@acronis-platform/design-tokens` and `@acronis-platform/assets` → `@acronis-platform/design-assets`. Update your dependencies and imports to the new package names.

## 0.2.0

### Minor Changes

- [#74](https://github.com/acronis/uikit/pull/74) [`bbeafee`](https://github.com/acronis/uikit/commit/bbeafeef7a7e417cfdf454e259d3055b813de4c2) Thanks [@heygabecom](https://github.com/heygabecom)! - Add the `@acronis-platform/design-assets` design-data package — DTCG-divergent JSON manifests for icons and illustrations, plus the bundled SVG binaries they reference. Validated with ajv against `schemas/pack.schema.json` and `schemas/rule.schema.json`. Data-only (no build, no runtime API), consumed via its `exports` map.
