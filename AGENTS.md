# AGENTS.md

Single source of truth for AI agents working in `acronis/uikit`.

This file is the **root index**. It is intentionally short (~120 lines) so
it fits in any context window. Specifics live in:

- `./context/*.md` — cross-cutting topics shared across workspaces
- `<workspace>/AGENTS.md` — quirks specific to one workspace

Each workspace also has a sibling `CLAUDE.md` containing only `@AGENTS.md`
so Claude Code's nested auto-load (it walks up from CWD) picks the
workspace's context when you work inside that subtree.

## Repository overview

`acronis/uikit` is a pnpm monorepo containing a React component
library, a demo SPA, a documentation site, a shared demos package, two
design-data packages (assets and tokens), and a build-tooling tier. The
library and the two design-data packages are published; the apps and the
tools are private.

The repo is organized into four top-level directories, each with a
distinct role:

- **`context/`** — Markdown instructions read by both LLMs and humans
  (cross-workspace conventions; each workspace also has its own).
- **`apps/`** — applications that get deployed (e.g. the demo and docs
  sites). Private.
- **`packages/`** — packages published to the npm registry.
- **`tools/`** — scripts that automate, translate, or execute operations
  (e.g. token→CSS builds). Private; never published.

## Workspaces

| Path                         | Package                                 | Published? | Stack                                                                       | Workspace docs                                   |
| ---------------------------- | --------------------------------------- | ---------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| `packages/ui-legacy/`        | `@acronis-platform/shadcn-uikit`        | **yes**    | Vite library, Storybook 10, Vitest + RTL                                    | [AGENTS.md](packages/ui-legacy/AGENTS.md)        |
| `packages/ui-react/`         | `@acronis-platform/ui-react`            | **yes**    | Base UI library, Vite, Storybook 10, Vitest + RTL, Tailwind v4              | [AGENTS.md](packages/ui-react/AGENTS.md)         |
| `packages/icons-react/`      | `@acronis-platform/icons-react`         | **yes**    | React icons generated from `design-assets`, Vite, Storybook, Vitest         | [AGENTS.md](packages/icons-react/AGENTS.md)      |
| `packages/icons-svg/`        | `@acronis-platform/icons-svg`           | no         | Raw SVG icon sources (mono/multicolor) fetched from Figma + manifests       | [AGENTS.md](packages/icons-svg/AGENTS.md)        |
| `packages/icons-svg-next/`   | `@acronis-platform/icons-svg-next`      | no         | Raw SVG sources for the **next-gen** icon set (Figma `new-frames` strategy) | [AGENTS.md](packages/icons-svg-next/AGENTS.md)   |
| `packages/icons-sprite/`     | `@acronis-platform/icons-sprite`        | **yes**    | Generated (committed) SVG sprites built from `icons-svg` (tsx + SVGO)       | [AGENTS.md](packages/icons-sprite/AGENTS.md)     |
| `apps/demo/`                 | `@acronis-platform/shadcn-uikit-demo`   | no         | Vite SPA, React Router v7, Zustand                                          | [AGENTS.md](apps/demo/AGENTS.md)                 |
| `apps/docs/`                 | `@acronis-platform/shadcn-uikit-docs`   | no         | Next.js 15 + Fumadocs                                                       | [AGENTS.md](apps/docs/AGENTS.md)                 |
| `apps/demos/`                | `@acronis-platform/shadcn-uikit-demos`  | no         | source-only (no build, no dev server)                                       | [AGENTS.md](apps/demos/AGENTS.md)                |
| `apps/kitchen-sink/`         | `@acronis-platform/kitchen-sink`        | no         | Vite SPA — one-page showcase of tokens, elements, components, icons         | [AGENTS.md](apps/kitchen-sink/AGENTS.md)         |
| `packages/design-tokens/`    | `@acronis-platform/design-tokens`       | **yes**    | JSON data only (DTCG-2025.10 design tokens), ajv-validated                  | [AGENTS.md](packages/design-tokens/AGENTS.md)    |
| `packages/design-assets/`    | `@acronis-platform/design-assets`       | **yes**    | JSON data only (icon/illustration manifests + binaries), ajv-validated      | [AGENTS.md](packages/design-assets/AGENTS.md)    |
| `packages/tokens-pd/`        | `@acronis-platform/tokens-pd`           | **yes**    | Generated (committed) CSS + Tailwind presets + DTCG, built by the tool      | [AGENTS.md](packages/tokens-pd/AGENTS.md)        |
| `tools/style-dictionary/`    | `@acronis-platform/style-dictionary`    | no         | Style Dictionary v5 build: design-tokens → tokens-pd CSS/presets            | [AGENTS.md](tools/style-dictionary/AGENTS.md)    |
| `tools/figma-icons-fetcher/` | `@acronis-platform/figma-icons-fetcher` | no         | Fetches + SVGO-optimizes icons from Figma into `icons-svg` (tsx, Vitest)    | [AGENTS.md](tools/figma-icons-fetcher/AGENTS.md) |

