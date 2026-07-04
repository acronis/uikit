# Spec — token format

The token-format contract for `@acronis-platform/design-tokens`: how the emitted `.tokens.json` files relate to the DTCG 2025.10 spec, what lives under `$extensions` (the `com.acronis.*` / `com.figma.*` namespaces), and the naming rules for ids, filenames, and `$type`. The concrete data model — modes, aliasing, platform scope, and what files exist — is in [`manifest.md`](./manifest.md).

## Relationship to DTCG

Token files are DTCG-conformant with two deliberate divergences, both at the **token**:

- **Per-mode `values`.** DTCG 2025.10 does not store multiple per-mode values inside one token. We want one JSON file per Group with all modes inline, so every mode-aware token carries a top-level `values` dictionary keyed by mode name — a sibling of `$value`, NOT inside `$extensions`. The token has **no top-level `$value`**; the value lives inside `values`.
- **Per-token `platforms`.** Platform scope (`WEB` / `PD`) is a top-level `platforms` array on the token.

Everything else stays DTCG: token shape, `$type` and group-level `$type` inheritance, alias syntax (`{group.token}`), composite types. The underlying spec rules live under [`DTCG-2025-10/`](./DTCG-2025-10/) — load the relevant module's [`format/index.md`](./DTCG-2025-10/format/index.md) when you need spec details.

`values` is always a dictionary (one or many entries — single-brand semantics use one key, theme-aware palette uses two). Examples:

- A palette token (mode dimension: Theme): `values.light` and `values.dark`, each a DTCG color value (`{ colorSpace: "hsl", components: [...], alpha? }`).
- A semantic-color token (mode dimension: Brand): `values.acronis`, a DTCG alias string like `"{palette.blue.7}"`.

Single-value (non-mode-aware) primitives still use `$extensions.com.acronis.units` (shape `{ value, unit: "px" }` for dimensions, or the raw scalar for other `$type`s). DTCG composite typography tokens continue to use a native `$value`. Mode storage, aliasing, and platform scope are detailed in [`manifest.md`](./manifest.md).

Canonical token shape:

```json
"<token-name>": {
  "values": {
    "<modeName>": <value | alias>
  },
  "platforms": ["PD"],
  "$extensions": { "com.figma.variableId": "VariableID:..." }
}
```

## `$schema` & Figma discriminator

Every emitted token file MUST start with:

```json
"$schema": "../schemas/tokens.schema.json"
```

The file's `$schema` points at the repo's [`../schemas/tokens.schema.json`](../schemas/tokens.schema.json) — the canonical description of the Acronis shape (DTCG-conformant with the divergences above). It doubles as the discriminator: a generic DTCG consumer that opens the file sees a non-DTCG `$schema` and should route it through an Acronis-aware parser rather than treat it as a plain DTCG file.

**Discriminator.** Every token carries **exactly one** of:

- `com.figma.variableId` — the source is a Figma Variable.
- `com.figma.styleId` — the source is a Figma Style (paint, effect, or text).

Downstream tooling discriminates by which key is present. Do not introduce a separate `com.acronis.origin` marker.

Additional `com.figma.*` metadata when present:

- `com.figma.scopes: [...]` — Variable scopes (e.g., `ALL_SCOPES`).
- `com.figma.hiddenFromPublishing: true` — emitted only when truthy.
- `com.figma.gradientTransform: [[…],[…]]` — Figma's gradient transform, for paint-style gradients where DTCG `gradient` has no direction field.

A handful of tokens may exist in Figma but be intentionally not linked back (no `variableId` / `styleId`). These are rare; add a `$description` explaining why when introducing one.

## `$extensions` namespaces

Vendor-specific metadata goes under `$extensions` with a reverse-DNS key. DTCG leaves the namespace open ([`format/design-token.md`](./DTCG-2025-10/format/design-token.md)); these two prefixes are our convention, and **any other prefix MUST NOT appear** — schema validators MUST reject unknown top-level prefixes inside `$extensions`.

| Prefix          | Owner            | Purpose                                                                                                                      |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `com.acronis.*` | This project     | Project-specific metadata not yet promoted to a top-level key.                                                               |
| `com.figma.*`   | Figma round-trip | Identity carried back to Figma (`com.figma.variableId`, `com.figma.styleId`, `com.figma.scopes`, future `com.figma.nodeId`). |

### `com.acronis.*` keys today

