// .claude/skills/figma-to-design-tokens/helpers/diff-tiers-reader.mjs
// Reads all three tier files and builds lookup indexes keyed by Figma IDs.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const TIERS_DIR = fileURLToPath(new URL('../../../../packages/design-tokens/tiers/', import.meta.url));

const TIER_FILES = {
  primitives: `${TIERS_DIR}primitives.json`,
  semantics:  `${TIERS_DIR}semantics.json`,
  components: `${TIERS_DIR}components.json`,
};

export class TiersReader {
  // Map<variableId, {tier, path, token}>
  #variableIndex = new Map();
  // Map<styleId, {tier, path, token}>
  #styleIndex = new Map();
  // Raw tier objects keyed by tier name.
  #tiers = {};

  constructor() {}

  load() {
    for (const [tier, filePath] of Object.entries(TIER_FILES)) {
      if (!fs.existsSync(filePath)) continue;
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      this.#tiers[tier] = raw;
      this.#indexTree(raw, tier);
    }
    return this;
  }

  get variableIndex() { return this.#variableIndex; }
  get styleIndex()    { return this.#styleIndex; }
  get tiers()         { return this.#tiers; }

  #indexTree(node, tier) {
    // Tiers use both $value (components) and `values` (primitives/semantics)
    // as leaf indicators, so we cannot rely on DtcgWalker which only matches
    // nodes with `$value`. Use a tier-aware recursive walk instead.
    for (const { path, leaf } of TiersReader.#walkTier(node)) {
      const ext = leaf.$extensions ?? {};
      const variableId = ext['com.figma.variableId'];
      const styleId    = ext['com.figma.styleId'];
      if (variableId) this.#variableIndex.set(variableId, { tier, path, leaf });
      if (styleId)    this.#styleIndex.set(styleId, { tier, path, leaf });
    }
  }

  // A tier leaf is any node that has a com.figma.variableId or styleId in
  // $extensions. This covers all three tier formats:
  //   - primitives: { values, platforms, $extensions }
  //   - semantics:  { values, platforms, $extensions }
  //   - components: { $value, $type, $extensions }
  static *#walkTier(node, path = []) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    const ext = node.$extensions;
    if (ext && (ext['com.figma.variableId'] || ext['com.figma.styleId'])) {
      yield { path, leaf: node };
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      yield* TiersReader.#walkTier(v, [...path, k]);
    }
  }
}
