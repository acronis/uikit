# Figma sync

The files under `tiers/` are the **source of truth** — what's committed and what downstream consumers read. Figma is the design tool those values originate in, not the published source. When the values change in Figma, an LLM (Claude) **syncs** them into the JSON via the [`figma-console` MCP server](https://github.com/southleft/figma-console-mcp): it reads Figma through the MCP and re-emits the JSON using the helper scripts under `.tmp/scripts/`. The scripts exist to guarantee the exact shape/formatting and to keep the LLM's token usage down — they're the LLM's sync toolkit, not an autonomous pipeline that owns the data. This doc covers the Figma↔code mapping, the pull workflow, those helper scripts, and the after-sync regenerate sequence.

Vocabulary used here (Tier, Group, Mode, Theme, Brand, Collection) is defined in [`glossary.md`](./glossary.md).

## Sync direction

The JSON files are the source of truth; Figma is where the values are designed. The only automated direction today is **Figma → repo**: an LLM pulls the latest from Figma and re-emits the JSON. Two notional directions exist:

1. **Sync (Figma → repo)** — the LLM refreshes `.tmp/figma-tokens/` from Figma, then runs the helper scripts to re-emit `tiers/`. This is the supported flow.
2. **Push (repo → Figma)** — changes made in Figma based on decisions in code. Designer-driven; not automated. (A future round-trip isn't ruled out, but isn't supported today.)

### Snapshots land in `.tmp/figma-tokens/`

Figma exports drop into `.tmp/figma-tokens/` — a DTCG-shaped export plus Figma metadata sidecars used by the generators:

| File                                      | Contents                                                                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `.tmp/figma-tokens/variables.tokens.json` | DTCG export of every Variable Collection (Theme, Brand, Units, Typography). Includes Modes, Groups, and aliased values.          |
| `.tmp/figma-tokens/variables-meta.json`   | Sidecar: `{ [variableId]: { name, scopes, hidden } }`. Holds `scopes` and `hiddenFromPublishing` — fields the DTCG export drops. |
| `.tmp/figma-tokens/styles-color.json`     | Paint (color) styles. Backs the four `colors.background.ai` gradients today.                                                     |
| `.tmp/figma-tokens/styles-effect.json`    | Effect styles (shadows, blurs). Not yet consumed by the generators.                                                              |
| `.tmp/figma-tokens/styles-text.json`      | Text styles. Will back `semantics.typography` once that's built.                                                                 |

`.tmp/` is **gitignored** — snapshots are reproducible inputs any contributor can re-fetch from Figma; committing them would just churn the diff. The helper scripts under `.tmp/scripts/` are whitelisted (`.gitignore` carves them back in) as a temporary location until the proper CI/CD sync pipeline lands.

### Bootstrap — when `.tmp/figma-tokens/` is missing

