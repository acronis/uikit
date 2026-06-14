#!/usr/bin/env node
// Post-process step for the Figma sync. Run after the MCP calls that write
// `.tmp/figma-tokens/`. Two jobs:
//
//   1. Rename `tokens.tokens.json` → `variables.tokens.json` if found.
//      `figma_export_tokens` ignores the requested filename when `outputPath`
//      is a directory and always writes `<format>.tokens.json`. Our generators
//      expect `variables.tokens.json`, so we normalize. A fresh export always
//      lands in `tokens.tokens.json`, so when it is present it WINS — we
//      overwrite any existing `variables.tokens.json` (a stale rename from a
//      prior pull) rather than leave the old one shadowing the new export.
//
//   2. Diff the VariableID references in the export against the meta sidecar
//      and report any missing IDs. `figma.variables.getLocalVariablesAsync()`
//      reliably misses a handful of IDs (today: the two palette orphans
//      VariableID:139:23 / :139:25, plus the two `component/sub item/*`
//      IDs added 2026-05-27). Anything left uncovered makes the components
//      generator throw with "no metadata for VariableID:…".
//
// Exits with status 1 if any IDs are missing, after printing a paste-ready
// JS array literal the operator/agent can drop into a `figma_execute` probe
// (loop over `getVariableByIdAsync`) to fill the gap. Re-run after merging
// the probe result into `variables-meta.json` — should exit 0.
//
// Usage: node .tmp/scripts/figma-pull-postprocess.mjs
//   No args. Operates on `figma-to-json-plus/snapshot/` relative to this package.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../../figma-to-json-plus/snapshot/', import.meta.url));
const EXPORT_PATH = path.join(DIR, 'variables.tokens.json');
const ALT_EXPORT_PATH = path.join(DIR, 'tokens.tokens.json');
const META_PATH = path.join(DIR, 'variables-meta.json');

// 1. Normalize export filename. A fresh `tokens.tokens.json` always wins —
// overwrite any stale `variables.tokens.json` left by a prior pull.
if (fs.existsSync(ALT_EXPORT_PATH)) {
  fs.renameSync(ALT_EXPORT_PATH, EXPORT_PATH);
  console.log(`Renamed tokens.tokens.json → variables.tokens.json`);
}

if (!fs.existsSync(EXPORT_PATH)) {
  console.error(`Missing ${EXPORT_PATH} — run figma_export_tokens first.`);
  process.exit(1);
}
if (!fs.existsSync(META_PATH)) {
  console.error(`Missing ${META_PATH} — run figma.variables.getLocalVariablesAsync() and save the result first.`);
  process.exit(1);
}

// 2. Coverage diff: every VariableID in the export must exist in the meta sidecar.
const exportSrc = fs.readFileSync(EXPORT_PATH, 'utf8');
const exportIds = new Set(exportSrc.match(/VariableID:\d+:\d+/g) ?? []);
let meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
// figma_execute returns results wrapped in an MCP envelope {_mcp, success, result}.
// Unwrap automatically and rewrite the file so subsequent runs see clean data.
if (meta._mcp !== undefined && meta.result !== undefined) {
  meta = meta.result;
  fs.writeFileSync(META_PATH, JSON.stringify(meta));
  console.log('Unwrapped MCP envelope from variables-meta.json.');
}
const metaIds = new Set(Object.keys(meta));
const missing = [...exportIds].filter(id => !metaIds.has(id)).sort();

console.log(`Export references ${exportIds.size} variable IDs; meta sidecar has ${metaIds.size} entries.`);

if (missing.length === 0) {
  console.log('Meta coverage: complete.');
  process.exit(0);
}

console.error(`Meta coverage: ${missing.length} missing ID(s).`);
console.error('');
console.error('Probe them with figma_execute, then merge into variables-meta.json:');
console.error('');
console.error('  const ids = ' + JSON.stringify(missing) + ';');
console.error('  const out = {};');
console.error('  for (const id of ids) {');
console.error('    const v = await figma.variables.getVariableByIdAsync(id);');
console.error('    if (v) out[id] = { name: v.name, scopes: v.scopes, hidden: v.hiddenFromPublishing };');
console.error('  }');
console.error('  return out;');
console.error('');
process.exit(1);
