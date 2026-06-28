# Manifest — token files

The shape of the `@acronis-platform/design-tokens` token files, how their token values vary by mode and platform, and how they resolve through the alias chain. For DTCG/format rules, `$extensions` namespacing, and naming see [`spec.md`](./spec.md); for how these files are updated/synced from Figma see [`figma-sync.md`](./figma-sync.md). Vocabulary (Tier, Group, Mode, Theme, Brand, Collection) lives in [`glossary.md`](./glossary.md). The authoritative schema is [`../schemas/tokens.schema.json`](../schemas/tokens.schema.json).

## The files

Token value files live under `tiers/`; the package root holds only package metadata (`package.json`, `README.md`, `schemas/`).

These files are the source of truth. The `figma-to-*.mjs` helper scripts re-emit them during a Figma sync (see [`figma-sync.md`](./figma-sync.md)) so the canonical shape stays exact; reflect a Figma change by running a sync rather than hand-patching.

| File                    | Re-emitted by (on sync)                |
| ----------------------- | -------------------------------------- |
| `tiers/primitives.json` | `.tmp/scripts/figma-to-primitives.mjs` |
| `tiers/semantic.json`   | `.tmp/scripts/figma-to-semantic.mjs`   |
| `tiers/components.json` | `.tmp/scripts/figma-to-components.mjs` |

### `primitives.json`

Covers all of the Primitives Tier:

