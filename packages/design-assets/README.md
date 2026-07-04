# @acronis-platform/design-assets

Acronis visual assets as data as custom JSON schema. Includes binies of icons, illustrations and othe visual assets. No runtime code.

## Table of contents

- [Introduction](#introduction)
- [Glossary](#glossary)
- [Properties](#properties)
- [Pack structure](#pack-structure)
- [Package structure](#package-structure)
- [Contributing](#contributing)
- [How to run](#how-to-run)
- [Translation tools](#translation-tools)
- [License](#license)

## Introduction

`@acronis-platform/design-assets` is **design data only**, technology-agnostic. It ships JSON manifests plus the binary files (`.svg`, `.png`, `.webp`) those manifests reference — no components, no build, no runtime API. The canonical form stays as data so no consumer's conventions are baked in: the same `bell-24.svg` survives a React build, an SVG-sprite build, and a Figma sync without ever becoming any one platform's idea of what an icon is.

The package is meant to be consumed by a **translation tool**: a build-time program that reads the manifests, resolves them, and emits platform-specific output (a React index, an SVG sprite, a resource catalog, a Figma sync payload, …).

The manifests borrow DTCG's `$`-prefix vocabulary (`$schema`, `$type`, `$description`, `$extensions`, plus value discriminators `$file` / `$from` / `$rules`) but are **NOT DTCG-conformant** — project fields live at top-level keys (`values`, `platforms`, `metadata`), not inside `$extensions.com.acronis.*`. The `$schema` field on every file is the discriminator. See [Translation tools](#translation-tools).

## Glossary

### Schema

- **Schema** — the JSON Schema (draft 2020-12) under [`schemas/`](./schemas/) that defines the validation contract for manifests and rules. The `$schema` field on every file points at its schema and is the discriminator a consumer uses to recognize an `@acronis-platform/design-assets` file (vs. a DTCG token file or anything else).

### Rules

- **Rule** — a named, parameterized transform (e.g., `scale-16`, `stroke-2-5`) declared once under [`rules/`](./rules/) and referenced by id from a computed value's `$rules` array. Rules are pure declarations of intent today; the executor that applies them is out of scope.

### Packs

- **Pack** — a top-level catalog of Assets that share a style and medium. One manifest per Pack under [`packs/`](./packs/). Five today: `icons-stroke-mono`, `icons-stroke-multi`, `icons-solid-mono`, `icons-solid-multi`, `illustrations`.
- **Asset** — the smallest catalog entry: one logical thing (`add`, a hero illustration). Stable kebab-case id, lives in exactly one Pack, expresses one or more Variants. Addressed externally as `<pack>.<id>`.
- **Variant** — a discriminator dimension on an Asset. Keys are real ids; today every key is a numeric-string size (`"16"`, `"24"`, `"32"`), but theme (`"dark"`), locale (`"de-DE"`), or composite (`"24-dark"`) keys MAY arrive later without restructuring.
- **Canonical / Default** — the one Variant a Pack treats as the source of truth: what other Variants compute from and what a translation tool preselects. Marked inline by `"default": true` on exactly one entry. An Asset MAY flag a _different_ entry to override the pack canonical.
- **Value** — what a Variant resolves to, in two flavors:
  - **Source value** — `{ "$file": "<path>" }`, a binary on disk; not computed from anything.
  - **Computed value** — `{ "$rules": [...] }`, computed from a sibling Variant of the _same_ Asset by applying Rules in order. Omit `$from` to compute from the effective canonical; add `"$from": "<sibling-id>"` only to compute from a non-canonical sibling.

These definitions are kept in sync with [`context/glossary.md`](./context/glossary.md) — if you edit one, edit the other.

## Properties

Every key that can appear in a manifest. (`Level` names where it lives; `Required` is within that level.)

| Key            | Level         | Type / values                                         | Required                | Meaning                                                                                                                                   |
| -------------- | ------------- | ----------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`      | pack          | string (`"../schemas/pack.schema.json"`)              | yes                     | Schema discriminator; identifies the file as an `@acronis-platform/design-assets` manifest.                                               |
| `name`         | pack          | string, `^[a-z][a-z0-9-]*$`                           | yes                     | Pack id; MUST equal the filename stem.                                                                                                    |
| `version`      | pack          | string (semver)                                       | yes                     | Pack version; new manifests start at `"1.0.0"`.                                                                                           |
| `$type`        | pack / asset  | `"vector"` \| `"raster"`                              | yes (pack)              | Medium. Declared at the pack root; inherits to every Asset unless the Asset overrides it.                                                 |
| `values`       | pack / asset  | object (Variant id → Value)                           | yes                     | Variant map. Pack-level carries the canonical marker + shared values; per-asset carries the Asset's own/overriding values.                |
| `default`      | variant-value | boolean (`true`)                                      | no                      | Role marker inside one Value object flagging it as the canonical. Exactly one per pack `values`; at most one per asset `values`.          |
| `$file`        | variant-value | string path, `./packs/<pack>/<name>.(svg\|png\|webp)` | one of `$file`/`$rules` | Source value: this Variant is a binary at this path.                                                                                      |
| `$rules`       | variant-value | string[] of rule ids                                  | one of `$file`/`$rules` | Computed value: apply these rules, in order, to the resolved source.                                                                      |
| `$from`        | variant-value | string (sibling Variant id)                           | no                      | Computed source override; names a non-canonical sibling. Omit to compute from the effective canonical.                                    |
| `platforms`    | asset         | array of `"WEB"` \| `"PD"`                            | yes (per asset)         | Consumer scope. Per-asset only, not defaultable/inheritable. Default `["PD"]`.                                                            |
| `metadata`     | asset         | object                                                | yes (per asset)         | Descriptive fields container. Per-asset only, not defaultable.                                                                            |
| `category`     | metadata      | string[]                                              | yes (may be empty)      | Classification of the Asset.                                                                                                              |
| `tags`         | metadata      | string[]                                              | yes (may be empty)      | Free-form search tags.                                                                                                                    |
| `legacyNames`  | metadata      | string[]                                              | yes (may be empty)      | Prior names, for migration/search.                                                                                                        |
| `$description` | pack / asset  | string                                                | no                      | One-line human summary.                                                                                                                   |
| `$extensions`  | asset         | object (open, reverse-DNS keys)                       | no                      | Tool-specific payload. Any `com.<org>.*` key allowed; today only `com.figma.nodeId` / `com.figma.variableId` (Figma round-trip) are used. |

Distilled from [`context/spec.md`](./context/spec.md) §3.

## Pack structure

A manifest has a small set of root keys plus an `assets` map (Asset id → Asset). Each Asset carries its own `values`, `platforms`, and `metadata`.

```jsonc
{
  "$schema": "../schemas/pack.schema.json",
  "name": "concept-pack",
  "version": "1.0.0",
  "$type": "vector",
  "values": {
    // pack-level shared map
    "24": { "default": true }, // pack canonical (bare marker)
    "16": { "$rules": ["scale-16"] }, // computed; late-binds per asset
    "32": { "$rules": ["scale-32"] },
  },
  "assets": {
    "icon-basic": {
      "values": {
        "24": { "$file": "./packs/concept-pack/icon-24.svg" }, // supplies canonical binary
      },
      "platforms": ["PD"],
      "metadata": { "category": [], "tags": [], "legacyNames": [] },
    },
  },
}
```

**Pack `values` vs per-asset `values`.** Pack-level `values` holds the canonical marker and any computations shared across the Pack. Each Asset's `values` supplies its canonical binary and any overrides.

**Inheritance and overrides** — per-key shallow merge: effective values = `{ ...pack.values, ...asset.values }`, with the Asset winning _per key_ (no deep merge — an Asset entry replaces the pack entry for that key wholesale). Beyond that:

- `"default": true` inline marks the canonical; an Asset MAY flag a different entry to override the pack canonical.
- `null` at a key in an Asset's `values` opts that Variant out — it does not exist for the Asset, even if the pack supplies it.
- Computed entries (`{ "$rules": [...] }`, optional `$from`) that omit `$from` **late-bind** to each consuming Asset's own effective canonical, so one shared entry serves every Asset.

Depth: [`context/manifest.md`](./context/manifest.md) (authoring, merge, late binding) and [`context/spec.md`](./context/spec.md) (how a renderer reads the merged result).

## Package structure

```text
assets/
├── packs/                 One manifest per pack (packs/*.json) + bundled binaries (packs/<pack>/*).
├── rules/                 Declarative transform definitions (rules/*.json), referenced by $rules.
├── schemas/               JSON Schema (draft 2020-12) for manifests and rules.
├── context/               Authoring docs (spec.md, glossary.md, manifest.md, packs.md, rules.md).
├── README.md              This file — consumer-facing surface.
├── CONTRIBUTING.md        How to add an asset, pack, or rule.
├── LICENSE                MIT (package as a whole) + Lucide ISC third-party attribution.
└── package.json           Package metadata, files, and the validate script.
```

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for day-to-day tasks: adding an asset to a pack, adding a new pack or rule, validating, and attributing third-party sources.

## How to run

| Command         | Does                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`  | Installs devDependencies (ajv toolchain).                                                                              |
| `pnpm validate` | ajv-compiles both schemas, then validates every `packs/*.json` and `rules/*.json` against them. Run before committing. |

## Translation tools

The package is consumed by a **translation tool** in the [DTCG sense](https://www.designtokens.org/tr/2025.10/format/#translation-tool): a build-time program that reads the source-of-truth manifests and writes platform-specific output.

> [!IMPORTANT]
> Off-the-shelf DTCG translators do NOT work. The manifest shape intentionally diverges from DTCG. A generic DTCG consumer that opens one of these files MUST check the `$schema` discriminator and refuse to treat it as a DTCG token file.

How to consume:

1. **Check `$schema`** — only handle files whose `$schema` ends with `pack.schema.json`.
2. **Resolve** per [`context/spec.md`](./context/spec.md): merge pack + asset `values` (per-key, asset wins, drop `null`), pick the effective canonical, and build a derivation plan (resolved source + ordered rule ids) for each computed Variant.
3. **Apply `$rules`** via a rule executor — out of scope for this package; you supply the SVG/raster transform pipeline.
4. **Filter by `platforms`** — keep only Assets whose `platforms` includes your target (`WEB` / `PD`).
5. **Emit** in your platform's shape.

### Worked example — Style Dictionary

[Style Dictionary](https://styledictionary.com/) is a widely-used token translator and a representative Translation Tool. This wires `@acronis-platform/design-assets` into a build that emits a JavaScript module mapping `<asset>-<size>` → file path. The same skeleton can emit an SVG sprite, a React index, or a Figma sync payload — only the `format` changes.

```js
// style-dictionary.config.js
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerParser({
  name: 'acronis-assets-pack',
  pattern: /\/packs\/[a-z0-9-]+\.json$/,
  parser: ({ contents }) => {
    const pack = JSON.parse(contents);

    // Discriminator: only handle this project's manifests.
    if (!pack.$schema?.endsWith('pack.schema.json')) return {};

    const tokens = {};
    for (const [id, asset] of Object.entries(pack.assets)) {
      // Per-variant merge: shallow-merge pack.values with asset.values, asset
      // wins per key. A key set to null in asset.values opts that variant out,
      // so drop it. No deep merge — an asset variant entry replaces the pack's
      // entry for that key wholesale.
      const merged = { ...(pack.values ?? {}), ...(asset.values ?? {}) };
      const values = Object.fromEntries(
        Object.entries(merged).filter(([, value]) => value !== null)
      );

      tokens[id] = {};
      for (const [variant, value] of Object.entries(values)) {
        // Source values resolve directly. Computed values ({ $rules } — from
        // the effective canonical, or from $from — and the bare { default:true }
        // canonical marker) need a real executor — out of scope here.
        if (value.$file) {
          tokens[id][variant] = { value: value.$file, type: 'asset' };
        }
      }
    }
    return { [pack.name]: tokens };
  },
});

StyleDictionary.registerTransform({
  name: 'asset/path/relative',
  type: 'value',
  filter: (token) => token.type === 'asset',
  transform: (token) =>
    token.value.replace(
      /^\.\//,
      'node_modules/@acronis-platform/design-assets/'
    ),
});

export default {
  source: ['node_modules/@acronis-platform/design-assets/packs/*.json'],
  parsers: ['acronis-assets-pack'],
  platforms: {
    js: {
      transforms: ['asset/path/relative'],
      buildPath: 'build/',
      files: [{ destination: 'assets.js', format: 'javascript/es6' }],
    },
  },
};
```

This is illustrative — your translator owns the mapping from manifest to output. Things this minimal example does NOT do: execute `$rules` computation (you need an SVG/raster transform pipeline for that — see [`context/spec.md`](./context/spec.md) for the full resolution contract, and [`context/spec.md`](./context/spec.md) for the cases the format must cover), enforce `platforms` scope (filter assets by `WEB` / `PD` for your target), or surface `metadata.category` / `metadata.tags` to the output (useful for generating index files).

## License

MIT for the package as a whole; some icons are derived from [Lucide](https://lucide.dev) (ISC), whose attribution is retained. See [`LICENSE`](./LICENSE) for the full text and third-party attribution.
