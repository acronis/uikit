---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

Sync tokens from Figma and regenerate `tokens-pd` (`css/<Tier>/*`, Tailwind
presets, DTCG):

- **Components**: add the `CardFilter`, `Icon`, `MenuItem`, `SearchGlobal`, and
  `Table` token tiers. Fixes the `CardFilter` value text-style reference
  (`{typography.title.accent}` → `{typography.headings.title-accent}`); the
  components emitter now resolves this hyphen-as-dot typography mismatch so
  re-syncs stay correct.
- **Primitives**: the internal (hidden) `palette.electricblue.ink-*` stops were
  renamed to `palette.electricblue.blue-*` with refreshed values.
- **Semantics**: one alias re-pointed to `{palette.transparent.inverted.9}`.
