# AGENTS.md — `packages/design-assets`

`@acronis-platform/design-assets` — a **published** data-only workspace:
DTCG-divergent JSON manifests for icons and illustrations, plus the
bundled icon/illustration binaries they point at. No components, no
build, no runtime API — it ships data.

The package borrows DTCG `$`-prefix vocabulary but is **NOT**
DTCG-conformant: project fields live at top-level keys (`values`,
`platforms`, `metadata`), not inside `$extensions.com.acronis.*`.

Repo-wide rules (TypeScript, file naming, Conventional Commits,
Changesets) live in the repo root's [`../../context/`](../../context/)
and apply on top. This file documents only what is specific to this
workspace; the deeper conceptual reference lives in
[`./context/`](./context/).

## Validate

This is the only script that does real work. From the repo root:

```bash
pnpm --filter @acronis-platform/design-assets test       # alias for validate
pnpm --filter @acronis-platform/design-assets validate    # ajv + manifest/export audit (packs, rules, $file existence, per-pack export coverage)
```

`build` / `dev` / `clean` / `lint` / `typecheck` are intentional no-ops
— there is nothing to compile in a JSON data package. `test` runs the
ajv validation so `pnpm -r test` covers this workspace in CI.

## Authoritative specs

- [`context/spec.md`](./context/spec.md) — the normative contract: DTCG divergence,
  `$`-prefix discipline, the cases a manifest MUST cover (R1–R16), invariants, and the
  resolution algorithm (how a renderer reads a manifest; NOT rule execution).

`spec.md` is the source of truth for format and runtime behavior; the other
`context/*.md` docs below explain the concepts behind it.

## Loading context

This index is **not a knowledge base**. Before any non-trivial work, find
the matching row below and **read every listed file in full** before acting.
Do not load files that aren't listed; do not skip files that are. When a new
file lands under `./context/`, add a row here in the same change — an unlisted
file is invisible to the agent.

| When the task involves…                                                                                                                                                                                                                    | Load                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| The normative contract — DTCG divergence, `$`-prefix discipline, the R1–R16 cases, invariants, the resolution algorithm                                                                                                                    | [`context/spec.md`](./context/spec.md)                     |
| Grounding vocabulary (Schema, Rule, Pack, Asset, Variant, Canonical/Default, Value: source/computed, AssetsGroup, `$values` patch, …)                                                                                                      | [`context/glossary.md`](./context/glossary.md)             |
| Writing/reading a manifest — pack root, asset groups (`assetsGroups` / `$values` patch), asset shape, `values` map (`$file` / `$rules` / `$from` / `null`), merge semantics, metadata, platform scope, pack catalog, binary layout, naming | [`context/manifest-pack.md`](./context/manifest-pack.md)   |
| Adding or changing a rule under `./rules/` — declaration format, `kind` semantics (`scale`/`stroke`/`color`), target shape by kind                                                                                                         | [`context/manifest-rules.md`](./context/manifest-rules.md) |
| Sizing a pack change — whether a change is major / minor / patch, and how to record it                                                                                                                                                     | [`context/versioning.md`](./context/versioning.md)         |

## Third-party content & licensing

Some icons are derived from [Lucide](https://lucide.dev) (ISC). The
package as a whole is MIT, but the Lucide ISC notice **must** be retained
— see [`LICENSE`](./LICENSE), `THIRD-PARTY CONTENT` section. When you add
assets derived from a new third-party source, append its attribution +
full license text there (see [`CONTRIBUTING.md`](./CONTRIBUTING.md)).

## Changesets

This is a **published** workspace, so a change to its published surface
(`packs/`, `rules/`, `schemas/`, the `exports` map) needs a changeset.
See [`../../context/releasing.md`](../../context/releasing.md).

## Conventions for new context files

- `context/<name>.md`, lowercase-hyphen-separated, one concept per file. Do not
  duplicate content across files; cross-link with relative paths.
- Never inline rules into this file — extract to a file under `context/`
  and add a table row in the same change.
