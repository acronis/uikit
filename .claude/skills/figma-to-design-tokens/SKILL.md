---
name: figma-to-design-tokens
description: Sync design tokens from Figma into the design-tokens package (packages/design-tokens/tiers/*.json). Use when the user asks to update, sync, refresh, or pull design tokens from Figma. Runs a diff-gated pipeline — pulls a snapshot, shows a full diff report, waits for human approval, then emits to tiers/*.json — and never writes tier files without explicit approval.
argument-hint: '[primitives | semantics | components | all]'
---

# Skill: /figma-to-design-tokens

Sync Figma design tokens into `packages/design-tokens/tiers/*.json`. This skill
is **self-contained**: its pull/build/diff/emit scripts live beside this file
under `.claude/skills/figma-to-design-tokens/`. The key discipline: you **review
a diff report before any tier file is written**.

All `node …` commands below are written relative to the **repo root** — run them
from there.

Figma file: `https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit`

---

## Pre-flight — data source + plugin check

Run this before any other phase.

**Step 1 — data source**

Ask the user (AskUserQuestion) whether to fetch fresh data from Figma or use
the last snapshot already on disk. Default to **fetch** when no instruction
was given or the user's prompt does not say otherwise.

Options:

- **Fetch from Figma** _(default)_ — pull a new snapshot via the figma-console MCP
- **Use last snapshot** — work from `.claude/skills/figma-to-design-tokens/snapshot/` files already present

**Step 2a — plugin check (fetch path only)**

If fetching, call `figma_get_status` immediately — before asking about scope,
before any other work. Two outcomes:

- **Running**: report the connected file name and proceed to Phase 0.
- **Not running / unreachable**: stop. Tell the user: "The Figma Desktop
  Bridge plugin is not running. Open Figma → Plugins → Development →
  Figma Desktop Bridge → Run, then try again." Do not continue until confirmed.

**Step 2b — snapshot check (use last snapshot path only)**

Verify `.claude/skills/figma-to-design-tokens/snapshot/` exists and contains
`variables.tokens.json`, `variables-meta.json`, and `styles.json`. Show the file
timestamps. If any file is missing, report which ones and stop.

---

## Phase 0 — Parse intent

Read the user's prompt and identify:

- **Tier**: `primitives` | `semantics` | `components` | `all`
- **Scope**: optional component name (e.g. `Button`, `InputText`) or area
- **Goal**: what changed in Figma (rename, value update, new token, etc.)

If tier is ambiguous, ask before proceeding. Do not assume.

---

## Phase 1 — Pull from Figma

_Skip this phase entirely if Pre-flight chose "use last snapshot" — proceed directly to Phase 2 (Combine)._

Run all three MCP tools in order. Do not skip any.

**Courier convention.** Your only job for the pull is to route each tool's output
to its fixed snapshot filename — **byte-for-byte, no reshaping, field-picking, or
unwrapping**. Do NOT hand-author or re-type snapshot files. When an `execute`
result is large and the harness spills it to a temp file, `cp` that temp file to
the destination verbatim (the `{_mcp, success, result}` envelope is fine — the
scripts auto-unwrap it). The pipeline scripts own the file shapes; don't inspect
them unless a script fails.

**1a. `figma_export_tokens`**

```
outputPath: ./.claude/skills/figma-to-design-tokens/snapshot/
format: dtcg
```

The MCP server writes the export to disk itself. The loader (Phase 2) requires
`variables.tokens.json`; if the export lands as `tokens.tokens.json`, rename it:

```bash
mv .claude/skills/figma-to-design-tokens/snapshot/tokens.tokens.json \
   .claude/skills/figma-to-design-tokens/snapshot/variables.tokens.json
```

**1b. `figma_execute` → `styles.json`**
Pull **all** style types via the plugin API and save the raw result (envelope and
all) to `.claude/skills/figma-to-design-tokens/snapshot/styles.json`:

```javascript
const text = await figma.getLocalTextStylesAsync();
const paint = await figma.getLocalPaintStylesAsync();
const effect = await figma.getLocalEffectStylesAsync();
const grid = await figma.getLocalGridStylesAsync();
return {
  text: text.map((s) => ({
    id: s.id,
    key: s.key,
    name: s.name,
    fontName: s.fontName,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    textCase: s.textCase,
    textDecoration: s.textDecoration,
  })),
  color: paint.map((s) => ({
    id: s.id,
    key: s.key,
    name: s.name,
    paints: s.paints,
  })),
  effect: effect.map((s) => ({
    id: s.id,
    key: s.key,
    name: s.name,
    effects: s.effects,
  })),
  grid: grid.map((s) => ({
    id: s.id,
    key: s.key,
    name: s.name,
    layoutGrids: s.layoutGrids,
  })),
};
```

**Note**: use the plugin API (`getLocalTextStylesAsync`), NOT `figma_get_styles` —
the latter returns style _metadata_ only (no `letterSpacing`), and the primitives
emitter derives `font.letter-spacing.*` from each text style's `letterSpacing`. The
loader unwraps the envelope and reads `.text` / `.color` / `.effect` / `.grid`.

**1c. `figma_execute` → `variables-meta.json`**
Run the following code and save the raw result to `.claude/skills/figma-to-design-tokens/snapshot/variables-meta.json`:

```javascript
const vars = await figma.variables.getLocalVariablesAsync();
const out = {};
for (const v of vars) {
  out[v.id] = {
    name: v.name,
    scopes: v.scopes,
    hidden: v.hiddenFromPublishing,
  };
}
return out;
```

**Note**: `getLocalVariablesAsync()` returns an **array**, not a dict — iterate with `for...of` and key by `v.id` to get `VariableID:*` keys. Using `Object.entries()` produces integer keys `"0"`, `"1"`, … which the snapshot build (Phase 2) rejects.
The result is large (~100KB+); the harness spills it to a temp file — `cp` that file
verbatim to `variables-meta.json`. The `{_mcp, success, result}` envelope is fine;
the loader auto-unwraps it.

---

## Phase 2 — Combine

```bash
node .claude/skills/figma-to-design-tokens/figma-snapshot-build.mjs
```

Output: `.claude/skills/figma-to-design-tokens/snapshot/figma-snapshot.json`

This merges all three pull outputs into one normalized snapshot:

- DTCG variable tree with `figma-console-mcp` transport fields stripped
- Meta fields (`scopes`, `hiddenFromPublishing`) merged inline per variable
- **Figma hex colors normalized to canonical DTCG HSL** (`ColorNormalizer`), so the
  diff compares like-for-like (tiers store HSL) instead of flagging every color
- Styles sections passed through verbatim

**Meta-completeness gate.** The build throws `No metadata for VariableID:X` if any
variable in the export lacks an entry in `variables-meta.json`
(`getLocalVariablesAsync()` reliably misses a handful of IDs). When it does, probe
the missing IDs and merge them in:

```javascript
const ids = [
  /* printed by the error */
];
const out = {};
for (const id of ids) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (v)
    out[id] = {
      name: v.name,
      scopes: v.scopes,
      hidden: v.hiddenFromPublishing,
    };
}
return out;
```

Merge the result into `variables-meta.json`, then re-run Phase 2. Do NOT proceed
until it exits 0.

---

## Phase 3 — Diff

```bash
node .claude/skills/figma-to-design-tokens/figma-diff.mjs [--tier <tier>]
```

Output: structured diff printed to stdout + `snapshot/figma-diff-report.json`

**Present the full diff report to the operator. Do not summarize or omit lines.**

Change categories in the report:

| Symbol  | Category             | Meaning                                            |
| ------- | -------------------- | -------------------------------------------------- |
| `+`     | `TOKEN_ADDED`        | New variable in Figma, not yet in tiers            |
| `-`     | `TOKEN_DELETED`      | Variable removed from Figma, still in tiers        |
| `~`     | `VALUE_CHANGED`      | Default value changed                              |
| `~`     | `MODE_VALUE_CHANGED` | A specific mode value changed (e.g. Dark mode)     |
| `~`     | `TYPE_CHANGED`       | `$type` changed                                    |
| `~`     | `SCOPES_CHANGED`     | Figma scope restrictions changed                   |
| `~`     | `HIDDEN_CHANGED`     | `hiddenFromPublishing` toggled                     |
| `+/-/~` | `EXTENSION_*`        | A `com.figma.*` field added, removed, or changed   |
| `+/-/~` | `STYLE_*`            | Text/color/effect style added, removed, or changed |
| `?`     | `UNCLASSIFIED`       | Something changed but doesn't fit a known pattern  |

Dimension primitives carry a native DTCG `$value: { value, unit }`; the diff
compares `value` against the snapshot's raw value, so unit/font value changes
surface as `VALUE_CHANGED` (not `UNCLASSIFIED`).

Fields intentionally NOT diffed:

- `com.acronis.*` — hand-authored metadata (`tailwindRoles`, `textCase`, `textDecoration`), not in snapshot
- Tokens with no `variableId` (orphan palette stops, letter-spacing) — `FIGMA_UNTRACKED`

---

## Phase 4 — Human gate

Ask the operator: **"Does this diff look correct? Approve to proceed with emit."**

Do NOT modify any file under `tiers/` until explicitly approved.

Before approving, also check:

- If `TOKEN_ADDED` entries exist: does `components.json`'s
  `$extensions.com.acronis.tailwindRoles` need a new entry for the new token's
  leaf key? Raise this explicitly — a missing entry causes a style-dictionary
  build failure.
- If `UNCLASSIFIED` entries exist: explain each one. Ask the operator what to do.
- If `TOKEN_DELETED` entries exist: are these intentional removals or a pull issue?

---

## Phase 5 — Plan

Write a plan file at `.claude/plans/<slug>.md` with:

1. What changes will be made (token path, before/after value or structure)
2. Changeset bump level:
   - `patch` — value changed, no public path changes
   - `minor` — token added or deleted (pre-1.0)
   - `major` — token deleted (post-1.0, would break consumers)
3. Migration notes if tokens are renamed, deleted, or `$type` changed
4. Any hand-authored fields to add (e.g. new `tailwindRoles` entries)

Wait for plan approval before proceeding.

---

## Phase 6 — Emit

Run the appropriate emitter(s) based on the approved tier:

```bash
# Primitives
node .claude/skills/figma-to-design-tokens/emit-primitives.mjs

