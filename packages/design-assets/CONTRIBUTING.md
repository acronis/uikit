# Contributing to `@acronis-platform/design-assets`

This guide covers the day-to-day authoring tasks: adding an asset, adding a pack, adding a rule, validating your work, and attributing third-party sources. For deeper conceptual context (variants, derivation, naming, glossary) see the `context/` directory in this package — the references at the bottom of this file point you at the right doc per topic.

## Before you start

Before authoring anything, make sure you:

- **Understand the vocabulary** — Asset, Pack, Variant, canonical/`default`, Rule, source vs. computed value. They are defined in [`context/glossary.md`](./context/glossary.md).
- **Know the cases the schema supports** — the cases a manifest MUST cover (R1–R16), the `$`-prefix discipline, and which checks are schema- vs. runtime-enforced live in [`context/spec.md`](./context/spec.md). The schema itself is [`schemas/pack.schema.json`](./schemas/pack.schema.json).

## Adding an asset to an existing pack

An asset is a single named entry inside a pack: one id, one or more per-variant values, mandatory `platforms` and `metadata` blocks.

### 1. Drop the binary in place

Binaries live flat under `packs/<pack>/`. The filename MUST match `<asset-id>-<size>.<ext>`:

- `asset-id`: lowercase kebab-case, starting with a letter or digit.
- `size`: bare number, matching one of the pack's canonical sizes.
- `ext`: `svg` for vector packs, `png` or `webp` for raster.

Example: a new "bell" icon at 24px in `icons-stroke-mono` lands at `packs/icons-stroke-mono/bell-24.svg`.

### 2. Register it in the pack manifest

Open `packs/<pack>.json` and add a new entry under `assets`. The minimum shape, when the pack's `values` already define every variant you need:

```json
"bell": {
  "values": {
    "24": { "$file": "./packs/icons-stroke-mono/bell-24.svg" }
  },
  "platforms": ["PD"],
  "metadata": {
    "category": ["interface"],
    "tags": ["notification", "alert"],
    "legacyNames": []
  }
}
```

What's happening here:

- `values."24"` supplies the asset's binary for the pack's canonical variant — the one the pack marked `"default": true`.
- The pack-level `values."16"` and `values."32"` apply automatically. Each is a computed entry (`{ "$rules": [...] }`) that omits `$from`, so it derives from _this asset's_ effective canonical — the 24px file you just added. A single line in the manifest gets you a 16, a 24, and a 32.
- `platforms`: array of `"WEB"` / `"PD"`. Required, not defaultable.
- `metadata`: three arrays, all required (use `[]` if empty). Category, tags, and legacyNames are the only fields supported today — no other keys.

### 3. Override a pack variant when its derivation doesn't fit

If the derived 16px doesn't look right (optical balance breaks at small sizes, for example), supply your own entry under that key. Replace it with a different computation:

```json
"bell": {
  "values": {
    "16": { "$rules": ["stroke-2-5", "scale-16"] },
    "24": { "$file": "./packs/icons-stroke-mono/bell-24.svg" }
  },
  ...
}
```

…or with your own binary:

```json
"bell": {
  "values": {
    "16": { "$file": "./packs/icons-stroke-mono/bell-16.svg" },
    "24": { "$file": "./packs/icons-stroke-mono/bell-24.svg" }
  },
  ...
}
```

Per-variant replacement: your `values."16"` wins entirely over the pack's `values."16"`. There is no deep merge — the asset entry replaces the whole entry for that key. To opt out of a pack variant entirely, set the key to `null`.

The 32px keeps coming from the pack, since you didn't override it.

## Adding a new pack

A pack is a catalog of same-style assets. The five packs today are `icons-stroke-{mono,multi}`, `icons-solid-{mono,multi}`, and `illustrations`.

### 1. Create the manifest

Make a new file at `packs/<pack-id>.json`. The pack id (kebab-case) MUST equal the filename stem. Minimum shape:

```json
{
  "$schema": "../schemas/pack.schema.json",
  "name": "<pack-id>",
  "version": "0.1.0",
  "$type": "vector",
  "values": {
    "24": { "default": true },
    "16": { "$rules": ["scale-16", "stroke-1-6"] },
    "32": { "$rules": ["scale-32", "stroke-2-5"] }
  },
  "assets": {}
}
```

