---
'@acronis-platform/ui-react': minor
---

Add `ChatMenuItem`: one row of the chat rail at its expanded width (Figma node
`6516-2333`), with an `icon` slot, a required `label`, an `idle`/`active` fill
state (`active` marks the currently-open chat via its own token and
`aria-current="page"`), and a `hasExtras`/`extras` pair for composing a
trailing `ChatMenuItemExtras` cluster. Themed entirely from the `--ui-chat-*`
token tier, with hover/focus-visible each wired to its own token and the rail
seam positioned logically so the row mirrors under `dir="rtl"`.
