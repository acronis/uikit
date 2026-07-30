---
'@acronis-platform/ui-react': minor
---

Add `ChatMenuItemCollapsed`: the icon-only row of the chat rail at its collapsed
48px width (Figma node `7329-25084`), with an `icon` slot, a `hasAlert` red dot
that reuses the shipped `DotRed` icon, and an `idle` fill variant. Themed
entirely from the `--ui-chat-*` token tier (now imported in `styles/index.css`),
with hover / active / focus-visible each wired to its own token and the rail seam
and alert dot positioned logically so the row mirrors under `dir="rtl"`.
