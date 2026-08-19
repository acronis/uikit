---
'@acronis-platform/ui-react': patch
---

Theme `Timeline`'s connector and gap from the `--ui-timeline-*` tier.

The component consumed the alias targets `--ui-border-on-surface-border` and
`--ui-gap-16` because the Figma variables it references had no tier of their
own. That tier now ships, so the connector, the elbow and the marker-to-card
gap read `--ui-timeline-connector-color` and `--ui-timeline-gap` directly, and
`src/styles/index.css` imports the tier.

Figma binds `Timeline/gap` only to the horizontal marker-to-card gap and the
indent step derived from it; the vertical rhythm between rows and the card
header's spacing are unbound literals in the design and stay on `--ui-gap-16`.
Every value resolves the same today, so nothing renders differently — but a
brand override of the Timeline tokens is now honored.
