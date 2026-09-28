# figma-design-assets-sync

Private build tool that exports SVG icons from a set of Figma frames and regenerates
the `packages/design-assets` `icons` pack manifest.

## How it works

The target manifest (`packs/icons.json`) is one pack with four `assetsGroups`:
`solid-mono`, `solid-multi`, `stroke-mono`, `stroke-multi`. Each of those groups
maps 1:1 to a Figma frame under one shared "section" node — sync one section,
update all four groups.

1. Fetches the configured section node and finds its `solid-mono` / `solid-multi`
   / `stroke-mono` / `stroke-multi` child frames.
2. For each frame:
   1. Fetches all `_assetsource/<Name>` INSTANCE nodes.
   2. Resolves component descriptions via the Figma `/components` endpoint.
   3. Exports SVGs in batch (200/req) and downloads + SVGO-optimizes them.
   4. Saves each icon as `packs/icons/<PascalName>.svg` — binaries are **flat**
      and shared by every group, not one directory per group.
   5. Regenerates `packs/icons.json`'s `assetsGroups.<frameName>.assets` with
      parsed `category`, `tags`, and `legacyNames` from each component's Figma
      description field. Everything else in the manifest — the pack root, every
      other group, and this group's own `$values` / `$type` / `$description` —
      is left untouched.
3. Once every group has synced, prunes any `packs/icons/*.svg` no longer
   referenced by **any** group in the manifest (a global, one-time pass — not
   per group, since the binaries directory is shared).

A frame is only synced if the target manifest already declares a matching
`assetsGroups` entry — add the group manually first if you're introducing a
new one.

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

| Variable                     | Required | Description                                                                 |
| ---------------------------- | -------- | --------------------------------------------------------------------------- |
| `FIGMA_SYNC_TOKEN`           | yes      | Figma personal access token                                                 |
| `FIGMA_SYNC_FILE_KEY`        | yes      | Figma file key from the URL                                                 |
| `FIGMA_SYNC_SECTION_NODE_ID` | yes      | Node ID of the section containing the 4 group frames (colon or hyphen form) |
| `FIGMA_SYNC_PACK_NAME`       | no       | Target pack name, default `icons`                                           |
| `FIGMA_SYNC_PLATFORMS`       | no       | Comma-separated platforms, default `PD`                                     |

## Figma description format

Each component's description must follow:

```
Categories: Arrows Tags: sort down, direction LegacyNames: arrow-sort-down--16
```

Missing sections produce empty arrays and a warning is printed. Missing descriptions
print a warning per icon but the sync continues.

## Output

- `packs/icons/<PascalName>.svg` — SVGO-optimized, `currentColor`-themed SVGs,
  shared flat across every group
- `packs/icons.json` — updated manifest (pack root and every group's `$values`
  preserved; only the synced groups' `assets` maps are replaced)
- `reports/stroke-fill-warnings.md` — written by the stroke fill integrity
  check. Lives here (not under the consumer package's `packs/`) because it's
  internal build output, not published package data — gitignored, regenerated
  on every sync.
