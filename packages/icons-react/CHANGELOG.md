# @acronis-platform/icons-react

## 0.2.0

### Minor Changes

- [#84](https://github.com/acronis/uikit/pull/84) [`3b3fe78`](https://github.com/acronis/uikit/commit/3b3fe7852bbff8c50009648fe49fccbda9526bf2) Thanks [@leonid](https://github.com/leonid)! - Add `@acronis-platform/icons-react` — React icon components generated from
  `@acronis-platform/design-assets`. Ships all four packs via subpath exports
  (`./stroke-mono`, `./solid-mono`, `./stroke-multi`, `./solid-multi`) as
  tree-shakeable per-icon named exports plus an `icons` registry + `IconName`
  type per pack.
  - **mono** packs collapse to `currentColor` (inherit text color); **multi**
    packs keep their authored colors (gradient/clip ids are namespaced per icon
    to avoid collisions).
  - The design-assets scale + stroke rules are baked into a `size` prop, so a
    single 24px master renders at any size with the designed stroke weight
    (1.6px @16, 2px @24, 2.5px @32).

  `@acronis-platform/ui-react` now depends on it so components and stories can
  compose icons (e.g. `<Button><PlusIcon /> Add</Button>`).
