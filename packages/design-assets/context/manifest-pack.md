# Manifest

The shape of a Pack manifest at `../packs/<pack-id>.json`, end to end: the pack catalog, the
pack root, asset groups, each asset's per-variant `values`, its `metadata`, and its `platforms`
scope. The runtime algorithm that reads a manifest into concrete `(asset, variant) → binary`
outputs lives in [`spec.md`](./spec.md).

## Pack catalog

`../packs/<pack-id>.json` — one manifest per Pack. The filename stem MUST equal the manifest's
`name` field.

| Pack id         | `$type` | Groups                                     | Canonical size | Purpose                                                                                                                                                          |
| --------------- | ------- | ------------------------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icons`         | vector  | `solid-mono`, `solid-multi`, `stroke-mono` | `24`           | All UI icons, merged into one pack with per-group variant overrides. `stroke-mono` overrides via `$values`.                                                      |
| `illustrations` | vector  | —                                          | `48`           | Larger marketing / illustrative artwork. ~15% of assets hand-author the 96px source instead of deriving; asset-level `raster` overrides expected here over time. |

**Canonical size** = the size that every Asset declares its own `$file` for. **Groups** = named
subsets of Assets within the pack that can override the pack-level `$type` or `values` via a
`$values` merge-patch.

### Adding a new top-level Pack

1. Add the manifest: `../packs/<new-pack-id>.json`. Use an existing manifest as a template.
2. Add the binary directory: `../packs/<new-pack-id>/.gitkeep`. See [Binary layout](#binary-layout).
3. Add a row to the table above.

## Pack manifest

### Required top-level keys

| Key            | Required             | Notes                                                                                                                                          |
| -------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`      | REQUIRED             | MUST be `"../schemas/pack.schema.json"`.                                                                                                       |
| `name`         | REQUIRED             | Pack id. MUST equal the filename stem (e.g., `icons.json` → `"icons"`). Pattern: `^[a-z][a-z0-9-]*$`.                                          |
| `version`      | REQUIRED             | Semver. New manifests start at `"1.0.0"`.                                                                                                      |
| `$type`        | REQUIRED             | `"vector"` or `"raster"`. Inherits to every Asset (and Group) unless overridden. See [`spec.md`](./spec.md).                                   |
| `values`       | REQUIRED             | Pack-level Variant map. Carries the canonical marker and any shared Variant computations. See [Variants & values](#variants--values).          |
| `assets`       | one of assets/groups | Flat map of Asset id → Asset. Required unless the pack uses only `assetsGroups`.                                                               |
| `assetsGroups` | one of assets/groups | Map of group id → AssetsGroup. Required unless the pack uses only a flat `assets`. At least one of `assets` or `assetsGroups` must be present. |

Anything else at the root fails schema validation.

### `assets` is flat

Asset entries sit directly under `assets`. NO grouping by category, NO tier hierarchy. Rationale:
category is a _query_ on metadata, not a structural property; structure SHOULD have exactly one
place to look up an Asset by id.

```json
{
  "assets": {
    "add":    { "values": { ... }, "platforms": [...], "metadata": { ... } },
    "remove": { "values": { ... }, "platforms": [...], "metadata": { ... } },
    "edit":   { "values": { ... }, "platforms": [...], "metadata": { ... } }
  }
}
```

### Asset id rules

- Pattern: `^[a-z][a-z0-9-]*$` — lowercase, kebab-case, starts with a letter. **Exception:** the
  `icons` pack uses PascalCase ids (matching Figma component names, e.g. `AppWindow`); the
  `illustrations` pack MAY start with a digit (e.g. `404`, `500`).
- **Bare names** — `add`, `remove`, `edit`. NOT `icon-add` — the Pack name carries the icon
  context.
- **Unique within a Pack (or within a group).** The same id MAY appear in multiple Packs or
  multiple groups. External consumers address an Asset as `<pack>.<id>` (flat) or
  `<pack>.<group>.<id>` (grouped).

### Empty stubs

A Pack with `"assets": {}` validates — useful for stubbing a new Pack before authoring any
Asset. Note that `values` is still REQUIRED even on an empty stub: it MUST carry at least the
canonical marker (one entry flagged `"default": true`).

### Forbidden at the manifest root

- Any key not in the table above.
- Inline category groupings: `{ "assets": { "actions": { "add": {...} } } }` — wrong; category
  lives in [`metadata`](#metadata).
- A `$type` of `"asset"`, `"asset-vector"`, `"icon"`, etc.

## Asset groups

The `icons` pack uses `assetsGroups` to organize assets by rendering style. Each key in the
`assetsGroups` object IS the group id:

```json
{
  "assetsGroups": {
    "solid-mono":  { "assets": { ... } },
    "solid-multi": { "assets": { ... } },
    "stroke-mono": {
      "$values": {
        "24": { "$rules": ["current-color"] },
        "16": { "$rules": ["current-color", "stroke-1-6"] }
      },
      "assets": { ... }
    }
  }
}
```

### Group keys

| Key            | Required | Notes                                                                                      |
| -------------- | -------- | ------------------------------------------------------------------------------------------ |
| `assets`       | REQUIRED | Flat map of Asset id → Asset within this group. Same shape as the pack-level `assets` map. |
| `$type`        | optional | Overrides the inherited pack-level `$type` for every Asset in this group.                  |
| `$values`      | optional | RFC 7396 merge-patch on the pack-level `values`. See below.                                |
| `$description` | optional | One-line human summary of the group.                                                       |

### `$values` — group-level variant patch

`$values` is an RFC 7396 merge-patch applied on top of the pack-level `values` before the
per-asset merge. Absent keys inherit unchanged; a non-null entry overrides or adds that variant;
`null` removes the variant from this group's effective values set.

```json
"stroke-mono": {
  "$values": {
    "24": { "$rules": ["current-color"] },
    "16": { "$rules": ["current-color", "stroke-1-6"] }
  }
}
```

`$values` is deliberately named with a `$` prefix (following the existing `$type`, `$rules`,
`$from` convention for structural modifier keys) to distinguish it unambiguously from the full
`values` map at pack or asset level. A group with no variant override omits `$values` entirely.

### Group id rules

Group ids follow the same kebab-case pattern as Pack ids: `^[a-z][a-z0-9-]*$`. The object key IS
the group id — no separate `name` field.

### Adding a new group to an existing pack

1. Add the key under `assetsGroups` in the pack manifest. Use an existing group as a template.
2. Add a `$values` patch only if the group needs variant overrides; omit it otherwise.
3. Add binaries under `packs/<pack>/`.
4. Add a row to the [Pack catalog](#pack-catalog) table.

## Asset shape

The smallest legal Asset: one source variant, `platforms`, and the three required `metadata`
arrays.

```json
"AppWindow": {
  "values": {
    "24": { "$file": "./packs/icons/AppWindow.svg" }
  },
  "platforms": ["PD"],
  "metadata": {
    "category": [],
    "tags": [],
    "legacyNames": []
  }
}
```

### Top-level keys

| Key            | Required | Notes                                                                                                                                                                                                                    |
| -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$type`        | optional | Override the inherited Pack-level (or Group-level) `$type`. Same enum: `"vector"` or `"raster"`.                                                                                                                         |
| `$description` | optional | One-line human-readable summary. NOT a metadata replacement — search lives in `tags`.                                                                                                                                    |
| `values`       | REQUIRED | Variant map for this Asset. At minimum supplies the canonical's `$file` — the Pack's `values` only carries shared computed (or source) siblings, never the per-asset binary. See [Variants & values](#variants--values). |
| `platforms`    | REQUIRED | `("WEB" \| "PD")[]`, `minItems: 1`. Per-asset only; NOT defaultable. See [Platform scope](#platform-scope).                                                                                                              |
| `metadata`     | REQUIRED | `{ category, tags, legacyNames }`. Per-asset only; NOT defaultable. See [Metadata](#metadata).                                                                                                                           |
| `$extensions`  | optional | Narrow escape hatch reserved for Figma round-trip metadata. `^com\.figma\.` keys only. See [`spec.md`](./spec.md).                                                                                                       |

Anything else fails schema validation.

### Forbidden

- A top-level `$value` on the asset (DTCG-style). Values live in `values`.
- A `$type` of `"asset"`, `"icon"`, `"illustration"`, `"mixed"`.
- A `com.acronis.*` key inside `$extensions` — the project does NOT use that namespace in assets.
  See [`spec.md`](./spec.md).
- Asset-level overrides of metadata fields per variant. Metadata is per-asset, not per-variant.

## Variants & values

`values` is an object map keyed by variant id, on both the pack root and each Asset. Variant ids
match `^[a-z0-9][a-z0-9-]*$`. Today every variant key is a numeric-string size:

- `"16"`, `"20"`, `"24"`, `"32"`, `"48"`, `"64"`, `"96"` — and any other positive integer.

No floats, no units. A variant key is NOT a pixel measurement stamped on the file — it's a stable
identifier for the variant. The schema also admits non-numeric ids (`"dark"`, `"24-dark"`,
`"de-DE"`) so theme / locale / composite dimensions can arrive later without restructuring.

Each entry is one of:

### Source — `$file`

```json
"24": { "$file": "./packs/icons/AppWindow.svg" }
```

- `$file` is project-relative and MUST match
  `^\.\/packs/[a-z0-9-]+/[a-zA-Z0-9-]+\.(svg|png|webp)$`.
- MUST resolve under [`../packs/<pack>/`](../packs/) at commit time.
- A source points at a binary; it is not computed from anything else.

### Computed — `$rules` (+ optional `$from`)

```json
"16": { "$rules": ["current-color", "scale-16"] }
```

- `$rules` is a non-empty array of rule ids declared under [`../rules/`](../rules/). See
  [`rules.md`](./manifest-rules.md).
- Rules apply **left to right** against the resolved source. The same rule MAY appear more than
  once, but reviewers SHOULD flag this — it usually indicates intent that belongs in a new rule.
- **`$from` is omitted in the common case** — the computation then runs against the asset's
  **effective canonical** (see below). Most pack-shared computations omit `$from`.
- Provide `$from: "<sibling-id>"` **only** to compute from a _non-canonical_ sibling on the same
  asset:

  ```json
  "192": { "$from": "96", "$rules": ["scale-192"] }
  ```

  `$from` is always a literal variant id looked up on the **same Asset**. Cross-asset and
  cross-pack references are forbidden by construction.

### Opt out — `null`

```json
"32": null
```

Setting a variant key to `null` in an asset's `values` removes that variant for the asset — it
does not exist, even if the pack or group supplies it.

### The canonical — `"default": true`

Exactly one variant is the **canonical**: the source of truth other variants compute from, and
the variant a translation tool preselects. It is marked inline by `"default": true` on a variant
entry — never a string pointer, never a separate field.

- **Pack level** declares the canonical with a bare marker (no `$file`), because each asset
  supplies its own binary:

  ```json
  "24": { "default": true }
  ```

- **Asset level** supplies the binary for that variant. An asset that uses the pack canonical
  just provides the `$file` — it inherits the flag:

  ```json
  "24": { "$file": "./packs/icons/AppWindow.svg" }
  ```

- An asset MAY **override** the pack canonical (R12) by flagging a _different_ entry. Then it
  carries both the path and the marker:

  ```json
  "32": { "$file": "./packs/icons/Special.svg", "default": true }
  ```

**Effective canonical** = the id flagged in `asset.values` if any, else the id flagged in
`pack.values`. Because the flag lives _on_ a variant entry, the canonical always names a real
entry — it cannot dangle. The canonical is always a source, never computed, never `null`.

### Pack-level `values` and the per-key merge

The pack root carries `values` directly — a variant map shared by every Asset (and every Group)
that does not override per key. It holds the pack canonical marker plus any shared computed (or
source) variants.

The effective `values` for an Asset is a three-layer merge:

1. Start with `pack.values`.
2. Apply the group's `$values` patch (if the Asset belongs to a group): absent keys inherit; a
   non-null entry overrides or adds; `null` removes.
3. Shallow per-key merge with `asset.values`, where the asset wins.

The asset wins: if the Asset declares key `X`, the Asset's entry wins **entirely** for `X`. There
is NO deep-merge inside a variant value — you cannot, e.g., override only the `$rules` of an
inherited computed value while keeping its `$from`. If the Asset declares key `X` as `null`, key
`X` is **removed** even though the pack or group supplies it.

**Late binding.** A pack-level computation that omits `$from` binds to **each consuming asset's
own effective canonical** at resolution time. A pack-level `"16": { "$rules": ["scale-16"] }`
means "for each Asset, compute its `16` from THAT asset's canonical." This is how one pack
`values` entry serves every asset.

### What rules MUST NOT do

- Change the Asset's `$type`. A `vector` computation MUST yield a vector; a `raster` computation
  MUST yield a raster.
- Cross-asset effects. Rule input is a single source value; output replaces that variant only.

### Worked example — pack values plus three assets

```json
{
  "$schema": "../schemas/pack.schema.json",
  "name": "concept-pack",
  "version": "1.0.0",
  "$type": "vector",
  "values": {
    "24": { "default": true },
    "16": { "$rules": ["scale-16"] },
    "32": { "$rules": ["scale-32"] }
  },
  "assets": {
    "icon-basic": {
      "$description": "Plus glyph. Ships only the canonical 24px; 16 and 32 come from pack values.",
      "values": {
        "24": { "$file": "./packs/concept-pack/icon-basic-24.svg" }
      },
      "platforms": ["WEB", "PD"],
      "metadata": {
        "category": ["actions", "general"],
        "tags": ["plus", "create", "new", "insert"],
        "legacyNames": ["icon-plus", "plus-thin"]
      }
    },
    "icon-extended": {
      "$description": "Pencil glyph. Adds a 96 variant beyond pack values; 96 computes from the canonical (no $from).",
      "values": {
        "24": { "$file": "./packs/concept-pack/icon-extended-24.svg" },
        "96": { "$rules": ["scale-96"] }
      },
      "platforms": ["WEB", "PD"],
      "metadata": {
        "category": ["actions", "content"],
        "tags": ["pencil", "modify", "compose"],
        "legacyNames": ["icon-pencil", "edit-thin"]
      }
    },
    "icon-file-override": {
      "$description": "Minus glyph. 16px overrides the pack-computed variant with a hand-authored binary to preserve optical balance.",
      "values": {
        "24": { "$file": "./packs/concept-pack/icon-file-override-24.svg" },
        "16": { "$file": "./packs/concept-pack/icon-file-override-16.svg" }
      },
      "platforms": ["WEB"],
      "metadata": {
        "category": ["actions"],
        "tags": ["minus", "subtract"],
        "legacyNames": ["icon-minus"]
      }
    }
  }
}
```

What each one demonstrates:

- **`icon-basic`** (R1 + R2) — the common case: declares only the canonical `24` file; `16` and
  `32` are inherited from the pack-level `values` and compute from this asset's canonical.
- **`icon-extended`** (R3) — extends with a _new_ `96` variant the pack does not define; it
  computes from the canonical because `$from` is omitted.
- **`icon-file-override`** (R6) — replaces the pack-computed `16` with a hand-authored file
  because scale-down rules cannot preserve optical balance for this glyph.

### Executor scope and runtime invariants

The manifest declares INTENT. The executor that reads a rule file and transforms an SVG is **out
of scope today**; rule files under [`../rules/`](../rules/) describe semantics precisely enough
that an executor can be implemented later — see [`rules.md`](./manifest-rules.md). Resolution (merging
values, picking the canonical, emitting derivation plans) is specified in [`spec.md`](./spec.md),
which also checks invariants the schema does NOT enforce:

- That `$file` paths actually exist on disk.
- That a `$from` sibling — or, when `$from` is omitted, the effective canonical — exists and is
  non-null in the merged values map.
- That the effective `values` for an Asset resolves a canonical to a `$file` source.
- That exactly one canonical (`"default": true`) is in effect after the pack/asset/group merge.
- That `$rules` ids resolve to files in [`../rules/`](../rules/).
- That derivation chains are acyclic.

## Metadata

Per-asset descriptive fields under the top-level `metadata` key. Per-asset only — no Pack-level
inheritance, no per-Variant overrides, NOT defaultable. (`platforms` is a sibling of `metadata`,
not a member of it — see [Platform scope](#platform-scope).)

```json
"metadata": {
  "category":    [...],
  "tags":        [...],
  "legacyNames": [...]
}
```

All three fields are REQUIRED on every Asset. Empty arrays are allowed.

| Field         | Type       | Notes                                                                                                                                  |
| ------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `category`    | `string[]` | UI-grouping hints. Open vocabulary today (e.g., `"actions"`, `"navigation"`, `"content"`). An Asset MAY belong to multiple categories. |
| `tags`        | `string[]` | Free-form search keywords. Lowercase, no punctuation beyond hyphens.                                                                   |
| `legacyNames` | `string[]` | Historical names this Asset used to be known by. Useful when migrating consumers.                                                      |

### What metadata does NOT cover

- **Platform scope** — lives at the top-level `platforms` sibling. See [Platform scope](#platform-scope).
- **Visual semantics** — what the Asset _looks like_ belongs in `$description`.
- **Per-Variant information** — sizes are Variants; Variant-specific data belongs in
  [Variants & values](#variants--values).
- **Cross-asset relationships** — Assets do not reference other Assets today.

### Why metadata is not defaultable

Pack-level inheritance exists for `values` only. `category`, `tags`, and `legacyNames` are
inherently per-Asset — defaulting them risks silently-wrong values flowing into Assets that
should have declared their own. Each Asset MUST author its own `metadata` object even when it is
mostly empty arrays.

## Platform scope

> ⚠️ This enum is mirrored in `@acronis-platform/design-tokens`; the two MUST stay in sync — a
> change here requires the same change there.

Platform scope declares which consumers an asset targets so downstream tooling can route
correctly. Stored at the top-level `platforms` key on each Asset, sibling to `values` and
`metadata`:

```json
"AppWindow": {
  "values": { ... },
  "platforms": ["PD"],
  "metadata": { ... }
}
```

No pack-level inheritance, no defaultability, no per-mode override. Every Asset MUST declare
`platforms`.

### Shape

`("WEB" | "PD")[]` — closed enum, `uniqueItems`, `minItems: 1`.

| Value | Meaning                                            |
| ----- | -------------------------------------------------- |
| `WEB` | Web product surface (apps, dashboards, marketing). |
| `PD`  | Product Design (internal design-system surface).   |

Order-insensitive. `["WEB", "PD"]` and `["PD", "WEB"]` are equivalent semantically.

### Default

`["PD"]`. Every asset starts here. Widen to `["WEB"]` or `["WEB", "PD"]` only when the asset
has been audited for the additional consumer.

### Why it's a closed enum

Consumers branch on the value: a `WEB`-only asset is excluded from the Product Design package,
and vice versa. A typo (`"WEEB"`, `"web"`) MUST fail at validation time, not silently route to
the wrong consumer. Adding a third value requires a coordinated schema change in both
`assets/schemas/pack.schema.json` and the tokens schema.

## Binary layout

Where the actual `.svg` / `.png` / `.webp` files live and how they are named.

The Pack manifest and the Pack binary directory sit **side by side** under `packs/`, sharing the
same stem:

```text
../packs/
  icons.json
  icons/
    Acronis.svg
    AppWindow.svg
    ...
  illustrations.json
  illustrations/
    empty-state-hero-480.png
```

- One subdirectory per Pack, matching the Pack id exactly.
- Files sit **directly** under the Pack subdirectory. NO per-Asset subdirs
  (`icons/AppWindow/24.svg` ❌).
- A Pack with no committed binaries keeps a `.gitkeep` so the directory exists in the repo.

### Filename pattern

Binary filenames follow one of two conventions depending on the pack:

| Convention              | Pattern                                                              | Used by                                          |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| **Default** (new packs) | `<AssetId>[-<dimension>].<ext>` — PascalCase id, optional dimension  | `icons` pack (pulled from Figma component names) |
| **Legacy**              | `<asset-id>[-<dimension>].<ext>` — kebab-case id, optional dimension | `illustrations` and any pre-PascalCase packs     |

Parts:

- **`<AssetId>` / `<asset-id>`** — the Asset's id, matching the key in the manifest (PascalCase or
  kebab-case depending on the pack). See [Naming conventions](#naming-conventions).
- **`[-<dimension>]`** — optional. A hyphen-prefixed Variant id that disambiguates multiple
  source binaries for the same Asset. Omit entirely when the Asset ships only one source file.
  See **Dimension** in [`glossary.md`](./glossary.md). Examples:
  - `-24`, `-16`, `-32` — size variants
  - `-dark`, `-light` — theme variants
  - `-de-DE` — locale variants
- **`<ext>`** — `svg` for `vector`, `png` or `webp` for `raster`.

Examples:

- `AppWindow.svg` ✓ — default convention, no dimension (single canonical binary)
- `Bell-24.svg` ✓ — default convention, size dimension
- `Bell-dark.svg` ✓ — default convention, theme dimension
- `empty-state-hero-480.png` ✓ — legacy convention, size dimension
- `add-24.svg` ✓ — legacy convention, size dimension

### Orphans and missing files

- **Orphan binary** — a file under `packs/<pack>/` that no manifest entry references. Defect.
- **Missing binary** — a `$file` path in a manifest that does not exist on disk. Defect.
- Neither is caught by schema validation; both will be caught by a future validator script.

### Renaming an Asset

Rename every binary AND the manifest entry in the **same commit**. There is no aliasing layer —
the previous name lives on only in `legacyNames`.

## Naming conventions

### Pack ids, group ids, rule ids

- Pattern: `^[a-z][a-z0-9-]*$` — lowercase, kebab-case, starts with a letter.
- No underscores, no camelCase, no PascalCase, no dots, no slashes.
- Acronyms lowercase: `svg`, `ui` (not `SVG`, `UI`).

### Asset ids

| Convention              | Pattern                                 | Used by                                      |
| ----------------------- | --------------------------------------- | -------------------------------------------- |
| **Default** (new packs) | PascalCase, e.g. `AppWindow`, `Acronis` | `icons` pack — mirrors Figma component names |
| **Legacy**              | `^[a-z][a-z0-9-]*$` kebab-case          | `illustrations` and pre-PascalCase packs     |

- **Illustrations exception:** legacy ids MAY start with a digit (e.g. `404`, `500`).
- Asset ids are unique within a Pack (or within a group). The same id MAY appear in multiple
  Packs or groups — addressed externally as `<pack>.<id>` (flat) or `<pack>.<group>.<id>`.

### Asset filenames

Follow [Filename pattern](#filename-pattern) above. The dimension suffix in the filename MUST
match the Variant id in the manifest's `values` map. Omit the dimension when the Asset ships
only one source binary (no ambiguity needed).

### `$type` values

`vector` or `raster` only. No `"asset"`, `"icon"`, `"mixed"`, etc.

### `$`-prefixed keys

The full inventory and the rule for when to use `$` is the `$`-prefix discipline in
[`spec.md`](./spec.md). The short rule: `$` is for DTCG-borrowed or project-coined structural
modifier keys only — treat the existing set (`$schema`, `$type`, `$description`, `$extensions`,
`$file`, `$from`, `$rules`, `$values`) as fixed. Do not coin new ones.
