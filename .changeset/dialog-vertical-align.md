---
'@acronis-platform/ui-react': minor
---

Dialog / DialogContent: new `verticalAlign` prop (`'center'` default | `'top'`). `top` pins the popup 48px from the top edge of the viewport instead of centering it, so it keeps a stable top edge while its content height changes (still capped at the viewport height minus 96px). Omitting the prop keeps the existing centered placement.
