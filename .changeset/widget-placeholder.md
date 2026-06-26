---
'@acronis-platform/ui-react': minor
---

feat(widget-placeholder): add WidgetPlaceholder component

A composable empty-state for a dashboard widget — a bordered card with a header
(icon + title), a centered illustration / message / action, and an optional
footer. The root takes an `interactive` prop that makes the whole card focusable
and clickable (hover/active surface tints + a focus ring). Design-pending v1
ported from the legacy library; themed on semantic tokens (no
`--ui-widget-placeholder-*` tier yet — the icon/action use the brand action blue,
the illustration a muted placeholder tone). Parts: `WidgetPlaceholder`,
`WidgetPlaceholderHeader`, `WidgetPlaceholderIcon`, `WidgetPlaceholderTitle`,
`WidgetPlaceholderContent`, `WidgetPlaceholderImage`, `WidgetPlaceholderText`,
`WidgetPlaceholderAction`, `WidgetPlaceholderFooter`.