Fresh clones (and anyone who's never synced) won't have `.tmp/figma-tokens/`; the helper scripts fail with "no such file" until it's populated. To populate:

1. Confirm the `figma-console` MCP server is connected (declared in this package's [`.mcp.json`](../.mcp.json), loaded when Claude is launched from `design-tokens/`; needs `FIGMA_ACCESS_TOKEN_ACRONIS` in the environment).
2. `mkdir -p .tmp/figma-tokens`.
3. Run the [Pull workflow](#pull-workflow) below to export variables, styles, and metadata into that directory.
4. Run the [helper scripts](#helper-scripts--lib).

If the MCP server is unavailable, ask the user — do **not** fabricate snapshot contents. The JSON under `tiers/` is the source of truth and may be edited directly, but a change that's meant to mirror Figma should go through a sync so the files stay accurate; don't hand-patch them to stand in for a snapshot you couldn't fetch.

### When to sync

Sync (pull + re-emit) when:

- The user mentions a token or behavior that doesn't match the current `tiers/` or `.tmp/figma-tokens/`.
- The user explicitly asks for a refresh.
- A new mode, brand, or token has been added in Figma.

If something seems off between what the user describes and what's in the repo, **pull first** — the repo snapshot is probably stale. Don't argue from possibly-outdated data.

## Mapping

How code Tiers and Groups map to Figma's organization. Use this when translating between a code path (e.g. `palette.blue.7`) and a Figma name (e.g. `Blue/Blue-7-Primary`), or when deciding which Figma Collection a new token belongs in.

### Tier × Group ↔ Figma Collection × Figma Group

| Code Tier  | Code Group         | Figma Collection                     | Figma Group under Collection |
| ---------- | ------------------ | ------------------------------------ | ---------------------------- |
| Primitives | Palette            | Theme                                | (collection root)            |
| Primitives | Units              | Units                                | (collection root)            |
| Primitives | Font               | Font                                 | (collection root)            |
| Semantics  | Colors             | Brand                                | `Semantic/colors`            |
| Semantics  | Typography         | _(Figma Text Styles, not Variables)_ | —                            |
| Components | \* (per component) | Brand                                | `Component/*`                |

Notes:

- The **Brand** Figma Collection carries both `semantics.colors` and every `components.*` group. They share its mode axis (`acronis` and `brand-b` today; `brand-b` mirrors `acronis` until designers author it — see [`manifest.md`](./manifest.md)).
- **Semantics/Typography** is not a Variable Collection — it's modeled as Figma Text Styles and emitted to `tiers/semantic.json`. See [`manifest.md`](./manifest.md).
- **Components** are variables under the Brand collection (`Component/*`) and are emitted to `tiers/components.json`. See [`manifest.md`](./manifest.md).

### Name canonicalization

Code names are simpler and take priority. Figma names are optimized for the Figma UI; the generator translates them on import. Examples:

| Code                             | Figma                    |
| -------------------------------- | ------------------------ |
| `palette.blue.7`                 | `Blue/Blue-7-Primary`    |
| `palette.blue.13`                | `Blue/Blue-13-Brand`     |
| `palette.transparent.inverted.6` | `Transparent/Inverted-6` |
| `palette.grayscale.5`            | `Grayscale/Gray-5`       |
| `units.gap.4`                    | `gap/gap-4`              |
| `units.size.16`                  | `size/size-16`           |
| `units.stroke.1-6`               | `stroke/width-1-6`       |
| `units.radius.4`                 | `radius/radius-4`        |
| `font.font-size.10`              | `font-size/font-size-10` |

The translation logic for palette names lives in `../.tmp/scripts/lib/palette-map.mjs`. The alias-prefix rules (e.g. `gap.gap-N → units.gap.N`) live in `../.tmp/scripts/lib/alias-map.mjs`. Extend either one — don't bypass them — when a new naming pattern appears in Figma.

## Pull workflow

Use the Figma Console MCP tools, then run the post-process gate:

1. **DTCG variables export** — `figma_export_tokens` with `format: dtcg`, `scope: file`, `modes: all`, and `outputPath: '.tmp/figma-tokens/'` (must be a **directory** — the tool ignores explicit filenames and always writes `<format>.tokens.json` inside it; the post-process step renames it).
2. **Variable meta sidecar** — `figma_execute` running `figma.variables.getLocalVariablesAsync()` and returning `{ [id]: { name, scopes, hidden } }`. Save as `.tmp/figma-tokens/variables-meta.json`.
3. **Style exports** — pull paint, effect, and text styles into their respective `.tmp/figma-tokens/styles-*.json` files.
4. **Post-process gate** — `node ../.tmp/scripts/figma-pull-postprocess.mjs`. It renames `tokens.tokens.json` → `variables.tokens.json` and diffs the VariableIDs the export references against the meta sidecar. Exits 0 when meta covers every ID; exits 1 with a paste-ready `figma_execute` snippet listing the missing IDs.
5. **Probe missing IDs (only if step 4 reported any)** — run the printed snippet in `figma_execute`, merge the returned `{id: {name, scopes, hidden}}` into `.tmp/figma-tokens/variables-meta.json`, then re-run step 4 to confirm clean coverage.

### Orphan variable IDs

A handful of VariableIDs are referenced by the DTCG export but not returned by `getLocalVariablesAsync()`. Today: the two palette orphans (`VariableID:139:23`, `VariableID:139:25`, referenced as Transparent/Inverted-6/-8 in semantic colors) plus the two `component/sub item/*` IDs (`VariableID:684:1710`, `VariableID:788:15959`). The post-process gate (step 4) detects ALL such gaps automatically — palette and otherwise — so this list stays accurate without manual upkeep. The primitives generator still carries a hardcoded `ORPHAN_PALETTE` list for the two Transparent/Inverted stops, because they're referenced as _aliases_ (not just metadata) and need value data the bulk export doesn't supply.

## Helper scripts & lib

`../.tmp/scripts/` holds the helper scripts the LLM runs during a sync, plus small operational helpers. They re-emit the canonical JSON shape so the LLM doesn't have to hand-write it — keeping the output accurate and the LLM's token usage low. The design is modular and OOP-oriented — prefer extending `../.tmp/scripts/lib/` over inlining logic in a top-level script.

### Top-level scripts

| Script                        | Role                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `figma-to-primitives.mjs`     | Reads the DTCG export and emits `tiers/primitives.json` (palette + units + typography primitives). Canonical formatter for that file.                                                                                                                                                                                                                          |
| `figma-to-semantic.mjs`       | Reads the DTCG export and emits `tiers/semantic.json` (semantic colors + typography). Depends on `tiers/primitives.json` for the palette VariableID → path map and alias-target validation. Canonical formatter for that file.                                                                                                                                 |
| `figma-to-components.mjs`     | Reads the DTCG export and emits `tiers/components.json` (per-component tokens). Depends on both `primitives.json` and `semantic.json` so the alias-map validator can confirm every translated alias target exists. Inlines + warns on raw-value gaps in Figma (same posture as the typography gaps in `figma-to-semantic`). Canonical formatter for that file. |
| `figma-pull-postprocess.mjs`  | The post-process gate from the [Pull workflow](#pull-workflow): renames `tokens.tokens.json` → `variables.tokens.json` and diffs VariableID coverage. Prints a paste-ready `figma_execute` snippet for missing IDs and exits 1 until coverage is clean. Run after every pull.                                                                                  |
| `extract-linear-gradient.mjs` | Vendored helper converting a Figma `gradientTransform` into start/end points. Pure math, no I/O. Used when authoring the AI gradient round-trip data.                                                                                                                                                                                                          |

All three emitters are also the **canonical formatters**: they produce a mixed JSON layout (always-multi-line top-level `values` dict, inline mode values, token `$extensions` broken when long, meta keys hoisted before integer-like keys) that no standard JSON formatter reproduces. `.vscode/settings.json` disables format-on-save for JSON in this workspace.

### Run order

The three emitters must run in dependency order — semantic reads primitives, components reads both:

```bash
node ../.tmp/scripts/figma-to-primitives.mjs
node ../.tmp/scripts/figma-to-semantic.mjs
node ../.tmp/scripts/figma-to-components.mjs
```

The emitters default to `.tmp/figma-tokens/variables.tokens.json`; pass an alternate path as `argv[2]` if needed.

### Shared lib (`../.tmp/scripts/lib/`)

| Module            | Purpose                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paths.mjs`       | Resolves DTCG export + meta sidecar paths; `loadDtcg(argv)`, `loadMeta()`.                                                                                                                                                                                                                                                                                                      |
| `meta.mjs`        | Builds `metaFor(variableId)` → `{ scopes, hidden }` over the sidecar. Throws on unknown IDs — a signal to refresh the sidecar.                                                                                                                                                                                                                                                  |
| `color.mjs`       | `hexToRgb`, `srgbToHsl`, `hexToHslValue`, `round`. All angles/percents rounded to 2 decimals for stable output.                                                                                                                                                                                                                                                                 |
| `palette-map.mjs` | Figma palette name → code path translator (`["Blue", "Blue-7-Primary"]` → `["blue", "7"]`). Throws on unrecognized token names — extend, don't silently mis-map.                                                                                                                                                                                                                |
| `alias-map.mjs`   | Figma DTCG alias → code alias translator with target-existence validator. `makeAliasTranslator({primitives, semantic})` returns `{ translate, has }`. Knows the `color.* → colors.*`, `gap.gap-N → units.gap.N`, `size.size-N → units.size.N`, `stroke.width-N → units.stroke.N`, `radius.radius-N → units.radius.N` rules, with palette-direct fallback via `palette-map.mjs`. |
| `tree.mjs`        | Generic tree ops: `setPath`, `collectColorLeaves`, `sortNode`, `reorderByList`.                                                                                                                                                                                                                                                                                                 |
| `format.mjs`      | The mixed-layout DTCG JSON formatter.                                                                                                                                                                                                                                                                                                                                           |

### Adding a script

- **Modular** — factor reusable logic into `../.tmp/scripts/lib/` before writing a top-level script.
- **OOP-oriented** — prefer small classes / factory functions with explicit interfaces over loose function bags. Existing lib modules use factories (e.g. `makeMetaFor`); match that style.
- **ESM, plain `node`.** No `package.json`, no lint, no tests yet — keep dependencies at zero.

### What the scripts intentionally don't do

- They don't pull data from Figma — that's done via the Figma Console MCP tools directly (see [Pull workflow](#pull-workflow)).
- They don't push data back to Figma — designer-driven for now.

## After pulling, re-emit

After a clean pull (post-process gate exits 0), re-emit the JSON, validate, and commit:

1. **Re-emit** — run the three emitters in the [run order](#run-order) above.
2. **Validate** — `pnpm validate` from `design-tokens/` (uses ajv with `--strict=false`; see the DTCG spec under [`DTCG-2025-10/`](./DTCG-2025-10/)).
3. **Commit** — commit the regenerated `tiers/*.json`. The `.tmp/figma-tokens/` snapshot stays gitignored and is not committed.