| Key                          | Status                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| `com.acronis.units`          | Dimension carrier (`{unit, value}`) on units primitives.                                                |
| `com.acronis.textCase`       | Typography hint preserved from Figma Text Styles (non-DTCG field).                                      |
| `com.acronis.textDecoration` | Typography hint preserved from Figma Text Styles (non-DTCG field).                                      |
| `com.acronis.modes`          | NOT USED — modes live at the top-level `values` key on each token (see [`manifest.md`](./manifest.md)). |
| `com.acronis.platform`       | NOT USED — platform scope lives at the top-level `platforms` key (see [`manifest.md`](./manifest.md)).  |
| `com.acronis.metadata`       | NOT USED.                                                                                               |

### Adding a new key (3-step rule)

A new `com.acronis.*` key requires THREE changes in the same commit:

1. Update [`../schemas/tokens.schema.json`](../schemas/tokens.schema.json) to allow / require the new key.
2. Add or update the context file that owns the key's semantics.
3. Update the CLAUDE.md row pointing at that context file, if the wording needs to widen.

A `com.acronis.*` key without a context file owning it is forbidden by review, not by tooling — the schema will accept it; reviewers MUST NOT. New `com.figma.*` keys follow the same three-step rule, but ownership is round-trip metadata driven by Figma's export, not authored design intent.

### Forbidden patterns

- Inventing a new top-level prefix (`org.acronis.*`, `com.acronis-internal.*`, `com.figma-export.*`). Stay inside the two reserved namespaces.
- Using `com.acronis.*` in places DTCG already specifies (`$value`, `$type`, `$description`, `$deprecated`, `$ref`). Use the DTCG keys.
- Storing values directly on `$extensions` that should live in DTCG `$value`. Extensions are for _metadata about the value_, not the value itself.

## Naming

Code names are simpler than Figma names and are canonical; the Figma → code mapping lives in [`figma-sync.md`](./figma-sync.md).

### Ids (token names, group names)

- Pattern: `^[a-z][a-z0-9-]*$` — lowercase, kebab-case, starts with a letter.
- No underscores, no camelCase, no PascalCase, no dots, no slashes.
- Acronyms lowercase: `dtcg`, `svg`, `ui` (not `DTCG`, `SVG`, `UI`).
- Numeric segments allowed: `palette.blue.7`, `stroke-2-5-px`. (DTCG forbids `.`, `{`, `}` in token names per [`format/design-token.md`](./DTCG-2025-10/format/design-token.md); dotted forms above denote nesting, not a single name segment.)

Per-token id semantics (Tier, Group, Mode, Theme, Brand) live in [`glossary.md`](./glossary.md) and [`manifest.md`](./manifest.md).

### Filenames

| Extension       | Meaning                            |
| --------------- | ---------------------------------- |
| `*.tokens.json` | DTCG-conformant token file.        |
| `*.schema.json` | JSON Schema (draft 2020-12).       |
| `*.mjs`         | ESM JavaScript (`type: "module"`). |
| `*.md`          | Context / docs.                    |

File **stems** match the id pattern above.

### Reserved DTCG `$`-prefixed keys

These come from DTCG. Use them as defined; do NOT invent new `$`-prefixed keys.

| Key            | Use                                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`      | URL or repo-relative path to the validating schema.                                                                                            |
| `$type`        | Type discriminator. See below.                                                                                                                 |
| `$value`       | The actual value. Used on DTCG composite tokens (e.g. typography). NOT used on mode-aware tokens (values live in the top-level `values` dict). |
| `$description` | One-line human-readable summary.                                                                                                               |
| `$extensions`  | Container for `com.acronis.*` and `com.figma.*` keys (see above).                                                                              |
| `$deprecated`  | DTCG deprecation marker. Adoption deferred.                                                                                                    |
| `$ref`         | DTCG JSON Pointer alias. Adoption deferred.                                                                                                    |

### `$type` values

DTCG-defined only: `color`, `dimension`, `fontFamily`, `fontWeight`, `number`, `typography`, `shadow`, `border`, `transition`, `gradient`, `cubicBezier`, `strokeStyle`, `duration`. DTCG group-level `$type` inheritance applies: declared at a parent group, descendants inherit unless overridden.

### Where the helper scripts enforce this

`.tmp/scripts/figma-to-primitives.mjs` and `.tmp/scripts/figma-to-semantic.mjs` are the canonical emitters AND formatters — they produce the exact shape above. During a Figma sync the LLM runs them to re-emit `tiers/primitives.json` and `tiers/semantic.json` in that canonical shape, so it doesn't have to hand-write the JSON (accuracy, plus fewer LLM tokens). The JSON is the source of truth and may be edited, but reflect a Figma change by running a sync. See [`figma-sync.md`](./figma-sync.md).
