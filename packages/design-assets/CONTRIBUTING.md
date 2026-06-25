# Contributing to `@acronis-platform/design-assets`

There are two ways to make a change:

- **✋ By hand** — open the pack files and edit directly.
- **🔌 Via Figma sync** — run `tools/figma-design-assets-sync` to pull icons from Figma.

> [!IMPORTANT]
> The pack files under `packs/` are the **single source of truth**. They're what gets
> published and what every consumer reads. Whichever path you take, a change isn't real
> until the files are updated, checked (`pnpm validate`), and committed.

> [!WARNING]
> **Figma sync can overwrite hand-authored changes.** The sync tool
> (`tools/figma-design-assets-sync`) regenerates pack manifests from Figma frames. It is
> **not aware** of hand-authored additions: group `$values` patches, `current-color` rules,
> asset-level overrides, null opt-outs, or any structural edit you made directly to the JSON.
> Running it on a pack with recent manual changes may **silently discard them**.
>
> Safe approach: run the sync first, then re-apply your manual changes on top — or skip the
> sync for that pack and add only the missing assets by hand.

## At a glance

|                   | ✋ **By hand**                                                         | 🔌 **Via Figma sync**                                         |
| ----------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| **What it is**    | Edit the pack or rule JSON directly                                    | Run `tools/figma-design-assets-sync` to pull icons from Figma |
| **Best for**      | One asset, structural changes, rule additions, group `$values` patches | Bulk icon syncs from a Figma frame                            |
| **What you need** | A code editor + the repo running locally                               | Figma access token + `tsx` + repo running locally             |
| **Safety net**    | `pnpm validate` — run it before committing                             | `pnpm validate` — run manually after the sync                 |
| **Effort**        | Higher                                                                 | Lower for bulk syncs                                          |

---

## ✋ By hand

### Adding an asset to an existing pack

An asset is a single named entry inside a pack: one id, one or more per-variant values,
mandatory `platforms` and `metadata` blocks.

#### 1. Drop the binary in place

Binaries live flat under `packs/<pack>/`. The filename pattern depends on the pack's convention:

| Convention              | Pattern                                                              | Used by                                  |
| ----------------------- | -------------------------------------------------------------------- | ---------------------------------------- |
| **Default** (new packs) | `<AssetId>[-<dimension>].<ext>` — PascalCase id, optional dimension  | `icons` pack                             |
| **Legacy**              | `<asset-id>[-<dimension>].<ext>` — kebab-case id, optional dimension | `illustrations` and pre-PascalCase packs |

- **`<AssetId>` / `<asset-id>`**: matches the id in the manifest exactly (PascalCase or kebab-case).
- **`<dimension>`** (optional): `-<variant-id>` appended between the id and extension — identifies
  which Variant the file belongs to. Examples: `-24` (size), `-dark` (theme), `-de-DE` (locale).
  Omit the dimension entirely when the Asset ships only one source binary (e.g. `AppWindow.svg`,
  not `AppWindow-24.svg`).
- **`<ext>`**: `svg` for vector packs, `png` or `webp` for raster.

#### 2. Register it in the pack manifest

Open `packs/<pack>.json` and add a new entry under the relevant `assets` map (at the pack root
for flat packs, or under `assetsGroups.<group>.assets` for grouped packs like `icons`). The
minimum shape when the pack's `values` already define every variant:

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

- `values."24"` supplies the asset's binary for the pack's canonical variant (the one marked
  `"default": true` at the pack level).
- Pack-level `values` entries that omit `$from` **late-bind** to each asset's own canonical, so
  derived sizes (e.g. `"16"`) are inherited automatically — one line in the manifest gets you
  all sizes.
- `platforms`: array of `"WEB"` / `"PD"`. Required, not defaultable.
- `metadata`: three arrays, all required (use `[]` if empty).

#### 3. Override a pack variant when its derivation doesn't fit

Supply your own entry under that key to override. Replace with a different computation:

```json
"bell": {
  "values": {
    "16": { "$rules": ["stroke-2-5", "scale-16"] },
    "24": { "$file": "./packs/icons/bell-24.svg" }
  }
}
```

…or with your own binary:

```json
"bell": {
  "values": {
    "16": { "$file": "./packs/icons/bell-16.svg" },
    "24": { "$file": "./packs/icons/bell-24.svg" }w
  }
}
```

To opt out of a pack variant entirely, set the key to `null`.

### Adding a new pack

A pack is a catalog of same-style assets. The packs today are `icons` and `illustrations`.

#### 1. Create the manifest

Make a new file at `packs/<pack-id>.json`. The pack id (kebab-case) MUST equal the filename stem.
Minimum shape:

