---
'@acronis-platform/ui-react': minor
---

Add `AccordionContainer`: the shared disclosure primitive behind `Card`'s and
`Section`'s upcoming `isCollapsable` variant. Built directly on Base UI's
Collapsible — owns open state, the trigger button, chevron rotation, and panel
animation — while imposing no visual styling beyond what the disclosure
mechanic itself requires (no padding/background/border on `Root`/`Content`, no
position/hover opinion on `Trigger` beyond its chevron color). `children`
accepts a render-prop function receiving the current `{ open }` state, so a
header rendered outside `Content` can vary by state even when the component
owns it uncontrolled.