- `palette` — color tokens, mode-aware on the **Theme** axis (`light` / `dark`). Values stored as `{ colorSpace: "hsl", components: [...], alpha? }` under `values.{light,dark}` on each token (see [Modes & themes](#modes--themes)).
- `units` — `gap`, `size`, `radius`, `stroke`. Single-value (no modes). Stored under `$extensions.com.acronis.units` as `{ value, unit: "px" }`. (`gap` was previously `space`; renamed in Figma 2026-05-27 along with `space-N → gap-N` per-token identifiers.)
- `font` — `font-family`, `font-weight`, `font-size`, `line-height`, `letter-spacing`. Single-value, stored under `$extensions.com.acronis.units`. `letter-spacing` is derived from `.tmp/figma-tokens/styles-text.json` rather than a Figma Variable (Figma exposes letter-spacing only on Text Styles), so its tokens carry a group-level `$description` instead of `com.figma.variableId`.

### `semantic.json`

Two roots, no outer `semantic` wrapper:

- `colors.{background,text,glyph,border}` — mode dimension is **Brand**. Today two brand modes appear in `values`: `acronis` and `brand-b` (added in Figma 2026-05-27; currently mirrors `acronis` on every token). The set is data-driven from Figma's `lastSyncedValue` per token — new brands flow through without code changes. Every variable-backed token carries `$extensions.com.figma.variableId` and a `values.<brand>` alias like `"{palette.blue.7}"`. The four AI background gradients under `colors.background.ai` are Figma paint styles (no mode dimension); they carry `com.figma.styleId` and a single-keyed `values.acronis` stop array.
- `typography.{headings,body,link,caption,note,fineprint}` — DTCG `typography` composite tokens derived from `.tmp/figma-tokens/styles-text.json`. No mode dimension, so the composite lives directly on `$value` (no `values` wrapper). Each token carries `com.figma.styleId`. Non-DTCG fields from Figma are preserved as `com.acronis.textCase` and `com.acronis.textDecoration` on the affected tokens. Two known primitive gaps are inlined as raw dimensions: `font-size 11` (on the two `note.*` styles) and `line-height 40` (on `headings.display`) — these values appear in Figma Text Styles but not the Typography Variable Collection.

The `variableId` / `styleId` discriminator split is described in [`spec.md`](./spec.md).

### `components.json`

One root per component, no outer wrapper. `$type` lives on each token because most components mix `color` and `dimension`. Mode dimension is **Brand** — same axis as `semantic.json`'s `colors` (`acronis` and `brand-b` today; data-driven). 11 components today (`breadcrumb`, `button`, `chip`, `form`, `icon`, `menubar`, `sidebar`, `sub-item`, `tag`, `tooltip`, `tree`), 211 tokens total.

Aliases follow the chain `components → semantics → primitives` (see [The alias chain](#the-alias-chain)). Component tokens alias `colors.*` (preferred) or `units.*` / `palette.*` (acceptable when no suitable semantic exists). Every token is variable-backed, so `com.figma.variableId` is the only discriminator — no `styleId` paths in components today.

**Raw-value gaps inlined**: many tokens in Figma hold raw literals instead of aliases (mostly across `button`'s `ai`/`destructive`/`ghost`/`inverted`/`primary`/`secondary` variants; plus a handful in `tree`, `sub-item`, `tag`). The generator inlines them — HSL for hex colors, `{value, unit: "px"}` for dimensions — and warns once per token-mode. Same posture as the typography primitive gaps. These warnings are the punch list for tightening up the alias chain in Figma (see [`figma-sync.md`](./figma-sync.md)).

### Not yet built

| Planned        | Notes                                                |
| -------------- | ---------------------------------------------------- |
| `dist/` layout | Unspecified — where built output bundles would land. |

## Token shape

A token carries some of these keys (full rules in [`../schemas/tokens.schema.json`](../schemas/tokens.schema.json)):

- **`$value`** — the literal token value, used only for single-mode tokens (e.g. typography composites). Mode-aware tokens omit `$value` and use `values` instead.
- **`values`** — the per-mode value dictionary (see [Modes & themes](#modes--themes) for the storage shape). Either `$value` or `values` carries the payload, not both.
- **`$type`** — DTCG type from the schema's closed enum (`color`, `dimension`, `fontFamily`, `fontWeight`, `gradient`, `typography`, `duration`, `cubicBezier`, `number`, `strokeStyle`, `border`, `transition`, `shadow`). May be inherited from an ancestor group down to its tokens or set per-token (components set it per-token).
- **`$description`** — optional human-readable note; also the documented home for "why a Tier was skipped" justifications.
- **`platforms`** — required on every token; see [Platform scope](#platform-scope).
- **`$extensions`** — `com.acronis.*` and `com.figma.*` keys only. `com.acronis.units` carries single-value primitives (`{value, unit:"px"}` for dimensions, string for fontFamily, number for fontWeight); `com.figma.variableId` / `com.figma.styleId` are mutually exclusive discriminators. Namespace rules in [`spec.md`](./spec.md).
- **`$deprecated`** — optional boolean or string.

**What's required.** A node is a **token** (not a group) if it carries `values`, `$value`, or `$extensions.com.acronis.units`; every token MUST declare `platforms`. The root node additionally requires `$schema`. A primitive single-value token may carry only `$extensions.com.acronis.units` + `platforms` (no `$value`).

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

Only two Groups carry a mode dimension today; everything else is single-value:

| Group                | Mode dimension | Current values                                  | Planned values                                                                                                                          |
| -------------------- | -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `primitives.palette` | **Theme**      | `light`, `dark`                                 | `high-contrast`; color-vision variants (deuteranopia, protanopia, tritanopia); culturally-adjusted variants (e.g. red-as-success in CN) |
| `semantics.colors`   | **Brand**      | `acronis`, `brand-b` (mirrors `acronis` today)  | Additional brand(s) for white-labeling                                                                                                  |
| `components.*`       | **Brand**      | `acronis`, `brand-b` (inherited from semantics) | Same as Brand above                                                                                                                     |

**How modes propagate.** Modes do **not** repeat at every Tier. The mode axis is owned by the Tier that introduces it:

- The **Theme** axis lives at `primitives.palette`. Switching theme changes palette values.
- The **Brand** axis lives at `semantics.colors`. Switching brand changes which palette tokens semantic roles alias.
- Component tokens alias semantic (or palette) tokens and inherit both axes through the alias chain — they never restate modes.

**Adding a new mode** (e.g. palette `high-contrast`) is data-driven, not code-driven:

1. Add it as a Mode to the corresponding Figma Collection (Theme for palette, Brand for semantic/component).
2. Re-pull the data — see [`figma-sync.md`](./figma-sync.md).
3. Confirm the generator picks up the new mode key inside every token's `values`.

The generator and emission format must not assume a fixed set of modes.

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

**Why a closed enum.** Consumers branch on the value: a `WEB`-only token is excluded from the Product Design package, and vice versa. A typo (`"WEEB"`, `"web"`) MUST fail at validation time, not silently route to the wrong consumer. Adding a third value (e.g. `"MOBILE"`) requires a coordinated schema change in [`../schemas/tokens.schema.json`](../schemas/tokens.schema.json) here AND in the assets package's `pack.schema.json`, plus this section and its assets-side mirror.

**Historical note.** This field used to live inside `$extensions.com.acronis.platform`. It was promoted to a top-level `platforms` key on each token (alongside `values`, formerly `com.acronis.modes`) when the package moved project fields out of `$extensions`. The assets package made the same move, so both packages now expose `platforms` at the same path — a consumer walking "things with platform scope" can use one access path (`.platforms`) across both.