```json
{
  "$schema": "../schemas/pack.schema.json",
  "name": "<pack-id>",
  "version": "0.1.0",
  "$type": "vector",
  "values": {
    "24": { "default": true },
    "16": { "$rules": ["scale-16"] }
  },
  "assets": {}
}
```

Keys:

- `$schema`: always `../schemas/pack.schema.json`. This is the discriminator consumers use.
- `name`: pack id; MUST equal the filename stem.
- `version`: semver. Bump it when the pack's contents change in a way consumers should notice.
- `$type`: `"vector"` or `"raster"`. Inherited by every asset; can be overridden per asset.
- `values`: pack-level variant map. Exactly one entry MUST carry `"default": true`. Declare
  derived variants here as computed entries so individual assets only need to ship the canonical.

#### 2. Create the binary directory

`packs/<pack-id>/` is a sibling of the manifest. Binaries go directly inside (flat, no per-asset
subdirectories). Add a `.gitkeep` until the first binary lands.

### Adding a new group to an existing pack

Use `assetsGroups` when you want to organize assets into named subsets that share most of the
pack's variant behavior but need one or two variants to differ.

```json
{
  "assetsGroups": {
    "my-group": {
      "$values": {
        "16": { "$rules": ["scale-16", "stroke-1-6"] }
      },
      "assets": { ... }
    }
  }
}
```

- The group id (object key) follows the same kebab-case pattern as the pack id.
- `$values` is an RFC 7396 merge-patch on the pack-level `values`. Absent keys inherit unchanged;
  a non-null entry overrides or adds; `null` removes the variant from this group entirely.
- `$type` can also be overridden per group.

### Adding a new rule

A rule is a declarative transform referenced from a computed variant's `$rules` array. Rules live
in `rules/<name>.json`. The filename stem MUST equal the `name` field.

Three kinds today:

- `scale` — resize the source's bounding box to the target dimension.
  `target`: `{ "value": <number>, "unit": "px" }`
- `stroke` — set every stroked path on the source to the target width.
  `target`: `{ "value": <number>, "unit": "px" }`
- `color` — replace hardcoded colors in the SVG with a CSS value.
  `target`: `{ "value": "<css-value>" }` (no `unit` — value is a CSS string, e.g. `"currentColor"`)

```json
{
  "$schema": "../schemas/rule.schema.json",
  "name": "scale-48",
  "kind": "scale",
  "target": { "value": 48, "unit": "px" }
}
```

```json
{
  "$schema": "../schemas/rule.schema.json",
  "name": "current-color",
  "kind": "color",
  "target": { "value": "currentColor" }
}
```

Decimal values in filenames use dashes: `stroke-1-6` means width 1.6.

### Validating

```bash
pnpm validate          # from packages/design-assets/
```

`pnpm validate` compiles both schemas and checks every pack manifest and rule file. Run before
committing. It catches missing required keys, wrong shapes, invalid asset ids, invalid `$file`
paths, missing binaries referenced by `$file`, and per-pack subpath export coverage in
`package.json`.

### Third-party sources

If you add assets derived from a third-party library:

1. Open `LICENSE` and scroll to the "Third-party content" section.
2. Append a new subsection: attribution paragraph (source + URL) + the source's full license
   text, reproduced verbatim.
3. If the source's license requires it, include the copyright notice.

---

## 🔌 Via Figma sync

The Figma sync tool (`tools/figma-design-assets-sync`) pulls SVG icons from a Figma file and
regenerates a pack manifest. See its own
[`README.md`](../../tools/figma-design-assets-sync/README.md) for setup and usage.

After running the sync, always:

1. **Review the diff** — check that nothing was removed unexpectedly.
2. **Run `pnpm validate`** — the sync does not run it automatically.
3. **Re-apply any hand-authored changes** the sync may have overwritten (see warning above).

---

## Where the deeper context lives

| Topic                                                                                                                                  | File                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Vocabulary — Schema, Rule, Pack, Asset, Variant, Canonical/Default, Value (source/computed), AssetsGroup                               | [`./context/glossary.md`](./context/glossary.md)             |
| The normative contract — DTCG divergence, `$`-prefix discipline, R1–R16 cases, invariants, resolution algorithm                        | [`./context/spec.md`](./context/spec.md)                     |
| Manifest shape — pack root + asset groups, the `values` map, derivation, metadata, platform scope, pack catalog, binary layout, naming | [`./context/manifest-pack.md`](./context/manifest-pack.md)   |
| Rule declaration format                                                                                                                | [`./context/manifest-rules.md`](./context/manifest-rules.md) |
| How to size a change — major / minor / patch and how to record it                                                                      | [`./context/versioning.md`](./context/versioning.md)         |

The same context files are indexed in `./AGENTS.md` for AI agents.
