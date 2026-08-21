---
'@acronis-platform/ui-react': minor
---

Add `variant` (`'text'` / `'icon'`), `label`, and `icon` props to `Avatar` for
the no-photo case, matching the current Figma component — with no `children`
composed, `variant="text"` (default) shows `label` (default `'SB'`) and
`variant="icon"` shows a consumer-supplied `icon`. Composing
`AvatarImage`/`AvatarFallback` as children still takes precedence over both,
so existing usage is unaffected. Also adds the missing Figma Code Connect
mapping for `Avatar` itself (previously only `AvatarGroup` was mapped) and
fixes its `ui-spec` Figma node reference, which pointed at the group node.