`packages/` holds the published workspaces:

- `packages/ui-legacy/` — the published shadcn-based UI library.
- `packages/ui-react/` houses the published next-generation **Base UI**
  library (`@base-ui/react` as a direct dep), themed by
  `@acronis-platform/tokens-pd`. New component work goes here.
- `packages/icons-react/` — published React icon components, **generated**
  from `@acronis-platform/design-assets` (24px masters + scale/stroke rules
  baked into a `size` prop). Per-pack subpath exports, tree-shakeable.
- `packages/icons-svg/` — **private, source-only** raw SVG icon sources
  (monocolor + multicolor) fetched from Figma, plus per-page JSON manifests.
  No build; consumed in-repo from `src/`. Synced via its `pull-icons` script
  (which runs `tools/figma-icons-fetcher`) or the `Fetch Figma Icons` workflow.
- `packages/icons-svg-next/` — sibling of `icons-svg` for the **next-gen** icon
  set: same private, source-only model, but pulled from the `shadcn-uikit` Figma
  file with the fetcher's `new-frames` selection strategy. Synced via its
  `pull-icons` script or the `Fetch Figma Icons (next)` workflow.
- `packages/icons-sprite/` — published SVG sprites (combined / monocolor /
  multicolor) **generated and committed** from `icons-svg` (same model as
  `tokens-pd`). Its `build` runs `scripts/generate-sprite.ts`; re-run it after
  an icons-svg sync. Monocolor symbols are `currentColor`-themable.
- `packages/design-tokens/` and `packages/design-assets/` — the published
  **design-data** packages. These ship JSON (and, for assets, bundled
  binaries) only: no build step, no runtime API. Their one real script
  is `validate` (ajv); `build`/`dev`/`clean`/`lint`/`typecheck` are
  no-ops and `test` aliases `validate`.
- `packages/tokens-pd` ships the consumable token artifacts (per-brand CSS,
  per-component CSS, Tailwind presets, DTCG). It has **no build logic of its own**
  — its `build` delegates to `tools/style-dictionary`, which writes the generated
  (and committed) output into the package.

`tools/` holds private (unpublished) build tooling:

- `tools/style-dictionary/` — a Style Dictionary v5 translation pipeline
  that builds `@acronis-platform/design-tokens` into per-brand CSS custom
  properties. Its real script is `build`; output lands in a gitignored
  `dist/`.
- `tools/figma-icons-fetcher/` — fetches SVG icons from a Figma file,
  SVGO-optimizes them, and writes them (with JSON manifests + mono/multicolor
  categorization) into `packages/icons-svg` and `packages/icons-svg-next`. Node
  selection is pluggable (`frames-by-name` / `new-frames`). Run via `tsx` (no
  build step); drives the `Fetch Figma Icons` workflows and each package's
  `pull-icons` script.

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
no-ops because the package is consumed via source-file exports. Tools
follow the same vocabulary too: `tools/style-dictionary`'s real work is
`build` (with `test`/`test:watch` running vitest); only `dev` is a no-op.

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
- `context/roadmap.md` — product roadmap (epics, phases, v1 scope/timeline);
  tracked on GitHub Project #3 as issues #102–108. Companion task breakdowns:
  `context/backlog-p2-primitives.md`, `context/backlog-p3-p4.md`.
- `context/project-board.md` — how we run Project #3: epic/task model, status
  lifecycle + gates, fields, views, and automation.
- `packages/ui-spec/context/component-specs-proposal.md` — **Proposed**
  (not yet adopted):
  framework-agnostic component specs + a machine-readable design grammar, to
  support future non-React implementations and agent tooling.

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
