---
'@acronis-platform/design-tokens': major
'@acronis-platform/tokens-pd': major
---

# `1.0.0` — first stable token release

This is the first stable (`1.0.0`) release of the published token packages. It
consolidates the entire `feature/design-tokens-update` line of work into one
release rather than a chain of pre-`1.0` patch/minor bumps. Treat the prior
`0.x` token JSON and `tokens-pd` output as superseded: paths, value shapes, and
generated CSS variable names have all changed since the last published `0.x`.

The two packages move in lockstep — `tokens-pd` is fully regenerated from
`design-tokens` by `tools/style-dictionary`, so every `design-tokens` change
below is reflected in the corresponding `tokens-pd` artifacts.

---

## `@acronis-platform/design-tokens` (→ `1.0.0`)

### Token value shape — native DTCG dimensions (BREAKING)

- Dimension tokens (`$type: "dimension"` — `units.*`, `font.font-size`,
  `font.line-height`, `font.letter-spacing`, and every component dimension)
  now carry a **native DTCG** `$value: { value, unit }` (unit `px`/`rem`).
- The custom `$extensions.com.acronis.units` value carrier (and its short-lived
  `{ components, dimensionSpace }` intermediate) is **removed**. Dimensions no
  longer stash their value in `$extensions`.
- `fontWeight` and `fontFamily` are scalar DTCG types and carry a plain
  `$value` — a `number` for weight, a `string`/array for family — not a
  dimension object.
- The schema descriptions were updated to native DTCG language to match.

### Schema file renamed `tokens.schema.json` → `tier.schema.json` (BREAKING)

The validating schema moved from `schemas/tokens.schema.json` to
`schemas/tier.schema.json`. It describes the structure of a whole **tier file**
(`tiers/*.json`) — how tokens are grouped and nested within a tier, not just a
single token — so the name now reflects what it validates.

- The `$schema` value embedded in every tier file is now
  `"../schemas/tier.schema.json"` (the schema enforces this exact string as a
  `const`, so the file and its tier data move in lockstep).
- The schema's own `$id` is updated to match.
- Consumers that reference the schema by path (or key off the `$schema`
  discriminator string) must update to `tier.schema.json`. The package's
  `exports` map already exposes `./schemas/*`, so the import subpath simply
  changes filename.

### Transparent rule (BREAKING for affected leaves)

A fully-transparent color (`alpha: 0`) is emitted as the CSS keyword
`transparent` instead of an HSL object. Figma stores zero-alpha colors with
arbitrary channels (often a magenta placeholder), so the RGB channels are
meaningless. This applies to `palette.transparent.*` primitives and any
component literal color at `alpha: 0`.

### Naming — camelCase aligned with Figma (BREAKING)

Token segment names are kept **verbatim from Figma** (camelCase), no longer
kebab-converted by the emitter:

- `on surface` → `onSurface`, `on brand` → `onBrand`, etc. (all `on *` groups).
- `status-strong` → `statusStrong`.
- Component/SubComponent names stay PascalCase (e.g. `MenuItemList`).

Note: the generated CSS custom-property names are unaffected — Style Dictionary
kebab-cases path segments into variable names, so `--ui-…-on-surface-…` is
preserved for consumers.

### Tiers rebuilt from Figma (BREAKING)

- **Semantics** (`tiers/semantic.json` → `tiers/semantics.json`, renamed):
  added the build-time `com.acronis.tailwindRoles` routing extension; removed
  the `brand-b` values mode; renamed token paths; deleted obsolete tokens;
  relocated the four AI gradients to a top-level `gradients.*` root, and a
  gradient-valued border (`border.onStatus.ai-strong`) now resolves through a
  proper `{gradients.ai.idle}` alias rather than a literal CSS string.
