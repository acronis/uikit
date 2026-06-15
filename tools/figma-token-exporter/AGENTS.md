# AGENTS.md — `tools/figma-token-exporter`

`@acronis-platform/figma-token-exporter` — a **private** (unpublished) build
tool: a small, self-hosted Figma plugin plus a local Node receiver that exports
the design system's variables and styles into
`packages/design-tokens/.tmp/figma-tokens/` — the snapshot the design-tokens
sync emitters consume.

It exists to replace the third-party **figma-console** Desktop Bridge for the
bulk token pull (step 1 of the [`/sync-tokens`](../../packages/design-tokens/context/figma-sync.md)
runbook). The Figma org is **not** on Enterprise, so the REST Variables API is
unavailable and reading variables requires the Plugin API — i.e. _something must
run inside Figma_. This makes that "something" a repo-owned plugin instead of an
external MCP + its bridge.

Repo-wide rules (TypeScript, kebab-case filenames, Conventional Commits) live in
the repo root's [`../../context/`](../../context/) and apply on top. This file
documents only what is specific to this workspace.

## Why the output matches figma-console exactly

`src/convert.ts` is a **faithful, trimmed port** of figma-console-mcp's
serialization (MIT — `southleft/figma-console-mcp`: `figma-converter.js` +
`formatters/dtcg.js` + `alias-resolver.js`), restricted to the single-file,
all-modes export. The `/figma-to-design-tokens` skill's snapshot loader + tier
emitters were written against figma-console's output, so reproducing its exact
transform yields a **drop-in** snapshot:

- top-level key = `slugify(collection.name)` (`Theme` → `theme`, `Brand` → `brand`);
- token path = `variable.name.split("/")`, case-preserved;
- each leaf carries `$value` (+ non-primary modes under `$extensions.modes`) **and**
  `$extensions["figma-console-mcp"].{variableId,lastSyncedValue}`, where
  `lastSyncedValue` is keyed by **mode name** with `{reference}` | `{literal}`;
- an alias to a non-local target encodes as `{__library:VariableID:X:Y}`.

**Do not "improve" the shape here** — if the contract needs to change, change the
`/figma-to-design-tokens` skill's loader/emitters (and `figma-sync.md`) instead.
`src/__specs__/convert.spec.ts` pins this contract.

## How it runs

Two halves, no build step:

1. **The plugin** (`manifest.json`, `plugin/code.js`, `plugin/ui.html`) — plain
   JS, imported into **Figma Desktop** via _Plugins → Development → Import plugin
   from manifest…_ (pick `manifest.json`). On run it reads variables,
   collections, and text/paint/effect styles, resolves any cross-library alias
   targets (`getVariableByIdAsync`) so the meta sidecar is complete, and POSTs
   the raw payload to the local receiver.
2. **The receiver** (`src/receiver.ts`, run via `tsx`) — listens on
   `http://localhost:3333`, converts the payload (`src/convert.ts`), and writes
   the snapshot files (`src/write-snapshot.ts`) into
   `packages/design-tokens/.tmp/figma-tokens/`.

```bash
pnpm --filter @acronis-platform/figma-token-exporter receive
# then in Figma: run "Acronis Token Exporter" → "Send snapshot to repo"
# override the port (must match manifest networkAccess) with:  receive -- --port 4444
```

The port (`3333`) is declared in the manifest's `networkAccess.allowedDomains`;
if you change it, update both. See [`README.md`](./README.md) for the full
operator walkthrough.

## Files written

Into `packages/design-tokens/.tmp/figma-tokens/` (gitignored — never committed):

These feed the `/figma-to-design-tokens` skill's snapshot build
(`figma-snapshot-build.mjs --tmp`), which normalizes them into one
`figma-snapshot.json` that the three tier emitters consume:

| File                    | Consumed by                                   |
| ----------------------- | --------------------------------------------- |
| `variables.tokens.json` | snapshot build → all three tier emitters      |
| `variables-meta.json`   | snapshot build (scopes/hidden sidecar)        |
| `styles-text.json`      | `emit-semantics` (letter-spacing, typography) |
| `styles-color.json`     | parity only — not consumed today              |
| `styles-effect.json`    | parity only — not consumed today              |

The snapshot build's meta-completeness check passes on the first run because the
plugin folds resolved orphan IDs into `variables-meta.json`.

## Testing

`pnpm --filter @acronis-platform/figma-token-exporter test` runs the Vitest unit
specs (pure converter + snapshot writer; no Figma, no network). The end-to-end
correctness check is the sync itself: after a real export, `pnpm --filter
@acronis-platform/design-tokens emit` runs and `git diff tiers/` shows only
intended changes.
