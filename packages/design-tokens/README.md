# @acronis-platform/design-tokens

Acronis design tokens as data — DTCG-2025.10-conformant JSON. No runtime code.

## Table of contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Relationship to DTCG](#relationship-to-dtcg)
- [Glossary](#glossary)
- [JSON schema and structure](#json-schema-and-structure)
- [Token files](#token-files)
- [Package structure](#package-structure)
- [Contributing](#contributing)
- [How to run](#how-to-run)
- [Translation tools](#translation-tools)
- [License](#license)

## Introduction

`@acronis-platform/design-tokens` is **design data only** — the colors, sizes, typography, and per-component values that define how Acronis products look, stored as plain JSON. There are no components, no build step, and nothing to run: just the values.

The format takes **[DTCG 2025.10](https://www.designtokens.org/tr/2025.10/)** — the W3C-track design-token standard — as its starting point and **builds on top of it**, adding a couple of things the standard doesn't cover yet (see [Relationship to DTCG](#relationship-to-dtcg)).

Storing these values as data — rather than as CSS, a Tailwind config, or an iOS asset catalog — means no single technology is baked in. The same `palette.blue.7` can become any of those, and each team decides how. That conversion is done by a **translation tool** (see [Translation tools](#translation-tools)).

## Prerequisites

You don't need much — the package is just JSON. What you need depends on whether you want to **use** the tokens or **work on** them.

**To use the tokens in a product:**

- _Needed:_ a **translation tool** to turn the JSON into your platform's format (CSS, Tailwind, etc.). See [Translation tools](#translation-tools).
- _Optional:_ [Style Dictionary](https://styledictionary.com/) or another DTCG-aware translator, if you don't already have one.

**To work on the tokens (author or validate them):**

- _Needed (tools):_ [Node](https://nodejs.org/) 22.x and [pnpm](https://pnpm.io/) 10.27.0 — used by the `validate` script. Install with `pnpm install`.
- _Needed (mindset):_ read the **[Glossary](./context/glossary.md)** first. The docs use _Tier_, _Mode_, _Theme_, _Brand_, and _Alias_ with precise meanings; a few minutes there saves confusion later. Skimming [Relationship to DTCG](#relationship-to-dtcg) helps too.
- _Optional:_ familiarity with [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/) for deeper format questions — the spec is vendored under [`context/DTCG-2025-10/`](./context/DTCG-2025-10/).

## Relationship to DTCG

The token files follow **[DTCG 2025.10](https://www.designtokens.org/tr/2025.10/)** and add two small things on top, both at the token: a per-mode **`values`** dict (so one file holds every theme and brand inline) and a per-token **`platforms`** scope (so each token says which consumers it's for).

That's the short version. The full contract — how the files relate to the spec, what each divergence is and why, the `$schema` discriminator, and the `$extensions` namespaces — lives in **[`context/spec.md`](./context/spec.md)**. Read it there to learn more.

## Glossary

The docs use a small set of terms precisely. They're all defined in **[`context/glossary.md`](./context/glossary.md)** — read it once before working with the tokens.

## JSON schema and structure

The actual data lives in [`tiers/*.json`](./tiers) — three files, one per Tier. Every token carries a value (a per-mode `values` dict or a DTCG `$value`), a `$type`, a `platforms` scope, and optional `$extensions` metadata.

Every file is validated against **[`schemas/tier.schema.json`](./schemas/tier.schema.json)** — the authority on which keys are allowed, where they may appear, and when they're required. Run `pnpm validate` to check the data against it.

For the full breakdown — every key, its rules, and the reasoning — see **[`context/spec.md`](./context/spec.md)**.

## Token files

Three token files, one per Tier:

- **`tiers/primitives.json`** — palette (Theme `light`/`dark`), units, font primitives.
- **`tiers/semantics.json`** — semantic colors (Brand axis), typography composites.
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

A semantic or component token (Brand axis — e.g. `acronis`, the default brand) aliases upstream tokens with DTCG `{group.token}` strings:

```jsonc
"background": {
  "brand": {
    "primary": {
      "values": {
        "acronis": "{palette.blue.7}"
      },
      "platforms": ["PD"],
      "$extensions": { "com.figma.scopes": ["ALL_FILLS"], "com.figma.variableId": "VariableID:50:1428" }
    }
  }
}
```

A **dimension** primitive (units, font-size, line-height, letter-spacing — no mode dimension) carries its value in `$value` as a native DTCG dimension `{ value, unit }`:

```jsonc
"gap": {
  "4": {
    "$value": { "unit": "px", "value": 4 },
    "platforms": ["PD"],
    "$extensions": {
      "com.figma.scopes": ["GAP", "FONT_VARIATIONS"],
      "com.figma.variableId": "VariableID:1330:10878"
    }
  }
}
```

`fontWeight` and `fontFamily` primitives are scalar DTCG types, so they carry a plain `$value` (a number / string):

```jsonc
"font-weight": {
  "$type": "fontWeight",
  "regular": { "$value": 400, "platforms": ["PD"], "$extensions": { /* … */ } }
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
- **Brand axis** (`acronis` is the default brand; more are data-driven) lives on `semantic.colors` and `components.*`.
- **Alias chain** — `components → semantics → primitives`. Aliases are DTCG `{group.token}` strings stored inside `values.<mode>` (or a typography composite `$value`). When a theme switches, the primitive value changes and everything downstream picks it up.
- **Adding a mode** is data-driven — the schema's mode pattern accepts any kebab-case lowercase name; no schema edit needed.

Depth: [`./context/manifest.md`](./context/manifest.md).

## Package structure

```text
design-tokens/
├── tiers/                 The token JSON: primitives.json, semantics.json, components.json.
├── schemas/               JSON Schema (draft 2020-12) for the token files.
├── context/               Authoring docs, incl. the vendored DTCG-2025-10 spec snapshot.
├── README.md              This file — consumer-facing surface.
├── CONTRIBUTING.md        How to author a token, add a mode, validate.
├── LICENSE                MIT.
└── package.json           Package metadata, files, and the validate script.
```

## Contributing

The JSON under `tiers/` is the **source of truth** — edit it directly (it's hand-editable and schema-validated). See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for day-to-day tasks: authoring a token, adding a mode, adding a new `$type` or `$extensions` key, and validating.

## How to run

| Command         | Does                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`  | Installs devDependencies (the ajv toolchain).                                                                           |
| `pnpm validate` | ajv-compiles the token schema (with `--strict=false`), then validates `tiers/*.json` against it. Run before committing. |

## Translation tools

The package is consumed by a **translation tool** in the [DTCG sense](https://www.designtokens.org/tr/2025.10/format/#translation-tool): a build-time program that reads the source-of-truth tokens and writes platform-specific output.

Because the token files **are** DTCG-conformant, generic DTCG tooling largely works out of the box. Only two Acronis divergences need handling: the on-token `values` dict (mode-aware tokens) and the token `platforms` array sit outside the plain DTCG shape. Every `$value` is native DTCG. A consumer that wants to use Style Dictionary, Tokens Studio, or any DTCG library should register a custom parser that understands these two details. Key off [`schemas/tier.schema.json`](./schemas/tier.schema.json) (or the `package.json` name) to identify our tokens.

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
        if (v && typeof v === 'object' && (v.values || v.$value)) {
          // Token: prefer top-level `values` (mode-aware), else native DTCG
          // `$value` (dimension `{ value, unit }`, fontWeight/fontFamily scalars,
          // typography composites). Filter by `platforms` if your target needs it.
          const value = v.values ?? v.$value;
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
