---
'@acronis-platform/ui-react': patch
---

**Checkbox**: refreshed the Figma link. The Code Connect mapping and spec now
point at the current node (`725:2773` in the `ui-react` file) instead of the
stale `2238:43890` node in the old `shadcn-uikit` file. The design's props
(`label`, `description`), variants (`unchecked`/`checked`/`indeterminate`),
and states (`idle`/`hover`/`active`/`focus`/`disabled`) were verified against
the current implementation — no code changes were needed, they already match.
