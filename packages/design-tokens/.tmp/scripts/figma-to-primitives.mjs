#!/usr/bin/env node
// Convert the Figma DTCG export into tiers/primitives.json.
//
// Usage: node .tmp/scripts/figma-to-primitives.mjs [export-file]
//   export-file defaults to ./figma/variables.tokens.json
//   (the path produced by figma-console MCP's figma_export_tokens).
//
// Output: palette (mode-aware HSL, the `theme` collection), `units` wrapping
// gap/size/radius/stroke (the `units` collection), and `font`
// (the `font` collection). Brand collection is handled separately by
// figma-to-semantic.mjs.
//
// This script is also the canonical formatter for tiers/primitives.json: a mixed
// layout that no standard JSON formatter reproduces. `.vscode/settings.json`
// disables format-on-save for JSON in this workspace.
//
// Input  (figma/variables.tokens.json):
//   theme.Blue["Blue-3"]           → { $type: "color", $value: "#D6E4F5",
//                                       $extensions.modes.Dark: "#063679" }
//   units.gap["gap-0"]             → { $type: "dimension", $value: 0 }
//   units.stroke["width-1-6"]      → { $type: "dimension", $value: 1.6 }
//   font["font-family"].default    → { $type: "fontFamily", $value: "Inter" }
//
// Output (tiers/primitives.json):
//   palette.blue["3"]              → { values: {light, dark}, platforms: ["PD"], $extensions: { com.figma.{scopes,variableId} } }
//   units.gap["0"]                 → { platforms: ["PD"], $extensions: { com.acronis.units: {unit:"px", value:0}, com.figma.{scopes,variableId} } }
//   units.stroke["1-6"]            → { platforms: ["PD"], $extensions: { com.acronis.units: {unit:"px", value:1.6}, ... } }
//   font["font-family"].default    → { platforms: ["PD"], $extensions: { com.acronis.units: "Inter", ... } }

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadDtcg, loadMeta } from './lib/paths.mjs';
import { makeMetaFor } from './lib/meta.mjs';
import { round, hexToHslValue } from './lib/color.mjs';
import { mapPaletteParts } from './lib/palette-map.mjs';
import { setPath, collectColorLeaves, sortNode, reorderByList } from './lib/tree.mjs';
import { formatDtcgJson } from './lib/format.mjs';
import { lsSlug } from './lib/typography-map.mjs';

const TEXT_STYLES_PATH = fileURLToPath(new URL('../../.tmp/figma-tokens/styles-text.json', import.meta.url));

const { path: srcPath, source } = loadDtcg(process.argv);
if (!source.theme) throw new Error(`source ${srcPath} has no "theme" key — expected the Theme collection at root.`);
if (!source.units) throw new Error(`source ${srcPath} has no "units" key — expected the Units collection at root.`);
if (!source.font) throw new Error(`source ${srcPath} has no "font" key — expected the Font collection at root.`);

const OUT = fileURLToPath(new URL('../../tiers/primitives.json', import.meta.url));
// Sidecar metadata: variableId → { scopes, hidden, name }. Provides scopes +
// hiddenFromPublishing for every variable, which the DTCG export drops.
const metaFor = makeMetaFor(loadMeta());

const fcExt = leaf => leaf?.$extensions?.['figma-console-mcp'] ?? {};

// Single-element palette paths (e.g. `Base`) just lowercase. Multi-element
// paths delegate to the shared mapper.
function mapPalettePath(parts) {
  if (parts.length === 1) return [parts[0].toLowerCase()];
  return mapPaletteParts(parts);
}

const out = {
  $schema: '../schemas/tokens.schema.json',
  palette: { $type: 'color' },
  font: {
    'font-family': { $type: 'fontFamily' },
    'font-weight': { $type: 'fontWeight' },
    'font-size': { $type: 'dimension' },
    'line-height': { $type: 'dimension' },
    'letter-spacing': {
      $type: 'dimension',
      $description: 'Derived from Figma Text Styles; no source Variable. Refresh by re-pulling figma/styles-text.json.',
    },
  },
  units: { $type: 'dimension' },
};

// ---------- palette ----------
for (const { path: leafPath, leaf } of collectColorLeaves(source.theme)) {
  const ourPath = mapPalettePath(leafPath);
  const lightHex = leaf.$value;
  const darkHex = leaf.$extensions?.modes?.Dark ?? leaf.$value;
  const variableId = fcExt(leaf).variableId;
  const meta = metaFor(variableId);
  const ext = {
    'com.figma.scopes': meta.scopes,
    'com.figma.variableId': variableId,
  };
  if (meta.hidden) ext['com.figma.hiddenFromPublishing'] = true;
  setPath(out, ['palette', ...ourPath], {
    values: { light: hexToHslValue(lightHex), dark: hexToHslValue(darkHex) },
    platforms: ['PD'],
    $extensions: ext,
  });
}