# Semantics (requires current primitives)
node .claude/skills/figma-to-design-tokens/emit-semantics.mjs

# Components — all allowlisted components
node .claude/skills/figma-to-design-tokens/emit-components.mjs

# Components — single component only
node .claude/skills/figma-to-design-tokens/emit-components.mjs --component InputText

# All tiers (order matters: primitives → semantics → components)
node .claude/skills/figma-to-design-tokens/emit-primitives.mjs
node .claude/skills/figma-to-design-tokens/emit-semantics.mjs
node .claude/skills/figma-to-design-tokens/emit-components.mjs
```

After each emitter, validate immediately (Phase 8). Fix before running the next emitter.

If any hand-authored fields need updating (e.g. `com.acronis.tailwindRoles` in
`components.json`) — edit them manually in `tiers/components.json` before running
style-dictionary.

---

## Phase 7 — Rebuild tokens-pd

```bash
pnpm --filter @acronis-platform/style-dictionary build
```

---

## Phase 8 — Validate

```bash
pnpm --filter @acronis-platform/design-tokens validate
```

On failure, diagnose. Common causes:

- **Missing `tailwindRoles` entry**: a new token's leaf key has no Tailwind role mapping.
  Add the entry to `$extensions.com.acronis.tailwindRoles` in `tiers/components.json`.
- **Alias does not resolve**: a semantic/component token aliases a path that doesn't exist
  in primitives. Check the alias chain and fix the emitter output or re-run primitives.
- **Schema violation**: a token has a malformed `$value` or missing `$type`.

After fixing, re-run the affected emitter and re-validate.

---

## Phase 9 — Changeset

```bash
pnpm changeset
```

Create `.changeset/<name>.md`. The changeset must include:

```markdown
---
'@acronis-platform/design-tokens': minor # or patch/major
'@acronis-platform/tokens-pd': minor
---

