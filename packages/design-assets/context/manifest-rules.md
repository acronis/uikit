# Manifest — Rules

The shape of a rule file at `../rules/<name>.json`, end to end: the rules catalog, the required
fields, target shapes per kind, and how rules are referenced from pack manifests. The **executor**
that applies a rule to a binary is out of scope today; these files are declarations of intent.

## Rules catalog

`../rules/<name>.json` — one file per rule. The filename stem MUST equal the `name` field inside
the file.

| File                 | `kind` | `target`                     | What it does                                                              |
| -------------------- | ------ | ---------------------------- | ------------------------------------------------------------------------- |
| `scale-16.json`      | scale  | `{ value: 16,  unit: "px" }` | Resize the source's bounding box to 16 px along the longer dimension.     |
| `scale-32.json`      | scale  | `{ value: 32,  unit: "px" }` | Resize to 32 px.                                                          |
| `scale-96.json`      | scale  | `{ value: 96,  unit: "px" }` | Resize to 96 px.                                                          |
| `stroke-1-6.json`    | stroke | `{ value: 1.6, unit: "px" }` | Set every stroked path on the source vector to 1.6 px stroke width.       |
| `stroke-2-5.json`    | stroke | `{ value: 2.5, unit: "px" }` | Set every stroked path to 2.5 px stroke width.                            |
| `current-color.json` | color  | `{ value: "currentColor" }`  | Replace hardcoded fill/stroke colors with the CSS `currentColor` keyword. |

### Adding a new rule

1. Create `../rules/<name>.json`. The filename stem MUST equal the `name` field.
2. Choose a `kind` and write the matching `target` shape (see [Target shape by kind](#target-shape-by-kind)).
3. Run `pnpm validate` to confirm the file passes `rule.schema.json`.
4. Add a row to the table above.
5. Reference the new rule by name in pack manifest `$rules` arrays where needed.

## Rule manifest

### Required fields

| Field     | Type   | Required                      | Notes                                                                     |
| --------- | ------ | ----------------------------- | ------------------------------------------------------------------------- |
| `$schema` | string | REQUIRED                      | MUST be `"../schemas/rule.schema.json"`.                                  |
| `name`    | string | REQUIRED                      | MUST equal the filename stem. Pattern: `^[a-z][a-z0-9-]*$`.               |
| `kind`    | enum   | REQUIRED                      | `"scale"` \| `"stroke"` \| `"color"`. Closed enum.                        |
| `target`  | object | required for `scale`/`stroke` | Shape differs by kind. See [Target shape by kind](#target-shape-by-kind). |

Anything else fails schema validation.

### Minimum valid shapes

```json
{
  "$schema": "../schemas/rule.schema.json",
  "name": "scale-48",
  "kind": "scale",
  "target": { "value": 48, "unit": "px" }
}
```

```json
{
  "$schema": "../schemas/rule.schema.json",
  "name": "current-color",
  "kind": "color",
  "target": { "value": "currentColor" }
}
```

### Forbidden

- Any key not in the table above.
- A `description` field — semantics are documented once in this file, not paraphrased per rule.
- An `id` field — the filename stem IS the identifier; `name` mirrors it for self-documentation.
- Executable code — rule files are declarations; the executor lives elsewhere.

## Target shape by kind

The `target` shape depends on `kind`.

### `scale` and `stroke`

```json
"target": { "value": 16, "unit": "px" }
```

Both fields required:

- **`value`** — number, `exclusiveMinimum: 0`. Integers and floats both legal (e.g., `16` for
  scale, `1.6` for stroke width).
- **`unit`** — closed enum `["px"]`. Widening the enum requires a schema change.

Semantics:

- `kind: "scale"` — scale the source's bounding box to `target` along the longer dimension.
  Aspect ratio preserved. Vector strokes are NOT compensated by this rule.
- `kind: "stroke"` — set every stroked path on the source vector to `target` stroke width. No
  effect on filled paths.

### `color`

```json
"target": { "value": "currentColor" }
```

One field required:

- **`value`** — string, minimum 1 character. A CSS value applied to the SVG's color attributes.

No `unit` field — the value is already a CSS string, not a numeric measurement.

Semantics:

- `kind: "color"` — replace hardcoded fill and stroke color values in the SVG with the CSS
  `target.value`. Primarily used with `"currentColor"` to make monochrome icons themable via CSS.

## Rule names in pack manifests

A computed variant's `$rules` array references rules by name (filename stem). Rules apply
**left to right** against the resolved source binary:

```json
"16": { "$rules": ["current-color", "scale-16"] }
```

A rule does not know which Asset or Pack it will be applied to — variant context is always
supplied by the manifest entry, never by the rule. See
[`manifest-pack.md`](./manifest-pack.md) for the full variants & values section.

## Adding new kinds and units

### Adding a new kind

1. Add it to the `kind` enum in [`../schemas/rule.schema.json`](../schemas/rule.schema.json).
2. Decide whether it needs a new `target` shape or fits an existing branch:
   - Numeric measurement → reuse the `scale`/`stroke` branch `{ value: number, unit: "px" }`.
   - CSS string → reuse the `color` branch `{ value: string }`.
   - Something else → add a new branch to the `oneOf` in `target`.
3. Document the new kind's semantics in [Target shape by kind](#target-shape-by-kind) above.
4. Add a row to the [Rules catalog](#rules-catalog) for any initial rules of that kind.

### Adding a new unit

The `unit` enum on `scale`/`stroke` rules is intentionally narrow. Widening it requires:

1. Adding the new unit to the enum in [`../schemas/rule.schema.json`](../schemas/rule.schema.json).
2. Documenting it here (semantics, when to use, conversion expectations for the executor).
3. A motivating consumer.

## Binary layout

Rule files live flat under `../rules/`. No subdirectories. One file per rule.

```text
../rules/
  current-color.json
  scale-16.json
  scale-32.json
  scale-96.json
  stroke-1-6.json
  stroke-2-5.json
```

Rule files are not bundled with pack binaries. The consumer's translation tool resolves rule ids
to these files at build time.

## Naming conventions

Rule ids follow the pack id pattern: `^[a-z][a-z0-9-]*$` — lowercase, kebab-case, starts with a
letter. The filename stem MUST equal the `name` field.

Additional conventions:

- **Decimals use dash-as-decimal**: `stroke-1-6` = stroke width 1.6. No decimal points in
  filenames.
- **No direction prefix** on scale rules (`scale-up-X`, `scale-down-X`). Direction is implicit
  from the resolution context.
- **No unit suffix** (`-px`). Unit is explicit inside the file, not in the name.
- **Kind prefix**: rule names conventionally start with their kind (`scale-`, `stroke-`).
  `current-color` is an exception — a `color` kind that names the CSS value instead.
