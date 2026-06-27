# @acronis-platform/figma-token-exporter

A self-hosted **Figma plugin + local receiver** that exports the design
system's variables and styles into `packages/design-tokens/.tmp/figma-tokens/`
— the snapshot the design-tokens sync emitters consume.

It replaces the third-party **figma-console** Desktop Bridge for the bulk token
pull. Reading Figma variables needs the Plugin API (the org isn't on Figma
Enterprise, so the REST Variables API is out), so a plugin must run inside
Figma — this one is ours, with no external MCP server.

## One-time setup

1. **Import the plugin into Figma Desktop** (required — local/dev plugins don't
   run in the browser): _Plugins → Development → Import plugin from manifest…_ →
   select `tools/figma-token-exporter/manifest.json`. It now appears under
   _Plugins → Development → Acronis Token Exporter_.

## Each export

1. **Start the receiver** from the repo:

   ```bash
   pnpm --filter @acronis-platform/figma-token-exporter receive
   ```

   It listens on `http://localhost:3333` and writes into
   `packages/design-tokens/.tmp/figma-tokens/`. Leave it running.

2. **Open the target Figma file** in Figma Desktop and run **Acronis Token
   Exporter**. It reads variables/collections/styles and shows a summary.

3. Click **“Send snapshot to repo.”** The receiver logs the files it wrote.
   You can re-export as many times as you like; Ctrl-C to stop the receiver.

4. Run the repo-side sync from the monorepo root:

   ```bash
   pnpm tokens:sync
   ```

   See
   [`packages/design-tokens/context/figma-sync.md`](../../packages/design-tokens/context/figma-sync.md)
   for the canonical one-way runbook and diff review expectations.

### Changing the port

The receiver port (`3333`) is also declared in `manifest.json` under
`networkAccess.allowedDomains`. To use another port, pass it to the receiver
**and** update the manifest (then re-import the plugin):

```bash
pnpm --filter @acronis-platform/figma-token-exporter receive -- --port 4444
```

## How it works

- `plugin/code.js` (Figma main thread) — extracts variables, collections, and
  text/paint/effect styles, resolves cross-library alias targets via
  `getVariableByIdAsync`, and posts a raw payload to the UI iframe.
- `plugin/ui.html` — POSTs the payload to the receiver (the iframe has `fetch`;
  the plugin sandbox does not).
- `src/receiver.ts` — HTTP listener; on POST, converts and writes the snapshot.
- `src/convert.ts` — a faithful port of figma-console's variable→DTCG
  serialization, so the output is a drop-in for the existing emitters.
- `src/write-snapshot.ts` — writes the five snapshot files + the
  `variables-meta.json` sidecar.

## Troubleshooting

- **Plugin says “Could not reach the receiver.”** Start the receiver first; make
  sure its port matches `manifest.json`.
- **`networkAccess` error in Figma.** The manifest must allow the receiver
  origin (`http://localhost:3333`). Re-import after editing the manifest.
- **A `figma_execute`/Desktop Bridge prompt appears.** That's the _old_
  figma-console flow — it isn't needed anymore; use this plugin instead.
