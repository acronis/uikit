# AGENTS.md

Single source of truth for AI agents working in `acronis/shadcn-uikit`.

This file is the **root index**. It is intentionally short (~120 lines) so
it fits in any context window. Specifics live in:

- `./context/*.md` — cross-cutting topics shared across workspaces
- `<workspace>/AGENTS.md` — quirks specific to one workspace

Each workspace also has a sibling `CLAUDE.md` containing only `@AGENTS.md`
so Claude Code's nested auto-load (it walks up from CWD) picks the
workspace's context when you work inside that subtree.

## Repository overview

`acronis/shadcn-uikit` is a pnpm monorepo containing a React component
library, a demo SPA, a documentation site, and a shared demos package.
Only the library is published; the apps are private.

## Workspaces

| Path | Package | Published? | Stack | Workspace docs |
|---|---|---|---|---|
| `packages/legacy/ui/` | `@acronis-platform/shadcn-uikit` | **yes** | Vite library, Storybook 10, Vitest + RTL | [AGENTS.md](packages/legacy/ui/AGENTS.md) |
| `apps/demo/` | `@acronis-platform/shadcn-uikit-demo` | no | Vite SPA, React Router v7, Zustand | [AGENTS.md](apps/demo/AGENTS.md) |
| `apps/docs/` | `@acronis-platform/shadcn-uikit-docs` | no | Next.js 15 + Fumadocs | [AGENTS.md](apps/docs/AGENTS.md) |
| `apps/demos/` | `@acronis-platform/shadcn-uikit-demos` | no | source-only (no build, no dev server) | [AGENTS.md](apps/demos/AGENTS.md) |

`packages/legacy/` is a parent directory housing the current single
published workspace. The `legacy` prefix anticipates a future split into
non-legacy packages; nothing under that prefix is scheduled yet.

## Scripts vocabulary

Every workspace exposes the same script names. Run any of them as:

- `pnpm -r <name>` — all workspaces, topological order
- `pnpm --filter <package> <name>` — single workspace

Names: `dev` · `build` · `test` · `test:watch` · `lint` · `lint:fix` · `typecheck` · `clean`

Root-only scripts (from the repo root):

- `format`, `format:check` — Prettier across the tree
- `changeset`, `version`, `release` — Changesets CLI passthroughs
- `husky` — runs lint-staged + typecheck (used by the pre-commit hook)

`apps/demos` is intentionally source-only: its `dev`/`build` scripts are
no-ops because the package is consumed via source-file exports.

## How agents should navigate this repo

1. **Always read this file first** — it tells you which workspace owns
   your task.
2. **Read the workspace's `AGENTS.md`** for the area you're editing.
   The workspace owns its own conventions, testing, theming, etc. in a
   workspace-local `context/` directory.
3. **Pull from this repo's root `./context/<topic>.md`** when relevant
   — it holds only the truly cross-workspace topics.

Cross-workspace context is intentionally minimal. Anything specific to
how a particular workspace is built, tested, or styled lives **inside
that workspace**, never here.

## Always-loaded cross-cutting context

@context/conventions.md
@context/commits.md

## Cross-cutting context (read on demand)

- `context/releasing.md` — Changesets workflow that applies to any
  published workspace in the monorepo.

## Tooling preconditions

- **Package manager**: pnpm `10.27.0` (declared in root `packageManager`).
  Enable via `corepack enable` or `npm install -g pnpm@10.27.0`.
- **Node**: 22.x (CI uses Node 22).
- **TypeScript** for all new source code.
- The catalog block in `pnpm-workspace.yaml` is the single source of
  truth for shared dependency versions — bump there, not per workspace.
  Respect intentional drift noted in catalog comments.
- Use `pnpm --filter <package> <script>` over `cd <workspace> && pnpm <script>`.
- **Never** use `--no-verify` to bypass commit hooks; fix the underlying
  issue. The pre-commit hook runs `lint-staged` + `typecheck`.

## What this repo does NOT have

To prevent agents inventing things from outdated knowledge:

- **No Vue**. The repo is React-only. Any `.vue` reference is stale.
- **No VitePress**. Docs are Next.js + Fumadocs at `apps/docs/`.
- **No `packages/documentation/` or `packages/examples/`**. Those paths
  never existed in this repo.
