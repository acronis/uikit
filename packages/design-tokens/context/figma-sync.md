# Figma → repo token sync (one-way)

This is the canonical runbook for syncing token changes from Figma into this
repo.

## Scope

- Direction is **one-way**: **Figma → repo**.
- The only manual operation is exporting a fresh snapshot from Figma using
  `tools/figma-token-exporter`.
- Repo-side sync is one command from the monorepo root.

## Steps

1. Export a fresh snapshot to `packages/design-tokens/.tmp/figma-tokens/`
   with the local exporter plugin:

   ```bash
   pnpm --filter @acronis-platform/figma-token-exporter receive
   ```

   Then in Figma Desktop run **Acronis Token Exporter** and click
   **Send snapshot to repo**.

2. Run the post-export sync pipeline:

   ```bash
   pnpm tokens:sync
   ```

   This executes:
   - `pnpm --filter @acronis-platform/design-tokens emit`
   - `pnpm --filter @acronis-platform/tokens-pd build`

3. Review the diff before committing:
   - `packages/design-tokens/tiers/*.json`
   - `packages/tokens-pd/**` outputs

## Extension point

As additional downstream token packages are introduced (for example
`tokens-web`), extend the root `tokens:sync` script so this runbook remains
single-command.
