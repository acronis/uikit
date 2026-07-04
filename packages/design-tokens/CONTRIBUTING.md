# Contributing to `@acronis-platform/design-tokens`

This guide covers the day-to-day authoring tasks: keeping the tokens and Figma in step (the two [sync pipelines](#sync-pipelines)), adding a new mode, adding a new `$type` or `$extensions` key, and validating your work. For deeper conceptual context (modes, themes, alias chains, the DTCG divergence, the Figma sync) see this package's `context/` directory — the references at the bottom of this file point you at the right doc per topic.

> [!IMPORTANT]
> The token JSON under `tiers/` is the **source of truth** — it's what's committed and what consumers read. **Figma is never the source of truth**; it's a peer surface designers work in. The two are kept in step by an LLM (Claude) via the [Figma Console MCP](https://github.com/southleft/figma-console-mcp), and changes can flow **either direction** — see [Sync pipelines](#sync-pipelines). Either way it ends with `pnpm validate` → commit.

## Before you start

- **Set up Figma access** (one-time) — a `FIGMA_ACCESS_TOKEN_ACRONIS` env var + the Figma Console MCP. Step-by-step in the README [Setup](./README.md#setup).
- **Know the vocabulary** — Tier, Group, Mode, Theme, Brand, Collection, and the token. See [`context/glossary.md`](./context/glossary.md).
- **Know the format and its rules** — the data model in [`context/manifest.md`](./context/manifest.md), and the DTCG conformance/divergence + naming + `$extensions` rules in [`context/spec.md`](./context/spec.md). The schema itself is [`schemas/tokens.schema.json`](./schemas/tokens.schema.json).

## Sync pipelines

The JSON under `tiers/` is the **source of truth**; Figma is a peer surface. An LLM (Claude) keeps them in step through the [Figma Console MCP](https://github.com/southleft/figma-console-mcp). Changes flow in **either direction** — pick the one that matches where the change originated. Both end with `pnpm validate` → commit ([Validating](#validating)).
| Pipeline | Use when | Tools |
| --------------------------------------------------- | ------------------------------ | --------------------------------------- |
| [Figma → JSON](#figma--json-designer-changed-figma) | a designer changed Figma | LLM + Figma Console + JS helper scripts |
| [JSON → Figma](#json--figma-change-decided-in-code) | the change was decided in code | LLM + Figma Console |

### Figma → JSON (designer changed Figma)

Pull a Figma change back into the canonical JSON. The **JS helper scripts** (`.tmp/scripts/figma-to-*.mjs`) re-emit the JSON so the shape stays exact and the LLM spends few tokens — that's why this direction has scripts and the other doesn't.

Where the change lives in Figma (so you know what was touched):

| Change                                                         | Where in Figma                                                              |
| -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| New palette color, or change a palette value                   | **Theme** collection (modes: `light`, `dark`)                               |
| New semantic color, or change which palette token it aliases   | **Brand** collection, group `Semantic/colors` (modes: `acronis`, `brand-b`) |
| New per-component token, or change its alias                   | **Brand** collection, group `Component/<component-name>`                    |
| New unit (`gap`, `size`, `radius`, `stroke`) or font primitive | **Units** or **Font** collection (single-value, no modes)                   |
| New typography style                                           | **Text Styles** (not a Variable Collection — backs `semantic.typography`)   |

Figma naming is UI-optimized; the helper scripts translate it to our canonical kebab-case paths on import. With the Figma Console MCP available (see [Setup](./README.md#setup)), **ask Claude to sync** — it pulls the Figma snapshot into `.tmp/figma-tokens/` and runs the helper scripts to re-emit the affected JSON. The full procedure (export steps, post-process gate, generator order) lives in [`context/figma-sync.md`](./context/figma-sync.md); Claude follows it.

To run it by hand — pull (short version; full procedure in [`context/figma-sync.md`](./context/figma-sync.md)):

1. `figma_export_tokens` (figma-console MCP) → writes `.tmp/figma-tokens/tokens.tokens.json`.
2. `figma_execute` running `figma.variables.getLocalVariablesAsync()` → save as `.tmp/figma-tokens/variables-meta.json`.
3. Pull paint, effect, and text styles into the matching `.tmp/figma-tokens/styles-*.json` files.
4. `node .tmp/scripts/figma-pull-postprocess.mjs` — renames the export to `variables.tokens.json` and diffs VariableID coverage against the meta sidecar. Exits 0 when complete; exits 1 with a paste-ready `figma_execute` snippet listing IDs that need probing.
5. If step 4 reported missing IDs, probe them via `figma_execute`, merge into `.tmp/figma-tokens/variables-meta.json`, and re-run step 4 until clean.

Then re-emit the JSON with the three helper scripts, in this order (the second and third depend on the first two for alias-target validation):

```bash
node .tmp/scripts/figma-to-primitives.mjs
node .tmp/scripts/figma-to-semantic.mjs
node .tmp/scripts/figma-to-components.mjs
```

They write `tiers/primitives.json`, `tiers/semantic.json`, and `tiers/components.json`, and are the canonical formatter for each — don't reformat the output. Finish with `pnpm validate` and review `git diff tiers/`: only the tokens you touched should have changed.

### JSON → Figma (change decided in code)

When a change is decided in the JSON — add a token, rename one, adjust a value — and Figma should reflect it so designers see it. **No JS scripts** here: Claude writes to Figma directly through the Figma Console MCP (the scripts only run the other direction).

1. **Edit the JSON** (the source of truth) — by hand or otherwise; keep it schema-valid (`pnpm validate`).
2. **Ask Claude to mirror it into Figma.** Using the Figma Console MCP, it creates/updates the matching Figma Variables (Theme / Brand / Units / Font collections) or Text Styles so the Figma file matches the JSON. Naming maps the same way as the table above, in reverse.
3. **Capture round-trip metadata.** Newly created Figma Variables get fresh `VariableID`s; run a quick [Figma → JSON](#figma--json-designer-changed-figma) sync afterwards so each new token's `$extensions.com.figma.variableId` is written back. Then `pnpm validate` → commit.

Use this direction when code is ahead of Figma; use Figma → JSON when Figma is ahead.

## Adding a new mode

Modes are data-driven. The helper scripts read whichever mode names appear in Figma's `lastSyncedValue` per token, lower-case + kebab them, and emit them verbatim into each token's `values` dict.

1. Add the mode to the corresponding Figma Collection (Theme for palette, Brand for semantic / component).
2. Run a [Figma → JSON](#figma--json-designer-changed-figma) sync.
3. Confirm every token's `values` now carries the new mode key.

No script or schema edits required as long as the mode name fits the schema's pattern (`^[a-z][a-z0-9-]*$` — any kebab-case lowercase identifier).

See [`context/manifest.md`](./context/manifest.md) for the list of current and planned modes.

## Adding a new `$type` or `$extensions` key

These are schema changes — coordinated edits in three places, all in the same commit:

1. **`schemas/tokens.schema.json`** — extend the `TokenType` enum (new `$type`) or the `Extensions` `properties` map (new `$extensions` key).
2. **`context/spec.md`** (and [`context/spec.md`](./context/spec.md) for any cross-package implications) — document the new key's semantics and reserved-namespace rules.
3. **Generator(s)** — update whichever of `.tmp/scripts/figma-to-*.mjs` emits the new shape so the next sync produces it.

A new `com.acronis.*` key also needs a context-file owner (a `.md` file under `context/` that documents what the key means) — a `com.acronis.*` key without a documented owner is forbidden by review even if the schema accepts it. Detail in [`context/spec.md`](./context/spec.md).

## Validating

The package's `package.json` carries a `validate` script that compiles both schemas and checks every JSON file against them:

```bash
pnpm validate
```

Run `pnpm validate` from `packages/design-tokens/` (or `pnpm --filter @acronis-platform/design-tokens validate` from the repo root) before committing. It catches:

- Token files that don't conform to `tokens.schema.json` (missing `platforms` on a token, unknown `$type`, unknown `$extensions` key prefix, malformed `com.figma.variableId`, etc.).

It does NOT check semantic correctness — whether an alias points at a token that exists, whether mode values agree, whether a color is the one you intended. Those checks live in the generators (alias-target validation) or in code review.

## Where the deeper context lives

These docs live in this package under `context/`. They are the authoritative reference; this contributing guide is a quick-start.

| Topic                                                                                                           | File                                                 |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Vocabulary — Tier, Group, Mode, Theme, Brand, Collection, token                                                 | [`./context/glossary.md`](./context/glossary.md)     |
| Token-file data model — the files, token shape, modes & themes, the alias chain, platform scope                 | [`./context/manifest.md`](./context/manifest.md)     |
| DTCG conformance & divergence, `$schema`/discriminator, `$extensions` namespaces, naming / `$`-prefix / `$type` | [`./context/spec.md`](./context/spec.md)             |
| Figma → JSON sync — mapping, the pull/post-process workflow, the generators & lib                               | [`./context/figma-sync.md`](./context/figma-sync.md) |
| Naming rules (kebab-case, `$`-prefix reservations) — cross-package                                              | [`./context/spec.md`](./context/spec.md)             |

The same context files are indexed in `./CLAUDE.md` for AI agents.
