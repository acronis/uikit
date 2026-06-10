# @acronis-platform/figma-icons-fetcher

Private build tool. Fetches SVG icons from a Figma file, optimizes them with
SVGO, and writes them — with optional JSON manifests and mono/multicolor
categorization — into a target package.

It is the engine behind `packages/icons-svg`'s `pull-icons` script and the
`Fetch Figma Icons` GitHub Action. Not published to npm.

## Usage

The tool reads its configuration from `FIGMA_FETCHER_*` environment variables
(via `.env`, `.env.local`, then `process.env`). See
[`.env.local.example`](./.env.local.example) for the full list.

### As a workspace dependency (the normal path)

`packages/icons-svg` runs the tool from its own directory so that relative
output paths (`./src/svg`, …) and `.env.local` resolve there:

```bash
pnpm --filter @acronis-platform/icons-svg pull-icons
```

### Standalone

```bash
# from this workspace, with a local .env.local
pnpm --filter @acronis-platform/figma-icons-fetcher fetch-icons
```

### Programmatically

```ts
import { fetchIcons } from '@acronis-platform/figma-icons-fetcher';

await fetchIcons({
  token: '…',
  fileKey: '…',
  pageNames: ['Icons'],
  frameNames: ['16px', '24px'],
  outputDir: './icons',
});
```

## Configuration

| Variable                            | Required | Default            | Description                                         |
| ----------------------------------- | -------- | ------------------ | --------------------------------------------------- |
| `FIGMA_FETCHER_FIGMA_TOKEN`         | yes      | —                  | Figma personal access token                         |
| `FIGMA_FETCHER_FILE_KEY`            | yes      | —                  | Figma file key from the file URL                    |
| `FIGMA_FETCHER_PAGE_NAMES`          | yes      | —                  | Comma-separated page names containing icons         |
| `FIGMA_FETCHER_SELECTION_STRATEGY`  | no       | `frames-by-name`   | How icons are picked (see below)                    |
| `FIGMA_FETCHER_FRAME_NAMES`         | _maybe_  | —                  | Comma-separated frame names (`frames-by-name` only) |
| `FIGMA_FETCHER_SKIP_MISSING_IMAGES` | no       | `false`            | Skip (vs. fail on) icons Figma can't render         |
| `FIGMA_FETCHER_OUTPUT_DIR`          | no       | `./icons`          | Primary output directory                            |
| `FIGMA_FETCHER_OUTPUT_DIRS`         | no       | `[]`               | Additional output directories (comma-sep)           |
| `FIGMA_FETCHER_GENERATE_MANIFESTS`  | no       | `false`            | Write per-page + combined JSON manifests            |
| `FIGMA_FETCHER_MANIFEST_DIR`        | no       | `./manifests`      | Manifest output directory                           |
| `FIGMA_FETCHER_CATEGORIZE_BY_COLOR` | no       | `false`            | Split icons into mono/multicolor dirs               |
| `FIGMA_FETCHER_MONOCOLOR_DIR`       | no       | `monocolor-icons`  | Monocolor output directory                          |
| `FIGMA_FETCHER_MULTICOLOR_DIR`      | no       | `multicolor-icons` | Multicolor output directory                         |
| `FIGMA_FETCHER_CLASS_NAME`          | no       | _(none)_           | CSS class added to the SVG root                     |
| `FIGMA_FETCHER_SYSTEM_COLOR`        | no       | `#181818`          | Hex color replaced with `currentColor`              |

## Selection strategies

`FIGMA_FETCHER_SELECTION_STRATEGY` decides _which_ nodes inside the target
pages become icons. The two-call Figma fetch (file structure → page nodes) is
the same for both; only the node-selection step differs. Strategies live in
`src/strategies/`.

- **`frames-by-name`** (default) — within each page, take the frames whose name
  is in `FIGMA_FETCHER_FRAME_NAMES` (e.g. `16px,24px,32px`) and collect every
  `COMPONENT` node nested under them. Components named `_*` are skipped. The
  page name is used for manifest grouping. This is what `packages/icons-svg`
  uses.

- **`new-frames`** — the page's top-level frames are treated as **categories**
  (used for manifest grouping). Within each category, every frame badged with a
  `New` text label (the green redesign frames) is found, and the icon leaves
  inside it are collected — i.e. `FRAME`/`INSTANCE`/`COMPONENT` nodes, skipping
  grids (`_*`), placeholders (`?`), and auto-named layout wrappers (`Frame 12`).
  `FIGMA_FETCHER_FRAME_NAMES` is ignored. This is what
  `packages/icons-svg-next` uses.

## Sync behavior

- `outputDir` (and any `outputDirs`) are **fully replaced** with the current
  set of icons from Figma — a clean sync.
- `monocolor-icons/` and `multicolor-icons/` are **never cleaned**; only icons
  that are new since the last sync are added. This preserves legacy icons that
  were removed from Figma but are still referenced in consuming code.

## Scripts

| Script        | What it does                        |
| ------------- | ----------------------------------- |
| `fetch-icons` | Runs the fetch (`tsx src/index.ts`) |
| `test`        | Unit specs (`vitest run`)           |
| `lint`        | ESLint                              |
| `typecheck`   | `tsc --noEmit`                      |

`build`/`dev`/`clean` are no-ops — this is a runtime tool, not a compiled
artifact.
