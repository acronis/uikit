# Glossary

> [!IMPORTANT]
> **This glossary and the "Glossary" section of [`../README.md`](../README.md) are a matched pair.** They define the same terms for two audiences (this file for contributors and agents, the README for first-time readers). If you change a definition in one, update the other in the **same** change — they MUST NOT drift.

Vocabulary used throughout this package. Other context files use these terms precisely; load this file before reading any other. The terms are grouped to read in parallel with the README — **Schema**, **Rules**, **Packs** — followed by extra precise terms the README omits.

## Schema

- **`$schema`** — the per-manifest discriminator URI (`../schemas/pack.schema.json` for packs, `../schemas/rule.schema.json` for rules). Identifies a file as an `@acronis-platform/design-assets` manifest rather than a DTCG token file; a generic DTCG consumer MUST refuse to parse it as DTCG. See [`spec.md`](./spec.md).

- **Vector / Raster** — the `$type` of a Pack or Asset. `vector` = SVG; `raster` = PNG / WebP / etc. Declared at the Pack root and inherits down the tree; an Asset MAY override its own `$type`.

## Rules

- **Rule** — a named, parameterized transform declared once under [`../rules/`](../rules/) and referenced from a computed value's `$rules` array. Rules are pure declarations today; the executor that applies them is out of scope. See [`rules.md`](./rules.md).

## Packs

- **Pack** — a top-level catalog of Assets that share a style and medium. One manifest per Pack under [`../packs/`](../packs/). The 5 packs today: `icons-stroke-mono`, `icons-stroke-multi`, `icons-solid-mono`, `icons-solid-multi`, `illustrations`. See [`packs.md`](./packs.md).

- **Asset** — the smallest catalog entry: one logical thing (e.g., `add`, `remove`, a hero illustration). Has a stable id, exists in exactly one Pack, expresses one or more Variants.

- **Variant** — a discriminator dimension on an Asset (the project term that replaces the old "Mode"). Variant keys are real ids; today every key is a numeric-string size (e.g., `"16"`, `"24"`, `"32"`), but they MAY later be theme (`"dark"`), locale (`"de-DE"`), or composite (`"24-dark"`) without restructuring. Per-asset values live under `values`; pack-wide values live under the pack-level `values` map. See [`manifest.md`](./manifest.md).
  - **`default` / canonical** — the one Variant a Pack treats as the source of truth: what other Variants typically compute from, and what a translation tool preselects. Marked inline by `"default": true` on exactly one entry of `values`. At pack level that entry is the bare marker `{ "default": true }` (each Asset supplies the actual binary); each Asset fills its canonical's `$file` in its own `values`. An Asset MAY mark a _different_ entry `"default": true` to override the pack canonical (R12). See **effective canonical** below.

- **Value** — what a Variant resolves to. Two flavors:
  - **Source value** — `{ "$file": "<path>" }` — points at a binary on disk; not computed from anything else.
  - **Computed value** — `{ "$rules": [...] }` — computed from a sibling Variant of the same Asset by applying Rules in order. Omit `$from` to compute from the effective canonical (the common case); add `"$from": "<sibling-id>"` only to compute from a non-canonical sibling.

## Extra terms (glossary-only)

These refine the terms above and are not in the README "Glossary".

- **Effective canonical** — the canonical actually in force for an Asset after merge: the id flagged `"default": true` in the Asset's `values`, else the id flagged in the Pack's `values`. Because the flag lives _on_ a Variant entry, the canonical always names a real entry — it cannot dangle. It is always a source, never computed, never `null`.

- **Defaults / inheritance** — the pack-level `values` map applies to every Asset in the Pack unless the Asset declares its own value for that key. Merge is shallow per key: effective values = `{ ...pack.values, ...asset.values }`; the Asset's `values[key]` wins entirely over the same-key pack value (no deep merge), and `null` at a key opts the Asset out of that inherited Variant. See [`manifest.md`](./manifest.md).

- **Source** — the Variant a Computed value derives from: the `$from` sibling, or the effective canonical when `$from` is omitted. **Same-asset only** — no cross-asset, no cross-pack references. A pack-level computed entry omits `$from`, so it late-binds to each consuming Asset's own effective canonical.

- **Opt-out** — a Variant key set to `null` in an Asset's `values`. The Variant does not exist for that Asset, even if the Pack supplies it (R5). See [`manifest.md`](./manifest.md).

- **Metadata** — descriptive fields that cannot be derived from the binary: `category`, `tags`, `legacyNames`. Per-asset only — not defaultable. See [`manifest.md`](./manifest.md).

- **Platform** — the consumer-scope array (`WEB` / `PD`) on every Asset. Stored at the top-level `platforms` key, sibling to `values` and `metadata`. Per-asset only — not defaultable. See [`./manifest.md`](./manifest.md).
