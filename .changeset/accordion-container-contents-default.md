---
'@acronis-platform/ui-react': minor
---

`AccordionContainer`'s `Root` now defaults to `display: contents` when
`collapsible` is true, so it never becomes a box in the consumer's flex/grid
layout (this is what lets `Section`'s root `gap` apply directly across its
header and content instead of being silently dropped by the wrapper). The
default is applied as `contents!` so it also wins over a `render`-prop
element's own conflicting display class regardless of stylesheet order. Pass
an important-modified display utility (e.g. `className="flex!"`) if you rely
on `Root` being a real box — `tailwind-merge` resolves the conflict in your
favor; a non-important utility (`flex`) won't be deduped against `contents!`
and loses the cascade to it.