## design-tokens

### Added

| Token                      | $type   |
| -------------------------- | ------- |
| `component.new-token.path` | `color` |

### Deleted

| Token                      | Was                                             |
| -------------------------- | ----------------------------------------------- |
| `component.old-token.path` | `{semantics.colors.background.surface.primary}` |

### Changed

| Token                        | From      | To        |
| ---------------------------- | --------- | --------- |
| `component.value-token.path` | old value | new value |

## Migration

If you reference `--ui-old-token-*` CSS variables, update to `--ui-new-token-*`.
```

---

## Phase 10 — Commit

Stage specific files only:

```bash
git add packages/design-tokens/tiers/primitives.json packages/design-tokens/tiers/semantics.json packages/design-tokens/tiers/components.json
git add packages/tokens-pd/
git add .changeset/
```

Commit message follows Conventional Commits:

```
feat(input-text): sync InputText component tokens from Figma
fix(primitives): update palette.blue.3 light value
chore(tokens): sync all tiers from Figma
```

---

## Hard rules

- **Never hand-edit `tiers/*.json`** — always use the emitters.
- **Never use `--no-verify`** — fix the hook failure.
- **Never proceed past Phase 4** without explicit operator approval.
- **Never fabricate snapshot data** — if the MCP pull fails, stop and report.
- If the snapshot build throws `"No metadata for VariableID:X"` — re-run Phase 1c
  (probe the missing IDs and merge them into `variables-meta.json`).

---

## Reference: Figma ↔ code mapping

How code Tiers/Groups map to Figma's organization — use it when translating a
code path (`palette.blue.7`) to a Figma name (`Blue/Blue-7-Primary`), or deciding
which Collection a new token belongs in.

| Code Tier  | Code Group         | Figma Collection                     | Figma Group under Collection   |
| ---------- | ------------------ | ------------------------------------ | ------------------------------ |
| Primitives | Palette            | Theme                                | (collection root)              |
| Primitives | Units              | Units                                | (collection root)              |
| Primitives | Font               | Font                                 | (collection root)              |
| Semantics  | Colors             | Brand                                | `Semantic/colors`              |
| Semantics  | Gradients          | Brand                                | `Semantic/gradients`           |
| Semantics  | Typography         | _(Figma Text Styles, not Variables)_ | —                              |
| Components | \* (per component) | Brand                                | `Brand/components/<Component>` |

- The **Brand** collection carries `semantics.colors`, `semantics.gradients`, and every `components.*` group; they share its mode axis (`acronis` only today).
- **Components** are emitted only for the `COMPONENTS` allowlist in `helpers/emit-components-builder.mjs` (today: `Breadcrumb`, `Button`, `ButtonIcon`, `Checkbox`, `InputText`, `SidebarPrimary`, `SidebarSecondary`, `Switch`, `Tag`). Extend the allowlist to pull more.

### Name handling

Figma segment names are **kept verbatim** — Component/SubComponent names stay
PascalCase (`Button`, `MenuItemList`); all other segments keep their Figma
camelCase (`onSurface`, `statusStrong`, `borderColor`). (Style Dictionary
kebab-cases the generated CSS var names, so consumers are unaffected.) Two groups
are **translated** on import: palette names via `helpers/emit-palette-mapper.mjs`
(`Blue/Blue-7-Primary` → `palette.blue.7`) and unit aliases via
`helpers/emit-alias-translator.mjs` (`gap/gap-4` → `units.gap.4`). Extend those
helpers — don't bypass them — when a new palette/unit naming pattern appears.

### Mocked values

Some values can't be native Figma variables, so designers mock them; the emitters
decode each into the right DTCG `$type`:

| Figma form                                                   | Decodes to                                                            | Where                  |
| ------------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------- |
| Color literal at `alpha: 0` (e.g. magenta `#FF00FF00`)       | CSS `transparent`                                                     | primitives, components |
| `string` holding `linear-gradient(<angle>, <hex> <pct>%, …)` | `$type: "gradient"` stop array; raw string in `com.figma.cssGradient` | `Semantic/gradients`   |
| `string` holding `typography.<path>`                         | `$type: "typography"` alias (`{typography.body.strong}`)              | components             |
| `string` on a `borderStyle` key                              | `$type: "strokeStyle"` (value `"solid"`)                              | components             |
| `string` on a per-state `textDecoration` key                 | `$type: "string"` (value `"none"` / `"underline"`)                    | components             |

### Orphan variable IDs

A few VariableIDs are referenced by the DTCG export but not returned by
`getLocalVariablesAsync()` (today: the palette orphans `VariableID:139:23`,
`VariableID:139:25`, Transparent/Inverted-6/-8). Phase 2 throws `No metadata for
VariableID:X` on any such gap — probe and merge them in. The primitives emitter
also carries a hardcoded `ORPHAN_PALETTE` list for those two stops, because they
are referenced as _aliases_ and need value data the bulk export doesn't supply.
