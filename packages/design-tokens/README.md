# @acronis-platform/design-tokens

Acronis design tokens as data — DTCG-2025.10-conformant JSON. No runtime code.

## Table of contents

- [Introduction](#introduction)
- [Relationship to DTCG](#relationship-to-dtcg)
- [Glossary](#glossary)
- [Properties](#properties)
- [Token files](#token-files)
- [Package structure](#package-structure)
- [Setup](#setup)
- [Contributing](#contributing)
- [How to run](#how-to-run)
- [Translation tools](#translation-tools)
- [License](#license)

## Introduction

`@acronis-platform/design-tokens` is **design data only**, technology-agnostic. It ships JSON token files — every color, dimension, typography, and per-component value across Acronis surfaces — and nothing else: no components, no build, no runtime API. The files are **[DTCG 2025.10](https://www.designtokens.org/tr/2025.10/)**-conformant.

Keeping the canonical form as data means no consumer's conventions are baked in. The same `palette.blue.7` ends up in a CSS file, a Tailwind config, and an iOS Asset Catalog without ever becoming one of their conventions — each team owns its own pipeline.

The package is meant to be consumed by a **translation tool**: a build-time program that reads the source-of-truth tokens and emits platform-specific output (CSS custom properties, a JS module, a Tailwind `@theme` block, an Asset Catalog, …). See [Translation tools](#translation-tools).

## Relationship to DTCG

The token files are conformant with **[DTCG 2025.10](https://www.designtokens.org/tr/2025.10/)**, the W3C-track Design Tokens Community Group format. We use the DTCG `$`-prefix vocabulary (`$schema`, `$type`, `$value`, `$extensions`, `{group.token}` alias syntax) and the DTCG type system (`color`, `dimension`, `gradient`, `typography`, …).

We diverge in two small, deliberate ways, both at the token:

- **Per-mode `values`** — a top-level `values` dict carries one value per mode (Theme `light`/`dark`, Brand `acronis`/`brand-b`), instead of the spec's single `$value`.
- **Token `platforms`** — a top-level `platforms` array scopes the token to `WEB` / `PD` consumers.

Neither lives under `$extensions.com.acronis.*` as the spec's vendor-extension pattern would suggest. Each file's `$schema` points at [`schemas/tokens.schema.json`](./schemas/tokens.schema.json) — the canonical description of the Acronis shape (DTCG-conformant with these divergences), which also flags the file as ours rather than plain DTCG. Full rationale: [`./context/spec.md`](./context/spec.md).

## Glossary

### Tiers & groups

- **Tier** — a business categorization of tokens: **primitives** (raw palette, units, font primitives), **semantics** (roles/intents that alias primitives), **components** (component-specific tokens that alias semantics). Tiers exist in code only; Figma does not use the concept.
- **Group** — a parent of one or more tokens, living inside a Tier or another Group (`palette`, `palette.blue`, `units.gap`).

### Modes

- **Mode** — a dimension inside a Group that lets a token carry a different value per active dimension value. A Group may have one mode, many, or none.
- **Theme** — business name for the modes under `primitives.palette`: `light` / `dark`. "Theme switch" is the user-facing concept.
- **Brand** — business name for the modes under `semantics.colors` and `components.*`: `acronis`, `brand-b` today, more planned. Drives white-labeling.
- **Collection** — Figma-native concept: a Figma Collection groups Variables under exactly one mode dimension.

### Tokens

- **Token** — the smallest entry: it carries a value via per-mode `values` (or a DTCG `$value` on typography composites) plus a `$type` and a `platforms` scope.
- **Alias** — a DTCG `{group.token}` string pointing at another token; resolved by the consumer. Stored inside `values.<mode>` or inside a composite `$value`.
- **Primitive / semantic / component** — the three Tiers a token belongs to, wired in an alias chain `components → semantics → primitives`.

These definitions are kept in sync with [`context/glossary.md`](./context/glossary.md) — edit both.

## Properties

Every key that can appear in a token file. (`Level` names where it lives; `Required` is within that level.)

| Key                   | Level         | Type / values                                                                                                                                                                     | Required                                         | Meaning                                                                                                                                                                                                  |
| --------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`             | root          | string (`../schemas/tokens.schema.json`)                                                                                                                                          | yes (root)                                       | Schema discriminator; points at the repo's Acronis token schema (DTCG-conformant shape).                                                                                                                 |
| `$value`              | token         | any DTCG value                                                                                                                                                                    | one of `$value` / `values` / `com.acronis.units` | Native DTCG single value — used by typography composites (object of font aliases). NOT used for mode-aware tokens.                                                                                       |
| `values`              | token         | object (mode id → value)                                                                                                                                                          | one of `$value` / `values` / `com.acronis.units` | Per-mode value dict — the primary Acronis divergence. Keys are kebab-case lowercase mode names (`light`, `dark`, `acronis`, `brand-b`); values are concrete values or `{group.token}` aliases.           |
| `$type`               | group / token | DTCG type enum (`color`, `dimension`, `fontFamily`, `fontWeight`, `gradient`, `typography`, `duration`, `cubicBezier`, `number`, `strokeStyle`, `border`, `transition`, `shadow`) | no                                               | Token type; may be declared on a Group and inherited.                                                                                                                                                    |
| `$description`        | group / token | string                                                                                                                                                                            | no                                               | One-line human summary.                                                                                                                                                                                  |
| `platforms`           | token         | array of `"WEB"` \| `"PD"`                                                                                                                                                        | yes (every token)                                | Consumer scope. The schema requires every token to declare it.                                                                                                                                           |
| `$extensions`         | group / token | object, keys `^com\.(acronis\|figma)\.`                                                                                                                                           | no                                               | Vendor metadata, namespaced reverse-DNS.                                                                                                                                                                 |
| ↳ `com.acronis.units` | `$extensions` | `{value,unit:"px"}` \| string \| number                                                                                                                                           | makes a token                                    | Single-value primitive carrier (units, font primitives) — holds the value instead of `$value`. A token carrying it MUST declare `platforms`. Also: `com.acronis.textCase`, `com.acronis.textDecoration`. |
| ↳ `com.figma.*`       | `$extensions` | `variableId`, `styleId`, `scopes`, `hiddenFromPublishing`, `gradientTransform`                                                                                                    | no                                               | Figma round-trip metadata. `variableId` and `styleId` are mutually exclusive.                                                                                                                            |
| `$deprecated`         | group / token | boolean \| string                                                                                                                                                                 | no                                               | Marks the token deprecated; a string carries a reason.                                                                                                                                                   |

Note: a token **should use exactly one** of `$value` (typography composites), per-mode `values` (mode-aware tokens), or `$extensions.com.acronis.units` (single-value primitives). The schema enforces the mutual-exclusion half — no token may carry **more than one**, and `pnpm validate` rejects any that does. The complementary expectation that every leaf carries **at least one** is normative in [`./context/spec.md`](./context/spec.md) and checked in review (it can't be expressed structurally, since a leaf is defined by carrying one).

## Token files

Three token files, one per Tier:

- **`tiers/primitives.json`** — palette (Theme `light`/`dark`), units, font primitives.
- **`tiers/semantic.json`** — semantic colors (Brand axis), typography composites.
- **`tiers/components.json`** — per-component tokens, aliasing semantics.

### Token shapes

A mode-aware color token (palette: Theme axis `light` / `dark`):

```jsonc
"blue": {
  "7": {
    "values": {
      "dark": { "colorSpace": "hsl", "components": [213, 61, 60] },
      "light": { "colorSpace": "hsl", "components": [213, 90, 47] }
    },
    "platforms": ["PD"],
    "$extensions": { "com.figma.scopes": ["ALL_FILLS"], "com.figma.variableId": "VariableID:7:1592" }
  }
}
```

A semantic or component token (Brand axis `acronis` / `brand-b`) aliases upstream tokens with DTCG `{group.token}` strings:

```jsonc
"background": {
  "brand": {
    "primary": {
      "values": {
        "acronis": "{palette.blue.7}",
        "brand-b": "{palette.blue.7}"
      },
      "platforms": ["PD"],
      "$extensions": { "com.figma.scopes": ["ALL_FILLS"], "com.figma.variableId": "VariableID:50:1428" }
    }
  }
}
```

A single-value primitive (units, font primitives — no mode dimension) keeps its value inside `com.acronis.units` rather than DTCG `$value`:

```jsonc
"gap": {
  "4": {
    "platforms": ["PD"],
    "$extensions": {
      "com.acronis.units": { "value": 4, "unit": "px" },
      "com.figma.scopes": ["GAP", "FONT_VARIATIONS"],
      "com.figma.variableId": "VariableID:1330:10878"
    }
  }
}
```

A typography composite uses native DTCG `$value` and aliases font primitives:

```jsonc
"body": {
  "default": {
    "$value": {
      "fontFamily": "{font.font-family.default}",
      "fontSize": "{font.font-size.14}",
      "fontWeight": "{font.font-weight.regular}",
      "lineHeight": "{font.line-height.24}",
      "letterSpacing": "{font.letter-spacing.0}"
    },
    "platforms": ["PD"],
    "$extensions": { "com.figma.styleId": "S:1454266942a995f5fc120dbb30b0e51bc0edacad," }
  }
}
```

### Modes & the alias chain

- **Theme axis** (`light` / `dark`) lives on `primitives.palette`. Semantic and component tokens never restate it — they alias palette tokens and inherit the axis through the chain.
- **Brand axis** (`acronis`, `brand-b`; more planned) lives on `semantic.colors` and `components.*`.
- **Alias chain** — `components → semantics → primitives`. Aliases are DTCG `{group.token}` strings stored inside `values.<mode>` (or a typography composite `$value`). When a theme switches, the primitive value changes and everything downstream picks it up.
- **Adding a mode** is data-driven — the schema's mode pattern accepts any kebab-case lowercase name; no schema edit needed.

Depth: [`./context/manifest.md`](./context/manifest.md).

## Package structure

```text
design-tokens/
├── tiers/                 The token JSON: primitives.json, semantic.json, components.json.
├── schemas/               JSON Schema (draft 2020-12) for the token files.
├── context/               Authoring docs, incl. the vendored DTCG-2025-10 spec snapshot.
├── README.md              This file — consumer-facing surface.
├── CONTRIBUTING.md        How to author a token, add a mode, validate.
├── LICENSE                MIT.
├── package.json           Package metadata, files, and the validate script.
└── .tmp/scripts/          Figma-sync helper scripts the LLM triggers (repo-only, not shipped).
```

## Setup

The JSON files under `tiers/` are the **source of truth**. You only need this setup if you want to **update tokens from Figma** (change a value, add a token). If you just _consume_ the published JSON, skip it — `pnpm install` is all you need.

Updates flow from Figma through an AI assistant (Claude) that talks to Figma via the **[Figma Console MCP](https://github.com/southleft/figma-console-mcp)**. Two one-time steps:

### 1. Create a Figma access token

A Figma _personal access token_ lets the MCP read the Figma file. Create one by following Figma's official guide — **[Manage personal access tokens](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)** (Figma → your avatar → **Settings → Security → Personal access tokens → Generate new token**). Give it read access. **Copy it immediately — Figma shows the value only once.**

### 2. Set it globally as `FIGMA_ACCESS_TOKEN_ACRONIS`

The MCP reads the token from an environment variable named `FIGMA_ACCESS_TOKEN_ACRONIS`. Set it once, globally, so every terminal and Claude session sees it. Replace `figd_your_token_here` with your token.

**macOS (zsh, the default):**

```bash
echo 'export FIGMA_ACCESS_TOKEN_ACRONIS="figd_your_token_here"' >> ~/.zshrc
source ~/.zshrc
```

**Linux (bash):**

```bash
echo 'export FIGMA_ACCESS_TOKEN_ACRONIS="figd_your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

**Windows (PowerShell):**

```powershell
setx FIGMA_ACCESS_TOKEN_ACRONIS "figd_your_token_here"
```

Open a new terminal afterwards so it takes effect. (Or set it via **Settings → System → Advanced system settings → Environment Variables**.)

Check it worked: `echo $FIGMA_ACCESS_TOKEN_ACRONIS` (macOS/Linux) or `echo %FIGMA_ACCESS_TOKEN_ACRONIS%` (Windows).

### 3. The Figma Console MCP

The server is already wired up for this package in [`.mcp.json`](./.mcp.json) — it runs via `npx figma-console-mcp@latest`, so you just need [Node](https://nodejs.org) installed plus the token above. Install notes and capabilities: **[figma-console-mcp](https://github.com/southleft/figma-console-mcp)**. Launch Claude from the `design-tokens/` directory so it loads this `.mcp.json`.

### Updating tokens from Figma

Once set up: when a value or name changes in Figma, **ask Claude to sync** (with the Figma Console MCP available). Claude reads the change from Figma and re-emits the affected JSON using the helper scripts — they keep the shape exact and save tokens — then you run `pnpm validate` and commit. You can also hand-edit the JSON directly, since it's the source of truth. **Full step-by-step in [`CONTRIBUTING.md`](./CONTRIBUTING.md).**

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for day-to-day tasks: updating tokens from Figma, adding a mode, adding a new `$type` or `$extensions` key, and validating.

## How to run

| Command         | Does                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`  | Installs devDependencies (the ajv toolchain).                                                                           |
| `pnpm validate` | ajv-compiles the token schema (with `--strict=false`), then validates `tiers/*.json` against it. Run before committing. |

The Figma-sync helper scripts under `.tmp/scripts/` (`figma-to-primitives.mjs`, `figma-to-semantic.mjs`, `figma-to-components.mjs`, …) re-emit the token JSON from a Figma snapshot — the LLM triggers them during a [sync](#setup) to keep the shape exact and save tokens. They're repo-only (run with `node .tmp/scripts/<file>.mjs`), documented in [`./context/figma-sync.md`](./context/figma-sync.md); not npm scripts, not part of the published package.

## Translation tools

The package is consumed by a **translation tool** in the [DTCG sense](https://www.designtokens.org/tr/2025.10/format/#translation-tool): a build-time program that reads the source-of-truth tokens and writes platform-specific output.

Because the token files **are** DTCG-conformant, generic DTCG tooling largely works out of the box. The two Acronis divergences need handling, though: the on-token `values` dict (mode-aware tokens) and the token `platforms` array sit outside the plain DTCG shape, and single-value primitives carry their value inside `$extensions.com.acronis.units` rather than `$value`. A consumer that wants to use Style Dictionary, Tokens Studio, or any DTCG library should register a custom parser that understands these details. Key off [`schemas/tokens.schema.json`](./schemas/tokens.schema.json) (or the `package.json` name) to identify our tokens.

### Worked example — Style Dictionary

[Style Dictionary](https://styledictionary.com/) v4 is a widely-used token translator and a representative Translation Tool in the DTCG sense. This example wires `@acronis-platform/design-tokens` into a Style Dictionary build that fans out to **three** outputs in a single config: CSS custom properties, a JS module, and a Tailwind v4 `@theme` block. The same skeleton can be extended with SCSS, iOS, or any other platform — only the per-platform `format` changes.

```js
// style-dictionary.config.js
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerParser({
  name: 'acronis-tokens',
  pattern: /\/tiers\/.*\.json$/,
  parser: ({ contents }) => {
    const file = JSON.parse(contents);

    // Discriminator: only handle files that look like our shape.
    // (Public DTCG $schema URL + Acronis on-token `values`/`platforms`.)
    const walk = (node, path, out) => {
      for (const [k, v] of Object.entries(node ?? {})) {
        if (k.startsWith('$')) continue;
        const next = [...path, k];
        if (
          v &&
          typeof v === 'object' &&
          (v.values || v.$value || v.$extensions?.['com.acronis.units'])
        ) {
          // Token: prefer top-level `values` (mode-aware), then DTCG `$value`
          // (typography composites), then `com.acronis.units` (single-value
          // primitives). Filter by `platforms` if your target needs it.
          const value =
            v.values ?? v.$value ?? v.$extensions['com.acronis.units'];
          out[next.join('.')] = {
            value,
            type: v.$type,
            platforms: v.platforms,
          };
        } else if (v && typeof v === 'object') {
          walk(v, next, out);
        }
      }
      return out;
    };
    return walk(file, [], {});
  },
});

export default {
  source: ['node_modules/@acronis-platform/design-tokens/tiers/*.json'],
  parsers: ['acronis-tokens'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{ destination: 'tokens.css', format: 'css/variables' }],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
    tailwind: {
      transformGroup: 'css',
      buildPath: 'build/tailwind/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: '@theme inline' },
        },
      ],
    },
  },
};
```

This is illustrative — your translator owns the mapping from token to output. Things this minimal example does NOT do: resolve the `components → semantics → primitives` alias chain (Style Dictionary's built-in alias resolution covers the simple case, but you'll want to verify it against `{group.token}` paths), emit one file per mode (`values.light` vs `values.dark` → `:root` vs `.dark`), or filter by `platforms` scope (skip `PD`-only tokens when building for `WEB` and vice versa).

## License

MIT for the package as a whole. See [`LICENSE`](./LICENSE).
