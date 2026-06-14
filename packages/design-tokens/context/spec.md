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

Non-mode-aware **dimension** primitives store their value in `$value` as a native DTCG dimension `{ value, unit }` (`unit` is `"px"` or `"rem"` per DTCG). `fontWeight` and `fontFamily` primitives are scalar DTCG types, so they carry a plain `$value` (a number, or a string / array for a font stack). DTCG composite typography tokens also use a native `$value`. Every `$value` in this package is therefore native DTCG — the only divergences are the per-mode `values` dict and the `platforms` array. Mode storage, aliasing, and platform scope are detailed in [`manifest.md`](./manifest.md).

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
"$schema": "../schemas/tier.schema.json"
```

The file's `$schema` points at the repo's [`../schemas/tier.schema.json`](../schemas/tier.schema.json) — the canonical description of the Acronis shape (DTCG-conformant with the divergences above). It doubles as the discriminator: a generic DTCG consumer that opens the file sees a non-DTCG `$schema` and should route it through an Acronis-aware parser rather than treat it as a plain DTCG file.

**Discriminator.** Every token carries **exactly one** of:

- `com.figma.variableId` — the source is a Figma Variable.
- `com.figma.styleId` — the source is a Figma Style (paint, effect, or text).

Downstream tooling discriminates by which key is present. Do not introduce a separate `com.acronis.origin` marker.

Additional `com.figma.*` metadata when present:

- `com.figma.scopes: [...]` — Variable scopes (e.g., `ALL_SCOPES`).
- `com.figma.hiddenFromPublishing: true` — emitted only when truthy.
- `com.figma.gradientTransform: [[…],[…]]` — Figma's gradient transform, for paint-style gradients where DTCG `gradient` has no direction field.
- `com.figma.cssGradient: "linear-gradient(…)"` — the raw CSS gradient string for gradients that originate as **mocked `string` variables** (Figma variables can't hold gradient fills). The emitter parses its stops into the DTCG `gradient` `$value`; this key preserves the original string verbatim — including the `<angle>` (e.g. `90deg`), which DTCG `gradient` has no field for. Carried on the `gradients.ai.*` tokens in `semantics.json`.

A handful of tokens may exist in Figma but be intentionally not linked back (no `variableId` / `styleId`). These are rare; add a `$description` explaining why when introducing one.

## `$extensions` namespaces

Vendor-specific metadata goes under `$extensions` with a reverse-DNS key. DTCG leaves the namespace open ([`format/design-token.md`](./DTCG-2025-10/format/design-token.md)); these two prefixes are our convention, and **any other prefix MUST NOT appear** — schema validators MUST reject unknown top-level prefixes inside `$extensions`.

| Prefix          | Owner            | Purpose                                                                                                                      |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `com.acronis.*` | This project     | Project-specific metadata not yet promoted to a top-level key.                                                               |
| `com.figma.*`   | Figma round-trip | Identity carried back to Figma (`com.figma.variableId`, `com.figma.styleId`, `com.figma.scopes`, future `com.figma.nodeId`). |

### `com.acronis.*` keys

| Key                          | Status                                                                                                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `com.acronis.units`          | RETIRED — dimension primitives now carry a native DTCG `$value: { value, unit }`; fontWeight/fontFamily carry a plain `$value` scalar (see [`manifest.md`](./manifest.md)). |
| `com.acronis.textCase`       | Typography hint preserved from Figma Text Styles (non-DTCG field).                                                                                                          |
| `com.acronis.textDecoration` | Typography hint preserved from Figma Text Styles (non-DTCG field).                                                                                                          |
| `com.acronis.tailwindRoles`  | Root-level build-time hint mapping a token path segment to a Tailwind theme namespace (see below).                                                                          |
| `com.acronis.modes`          | NOT USED — modes live at the top-level `values` key on each token (see [`manifest.md`](./manifest.md)).                                                                     |
| `com.acronis.platform`       | NOT USED — platform scope lives at the top-level `platforms` key (see [`manifest.md`](./manifest.md)).                                                                      |
| `com.acronis.metadata`       | NOT USED.                                                                                                                                                                   |

#### `com.acronis.tailwindRoles`

A **root-level (group-level)** extension that maps a token path segment — a
semantic role (e.g. `background`) or a component part (e.g. `container`) — to the
Tailwind theme namespace it should route into: one of `backgroundColor`,
`textColor`, `borderColor`, `fill`, `ringColor`, or `backgroundImage`. It is
carried at the top of `semantics.json` and `components.json`.

This is a **build-time hint consumed by [`tools/style-dictionary`](../../../tools/style-dictionary/AGENTS.md)** (its `tailwind.ts` reads the
key to route colors/gradients into the right Tailwind namespace), **not part of
any token's value** — it carries no design data and never appears on a token's
`$value`. It is validated by the `AcronisTailwindRoles` `$def` in
[`../schemas/tier.schema.json`](../schemas/tier.schema.json).

### Adding a new key (3-step rule)

A new `com.acronis.*` key requires THREE changes in the same commit:

1. Update [`../schemas/tier.schema.json`](../schemas/tier.schema.json) to allow / require the new key.
2. Add or update the context file that owns the key's semantics.
3. Update the CLAUDE.md row pointing at that context file, if the wording needs to widen.

A `com.acronis.*` key without a context file owning it is forbidden by review, not by tooling — the schema will accept it; reviewers MUST NOT. New `com.figma.*` keys follow the same three-step rule, but ownership is round-trip metadata driven by Figma's export, not authored design intent.

### Forbidden patterns

- Inventing a new top-level prefix (`org.acronis.*`, `com.acronis-internal.*`, `com.figma-export.*`). Stay inside the two reserved namespaces.
- Using `com.acronis.*` in places DTCG already specifies (`$value`, `$type`, `$description`, `$deprecated`, `$ref`). Use the DTCG keys.
- Storing values directly on `$extensions` that should live in DTCG `$value`. Extensions are for _metadata about the value_, not the value itself.

## Naming

Code names are simpler than Figma names and are canonical.

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

DTCG-defined: `color`, `dimension`, `fontFamily`, `fontWeight`, `number`, `typography`, `shadow`, `border`, `transition`, `gradient`, `cubicBezier`, `strokeStyle`, `duration`. DTCG group-level `$type` inheritance applies: declared at a parent group, descendants inherit unless overridden.

**One non-DTCG divergence: `string`.** DTCG 2025.10 has no string type, but Figma exports raw `string` variables that don't map cleanly onto a DTCG type. The rule: a Figma `string` variable is re-typed only when it decodes unambiguously to a DTCG type (`textStyle` → a `typography` alias); otherwise it is emitted verbatim as `$type: "string"`, which is added to the schema's `$type` enum. Examples kept as `string`: per-state `textDecoration` (`"none"` / `"underline"`), `borderStyle` (`"solid"`), and the gradient-fill mocks that alias `{gradients.ai.*}` (the `gradient` `$type` itself lives only on those `gradients.ai.*` tokens in `semantics.json`).
