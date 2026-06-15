# AGENTS.md — `packages/design-tokens`

`@acronis-platform/design-tokens` — a **published** data-only workspace:
DTCG-2025.10-conformant design-token JSON. The files under
`tiers/` are the source of truth. Consumes the vendored DTCG-2025-10 spec
snapshot under `context/DTCG-2025-10/`.

Repo-wide rules (TypeScript, file naming, Conventional Commits,
Changesets) live in the repo root's [`../../context/`](../../context/)
and apply on top. This file documents only what is specific to this
workspace; the deeper conceptual reference lives in
[`./context/`](./context/).

## Validate

This is the only script that does real work. From the repo root:

```bash
pnpm --filter @acronis-platform/design-tokens test       # alias for validate
pnpm --filter @acronis-platform/design-tokens validate    # ajv-compiles the schema, validates the tier files
```

`--strict=false` is required for the tokens schema — a known ajv quirk from the `properties`/`patternProperties` overlap on `$extensions`. It is already baked into the `validate` script; keep it.

## Emit (re-emit tiers from a Figma snapshot)

```bash
pnpm --filter @acronis-platform/design-tokens emit
```

One-command re-emit: builds the normalized snapshot from the
figma-token-exporter output in `.tmp/figma-tokens/`
(`figma-snapshot-build.mjs --tmp`), runs the three tier emitters in dependency
order (`emit-primitives` → `emit-semantics` → `emit-components`), then
`validate` — fail-fast (`&&`-chained). All scripts live in the
[`/figma-to-design-tokens`](../../.claude/skills/figma-to-design-tokens/SKILL.md)
skill; this is the **figma-console-free** path (it reads `.tmp/figma-tokens/`,
which the exporter writes — no MCP pull). Requires a populated
`.tmp/figma-tokens/` snapshot. It does **not** rebuild `tokens-pd`, review the
diff, or fix consumers — run the skill for a diff-gated full sync.

`build` / `dev` / `clean` / `lint` / `typecheck` are intentional no-ops
— there is nothing to compile in a JSON data package. `test` runs the
ajv validation so `pnpm -r test` covers this workspace in CI.

## Loading context

This index is **not a knowledge base**. Before doing any non-trivial work, find the matching row below and **read every listed file in full** before acting. Do not load files that aren't listed; do not skip files that are.

When a new file lands under `context/`, add a row here in the same change. An unlisted file is invisible to the agent.

### Context — hand-authored

| When the task involves…                                                                                                                                          | Load                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Grounding vocabulary (Tier, Group, Mode, Theme, Brand, Collection, token)                                                                                        | [`context/glossary.md`](context/glossary.md)     |
| Writing/reading a `.tokens.json` — the files, token shape (`$value`/`$type`/`values`/`platforms`/`$extensions`), modes & themes, the alias chain, platform scope | [`context/manifest.md`](context/manifest.md)     |
| DTCG conformance & divergence, the `$schema`/Figma discriminator, `$extensions` namespaces (`com.acronis.*`/`com.figma.*`), naming / `$`-prefix / `$type` rules  | [`context/spec.md`](context/spec.md)             |
| Sizing a token change — whether a change is a major / minor / patch bump, and how to record it                                                                   | [`context/versioning.md`](context/versioning.md) |

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
