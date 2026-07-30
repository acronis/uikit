---
'@acronis-platform/ui-react': minor
---

Add `ChatHeaderCollapsed`: the header band of the collapsed AI-chat rail
(Figma node `7329-24771`), a static 48px band centering a branding glyph
through the shared `TagIcon`. The Figma `hasHistory` property is plumbed
through the API but is currently a no-op — the captured instance shows no
visible effect for either value.
