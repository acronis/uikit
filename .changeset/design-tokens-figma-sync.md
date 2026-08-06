---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Sync design tokens with Figma.

Populates three new brand themes (light-gray, telstra, yellow-1c) across the semantic
and component tiers. Adds numeric typography styles and component tokens for Toast,
Alert, Calendar, SegmentControl, AlertRibbon, InputNumPicker, Timer, Avatar and
Chat.sidebar. Darkens secondary on-surface text. Removes the SearchGlobal token set
along with legacy ButtonGroup tokens.

Adds shadows end to end: `primitives.shadows.{sm,md,lg}` hold the per-part scalars
Figma authors (Figma has no shadow variable type), `semantics.shadow.{sm,md,lg}` compose
them into DTCG `$type: shadow` tokens, and components reference those by alias. This
ships `--ui-shadow-{sm,md,lg}` and a Tailwind `boxShadow` namespace, with the light/dark
pair inside the shadow's color slot (`light-dark()` is a color function and cannot wrap a
whole shadow).
