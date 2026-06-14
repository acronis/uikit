// .claude/skills/figma-to-design-tokens/helpers/pull-snapshot-builder.mjs
// Merges all Figma pull outputs into one clean normalized figma-snapshot.json.
// Responsibilities:
//   - Walk DTCG variable tree via DtcgWalker
//   - Merge meta sidecar fields (scopes, hidden) inline per leaf
//   - Drop MCP-transport figma-console-mcp extension key
//   - Normalize Figma hex colors to canonical DTCG HSL (ColorNormalizer)
//   - Pass styles through verbatim
//   - Write output to snapshot/figma-snapshot.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DtcgWalker } from './utils-dtcg-walker.mjs';
import { ColorNormalizer } from './normalize-colors.mjs';

const SNAPSHOT_DIR = fileURLToPath(
  new URL('../snapshot/', import.meta.url),
);
const SNAPSHOT_PATH = path.join(SNAPSHOT_DIR, 'figma-snapshot.json');

export class SnapshotBuilder {
  #loader;

  constructor(loader) {
    this.#loader = loader;
  }

  // Build and return the normalized snapshot object (does not write to disk).
  build() {
    const variables = ColorNormalizer.normalize(this.#normalizeVariables());
    const styles = { ...this.#loader.styles };
    return { variables, styles };
  }

  // Build and write snapshot/figma-snapshot.json. Returns the snapshot object.
  buildAndWrite() {
    const snapshot = this.build();
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n');
    return snapshot;
  }

  get outputPath() { return SNAPSHOT_PATH; }

  #normalizeVariables() {
    const source = this.#loader.variables;
    const meta = this.#loader.meta;
    // Deep-clone the tree so we mutate a fresh copy.
    const tree = JSON.parse(JSON.stringify(source));

    for (const { path: leafPath, leaf } of DtcgWalker.walk(tree)) {
      const fcExt = leaf.$extensions?.['figma-console-mcp'] ?? {};
      const variableId = fcExt.variableId;
      if (!variableId) continue; // style-derived or non-variable node

      const metaEntry = meta[variableId];
      if (!metaEntry) {
        throw new Error(
          `No metadata for ${variableId} at path ${leafPath.join('.')}\n` +
          `Re-pull variables-meta.json so every VariableID has a meta entry.`,
        );
      }

      // Extract multi-mode values from lastSyncedValue.
      const modes = {};
      for (const [modeKey, modeData] of Object.entries(fcExt.lastSyncedValue ?? {})) {
        if ('literal' in modeData) modes[modeKey] = modeData.literal;
        else if ('reference' in modeData) modes[modeKey] = modeData.reference;
      }
      // Also include the raw modes shorthand if present.
      if (leaf.$extensions?.modes) {
        for (const [k, v] of Object.entries(leaf.$extensions.modes)) {
          if (!(k in modes)) modes[k] = v;
        }
      }

      // Build clean $extensions — com.figma.* namespace only.
      const cleanExt = {
        'com.figma.variableId': variableId,
        'com.figma.scopes': metaEntry.scopes ?? [],
      };
      if (metaEntry.hidden) cleanExt['com.figma.hiddenFromPublishing'] = true;
      if (Object.keys(modes).length > 0) cleanExt.modes = modes;

      leaf.$extensions = cleanExt;
    }

    return tree;
  }
}
