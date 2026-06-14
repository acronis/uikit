# Spec — @acronis-platform/design-assets pack manifests

The normative contract for pack manifests: how the format diverges from DTCG, the cases a manifest MUST cover, the rules its keys MUST follow, and how a renderer resolves a schema-valid manifest into concrete `(Asset, Variant) → binary-or-derivation` outputs. The schema ([`../schemas/pack.schema.json`](../schemas/pack.schema.json)) says what is _legal_; this document says what cases must be _covered_ and how to _read_ a legal manifest.

When a sentence says **MUST**, **MAY**, **SHOULD**, **MUST NOT** it carries [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) force.

---

## Vocabulary

Terms (Asset, Pack, Variant, Canonical/Default, Rule, Source value, Computed value, `$type`, effective canonical, …) are defined once in [`glossary.md`](./glossary.md). This document uses them with that meaning; read the glossary first.

---

## Divergence from DTCG

This project's manifests are **NOT** DTCG-conformant. They borrow DTCG-style `$`-prefixed keywords (`$schema`, `$type`, `$description`, `$file`, `$from`, `$rules`, `$extensions`) but the surrounding shape is project-specific. The DTCG spec — which the tokens package vendors and follows — has no concept of binary assets; rather than contort the spec, this format diverges.

### File location and the `$schema` discriminator

Every Pack manifest under `../packs/` ends in plain `.json` (not `.tokens.json`). The filename alone is NOT a DTCG-skip signal — discrimination is by `$schema`.

Every manifest MUST start with `"$schema": "../schemas/pack.schema.json"`. That URI is the canonical discriminator: unique to this project, distinct from `https://www.designtokens.org/schemas/...`, and a DTCG token consumer can refuse-by-schema without inspecting any other key. A DTCG token consumer that opens a pack manifest MUST look at `$schema` and refuse to interpret the file as DTCG when it points at this project's schema. The project does NOT publish a DTCG-conformant schema and MUST NOT use the W3C URI. (Every rule file likewise MUST start with `"$schema": "../schemas/rule.schema.json"` — see [`rules.md`](./rules.md).)

### How the shape diverges

- **No `$extensions.com.acronis.*` namespace.** Project fields live at top-level keys (`values`, `platforms`, `metadata`) on the Asset or the Pack. The DTCG-style `$extensions.com.<vendor>.<key>` indirection added cost without payoff for a private package with no third-party DTCG consumer.
- **`$extensions` is an open extensions object.** Any consumer-defined key is allowed (the schema sets `additionalProperties: true`). The two well-known Figma round-trip keys — `com.figma.nodeId`, `com.figma.variableId` — are validated by name (typed `string`); anything else is unconstrained. The convention — project fields live at top-level keys, NOT inside `$extensions.com.acronis.*` — is preserved by convention, no longer by schema enforcement.
- **No `$value` at leaves** — values live inside `values.<variant>`: a source `$file`, or a computed `$rules` (optionally with a `$from` sibling id).
- **No DTCG composite types** (`shadow`, `typography`, etc.).
- **No Resolver** — variants are stored inline in the Pack-level and per-asset `values` maps and merged per key, not resolved across files.
- **No cross-asset aliasing** — a computed variant's only source reference is `$from: "<id>"`, a literal variant id looked up on the **same asset** (omit it to compute from the effective canonical). No cross-asset, no cross-pack references.

### `$type` semantics

`$type` is `"vector"` or `"raster"`. NOT `"asset"`. NOT `"asset-vector"`. There is no `"mixed"` type today — declare per-asset overrides if a Pack contains both. Declared at the Pack root, every Asset inherits it; an Asset MAY override its own `$type` (the override pattern borrowed from DTCG group inheritance).

### Same-asset references — `$from`, not an alias

This project coins NO alias syntax. DTCG aliases (`{group.token}`) are absolute paths into a token tree; assets have nothing to point at across files, so there is no `{…}` form at all. A computed variant names its source sibling with `$from: "<id>"` — a literal variant id (e.g., `"24"`, `"48"`, `"dark"`) looked up on the **same asset**. Omit `$from` to compute from the effective canonical; this is the common case, and it lets a Pack-level shared computation late-bind to each consuming Asset's own canonical. `$from` can only ever name a sibling of the same asset — there is no cross-asset, no cross-pack reference. See [`manifest.md`](./manifest.md).

