# @acronis-platform/figma-icons-fetcher

## 0.2.0

### Minor Changes

- [#244](https://github.com/acronis/uikit/pull/244) [`c0410c1`](https://github.com/acronis/uikit/commit/c0410c116d286d1e0a1add659d81e28bf8951b7a) Thanks [@leonid](https://github.com/leonid)! - Add `@acronis-platform/icons-svg-next`, a source-only package of raw SVG icons
  (plus per-category manifests) pulled from the shadcn-uikit Figma file.

  To support it, `figma-icons-fetcher` gains pluggable node-selection strategies
  (`frames-by-name`, `new-frames`), a `FIGMA_FETCHER_SKIP_MISSING_IMAGES` option,
  and flat (`/`-collapsed) category manifest filenames. The default
  `frames-by-name` behavior used by `icons-svg` is unchanged.