- **Components** (`tiers/components.json`): rebuilt from Figma's
  `Brand/components` group; the `Input` component was renamed to `InputText`
  (the entire `input.*` namespace → `input-text.*`); added `breadcrumb`,
  `checkbox`, `switch`, `tag`; component-level typography tokens now correctly
  carry `$type: "typography"` so they render as `.typography-*` utility classes
  (previously emitted as malformed CSS variables).
- **Primitives** (`tiers/primitives.json`): added the Ink palette ramp and the
  `size-20` unit.

### Formatting — emitter owns tier format

- All tier JSON (`tiers/*.json`) and the `tokens-pd/dtcg/*` mirrors are now
  **fully alphabetically ordered** (numeric keys stay numeric); the emitter's
  formatter matches the prior Prettier line/inline conventions (printWidth 80).
- `tiers/` is added to `.prettierignore` so the emitter — not Prettier — owns
  the on-disk format.

### Sync pipeline

The `/figma-to-design-tokens` skill (a self-contained pipeline: pull →
snapshot-build → diff → emit, with a human-reviewable diff gate) replaces the
legacy temporary pull scripts as the canonical token-sync path.

### Context docs — removed `brand-matrix.md`

`context/brand-matrix.md` is deleted. It carried information that was untrue,
out of scope for this data-only package, or already owned by another context
file:

- **Wrong vocabulary.** It called the `light` / `dark` axis a "Color mode",
  but `glossary.md` defines that axis as **Theme** — reusing an established
  term with a different meaning.
- **Out-of-scope implementation details.** It referenced the legacy `--av-*`
  CSS prefix and the `oklch` color space; CSS variable names and the output
  color space are the translation tool's concern, not the token data.
- **Out-of-scope "Delivery model".** Emitted stylesheets, override-only files,
  and `light-dark()` composition belong to
  `@acronis-platform/style-dictionary` → `@acronis-platform/tokens-pd`, not to
  the data package.
- **Untrue / unmaintained roadmap content.** The "Brand override surface" table
  (keyed by `--ui-*` output variables) and "The matrix" (a speculative list of
  ~22 legacy brands with partner mappings and guessed dark-mode columns) were
  unverified planning material, not properties of the token data.
- **Misplaced how-to.** "Adding a brand" belongs in `CONTRIBUTING.md`.

The accurate, in-scope idea — the Brand axis is data-driven and adding a brand
is purely additive — is already covered by `glossary.md`, `manifest.md`, and
`token-contract.md`; references within the design-owned packages are updated in
the same change.

---

## `@acronis-platform/tokens-pd` (→ `1.0.0`)

Full regeneration from `@acronis-platform/design-tokens`. All generated CSS,
Tailwind presets, and the DTCG mirror reflect every change above.

- **CSS custom properties**: `--ui-input-*` renamed to `--ui-input-text-*`
  (Input → InputText); new per-component artifacts for `breadcrumb`,
  `checkbox`, `switch`, `tag`; component typography now emits `.typography-*`
  classes.
- **Transparent**: fully-transparent colors render as the `transparent`
  keyword (`light-dark(transparent, transparent)`), never `rgb(… / 0)`.
- **Native DTCG**: the Style Dictionary preprocessor passes native
  `$value: { value, unit }` through directly (the custom-carrier normalization
  step is gone); the DTCG mirror is written deep-sorted to match the source
  tiers.
- **Tailwind**: role-restricted presets regenerated; component color roles are
  routed from the leaf via the data-driven `com.acronis.tailwindRoles` map; keys
  are normalized to lowercase kebab-case.
- **Gradients**: data-driven gradient rebuild (AI gradients sourced from
  `gradients.*`).

## Migration

- Update any reference to `--ui-input-*` CSS variables to `--ui-input-text-*`.
- If you consumed `design-tokens` JSON directly, re-read dimension values as
  native DTCG `{ value, unit }` objects and font weight/family as scalars; the
  `$extensions.com.acronis.units` carrier no longer exists.
- The semantic tier file is now `tiers/semantics.json` (was `semantic.json`),
  and AI gradients live under the top-level `gradients.*` root.