### The canonical — an inline `"default": true` flag

The Pack names its canonical variant by marking exactly one entry in `values` with `"default": true` (e.g., `"24": { "default": true }`) — a boolean flag living _inside_ a variant value, NOT a string pointer like `values.default` and NOT a `$`-prefixed key. An Asset MAY mark a different entry to override the pack canonical. The flag marks a _role_, not a _how_, so it takes no `$` (see [`$-prefix discipline`](#-prefix-discipline) below).

### `$extensions` namespace rules

`$extensions` exists in asset manifests, but with a much narrower contract than DTCG's general-purpose extension mechanism.

| Prefix          | Status in `@acronis-platform/design-assets`                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `com.figma.*`   | **Allowed.** Round-trip identity carried back to Figma — `com.figma.nodeId`, `com.figma.variableId` (validated by name, typed `string`). The only prefix with a defined meaning here. |
| `com.acronis.*` | **NOT used.** Project metadata lives at top-level keys (`values`, `platforms`, `metadata`) instead. The assets schema does not expect any `com.acronis.*` key.                        |

Because the schema sets `additionalProperties: true` on `$extensions`, an unknown key will not be _rejected_ — but project fields MUST stay at their top-level home by convention, never reintroduced under `$extensions.com.acronis.*`. Adding a `com.acronis.*` key back would be a deliberate reversal of the divergence and needs a discussion, not a drive-by edit.

Forbidden:

- Inventing a new top-level prefix (`org.acronis.*`, `com.figma-export.*`). Stay inside the `com.figma.*` namespace.
- Storing on `$extensions` anything that belongs in `values` / `platforms` / `metadata`. Extensions are for round-trip metadata, not authored design intent.

### DTCG snapshot and cross-package symmetry

Assets does NOT vendor the DTCG spec. The single canonical DTCG copy lives in `@acronis-platform/design-tokens`, which still consumes the DTCG shape; assets only borrows the `$`-prefix vocabulary and otherwise diverges. The assets package moved project fields out of `$extensions` first; `@acronis-platform/design-tokens` later followed for `modes` (→ top-level `values`) and `platform` (→ top-level `platforms`). The two packages now share access paths for those two concepts. The tokens-only typography hints (`com.acronis.textCase`, `com.acronis.textDecoration`) have no assets equivalent and stay inside the tokens-side `$extensions`.

---

## `$`-prefix discipline

### The rule (one sentence — the canonical reference)

> **Use `$` if and only if the key is either (a) reserved by DTCG, or (b) a value-shape discriminator inside a Variant value object telling the resolver HOW to compute that Variant. Use NO `$` for any structural, container, or metadata field. DTCG forbids inventing new `$`-prefixed structural keys.**

### How to apply it

When adding any new key to the manifest, ask in order:

1. **Is it defined by the DTCG spec?** (`$schema`, `$type`, `$description`, `$extensions`, `$value`, `$deprecated`, `$ref`.) → Use the `$` form exactly as DTCG defines it.
2. **Does it appear inside a per-Variant value object and tell the resolver "this Variant is a file" or "is computed from sibling X"?** → It is a value-shape discriminator. Add `$`.
3. **Otherwise it is structural / a container / metadata** → no `$`. DTCG explicitly forbids inventing new `$`-prefixed structural keys ("token and group names MUST NOT begin with the `$` character"). The project follows the same discipline at the manifest level.

### Inventory — every key in scope

| Key                    | Has `$`? | Class                   | Justification                                                                                                                                                                                                                                                                                                   |
| ---------------------- | -------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema`              | yes      | DTCG-reserved           | DTCG spec; identifies the schema discriminator.                                                                                                                                                                                                                                                                 |
| `$type`                | yes      | DTCG-reserved           | DTCG spec; per-Asset override is the DTCG group-inheritance pattern.                                                                                                                                                                                                                                            |
| `$description`         | yes      | DTCG-reserved           | DTCG spec; one-line human summary.                                                                                                                                                                                                                                                                              |
| `$extensions`          | yes      | DTCG-reserved           | DTCG spec; an open object accepting any reverse-DNS-namespaced key. See R16.                                                                                                                                                                                                                                    |
| `$file`                | yes      | Value discriminator     | Tells the resolver "this Variant is a source binary at this path".                                                                                                                                                                                                                                              |
| `$from`                | yes      | Value discriminator     | Tells the resolver "this Variant computes from sibling X on the same Asset". OPTIONAL: a literal variant id (e.g., `"24"`, `"48"`); omit it to compute from the effective canonical.                                                                                                                            |
| `$rules`               | yes      | Value discriminator     | Tells the resolver "apply these named rules in order to the resolved sibling source".                                                                                                                                                                                                                           |
| `name`                 | no       | Structural              | Pack id. Container field.                                                                                                                                                                                                                                                                                       |
| `version`              | no       | Structural              | Pack semver. Container field.                                                                                                                                                                                                                                                                                   |
| `assets`               | no       | Structural              | Map container.                                                                                                                                                                                                                                                                                                  |
| `values`               | no       | Structural              | Map at pack and asset level. Every key is a variant id whose value is a Variant value (`$file` / `$rules` (+ optional `$from`) / `{ "default": true }` marker / null).                                                                                                                                          |
| `default`              | no       | Role marker             | Boolean (`true`) living _inside_ a Variant value object, flagging that entry as the canonical. It does not tell the resolver HOW to build the Variant (that is `$file` / `$rules`) — it marks a role — so per step 2 it takes no `$`. Exactly one per pack `values`; at most one per asset `values` (override). |
| `platforms`            | no       | Structural              | Per-Asset enum array; required, container-shaped.                                                                                                                                                                                                                                                               |
| `metadata`             | no       | Structural              | Per-Asset object container.                                                                                                                                                                                                                                                                                     |
| `category`             | no       | Structural              | String array inside `metadata`.                                                                                                                                                                                                                                                                                 |
| `tags`                 | no       | Structural              | String array inside `metadata`.                                                                                                                                                                                                                                                                                 |
| `legacyNames`          | no       | Structural              | String array inside `metadata`.                                                                                                                                                                                                                                                                                 |
| `com.figma.nodeId`     | no¹      | Extension namespace key | Lives inside `$extensions`. Namespaced (`com.figma.*`), not `$`-prefixed — DTCG extension keys are plain reverse-domain identifiers.                                                                                                                                                                            |
| `com.figma.variableId` | no¹      | Extension namespace key | Same as above.                                                                                                                                                                                                                                                                                                  |

¹ The `$` lives only on the parent `$extensions` key. Keys inside `$extensions` are plain reverse-DNS namespaces by DTCG convention.

---

## Requirements (R1–R16)

The cases a pack manifest MUST support. Each row names a concrete case and at least one Asset (or "no current example — future") so the design can be checked against reality, not theory.

| Id      | Case                                                                                                                                                                                                                                                                                                                                                              | Real example today                                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1**  | Pack-level shared computations — defined once under pack `values` (as entries alongside the canonical marker), applied to every Asset that does not override per-key. They omit `$from`, so each one late-binds to the consuming asset's own effective canonical.                                                                                                 | `icons-stroke-mono` `values."16"` and `."32"` compute from the canonical `24` for all 42 assets.                                                                 |
| **R2**  | Asset uses only the canonical; inherits every other Variant from Pack values.                                                                                                                                                                                                                                                                                     | `icons-stroke-mono.add`, `icons-stroke-mono.ban`, ~38 more.                                                                                                      |
| **R3**  | Asset extends with a **new Variant** beyond Pack values (additive — Pack does not define this Variant at all).                                                                                                                                                                                                                                                    | No current example. Will arrive when an icon needs `96` or an illustration needs `192`.                                                                          |
| **R4**  | Asset **overrides a default-computed Variant with different Rules** (still computed, different transform).                                                                                                                                                                                                                                                        | No current example. Will arrive when an icon's `16` needs `stroke-2-5` instead of the pack-default `stroke-1-6`.                                                 |
| **R5**  | Asset **opts out** of a Pack-supplied Variant — that Variant must not exist for the Asset.                                                                                                                                                                                                                                                                        | No current example. Expressed by `null` at the variant key in the Asset's `values`.                                                                              |
| **R6**  | Asset **replaces a default-computed Variant with its own binary**.                                                                                                                                                                                                                                                                                                | `illustrations.0001-full-image-backup` and `.0002-active-disk-cloning`, etc. — each ships its own `96.svg` overriding the pack-default-computed `96`.            |
| **R7**  | Asset has **multiple independent binaries** at different Variants (no shared canonical, no computation between them).                                                                                                                                                                                                                                             | `illustrations.0001-full-image-backup` (`48` and `96` are both `$file`, neither computes from the other).                                                        |
| **R8**  | **Asset-level `$type` override** — a `raster` Asset inside a `vector` Pack, or vice versa. Asset-level `$type: "raster"` MUST be allowed; the Variant file extensions MUST follow (`.png` / `.webp`, not `.svg`) — consistency is a runtime invariant (see [Invariants](#invariants)).                                                                            | No current example. The `illustrations` pack is the expected first home (PNG / WebP screenshots embedded in an otherwise-vector pack).                           |
| **R9**  | **Variant computed from a non-canonical sibling** — the source sibling is NOT the canonical (e.g., `96` computes from `48`, not from `24`). Expressed by `$from: "<sibling-id>"` (always a literal id).                                                                                                                                                           | No current example. Will arrive in `illustrations` once a `192` Variant is added that computes from `96`.                                                        |
| **R10** | **Future-proof for additional Variant dimensions** — `theme`, `locale`, composite keys. No structural break required when they arrive.                                                                                                                                                                                                                            | None today. The schema allows Variant keys matching `^[a-z0-9][a-z0-9-]*$`, supporting `"dark"`, `"16-dark"`, `"de-DE"`.                                         |
| **R11** | **Pack declares its canonical Variant by marking one entry** `"default": true` in `values` (required, exactly one). Translation tools read this to mark the preselected variant in component APIs.                                                                                                                                                                | `icons-stroke-mono`, `icons-stroke-multi`, `icons-solid-mono`, `icons-solid-multi`: `values."24".default = true`. `illustrations`: `values."48".default = true`. |
| **R12** | **Asset MAY override the pack-level canonical** by marking a different entry `"default": true` in its own `values`. Optional — absent means "inherit the pack canonical" (the common case). Present only when this asset's canonical differs from the pack's (e.g., an icon that only ships at `32`).                                                             | No current example. Demonstrated by `concept-pack.icon-special-default` (`values."32".default = true` in a pack whose canonical is `24`).                        |
| **R13** | Per-Asset `platforms` (`["WEB"]`, `["PD"]`, or both). Mandatory on every Asset. NOT defaultable at Pack level. NOT inheritable. Default value `["PD"]`; widen to `["WEB"]` only after audit.                                                                                                                                                                      | Every Asset in every pack. Icons → `["PD"]`; illustrations → `["WEB"]`.                                                                                          |
| **R14** | Per-Asset `metadata` (`category`, `tags`, `legacyNames`). Mandatory on every Asset (empty arrays allowed). NOT defaultable at Pack level. Per-Variant metadata is out of scope (see [Out of scope](#out-of-scope)).                                                                                                                                               | Every Asset in every pack. `illustrations` Assets carry populated `category` and `legacyNames`; icons carry empty arrays today.                                  |
| **R15** | Stable kebab-case Asset ids. **Pack and Rule ids** match `^[a-z][a-z0-9-]*$` (first char letter). **Asset ids** match `^[a-z0-9][a-z0-9-]*$` (first char letter OR digit — the `illustrations` pack opts into digit-prefix for its 4-digit catalog ids). Unique within a Pack; externally addressed as `<pack>.<id>`.                                             | All packs comply.                                                                                                                                                |
| **R16** | Per-Asset `$extensions` is an **open object** that accepts any reverse-DNS-namespaced key (`com.<org>.<…>`). The schema MUST NOT restrict to a fixed namespace allowlist. The schema MAY recognize specific well-known keys by name for typing — that is additive, not exclusive. New namespaces (`com.acronis.*` included) MAY be added without a schema change. | Today only `com.figma.nodeId` and `com.figma.variableId` are in use (Figma round-trip). `com.acronis.*` is allowed but not yet used.                             |

---

## Invariants

The schema enforces only a partial subset; the translation tool / renderer is the authoritative checker for the rest and SHOULD fail closed — surface the offending Asset/Variant and stop, rather than emit a partial set. Each invariant below states what the schema catches (if anything) and what is left to runtime.

1. **`$file` paths resolve on disk** under `../packs/<pack>/`. _Runtime only._ The schema validates the path _pattern_ but not file existence.
2. **Sibling / canonical references resolve.** _Runtime only._ `$from: "16"` is pattern-validated, but nothing checks that the named sibling — or, when `$from` is omitted, the effective canonical — names a present, non-`null` entry in the merged `effectiveValues` map.
3. **Computation chains are acyclic.** _Runtime only._ `A.$from → B`, `B.$from → A` is legal per the schema; the renderer MUST detect cycles. Derivation must terminate at a `$file` leaf.
4. **The canonical is marked exactly once and resolves to a source.** _Schema partial._ The schema enforces the _shape_ of the `default` flag (`const: true`, and only on a source-shaped entry — a Computed value carrying `default` is rejected). It cannot count flags across a map or compute the effective canonical, so three checks are _runtime_: exactly one `"default": true` per pack `values`; at most one per asset `values` (and it suppresses the inherited pack flag); the effective canonical resolves to a `$file` source (never computed, never null).
5. **`$type` / file-extension consistency.** _Schema partial (per-asset)._ When an asset declares its own `$type`, the schema constrains every `$file` extension in its `values` map: `.svg` for `vector`, `.png` or `.webp` for `raster`. Assets that omit `$type` and inherit from the pack are NOT constrained by the schema (it cannot compute effective `$type` in pure JSON Schema) — so the renderer MUST enforce this for _every_ Asset, including those that inherit `$type`.
6. **Referenced rule ids exist.** _Runtime only._ Every id in a `$rules` array MUST name a present declaration under `../rules/`.
7. **Variant keys obey the Pack's declared dimensions** _(Future)._ The schema allows free-form kebab-case keys. A future feature MAY let each Pack declare its dimensions (size, theme, etc.) and constrain Variant keys to combinations of those dimensions.

---

## Resolution algorithm

A renderer consumes:

1. A **pack manifest** (`../packs/<pack>.json`) that has already passed schema validation.
2. The **rule declarations** under `../rules/*.json` (to confirm referenced rule ids exist).
3. The **binaries** under `../packs/<pack>/` (the `$file` targets).

For each Asset in `pack.assets`, in any order (Assets are independent):

### a. Validate

The manifest MUST already satisfy `pack.schema.json`. A renderer SHOULD re-assert it and fail closed on any violation.

### b. Effective `$type`

`effectiveType = asset.$type ?? pack.$type`. Used in step (e) to check file extensions.

### c. Merge values (per-key, asset wins, no deep merge)

```
effectiveValues = { ...pack.values, ...asset.values }
```

Replacement is **whole-entry per key**: if the Asset declares key `X`, its entry wins entirely for `X` (no field-level merge into the pack entry). Then **drop every key whose merged value is `null`** — that is the opt-out (R5); the Variant does not exist for this Asset.

### d. Effective canonical

The effective canonical is the **id of the entry carrying `"default": true`** in `effectiveValues`, with the Asset's flag winning over the pack's:

- If `asset.values` flags an entry, that id is the canonical (R12), and the inherited pack flag is ignored.
- Otherwise the pack-flagged id is the canonical.

The renderer MUST verify:

- **Exactly one** effective canonical results. Zero or more than one is an error.
- The canonical entry resolves to a **`$file` source** for this Asset (it MUST NOT be a computed entry or `null`). The canonical is the root of every derivation, so it cannot itself be derived. (At pack level the canonical is the bare marker `{ "default": true }`; the Asset supplies the `$file` for that id — confirm it does.)

### e. Resolve each remaining Variant

For every key in `effectiveValues`:

| Merged value                   | Resolution                                                                                                                                                                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `null`                         | Already dropped in (c) — skip.                                                                                                                                                                                                                                            |
| `{ "$file": p, ... }`          | **Leaf.** The binary at `p`. Its extension MUST match `effectiveType` (`.svg` for `vector`; `.png`/`.webp` for `raster`). The optional `default: true` is consumed in (d) and otherwise ignored here.                                                                     |
| `{ "$rules": r, "$from"?: s }` | **Computed.** `source = s ?? effectiveCanonicalId`. Resolve `source` **on the same Asset** (it may itself be computed → recurse, building a chain to a leaf). Emit a derivation plan: `{ from: resolvedSource, rules: r }`. Every id in `r` MUST exist under `../rules/`. |

### f. Reject cycles

Build the directed graph of `$from` (and implicit-canonical) edges among an Asset's computed Variants. The renderer MUST detect cycles (`A → B → A`) and fail — derivation must terminate at a `$file` leaf.

### g. Same-Asset references only

`$from` and the implicit canonical resolve **only within the same Asset's `effectiveValues`**. Cross-Asset (`{otherAsset.24}`) and cross-Pack references are not permitted and have no syntax (see [Out of scope](#out-of-scope)).

---

## Platform filtering & ignored fields

**Platform filtering.** Each Asset declares `platforms` (`["WEB"]`, `["PD"]`, or both). A consumer targeting a platform selects only Assets whose `platforms` array includes that platform. `platforms` is per-Asset, never per-Variant — an Asset cannot ship a different binary for `WEB` vs `PD` at the same Variant (see [Out of scope](#out-of-scope)).

**Fields the renderer ignores.** `metadata` (`category`, `tags`, `legacyNames`), `$extensions`, and `$description` do not affect resolution. They are descriptive / round-trip payloads carried through for other consumers (search, Figma round-trip, docs).

---

## Out of scope

The design MUST NOT widen the spec to include any of the following. Each is deferred to its own discussion.

- **Cross-Asset references.** No `{otherAsset.24}`, no `{pack.asset.24}`. Variants resolve against the same Asset only.
- **Cross-Pack references.** Packs are independent units. No `{icons-solid-mono.add.24}`.
- **Per-Variant metadata.** `category`, `tags`, `legacyNames`, `platforms` are per-Asset only. A single Asset cannot have one `category` for its `16` Variant and another for its `32`.
- **Per-platform Variants.** An Asset cannot ship a different binary for `WEB` vs `PD` at the same Variant. Authoring two Assets is the workaround.
- **Rule execution — the resolution≠execution boundary.** This spec covers **resolution**: parsing a manifest, merging pack and asset values, picking the canonical, and resolving each Variant to either a source binary or a derivation plan (`source + ordered rule ids`). It does **not** cover **rule execution** — the transform a Rule performs on a binary (how `scale-96` resizes an SVG, how `stroke-2-5` rewrites stroke widths). Rules are declared under [`rules.md`](./rules.md) and describe intent (`{kind: "scale", target: {value: 16, unit: "px"}}`); the executor that reads a Rule and transforms a binary is a separate component. A renderer produces, for each computed Variant, a **derivation plan** — the resolved source binary plus the ordered list of rule ids — and hands that to the executor.

---

## Worked example

From `packs/concept-pack.json` — pack `values` are
`{ "24": { "default": true }, "16": { "$rules": ["scale-16"] }, "32": { "$rules": ["scale-32"] } }`.

Asset `icon-extended`:

```json
"values": {
  "24": { "$file": "./packs/concept-pack/icon-extended-24.svg" },
  "96": { "$rules": ["scale-96"] }
}
```

Resolution:

- **(b)** `effectiveType = "vector"` (inherited from the pack).
- **(c)** `effectiveValues = { "24": {$file …-24.svg}, "16": {$rules:["scale-16"]}, "32": {$rules:["scale-32"]}, "96": {$rules:["scale-96"]} }`
  (pack `16`/`32` inherited; asset adds `96`; asset `24` overrides the pack marker).
- **(d)** No asset flag → canonical is the pack-flagged `"24"`. The asset's `"24"` is a `$file` source ✓, exactly one canonical ✓.
- **(e)** Outputs:
  - `24` → leaf `icon-extended-24.svg` (`.svg` matches `vector` ✓).
  - `16` → computed, `$from` omitted ⇒ from canonical `24`; plan `{ from: 24-leaf, rules: ["scale-16"] }`.
  - `32` → computed from `24`; plan `{ from: 24-leaf, rules: ["scale-32"] }`.
  - `96` → computed from `24`; plan `{ from: 24-leaf, rules: ["scale-96"] }`.
- **(f)** Graph `16→24, 32→24, 96→24` is acyclic ✓.

The renderer emits one leaf binary (`24`) and three derivation plans (`16`, `32`, `96`), each handed to the rule executor.
