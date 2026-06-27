---
'@acronis-platform/ui-react': minor
---

feat(progress-circle): add ProgressCircle — circular/radial progress

A compact circular progress ring — an SVG arc that fills with `value` and whose
color tracks the level (danger → critical → warning → success), with an optional
numeric or icon center. Wraps the Base UI Progress primitive for
`role="progressbar"` semantics. Sizes `tiny` / `sm` / `md` / `lg`; status
derived from value (overridable). The sibling of the linear `Progress`, for
at-a-glance scores in table cells, cards, and widgets. Implements #446;
design-pending v1 on the shared status tokens (no new tier).
