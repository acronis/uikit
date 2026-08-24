---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Sync design tokens with Figma.

Adds the Stepper component tier — 22 new tokens covering `Stepper.Item` container
metrics and its completed/current/future states, plus the `breakpoint-default` and
`breakpoint-lg` label, value, line and gap roles — generated for all six brands.
Also records the shadow primitives (`shadows.sm`, `shadows.md`, `shadows.lg`) as
hidden from publishing in Figma and clears their colour scopes; this is metadata
only and leaves the emitted shadow values unchanged.