Keys:

- `$schema`: always `../schemas/pack.schema.json`. This is the discriminator consumers use to identify our manifests.
- `name`: pack id; MUST equal the filename stem.
- `version`: semver. Bump it when the pack's contents change in a way consumers should notice.
- `$type`: `"vector"` or `"raster"`. Inherited by every asset; can be overridden per asset if a pack is mixed.
- `values`: required. The pack-level variant map. Exactly one entry MUST carry `"default": true` — the canonical variant; the pack entry is just `{ "default": true }` (each asset supplies the binary). Declare the derived variants once here as computed entries (`{ "$rules": [...] }`) so individual assets only need to ship the canonical. Because these entries omit `$from`, each one derives from the consuming asset's effective canonical.

### 2. Create the binary directory

`packs/<pack-id>/` is a sibling of the manifest. Binaries go directly inside (flat — no per-asset subdirectories).

### 3. Pick canonical and derived sizes

Convention so far: icons author at 24px (the canonical, marked `"default": true`) and derive 16 and 32; illustrations author at 48px and derive 96. Pick whichever set makes sense for your pack and express it in the pack's `values` — one canonical entry plus a computed entry per derived variant.

## Adding a new rule

A rule is a declarative transform applied, in `$rules` order, to a computed variant's resolved source (its `$from` sibling, or the effective canonical when `$from` is omitted). Rules live in `rules/<name>.json` and document intent only — execution is owned by the consumer's translator (see [README.md](./README.md)).

Two kinds today:

- `scale` — resize the source's bounding box to the target dimension.
- `stroke` — set every stroked path on the source to the target width.

### Filename and shape

The filename stem MUST equal the `name` field. Decimal values in filenames use dashes: `stroke-1-6` means width 1.6.

```json
{
  "$schema": "../schemas/rule.schema.json",
  "name": "scale-48",
  "kind": "scale",
  "target": { "value": 48, "unit": "px" }
}
```

The only unit today is `px`. The enum is intentionally narrow; widening it is a coordinated schema change, not an ad-hoc rule addition.

## Validating

`assets/package.json` has a `validate` script that compiles both schemas and checks every pack manifest and every rule file against them:

```bash
pnpm validate
```

Run this from `packages/design-assets/` (or `pnpm --filter @acronis-platform/design-assets validate` from the repo root) before committing. It catches:

- Manifests that don't conform to `pack.schema.json` (missing required keys, wrong shapes, invalid asset ids, invalid `$file` paths).
- Rules that don't conform to `rule.schema.json`.

It does NOT check that the `$file` path resolves to a real binary on disk — do that by eye, or by running your translator end-to-end.

## Third-party sources

If you add an asset (or a batch of assets) derived from a third-party library, document the source in [`LICENSE`](./LICENSE):

1. Open `LICENSE` and scroll to the "Third-party content" section.
2. Append a new subsection: attribution paragraph (one or two sentences identifying the source and the URL) + the source's full license text, reproduced verbatim.
3. If the source's license requires it (most permissive licenses do), make sure the copyright notice is included.

Per-asset provenance is not tracked in the manifests today — the LICENSE entry is the canonical record that a given source was used in the package.

## Where the deeper context lives

These docs live in this package under `context/`. They are the authoritative reference; this contributing guide is a quick-start.

| Topic                                                                                                           | File                                             |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Vocabulary — Schema, Rule, Pack, Asset, Variant, Canonical/Default, Value (source/computed)                     | [`./context/glossary.md`](./context/glossary.md) |
| The normative contract — DTCG divergence, `$`-prefix discipline, R1–R16 cases, invariants, resolution algorithm | [`./context/spec.md`](./context/spec.md)         |
| Manifest shape — pack root + asset, the `values` map, derivation, metadata, platform scope                      | [`./context/manifest.md`](./context/manifest.md) |
| Pack catalog, on-disk binary layout, id/filename/`$type` naming                                                 | [`./context/packs.md`](./context/packs.md)       |
| Rule declaration format                                                                                         | [`./context/rules.md`](./context/rules.md)       |

The same context files are indexed in `./AGENTS.md` for AI agents.
