---
'@acronis-platform/ui-react': minor
---

Add `TreeItem`: one flat row of a tree / nested-list UI, from the Figma
"TreeItem" node (`2092:2596`). Composes an optional expand chevron, an optional
`Checkbox`, an optional leading icon, a truncating title, and an optional
trailing extras slot for `children`.

Scoped deliberately to a single row: it renders no nested list and implements no
expand/collapse, so `isExpandable` is a visual affordance and `selected` is a
prop the consumer drives — matching the Figma node's actual property set. No
`role="treeitem"` and no tab stop are forced, since a row is only a valid tree
item inside a `role="tree"` owner; the `render` prop is how a consumer supplies
those semantics.

Colors come from the semantic token tier (`--ui-text-on-surface-primary`,
`--ui-glyph-on-surface-primary`, `--ui-background-surface-hover` /
`-active`, `--ui-focus-primary`) because `tokens-pd` ships no `Tree` component
tier yet.
