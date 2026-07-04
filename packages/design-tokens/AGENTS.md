# AGENTS.md — `packages/design-tokens`

`@acronis-platform/design-tokens` — a **published** data-only workspace:
DTCG-2025.10-conformant design-token JSON. The files under
`tiers/` are the source of truth; they're synced from Figma by
[`context/figma-sync.md`](context/figma-sync.md). Consumes the vendored
DTCG-2025-10 spec snapshot under `context/DTCG-2025-10/`.

Repo-wide rules (TypeScript, file naming, Conventional Commits,
Changesets) live in the repo root's [`../../context/`](../../context/)
and apply on top. This file documents only what is specific to this
workspace; the deeper conceptual reference lives in
[`./context/`](./context/).

## Validate

This is the only script that does real work. From the repo root:

```bash
pnpm --filter @acronis-platform/design-tokens test       # alias for validate
pnpm --filter @acronis-platform/design-tokens validate    # ajv-compiles the schema, validates the three token files
```

`--strict=false` is required for the tokens schema — a known ajv quirk from the `properties`/`patternProperties` overlap on `$extensions`. It is already baked into the `validate` script; keep it.

`build` / `dev` / `clean` / `lint` / `typecheck` are intentional no-ops
— there is nothing to compile in a JSON data package. `test` runs the
ajv validation so `pnpm -r test` covers this workspace in CI.

## Bootstrap: `.tmp/figma-tokens/` may be absent

`.tmp/scripts/` (the Figma pull/post-process generators) is committed; `.tmp/figma-tokens/` holds local Figma snapshots that are **not** committed and won't be present in a fresh clone, so any helper script that reads from it will fail until you pull them. If you need that data and it isn't there:

1. `mkdir -p .tmp/figma-tokens` (run from this package directory).
2. Pull the snapshot via the **Figma Console MCP** server (`figma-console` in [`.mcp.json`](./.mcp.json) in this package; launch Claude from `packages/design-tokens/` so it loads) — never hand-author the snapshot contents.
3. Expected files and exact pull procedure: [`context/figma-sync.md`](context/figma-sync.md).
4. If the MCP server is unavailable, stop and ask the user — do not fabricate snapshot data. The JSON under `tiers/` is the source of truth and may be edited, but don't hand-patch it to stand in for a Figma snapshot you couldn't fetch.

## Loading context

This index is **not a knowledge base**. Before doing any non-trivial work, find the matching row below and **read every listed file in full** before acting. Do not load files that aren't listed; do not skip files that are.

When a new file lands under `context/`, add a row here in the same change. An unlisted file is invisible to the agent.

### Context — hand-authored

| When the task involves…                                                                                                                                          | Load                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Grounding vocabulary (Tier, Group, Mode, Theme, Brand, Collection, token)                                                                                        | [`context/glossary.md`](context/glossary.md)     |
| Writing/reading a `.tokens.json` — the files, token shape (`$value`/`$type`/`values`/`platforms`/`$extensions`), modes & themes, the alias chain, platform scope | [`context/manifest.md`](context/manifest.md)     |
| DTCG conformance & divergence, the `$schema`/Figma discriminator, `$extensions` namespaces (`com.acronis.*`/`com.figma.*`), naming / `$`-prefix / `$type` rules  | [`context/spec.md`](context/spec.md)             |
| Pulling from Figma — the mapping, the pull/post-process workflow, the generators under `.tmp/scripts/`                                                           | [`context/figma-sync.md`](context/figma-sync.md) |

### DTCG 2025.10 spec — vendored snapshot

Authoritative for all format questions. Read the relevant module's `index.md` (which lists its chapters) before answering rather than relying on memory.

| When the task involves…                                                                                | Load                                                                           |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Token-file structure, token anatomy, `$type`, `$extensions`, groups, aliases, composite types          | [`context/DTCG-2025-10/format/index.md`](context/DTCG-2025-10/format/index.md) |
| Color semantics — `colorSpace`, `components`, `alpha`, gamut mapping, interpolation, naming strategies | [`context/DTCG-2025-10/color/index.md`](context/DTCG-2025-10/color/index.md)   |

## Changesets

This is a **published** workspace, so a change to its published surface
(`tiers/`, `schemas/`, the `exports` map) needs a changeset. See
[`../../context/releasing.md`](../../context/releasing.md).

## Conventions for new context files

- **Project rules**: `context/<name>.md`, lowercase-hyphen-separated. Each file owns one concept; do not duplicate content across files. Cross-link with relative paths.
- **Reference snapshots** (vendored specs, large data dumps): their own directory under `context/`, with their own `index.md`.
- **Never** inline rules into this file — extract to a file under `context/` and add a table row.
