# Packs

The catalog of Packs in `@acronis-platform/design-assets`: the Packs that exist today and where
their manifests live, how their files are laid out on disk, and the naming rules
for ids and files.

## The packs

`../packs/<pack-id>.json` — one manifest per Pack. The filename stem
MUST equal the manifest's `name` field. See [`manifest.md`](./manifest.md).

| Pack id              | `$type` | Canonical size | Defaulted sizes                                  | Purpose                                                                                                                                                                                             |
| -------------------- | ------- | -------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icons-stroke-mono`  | vector  | `24`           | `16`, `32`                                       | Stroke-style icons, single-color. The default UI icon set.                                                                                                                                          |
| `icons-stroke-multi` | vector  | `24`           | `16`, `32`                                       | Stroke-style icons, multi-color.                                                                                                                                                                    |
| `icons-solid-mono`   | vector  | `24`           | `16`, `32`                                       | Filled icons, single-color.                                                                                                                                                                         |
| `icons-solid-multi`  | vector  | `24`           | (single-asset pack today; no defaults extracted) | Filled icons, multi-color.                                                                                                                                                                          |
| `illustrations`      | vector  | `48`           | `96`                                             | Larger marketing / illustrative artwork. ~15% of assets hand-author the 96 source instead of deriving; those override the default per-size. Asset-level `raster` overrides expected here over time. |

**Canonical size** = the size that every Asset declares its own `$file` for.
**Defaulted sizes** = sizes provided by the Pack's pack-level `values`; an Asset
omits them unless it has a hand-authored override for that size.

## Pack as namespace

Asset ids are unique within a Pack only. The same id MAY appear in multiple Packs
(e.g., `add` in both `icons-stroke-mono` and `icons-solid-mono`). External
consumers address an Asset as `<pack>.<id>`. See [`manifest.md`](./manifest.md)
for the id rules.

### Adding a new Pack

1. Add the manifest: `../packs/<new-pack-id>.json`. Use an existing
   manifest as a template.
2. Add the binary directory next to the manifest:
   `../packs/<new-pack-id>/.gitkeep`. See [Binary layout](#binary-layout).
3. Add a row to the table above.
4. CLAUDE.md does NOT need updating unless the new Pack introduces a new concept
   (e.g., a new `$type` value, a new metadata field).

### What is NOT a Pack

- **A category.** `actions` is a category value inside
  [`manifest.md`](./manifest.md), not a Pack.
- **A theme.** Light/dark variants of an Asset (if ever needed) belong inside
  the Asset, not in separate Packs.
- **A platform.** WEB-only vs PD-only is a per-asset `platforms` field, not a
  structural split. See [`manifest.md`](./manifest.md).

## Binary layout

Where the actual `.svg` / `.png` / `.webp` files live, and how they are named.

The Pack manifest and the Pack binary directory sit **side by side** under
`packs/`, sharing the same stem — flat, per Pack, co-located with the manifest:

```text
../packs/
  icons-stroke-mono.json
  icons-stroke-mono/
    add-24.svg
    add-32.svg
    remove-24.svg
  illustrations.json
  illustrations/
    empty-state-hero-480.png
