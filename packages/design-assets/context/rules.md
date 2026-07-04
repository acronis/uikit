# Rules format

How rule files under [`../rules/`](../rules/) are structured. The **executor** that applies a rule to a binary is out of scope today; these files are declarations.

## File naming

- One rule per file: `../rules/<name>.json`.
- Filename stem MUST equal the `name` field inside the file.
- Pattern: `^[a-z][a-z0-9-]*$` — same as pack manifests.
- Decimals use dash-as-decimal: `stroke-1-6` = stroke width 1.6.
- No direction prefix on scale rules (`scale-up-X`, `scale-down-X`). Direction is implicit from the resolution context — the rule is applied to the resolved source variant.
- No unit suffix (`-px`). Unit is explicit inside the file.

## Required fields

| Field     | Type   | Notes                                                  |
| --------- | ------ | ------------------------------------------------------ |
| `$schema` | string | `"../schemas/rule.schema.json"`.                       |
| `name`    | string | MUST equal the filename stem.                          |
| `kind`    | enum   | `"scale"` or `"stroke"`. Closed enum today.            |
| `target`  | object | `{ value: number > 0, unit: enum ["px"] }`. See below. |

Anything else fails schema validation. `description`, `id`, and `parameters` are NOT allowed — they were removed when the format collapsed to four fields.

## `target` shape

```json
"target": { "value": 16, "unit": "px" }
```

Both fields REQUIRED:

- **`value`** — number, `exclusiveMinimum: 0`. No upper bound. Integers and floats both legal (e.g., `16` for a scale, `1.6` for a stroke width).
- **`unit`** — closed enum `["px"]`. Today every rule operates in pixels. Widening the enum (e.g., `"rem"`, `"em"`) requires a schema change.

The `target` shape is the same across all kinds today. `kind` distinguishes meaning, not shape:

- `kind: "scale"` — scale the base value's bounding box to `target` along the longer dimension. Aspect ratio preserved. Vector strokes are NOT compensated by this rule.
- `kind: "stroke"` — set every stroked path on the base vector to `target` stroke width. No effect on filled paths.

## Adding a new kind

1. Add it to the `kind` enum in [`../schemas/rule.schema.json`](../schemas/rule.schema.json).
2. Document its semantics in this file alongside `scale` and `stroke`.
3. If the new kind needs more than one target value (e.g., a `padding` rule with four sides), the schema needs a per-kind branch — today's unified single-`target` shape assumes one target per rule.

## Adding a new unit

The unit enum is intentionally narrow. Widening it requires:

1. Adding the new unit to the enum in [`../schemas/rule.schema.json`](../schemas/rule.schema.json).
2. Documenting it here (semantics, when to use, conversion expectations for the future executor).
3. A motivating consumer — usually a token in `@acronis-platform/design-tokens` that needs the rule to operate in non-px units.

## Initial rules

| File              | `kind` | `target`                     |
| ----------------- | ------ | ---------------------------- |
| `scale-16.json`   | scale  | `{ value: 16,  unit: "px" }` |
| `scale-32.json`   | scale  | `{ value: 32,  unit: "px" }` |
| `scale-96.json`   | scale  | `{ value: 96,  unit: "px" }` |
| `stroke-1-6.json` | stroke | `{ value: 1.6, unit: "px" }` |
| `stroke-2-5.json` | stroke | `{ value: 2.5, unit: "px" }` |

## Rule names in manifests

A derived Variant value's `$rules` array references rules by name (filename stem):

```json
"16": { "$rules": ["scale-16", "stroke-1-6"] }
```

Rules apply left to right. See [`manifest.md`](./manifest.md).

## What rule files do NOT contain

- Executable code. Executor logic lives elsewhere (and does not exist today).
- Variant-specific context. A rule does not know which Asset or Pack it will be applied to.
- Per-platform variants. Use multiple rules instead.
- A `description`. The semantics of `kind` + `target` are documented once here, not paraphrased per rule.
- An `id`. The filename stem IS the identifier; `name` mirrors it for self-documentation.
