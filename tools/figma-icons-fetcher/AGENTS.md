# AGENTS.md — `tools/figma-icons-fetcher`

`@acronis-platform/figma-icons-fetcher` — a **private** (unpublished) build tool
that fetches SVG icons from a Figma file, optimizes them with SVGO, and writes
them (plus optional JSON manifests and mono/multicolor categorization) into a
target package. It is the engine behind `packages/icons-svg`'s `pull-icons`
script and the `Fetch Figma Icons` GitHub Action.

Repo-wide rules (TypeScript, kebab-case filenames, Conventional Commits) live in
the repo root's [`../../context/`](../../context/) and apply on top. This file
documents only what is specific to this workspace.

## How it runs

The tool is **never built** — it executes its TypeScript directly through `tsx`.
`src/index.ts` is the entry point; it auto-runs `fetchIcons()` when invoked
directly. Consumers invoke it from **their own directory** so that relative
output paths and `.env.local` resolve against the consumer, e.g.:

```bash
pnpm --filter @acronis-platform/icons-svg pull-icons
# → tsx ../../tools/figma-icons-fetcher/src/index.ts  (cwd = packages/icons-svg)
```

## Configuration

All config comes from `FIGMA_FETCHER_*` environment variables, merged in this
order (later wins): `.env` → `.env.local` → `process.env`. In CI there is no
`.env.local`, so the workflow passes every value via `env:` (token from the
`FIGMA_ACCESS_TOKEN` secret). See [`.env.local.example`](./.env.local.example)
and [`README.md`](./README.md) for the full table.

## Pipeline (src/)

`fetch-icons.ts` orchestrates the run:

1. `get-figma-icons.ts` — two Figma API calls (file structure → page nodes),
   then delegates node selection to a **strategy** in `strategies/` (chosen by
   `FIGMA_FETCHER_SELECTION_STRATEGY`), formats names (`helpers.formatName`),
   de-duplicates. Strategies are pure (no network/fs):
   - `frames-by-name` (default) — `COMPONENT` nodes under name-matched frames.
   - `new-frames` — icon leaves inside green `New`-badged frames, grouped by the
     page's top-level category frames. See `README.md` → "Selection strategies".
2. `get-figma-images.ts` — resolves SVG render URLs (batched 200/req).
3. `download-chunks.ts` → `download-image.ts` — downloads + SVGO-optimizes each
   icon (viewBox kept, IDs prefixed, system color → `currentColor`), writes to
   `outputDir` (+ extra dirs).
4. `save-new-icons-to-categories.ts` — copies only **new** icons into the
   mono/multicolor dirs (those dirs are never cleaned).
5. `generate-manifests.ts` — per-page + combined `icons.json`.

`figma-client.ts` is a thin typed `fetch` wrapper; `clean-directory.ts` and
`get-existing-icons.ts` are fs helpers.

## Testing

`pnpm --filter @acronis-platform/figma-icons-fetcher test` runs the Vitest unit
specs in `src/__specs__/` (pure helpers + fs helpers; no network). The
`integration.spec.ts` suite is `describe.skipIf`-gated on
`FIGMA_FETCHER_FIGMA_TOKEN` and only runs when a real token is present.