// Orphan palette stops referenced by brand but not present as local Mode
// variables — Figma exposes them via getVariableByIdAsync but not via
// figma_export_tokens. Listed manually so semantic aliases that target them
// (Transparent/Inverted-6 and -8) still resolve. Refresh by hand if the Figma
// source changes.
const ORPHAN_PALETTE = [
  { ourPath: ['transparent', 'inverted', '6'], variableId: 'VariableID:139:23',
    light: { colorSpace: 'hsl', components: [0, 0, 100], alpha: 0.4 },
    dark:  { colorSpace: 'hsl', components: [0, 0,   0], alpha: 0.4 } },
  { ourPath: ['transparent', 'inverted', '8'], variableId: 'VariableID:139:25',
    light: { colorSpace: 'hsl', components: [0, 0, 100], alpha: 0.2 },
    dark:  { colorSpace: 'hsl', components: [0, 0,   0], alpha: 0.2 } },
];
for (const o of ORPHAN_PALETTE) {
  const meta = metaFor(o.variableId);
  const ext = {
    'com.figma.scopes': meta.scopes,
    'com.figma.variableId': o.variableId,
  };
  if (meta.hidden) ext['com.figma.hiddenFromPublishing'] = true;
  setPath(out, ['palette', ...o.ourPath], {
    values: { light: o.light, dark: o.dark },
    platforms: ['PD'],
    $extensions: ext,
  });
}

// ---------- scalar leaf emitter ----------
// Non-palette primitive leaves carry their value inside
// `$extensions.com.acronis.units` rather than as a top-level `$value`. Modes
// are not applicable here (single-value), so there's no top-level `values` —
// only `platforms` is hoisted to the token level.
function emitScalarLeaves(node, outPath, keyPrefix, dtcgType) {
  if (!node) return;
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (!v || typeof v !== 'object' || !('$value' in v)) continue;
    const variableId = fcExt(v).variableId;
    const meta = metaFor(variableId);
    const localKey = keyPrefix ? k.replace(new RegExp(`^${keyPrefix}-`), '') : k;
    const unitsValue = dtcgType === 'dimension'
      ? { value: round(v.$value, 4), unit: 'px' }
      : v.$value;
    const ext = {
      'com.acronis.units': unitsValue,
      'com.figma.scopes': meta.scopes,
      'com.figma.variableId': variableId,
    };
    if (meta.hidden) ext['com.figma.hiddenFromPublishing'] = true;
    setPath(out, [...outPath, localKey], { platforms: ['PD'], $extensions: ext });
  }
}

// ---------- units ----------
emitScalarLeaves(source.units.gap,    ['units', 'gap'],    'gap',    'dimension');
emitScalarLeaves(source.units.size,   ['units', 'size'],   'size',   'dimension');
emitScalarLeaves(source.units.radius, ['units', 'radius'], 'radius', 'dimension');
emitScalarLeaves(source.units.stroke, ['units', 'stroke'], 'width',  'dimension');

// ---------- font ----------
emitScalarLeaves(source.font['font-family'],  ['font', 'font-family'],  null,           'fontFamily');
emitScalarLeaves(source.font['font-weight'],  ['font', 'font-weight'],  'font-weight',  'fontWeight');
emitScalarLeaves(source.font['font-size'],    ['font', 'font-size'],    'font-size',    'dimension');
emitScalarLeaves(source.font['line-height'],  ['font', 'line-height'],  'line-height',  'dimension');

// ---------- letter-spacing (derived from figma/styles-text.json) ----------
// Letter-spacing is not a Figma Variable — it only lives on Text Styles. Scan
// the snapshot for distinct values and emit them as dimension primitives so
// semantic typography can alias them via the standard alias chain.
const textStyles = JSON.parse(fs.readFileSync(TEXT_STYLES_PATH, 'utf8')).styles ?? [];
const lsValues = new Set();
for (const s of textStyles) {
  const ls = s.letterSpacing;
  if (!ls) continue;
  // 0 in any unit collapses to 0 px (PERCENT shows up on the 2 link styles —
  // a legacy artefact from their orphan boundVariables; semantically still 0).
  if (ls.value === 0) { lsValues.add(0); continue; }
  if (ls.unit !== 'PIXELS') throw new Error(`text style "${s.name}" non-zero letterSpacing unit ${ls.unit} not supported — only PIXELS`);
  lsValues.add(round(ls.value, 4));
}
for (const px of [...lsValues].sort((a, b) => a - b)) {
  setPath(out, ['font', 'letter-spacing', lsSlug(px)], {
    platforms: ['PD'],
    $extensions: { 'com.acronis.units': { unit: 'px', value: px } },
  });
}

// ---------- sort + reorder ----------
const sorted = sortNode(out);
const PALETTE_ORDER = ['$type', 'base', 'grayscale', 'blue', 'teal', 'green', 'yellow', 'orange', 'red', 'violet', 'transparent'];
sorted.palette = reorderByList(sorted.palette, PALETTE_ORDER);
sorted.units = reorderByList(sorted.units, ['$type', 'gap', 'size', 'radius', 'stroke']);
sorted.font['font-weight'] = reorderByList(sorted.font['font-weight'], ['$type', 'regular', 'medium', 'semibold', 'bold']);
// letter-spacing keys mix integer-like ("0", "1") with non-integer ("0-3") —
// V8 always iterates integer-like keys first in numeric order, so the output
// order is "0", "1", "0-3" regardless of how we sort. Stable across runs.
const ROOT_ORDER = ['$schema', 'palette', 'units', 'font'];
const root = reorderByList(sorted, ROOT_ORDER);

fs.writeFileSync(OUT, formatDtcgJson(root) + '\n');

const counts = {
  palette: Object.keys(root.palette).filter(k => !k.startsWith('$')).length,
  font: Object.values(root.font).reduce((n, sub) => typeof sub === 'object' ? n + Object.keys(sub).filter(k => !k.startsWith('$')).length : n, 0),
  units: Object.values(root.units).reduce((n, sub) => typeof sub === 'object' ? n + Object.keys(sub).filter(k => !k.startsWith('$')).length : n, 0),
};
console.log(`Wrote ${OUT}:`, counts);
