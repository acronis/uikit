---
'@acronis-platform/ui-react': patch
---

Fix `Button` states to match Figma: the `ghost` variant now underlines its
label on hover (wired to the `--ui-button-ghost-label-text-decoration-*`
tokens, dropped again on `:active`), and every variant shows a `pointer`
cursor.
