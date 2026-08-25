---
'@acronis-platform/ui-react': patch
---

`AccordionContainer`'s `Root` now defaults to `display: contents` when
`collapsible` is true, so it never becomes a box in the consumer's flex/grid
layout (this is what lets `Section`'s root `gap` apply directly across its
header and content instead of being silently dropped by the wrapper). Pass a
display utility in `className` if you rely on `Root` being a real box —
`tailwind-merge` resolves the conflict in your favor.
