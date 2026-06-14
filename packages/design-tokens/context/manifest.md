# Manifest — token files

The shape of the `@acronis-platform/design-tokens` token files, how their token values vary by mode and platform, and how they resolve through the alias chain. For DTCG/format rules, `$extensions` namespacing, and naming see [`spec.md`](./spec.md). Vocabulary (Tier, Group, Mode, Theme, Brand, Collection) lives in [`glossary.md`](./glossary.md). The authoritative schema is [`../schemas/tier.schema.json`](../schemas/tier.schema.json).

## The files

Token value files live under `tiers/`; the package root holds only package metadata (`package.json`, `README.md`, `schemas/`).

These files are the source of truth — edit them directly and keep them schema-valid.

### `primitives.json`

Covers all of the Primitives Tier:

- `palette` — color tokens, mode-aware on the **Theme** axis (`light` / `dark`). Values stored as `{ colorSpace: "hsl", components: [...], alpha? }` under `values.{light,dark}` on each token (see [Modes & themes](#modes--themes)).
- `units` — `gap`, `size`, `radius`, `stroke`. Single-value (no modes), `$type: dimension`. Stored under `$value` as a native DTCG dimension `{ value, unit: "px" }`. (`gap` was previously `space`; renamed in Figma 2026-05-27 along with `space-N → gap-N` per-token identifiers.)
- `font` — `font-family`, `font-weight`, `font-size`, `line-height`, `letter-spacing`. Single-value. The dimension members (`font-size`, `line-height`, `letter-spacing`) are stored under `$value` as a native DTCG dimension `{ value, unit: "px" }`. `font-weight` (`$type: fontWeight`) and `font-family` (`$type: fontFamily`) are scalar DTCG types, so they carry a plain `$value` (a number, or a string / array for a font stack). `letter-spacing` has no backing Figma Variable (Figma exposes letter-spacing only on Text Styles), so its tokens carry a group-level `$description` instead of `com.figma.variableId`.

### `semantics.json`

Three roots, no outer `semantic` wrapper:

- `colors.{background,text,glyph,border,focus}` — mode dimension is **Brand** (data-driven — brands are added as new `values.<brand>` keys, no code changes). Every variable-backed token carries `$extensions.com.figma.variableId` and a `values.<brand>` alias like `"{palette.blue.7}"`. (The flat variable-backed AI status colors `background.status.ai*` on the violet ramp also live here; the AI _gradient_ treatment is the separate `gradients` root below.)
- `gradients.ai.{idle,hover,active,disabled}` — DTCG `gradient` tokens (mode dimension **Brand**). Figma variables can't hold gradient fills, so these are mocked in Figma as `string` variables carrying a CSS `linear-gradient(...)`; they're stored as `{color, position}` stop arrays (hex → HSL, percent → `0..1`) with the raw CSS string — which also carries the `90deg` angle DTCG `gradient` can't express — preserved in `$extensions.com.figma.cssGradient`. Each token carries `com.figma.variableId`. Component AI fills in `components.json` alias this root.
- `typography.{headings,body,link,caption,note,fineprint}` — DTCG `typography` composite tokens derived from Figma Text Styles. No mode dimension, so the composite lives directly on `$value` (no `values` wrapper). Each token carries `com.figma.styleId`. Non-DTCG fields from Figma are preserved as `com.acronis.textCase` and `com.acronis.textDecoration` on the affected tokens. Every composite field aliases a primitive.

The `variableId` / `styleId` discriminator split is described in [`spec.md`](./spec.md).

### `components.json`

One root per component, no outer wrapper. `$type` lives on each token because a component's tokens span several `$type`s (`color`, `dimension`, `typography`, `string`, …). Mode dimension is **Brand** — same axis as `semantics.json`'s `colors` (data-driven). Which components exist, their token counts, and the `$type` distribution are defined by `components.json` itself — read the file, not this doc.

**Native structure.** The component tree nests interaction states (`color/idle`, `color/hover`, `color/active`, `color/disabled`) and real `_global` groups, written as-is — no flattening or `<prefix>-<state>` regrouping; the fixed state order is `idle → hover → active → disabled`. Segment names are kept verbatim from Figma — Component/SubComponent names PascalCase (`Button`, `ButtonIcon`), other segments camelCase (`borderColor`, `paddingX`); `_global` sorts first.

Aliases follow the chain `components → semantics → primitives` (see [The alias chain](#the-alias-chain)). Component tokens alias `colors.*` / `gradients.*` / `typography.*` (preferred) or `units.*` / `palette.*` (acceptable when no suitable semantic exists). Every token is variable-backed, so `com.figma.variableId` is the only discriminator — no `styleId` paths in components.

**Mocked values decoded** (Figma technical limitations). Figma can't express some token values directly, so the export decodes them by rule:

- transparent color literals (`#FF00FF00` / `#FFFFFF00`) → the CSS keyword string `"transparent"` on a `$type: "color"` token;
- `textStyle` string variables → `$type: "typography"` aliases (e.g. `{typography.body.strong}`).

Every other Figma `string` variable is kept verbatim as `$type: "string"` rather than re-typed — e.g. per-state `textDecoration` (`"none"`/`"underline"`), `borderStyle` (`"solid"`), and the AI fills that alias `{gradients.ai.*}`. (The `gradient` `$type` itself lives only on the `gradients.ai.*` tokens in `semantics.json`; component AI fills reference those by alias but stay `string`.) See [`spec.md`](./spec.md).

The result is an invariant, not a snapshot: **every component token resolves to a semantic/primitive alias or a decoded mock — no raw-value gaps.** A component that aliases a primitive directly is a **yellow flag** (see [The alias chain](#the-alias-chain)) — surface it in review with a justification rather than letting it pass silently.

## Token shape

A token carries some of these keys (full rules in [`../schemas/tier.schema.json`](../schemas/tier.schema.json)):

- **`$value`** — the literal token value (native DTCG), used for single-mode tokens: typography composites, plain fontWeight/fontFamily scalars, and dimension primitives (the last as `{ value, unit }`). Mode-aware tokens omit `$value` and use `values` instead.
- **`values`** — the per-mode value dictionary (see [Modes & themes](#modes--themes) for the storage shape). Either `$value` or `values` carries the payload, not both.
- **`$type`** — DTCG type from the schema's closed enum (`color`, `dimension`, `fontFamily`, `fontWeight`, `gradient`, `typography`, `duration`, `cubicBezier`, `number`, `strokeStyle`, `string`, `border`, `transition`, `shadow`). `string` is a documented non-DTCG divergence (see [`spec.md`](./spec.md)). May be inherited from an ancestor group down to its tokens or set per-token (components set it per-token).
- **`$description`** — optional human-readable note; also the documented home for "why a Tier was skipped" justifications.
- **`platforms`** — required on every token; see [Platform scope](#platform-scope).
- **`$extensions`** — `com.acronis.*` and `com.figma.*` keys only (e.g. `com.acronis.textCase`, `com.acronis.textDecoration`); `com.figma.variableId` / `com.figma.styleId` are mutually exclusive discriminators. Namespace rules in [`spec.md`](./spec.md).
- **`$deprecated`** — optional boolean or string.

**What's required.** A node is a **token** (not a group) if it carries `values` or `$value`; every token MUST declare `platforms`. The root node additionally requires `$schema`. A dimension primitive carries its value in `$value` as a native DTCG `{ value, unit }`; fontWeight/fontFamily primitives carry a plain `$value` scalar.

## Modes & themes

DTCG 2025.10 has no native way to store multiple per-mode values inside one token file. We store them in a top-level **`values` dictionary** on each mode-aware token, keyed by mode name:

```json
"<token-name>": {
  "values": { "light": …, "dark": … },
  "platforms": ["PD"],
  "$extensions": { "com.figma.variableId": "…" }
}
```

The schema requires `values` to have at least one key, with all keys kebab-case lowercase (`^[a-z][a-z0-9-]*$`) and no extra properties. Each value is a literal (palette: an HSL color object) or a DTCG **alias string** like `"{palette.blue.7}"` (see [The alias chain](#the-alias-chain)). This `values` storage shape is the single source for how every mode-aware token is laid out — other sections reference it rather than restate it.

Only two Groups carry a mode dimension; everything else is single-value. Which
Group owns which axis is structural; the concrete mode keys present in each are
defined by the JSON:

| Group                | Mode dimension | Mode keys                     | Planned                                                                                                                                 |
| -------------------- | -------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `primitives.palette` | **Theme**      | `light` / `dark`              | `high-contrast`; color-vision variants (deuteranopia, protanopia, tritanopia); culturally-adjusted variants (e.g. red-as-success in CN) |
| `semantics.colors`   | **Brand**      | data-driven (Brand axis)      | Additional brand(s) for white-labeling                                                                                                  |
| `components.*`       | **Brand**      | data-driven (same Brand axis) | Same as Brand above                                                                                                                     |

**How modes propagate.** Modes do **not** repeat at every Tier. The mode axis is owned by the Tier that introduces it:

- The **Theme** axis lives at `primitives.palette`. Switching theme changes palette values.
- The **Brand** axis lives at `semantics.colors`. Switching brand changes which palette tokens semantic roles alias.
- Component tokens alias semantic (or palette) tokens and inherit both axes through the alias chain — they never restate modes.

**Adding a new mode** (e.g. palette `high-contrast`) is data-driven, not code-driven: add the new mode key to each affected token's `values` dict. The schema accepts any kebab-case lowercase mode name, so no schema change is needed — nothing in the format assumes a fixed set of modes.

## The alias chain

Tokens reference upstream tokens instead of restating raw values. This is what lets a single palette swap cascade through every semantic and component token automatically.

```text
primitives  →  semantics  →  components
```

Direction is strict — downstream Tiers alias upstream Tiers, never the reverse.

- **Semantic tokens MUST alias primitives.** Never put a raw color / dimension / string on a semantic token.
- **Component tokens MUST alias semantics** (preferred) or **primitives** (acceptable when no suitable semantic exists). Never put a raw value on a component token.
- **A component aliasing a primitive directly is a yellow flag** — it may indicate a gap in the semantic layer. Surface it for review before committing.
- **No skipped Tiers without reason** — if you bypass semantics, document why in the token's `$description` or note it in the PR.

Alias values live inside the [`values.{modeName}` dict](#modes--themes) on each token as DTCG alias strings, e.g. `"{palette.blue.7}"`; the DTCG-side alias syntax is in [`DTCG-2025-10/format/aliases.md`](./DTCG-2025-10/format/aliases.md).

**Why this matters.** The alias chain is the mechanism by which the **Theme** axis (light/dark, future high-contrast/colorblind/cultural) propagates from `palette` through `semantics.colors` to every component, without anyone restating mode values downstream. Same for the **Brand** axis from `semantics.colors` to components.

## Platform scope

> ⚠️ This enum is mirrored in `@acronis-platform/design-assets`; the two MUST stay in sync — a change here requires the same change there.

Platform scope declares which consumers a token targets so downstream tooling can route correctly. It lives at `token.platforms` — top-level on the token, sibling to `values` / `$value` / `$extensions`. No collection-level inheritance, no per-mode override, no group-level placement. Every token MUST declare `platforms`.

**Shape:** `("WEB" | "PD")[]` — closed enum, `uniqueItems`, `minItems: 1`.

| Value | Meaning                                            |
| ----- | -------------------------------------------------- |
| `WEB` | Web product surface (apps, dashboards, marketing). |
| `PD`  | Product Design (internal design-system surface).   |

Order-insensitive: `["WEB", "PD"]` and `["PD", "WEB"]` are semantically equivalent; validators do not normalize.

**Default:** `["PD"]`. Every token starts here. Widen to `["WEB"]` or `["WEB", "PD"]` only when the token has been audited for the additional consumer.

**Why a closed enum.** Consumers branch on the value: a `WEB`-only token is excluded from the Product Design package, and vice versa. A typo (`"WEEB"`, `"web"`) MUST fail at validation time, not silently route to the wrong consumer. Adding a third value (e.g. `"MOBILE"`) requires a coordinated schema change in [`../schemas/tier.schema.json`](../schemas/tier.schema.json) here AND in the assets package's `pack.schema.json`, plus this section and its assets-side mirror.

**Historical note.** This field used to live inside `$extensions.com.acronis.platform`. It was promoted to a top-level `platforms` key on each token (alongside `values`, formerly `com.acronis.modes`) when the package moved project fields out of `$extensions`. The assets package made the same move, so both packages now expose `platforms` at the same path — a consumer walking "things with platform scope" can use one access path (`.platforms`) across both.
