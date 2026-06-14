# Contributing to `@acronis-platform/design-tokens`

This guide covers the day-to-day authoring tasks: editing a token, adding a new mode, adding a new `$type` or `$extensions` key, and validating your work. For deeper conceptual context (modes, themes, alias chains, the DTCG divergence) see this package's `context/` directory — the references at the bottom of this file point you at the right doc per topic.

> [!IMPORTANT]
> The token JSON under `tiers/` is the **source of truth** — it's what's committed and what consumers read. Edit it directly and keep it schema-valid; every change ends with `pnpm validate` → commit.

## Before you start

- **Know the vocabulary** — Tier, Group, Mode, Theme, Brand, Collection, and the token. See [`context/glossary.md`](./context/glossary.md).
- **Know the format and its rules** — the data model in [`context/manifest.md`](./context/manifest.md), and the DTCG conformance/divergence + naming + `$extensions` rules in [`context/spec.md`](./context/spec.md). The schema itself is [`schemas/tokens.schema.json`](./schemas/tokens.schema.json).

## Editing tokens

The files under `tiers/` are plain JSON and are the source of truth — edit them directly. Keep each token schema-valid:

- A token carries its value via per-mode `values` (mode-aware tokens) **or** a single native DTCG `$value` (dimension primitives, scalar `fontWeight` / `fontFamily`, typography composites) — never both.
- Every token must declare a `platforms` array.
- Aliases are DTCG `{group.token}` strings following the chain `components → semantics → primitives`.

Token shapes and the alias chain are documented in [`context/manifest.md`](./context/manifest.md). Finish with `pnpm validate` and review `git diff tiers/` so only the tokens you intended changed.

## Adding a new mode

Modes are data-driven — no schema edit is needed as long as the mode name fits the schema's pattern (`^[a-z][a-z0-9-]*$`, any kebab-case lowercase identifier).

1. Add the new mode key to each affected token's `values` dict (e.g. a new brand under `semantics.colors` / `components.*`, or a theme under `primitives.palette`).
2. Run `pnpm validate` and confirm every affected token's `values` carries the new key.

See [`context/manifest.md`](./context/manifest.md) for the list of current and planned modes.

## Adding a new `$type` or `$extensions` key

These are schema changes — coordinated edits in the same commit:

1. **`schemas/tokens.schema.json`** — extend the `TokenType` enum (new `$type`) or the `Extensions` `properties` map (new `$extensions` key).
2. **`context/spec.md`** — document the new key's semantics and reserved-namespace rules.

A new `com.acronis.*` key also needs a context-file owner (a `.md` file under `context/` that documents what the key means) — a `com.acronis.*` key without a documented owner is forbidden by review even if the schema accepts it. Detail in [`context/spec.md`](./context/spec.md).

## Validating

The package's `package.json` carries a `validate` script that compiles the schema and checks every token file against it:

```bash
pnpm validate
```

Run `pnpm validate` from `packages/design-tokens/` (or `pnpm --filter @acronis-platform/design-tokens validate` from the repo root) before committing. It catches:

- Token files that don't conform to `tokens.schema.json` (missing `platforms` on a token, unknown `$type`, unknown `$extensions` key prefix, malformed `com.figma.variableId`, etc.).

It does NOT check semantic correctness — whether an alias points at a token that exists, whether mode values agree, whether a color is the one you intended. Those checks live in code review.

## Where the deeper context lives

These docs live in this package under `context/`. They are the authoritative reference; this contributing guide is a quick-start.

| Topic                                                                                                           | File                                             |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Vocabulary — Tier, Group, Mode, Theme, Brand, Collection, token                                                 | [`./context/glossary.md`](./context/glossary.md) |
| Token-file data model — the files, token shape, modes & themes, the alias chain, platform scope                 | [`./context/manifest.md`](./context/manifest.md) |
| DTCG conformance & divergence, `$schema`/discriminator, `$extensions` namespaces, naming / `$`-prefix / `$type` | [`./context/spec.md`](./context/spec.md)         |

The same context files are indexed in `./CLAUDE.md` for AI agents.