```

- One subdirectory per Pack, matching the Pack id exactly.
- Files sit **directly** under the Pack subdirectory. NO per-Asset subdirs
  (`add/24.svg` ❌).
- A Pack with no committed binaries keeps a `.gitkeep` so the directory exists in
  the repo.

### Filename pattern

`<asset-id>-<size>.<ext>` — the canonical on-disk name for every binary.

- `<asset-id>` matches the id pattern (see [Naming conventions](#naming-conventions)),
  same as the manifest key.
- `<size>` matches `^[0-9]+$`, same as the numeric Variant key.
- `<ext>` is `svg` for `vector`, `png` or `webp` for `raster`.

Examples:

- `./packs/icons-stroke-mono/add-24.svg` ✓
- `./packs/icons-stroke-mono/add-16.svg` ✓
- `./packs/illustrations/empty-state-hero-480.png` ✓

Forbidden:

- `./packs/icons-stroke-mono/icon-add-24.svg` ❌ (no `icon-` prefix — see
  [`manifest.md`](./manifest.md))
- `./packs/icons-stroke-mono/add/24.svg` ❌ (no per-asset subdir)
- `./packs/icons-stroke-mono/add.svg` ❌ (size is required)

### Orphans and missing files

- **Orphan binary** — a file under `../packs/<pack>/` that no manifest
  entry references. Defect.
- **Missing binary** — a `$file` path in a manifest that does not exist on disk.
  Defect.
- Neither is caught by
  [`../schemas/pack.schema.json`](../schemas/pack.schema.json);
  both will be caught by a future validator script.

### Renaming an Asset

Rename every binary AND the manifest entry in the **same commit**. There is no
aliasing layer — the previous name lives on only in `legacyNames`. See
[`manifest.md`](./manifest.md).

### Why flat (per Pack), not nested per Asset

A nested layout (`<pack>/<asset>/<size>.ext`) was considered and rejected: it
adds a directory per Asset for no benefit, and `git mv` of a single binary
becomes a two-component move. Flat is shorter to scan, shorter to type, and
friendlier to glob. The Pack-level directory still exists — it's the manifest's
sibling under `packs/` — but Assets within it stay flat.

## Naming conventions

Rules for ids, filenames, JSON keys, and `$type` values in `@acronis-platform/design-assets`.

### Ids (asset ids, pack ids, rule ids, etc.)

- Pattern: `^[a-z][a-z0-9-]*$` — lowercase, kebab-case, starts with a letter.
- No underscores, no camelCase, no PascalCase, no dots, no slashes.
- Acronyms lowercase: `svg`, `ui` (not `SVG`, `UI`).
- Numeric segments allowed: `add-24`, `arrow-left-16`.
- **Illustrations exception:** illustration asset ids MAY start with a digit
  (e.g. `404`, `500`). The "starts with a letter" rule is relaxed only for the
  `illustrations` pack, where numeric-named assets are the established naming
  scheme. All other packs keep the letter-first rule.

### Filenames

| Extension       | Meaning                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------ |
| `packs/*.json`  | Asset pack manifest (DTCG-divergent, NOT DTCG-conformant); discriminated by its `$schema`. |
| `rules/*.json`  | Rule declaration; discriminated by its `$schema`.                                          |
| `*.schema.json` | JSON Schema (draft 2020-12).                                                               |
| `*.mjs`         | ESM JavaScript (`type: "module"`).                                                         |
| `*.md`          | Context / docs.                                                                            |

File **stems** match the id pattern above. A pack file's stem MUST equal its
manifest `name` field; a rule file's stem MUST equal its `id` field. For the
on-disk binary filename (`<asset-id>-<size>.<ext>`), see
[Filename pattern](#filename-pattern) under Binary layout.

### `$type` values

Project-coined: `vector`, `raster`. No `"asset"`, no `"asset-vector"`, no
`"mixed"`. DTCG group-level `$type` inheritance applies: declared at the Pack
root, every Asset inherits it unless it overrides its own `$type`.

### `$`-prefixed keys

When to use a `$` prefix and the full inventory of every `$`/non-`$` key is the
`$`-prefix discipline — canonical in [`spec.md`](./spec.md). The one-line rule:
use `$` only for DTCG-reserved keys and per-Variant value-shape discriminators;
never invent a new `$`-prefixed structural key. From a naming standpoint, just
treat the existing keywords (`$schema`, `$type`, `$description`, `$extensions`,
`$file`, `$from`, `$rules`) as a fixed set — do not coin new ones.

### JSON-key rules for manifests

- Non-`$` keys (asset ids, variant ids, metadata field names) follow the id
  pattern above where they are ids; descriptive metadata field names are the
  fixed set documented in [`manifest.md`](./manifest.md).
- Do NOT mix `$`-prefixed and bare keys for the same concept — `$`-prefixes are
  reserved for the DTCG-borrowed and project-coined keywords listed above.

### What naming does NOT cover

- Per-asset id semantics. Lives in [`glossary.md`](./glossary.md) and
  [`manifest.md`](./manifest.md).
- The exact regex used in JSON Schemas. Lives next to the schema itself; this
  section gives the human-readable rule.
