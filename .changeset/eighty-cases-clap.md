---
'@acronis-platform/ui-react': minor
---

Add a `TreeItem` `expanded` prop so the leading chevron can reflect the row's
expand/collapse state. Previously the chevron always pointed along the inline-end
direction, silently contradicting the `aria-expanded` the consumer publishes on
its own `render` element; `expanded` rotates it a quarter turn to point down.
Like `isExpandable` it is purely visual — the row still owns no expand state,
renders no nested list, and emits no change event. It defaults to `false` and has
no effect when `isExpandable` is false, so existing usage renders unchanged.
