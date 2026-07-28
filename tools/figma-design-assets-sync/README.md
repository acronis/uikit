# figma-design-assets-sync

Private build tool that exports SVG icons from a Figma frame and regenerates a
`packages/design-assets` pack manifest.

## How it works

1. Fetches all `_assetsource/<Name>` INSTANCE nodes from a configured Figma frame.
2. Resolves component descriptions via the Figma `/components` endpoint.
3. Exports SVGs in batch (200/req) and downloads + SVGO-optimizes them.
4. Saves each icon as `packs/<pack>/<PascalName>.svg`.
5. Regenerates `packs/<pack>.json` with parsed `category`, `tags`, and `legacyNames`
   from each component's Figma description field.

## Usage

The tool is invoked from the **consumer package directory** so that relative paths
and `.env.local` resolve correctly:

```bash
pnpm --filter @acronis-platform/design-assets sync
# → tsx ../../tools/figma-design-assets-sync/src/index.ts  (cwd = packages/design-assets)
```

### Diff-gate

The sync writes into `packs/`, then **shows the diff (added / modified / deleted) and reverts
unless you approve it** — so a Figma change never lands silently. It requires `packs/` to be
clean first (commit or stash pending work), because a decline restores `packs/` to `HEAD`.

| Flag           | Behavior                                                              |
| -------------- | --------------------------------------------------------------------- |
| _(none)_       | Interactive: sync, print the diff, prompt `[y/N]`; revert on decline. |
| `--dry-run`    | Preview: sync, print the diff, always revert (nothing persists).      |
| `--yes` / `-y` | Skip the gate and keep the changes (automation / CI).                 |

The gate is disabled automatically when cwd is not a git work tree.

## Configuration

Copy `.env.local.example` to `packages/design-assets/.env.local` and fill in:

| Variable                   | Required | Description                                 |
| -------------------------- | -------- | ------------------------------------------- |
| `FIGMA_SYNC_TOKEN`         | yes      | Figma personal access token                 |
| `FIGMA_SYNC_FILE_KEY`      | yes      | Figma file key from the URL                 |
| `FIGMA_SYNC_FRAME_NODE_ID` | yes      | Node ID of the frame (colon or hyphen form) |
| `FIGMA_SYNC_PACK_NAME`     | no       | Pack name, default `icons-stroke-mono`      |
| `FIGMA_SYNC_PLATFORMS`     | no       | Comma-separated platforms, default `PD`     |

## Figma description format

Each component's description must follow:

```
Categories: Arrows Tags: sort down, direction LegacyNames: arrow-sort-down--16
```

Missing sections produce empty arrays and a warning is printed. Missing descriptions
print a warning per icon but the sync continues.

## Output

- `packs/<pack>/<PascalName>.svg` — SVGO-optimized, `currentColor`-themed SVGs
- `packs/<pack>.json` — updated manifest (pack-level config preserved, assets replaced)
