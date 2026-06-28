# Glossary

Project vocabulary. Other context files use these terms precisely — when in doubt, start here.

> [!IMPORTANT]
> This glossary and the **Glossary** section of [`../README.md`](../README.md) are a matched pair. If you change one, update the other in the same change — they MUST NOT drift.

## Tiers & groups

### Tier

A business categorization Acronis applies to tokens. There are three:

- **Primitives** — raw values (palette, units, typography primitives).
- **Semantics** — roles/intents that alias primitives (color roles, text styles).
- **Components** — component-specific tokens that alias semantics.

Tiers exist in code only. Figma does not use this concept — see [`figma-sync.md`](./figma-sync.md) for how tiers map to Figma's organization.

### Group

A parent of one or more tokens. A Group lives inside a Tier, or inside another Group. Examples: `palette`, `palette.blue`, `units.gap`.

## Modes

### Mode

A dimension inside a Group that lets a token carry different values per active dimension value. Example: the `palette` group has two modes — `light` and `dark` — so every palette token has one value per mode.

A Group may have one mode, many modes, or none. Not every Group is mode-aware.

### Theme

**Business name** for the modes under `primitives.palette` — `light` and `dark`. "Theme switch" is the user-facing concept. See [`manifest.md`](./manifest.md) for current and planned theme values.

### Brand

**Business name** for the modes under `semantics.colors` and `components.*` — today `acronis` and `brand-b` (`brand-b` mirrors `acronis` until designers author it). Brand drives white-labeling. See [`manifest.md`](./manifest.md).

### Collection

**Figma-native concept.** A Figma Collection groups Variables and supports exactly one mode dimension; every token in the collection follows that dimension. The Figma file has four Collections — see [`figma-sync.md`](./figma-sync.md).

## Tokens

### Token

A single named value: `$value` (or a per-mode `values` dict), plus `$type`, `platforms`, and optional `$extensions`. The value-bearing node; a group is not a token. See [`manifest.md`](./manifest.md#token-shape).

### Alias

A token whose value references another token by path (DTCG syntax, e.g. `"{palette.blue.7}"`) instead of a literal. Aliases flow `components → semantics → primitives`; see the alias chain in [`manifest.md`](./manifest.md).
