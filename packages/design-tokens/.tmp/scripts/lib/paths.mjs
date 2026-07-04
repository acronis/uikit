// .tmp/scripts/lib/paths.mjs
// Resolve and load the two .tmp/figma-tokens/ sidecar files consumed by generators.
//
// Exports:
//   EXPORT_PATH — absolute path to .tmp/figma-tokens/variables.tokens.json (DTCG)
//   META_PATH   — absolute path to .tmp/figma-tokens/variables-meta.json (sidecar)
//   loadDtcg(argv) — reads argv[2] ?? EXPORT_PATH, returns { path, source }
//   loadMeta()     — reads META_PATH, returns the parsed { [id]: meta } map
//
// Example:
//   const { path, source } = loadDtcg(process.argv);
//   const meta = loadMeta();
//   // source.mode.Blue["Blue-3"] → DTCG color leaf
//   // meta["VariableID:99:1932"] → { name, scopes, hidden }

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT_URL = new URL('../../../', import.meta.url);

export const EXPORT_PATH = fileURLToPath(new URL('.tmp/figma-tokens/variables.tokens.json', ROOT_URL));
export const META_PATH = fileURLToPath(new URL('.tmp/figma-tokens/variables-meta.json', ROOT_URL));

export function loadDtcg(argv) {
  const path = argv[2] ?? EXPORT_PATH;
  return { path, source: JSON.parse(fs.readFileSync(path, 'utf8')) };
}

export function loadMeta() {
  return JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
}
