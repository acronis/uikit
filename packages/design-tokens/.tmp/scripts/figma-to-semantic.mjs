#!/usr/bin/env node
// Convert the Figma DTCG export into tiers/semantic.json — semantic colors
// that alias palette primitives, plus a semantic typography subtree derived
// from figma/styles-text.json that aliases typography primitives.
//
// Usage: node .tmp/scripts/figma-to-semantic.mjs [export-file]
//   export-file defaults to ./figma/variables.tokens.json
//   (the path produced by figma-console MCP's figma_export_tokens).
//
// The output has no outer "semantic" wrapper — just `colors.{background,text,
// glyph,border}` and `typography.{headings,body,link,caption,note,fineprint}`.
// Every variable-backed color leaf carries `$extensions.com.figma.variableId`.
// The four AI paint-style leaves under `colors.background.ai` carry
// `$extensions.com.figma.styleId` instead, as do all typography leaves.
// Downstream tooling can discriminate by which key is present.
//
// Depends on tiers/primitives.json being current — palette VariableID lookup
// validates that every Figma alias target maps to a real token in our tree,
// and typography primitives (font-family, font-size, font-weight, line-height,
// letter-spacing) feed the value→alias map for the typography subtree.
//
// Input  (figma/variables.tokens.json):
//   brand.color.background.surface.primary
//     → { $type: "color", $value: "{Base}",
//          $extensions["figma-console-mcp"].variableId: "VariableID:50:1426" }
//   brand.color.background.inverted.primary
//     → { $value: "{__library:VariableID:139:23}", ... }   // orphan ref
//
// Input  (figma/styles-text.json):
//   { name: "body/body-heading", fontName: {family,style}, fontSize, lineHeight,
//     letterSpacing, textCase, textDecoration, id: "S:1e65…" }
//
// Output (tiers/semantic.json):
//   colors.background.surface.primary
//     → { values: { acronis: "{palette.base}" },
//         platforms: ["PD"],
//         $extensions: { com.figma.{scopes,variableId} } }
//   colors.background.inverted.primary
//     → { values: { acronis: "{palette.transparent.inverted.6}" }, platforms: ["PD"], ... }
//   colors.background.ai.idle
//     → { values: { acronis: [{color:{...}, position:0.2}, …] },
//         platforms: ["PD"],
//         $extensions: { com.figma.gradientTransform: [[0,1,0],[-1,0,1]],
//                        com.figma.styleId: "6a29f79..." } }
//   typography.body.heading
//     → { $value: { fontFamily:"{…default}", fontSize:"{…14}", fontWeight:"{…semibold}",
//                   lineHeight:"{…24}", letterSpacing:"{…0-3}" },
//         platforms: ["PD"],
//         $extensions: { com.acronis.textCase:"UPPER", com.figma.styleId:"S:1e65…" } }

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadDtcg, loadMeta } from './lib/paths.mjs';
import { makeMetaFor } from './lib/meta.mjs';
import { round, srgbToHsl } from './lib/color.mjs';
import { mapPaletteParts } from './lib/palette-map.mjs';
import { setPath, collectColorLeaves, sortNode, reorderByList } from './lib/tree.mjs';
import { formatDtcgJson } from './lib/format.mjs';
import { makeTypographyMap, styleToWeight, mapTextStyleName } from './lib/typography-map.mjs';

const TEXT_STYLES_PATH = fileURLToPath(new URL('../../.tmp/figma-tokens/styles-text.json', import.meta.url));

const { path: srcPath, source } = loadDtcg(process.argv);
const figmaBrandColor = source.brand?.semantic?.colors;
if (!figmaBrandColor) throw new Error(`source ${srcPath} has no brand.semantic.colors subtree.`);

const OUT = fileURLToPath(new URL('../../tiers/semantic.json', import.meta.url));
const PRIMITIVES = fileURLToPath(new URL('../../tiers/primitives.json', import.meta.url));
const primitives = JSON.parse(fs.readFileSync(PRIMITIVES, 'utf8'));
const metaFor = makeMetaFor(loadMeta());

// ---------- palette lookup ----------
// Figma path like "Blue.Blue-3" → our path "blue.3". Single-element (e.g.
// "Base") just lowercases; multi-element shares the canonical mapper.
function translatePaletteParts(parts) {
  if (parts.length === 1) return [parts[0].toLowerCase()];
  return mapPaletteParts(parts);
}

// Reverse map: palette VariableID → our path ("palette.transparent.inverted.6").
// Used to resolve `{__library:VariableID:X:Y}` orphan refs that Figma emits
// when a brand var aliases a palette variable not present in the local Mode
// collection (e.g. Transparent/Inverted-6 and -8 come in as orphan refs).
const VARID_TO_PATH = (() => {
  const map = new Map();
  (function walk(node, base) {
    if (!node || typeof node !== 'object') return;
    const variableId = node?.$extensions?.['com.figma.variableId'];
    if (variableId && (base.length === 1 || base.length >= 2)) {
      map.set(variableId, base.join('.'));
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      walk(v, [...base, k]);
    }
  })(primitives.palette, ['palette']);
  return map;
})();

// Translate Figma alias → our alias. Three input shapes:
//   - "{Base}" / "{Blue.Blue-3}"   — local Mode reference (now bare, post-rename)
//   - "{__library:VariableID:X:Y}" — orphan/library ref, resolved via VARID_TO_PATH
function translateAlias(figmaAlias) {
  const orphan = figmaAlias.match(/^\{__library:(VariableID:[^}]+)\}$/);
  if (orphan) {
    const ourPath = VARID_TO_PATH.get(orphan[1]);
    if (!ourPath) throw new Error(`orphan VariableID ${orphan[1]} not found in tiers/primitives.json — refresh primitives first.`);
    return `{${ourPath}}`;
  }
  const m = figmaAlias.match(/^\{([^}]+)\}$/);
  if (!m) throw new Error(`expected palette alias, got ${figmaAlias}`);
  const ourParts = translatePaletteParts(m[1].split('.'));
  return `{palette.${ourParts.join('.')}}`;
}

// Validate the our-path actually exists in tiers/primitives.json.
function paletteHas(ourPath) {
  let cur = primitives.palette;
  for (const k of ourPath.split('.')) {
    if (!cur || typeof cur !== 'object' || !(k in cur)) return false;
    cur = cur[k];
  }
  return true;
}

const fcExt = leaf => leaf?.$extensions?.['figma-console-mcp'] ?? {};
const normalizeKey = k => k.replace(/\s+/g, '-');
// Mode keys come from Figma as title-case ("Acronis", "Brand B"). Lower-case
// and hyphenate so they're kebab-stable in our output.
const normalizeMode = m => m.toLowerCase().replace(/\s+/g, '-');

// ---------- build output ----------
const out = {
  $schema: '../schemas/tokens.schema.json',
  colors: { $type: 'color' },
};

// 1. Variable-backed semantic colors from the DTCG export.
// Mode iteration is data-driven: every brand mode that appears in
// lastSyncedValue is emitted (today: Acronis; soon: Brand B and more).
let count = 0;
const aliasErrors = [];
for (const { path, leaf } of collectColorLeaves(figmaBrandColor)) {
  const variableId = fcExt(leaf).variableId;
  const lastSynced = fcExt(leaf).lastSyncedValue ?? {};
  if (Object.keys(lastSynced).length === 0) {
    aliasErrors.push(`no lastSyncedValue modes at ${path.join('.')}`);
    continue;
  }
  const values = {};
  for (const [figmaModeKey, modeData] of Object.entries(lastSynced)) {
    if (!('reference' in modeData)) {
      aliasErrors.push(`${path.join('.')} mode ${figmaModeKey}: expected reference, got ${JSON.stringify(modeData)}`);
      continue;
    }
    const ourAlias = translateAlias(modeData.reference);
    const targetPath = ourAlias.slice(1, -1).split('.').slice(1).join('.');
    if (!paletteHas(targetPath)) aliasErrors.push(`unknown palette target: ${ourAlias} (from ${path.join('.')} mode ${figmaModeKey})`);
    values[normalizeMode(figmaModeKey)] = ourAlias;
  }
  const meta = metaFor(variableId);
  const ourKey = path.map(normalizeKey);
  const ext = {
    'com.figma.scopes': meta.scopes,
    'com.figma.variableId': variableId,
  };
  if (meta.hidden) ext['com.figma.hiddenFromPublishing'] = true;
  setPath(out.colors, ourKey, { values, platforms: ['PD'], $extensions: ext });
  count++;
}

// 2. AI paint-style gradients — four Figma fill styles outside the variable
// system. Each is a linear gradient pulled from Figma via console MCP
// (figma_execute → getLocalPaintStylesAsync, paints[0].gradientStops +
// gradientTransform). They live alongside the variable-backed entries under
// colors.background.ai.
//
// DTCG `gradient` $type takes an array of {color, position} stops. The spec
// has no field for direction, so we keep the Figma gradientTransform in
// $extensions.com.figma.gradientTransform for round-trip (rendering tools can
// derive the angle from it).
const toDtcgStop = s => {
  const stop = { color: { colorSpace: 'hsl', components: srgbToHsl([s.r, s.g, s.b]) }, position: round(s.position, 2) };
  if (s.a !== undefined && s.a < 1) stop.color.alpha = round(s.a, 4);
  return stop;
};
const AI_GRADIENT_TRANSFORM = [[0, 1, 0], [-1, 0, 1]]; // Figma returns ~6.12e-17 in place of 0 due to float math; we round to clean ints.
const AI_GRADIENTS = [
  { key: 'idle',     styleId: '6a29f79edcb949dfddc3c57804e23ca90e2e3158', stops: [{ r: 0.2196, g: 0.2863, b: 0.8784, a: 1, position: 0.2 }, { r: 0.9882, g: 0.1765, b: 0.9451, a: 1, position: 1 }] },
  { key: 'hover',    styleId: 'd75824f59afe59907a78feb5c44bcf9d89e32d8d', stops: [{ r: 0.2196, g: 0.2863, b: 0.8784, a: 1, position: 0.2 }, { r: 0.9882, g: 0.1765, b: 0.9451, a: 1, position: 1 }] },
  { key: 'active',   styleId: 'd3600bd86ce03979f095d043a02a4325e201c3c5', stops: [{ r: 0.2196, g: 0.2863, b: 0.8784, a: 1, position: 0.2 }, { r: 0.9882, g: 0.1765, b: 0.9451, a: 1, position: 1 }] },
  { key: 'disabled', styleId: 'ff3aef1c0377478a63ccaa33539cec575af8b8c5', stops: [{ r: 0.8588, g: 0.8745, b: 0.8980, a: 1, position: 0.2 }, { r: 0.8328, g: 0.8604, b: 0.9003, a: 1, position: 1 }] },
];
if (!out.colors.background) out.colors.background = {};
out.colors.background.ai = { $type: 'gradient' };
for (const { key, styleId, stops } of AI_GRADIENTS) {
  // Paint styles in Figma have no mode dimension, so values is single-keyed
  // under `acronis` (the brand mode every semantic carries today).
  out.colors.background.ai[key] = {
    values: { acronis: stops.map(toDtcgStop) },
    platforms: ['PD'],
    $extensions: {
      'com.figma.gradientTransform': AI_GRADIENT_TRANSFORM,
      'com.figma.styleId': styleId,
    },
  };
}

if (aliasErrors.length) {
  console.error('Alias errors:');
  for (const e of aliasErrors) console.error('  -', e);
  process.exit(1);
}

// 3. Typography from figma/styles-text.json — DTCG composite tokens, each leaf
// aliasing typography primitives. Single-value (no mode dimension): the
// composite goes on $value directly, not wrapped in com.acronis.modes.
// Non-DTCG fields (textCase, textDecoration) are preserved under com.acronis.*.
const textStyles = JSON.parse(fs.readFileSync(TEXT_STYLES_PATH, 'utf8')).styles ?? [];
const typoMap = makeTypographyMap(primitives);
const rawValueWarnings = [];

function aliasOrThrow(alias, field, value, styleName) {
  if (alias !== null) return alias;
  throw new Error(`text style "${styleName}": no primitive for ${field}=${JSON.stringify(value)} — extend primitives.json`);
}

function aliasOrInline(alias, px, field, styleName) {
  if (alias !== null) return alias;
  rawValueWarnings.push(`${styleName}: ${field} ${px}px has no matching primitive — inlined raw dimension`);
  return { unit: 'px', value: px };
}

out.typography = { $type: 'typography' };
let typoCount = 0;
for (const style of textStyles) {
  // Filter out _library/* placeholders — Figma keeps them in the file but
  // they're not part of the semantic typography surface.
  if (style.name.startsWith('_library/')) continue;
  const ourPath = mapTextStyleName(style.name);
  const family = style.fontName?.family;
  const weight = styleToWeight(style.fontName?.style);
  if (style.lineHeight?.unit !== 'PIXELS') throw new Error(`text style "${style.name}" lineHeight unit ${style.lineHeight?.unit} not supported — only PIXELS`);
  // 0 in any unit collapses to 0 px — matches the normalization in
  // figma-to-primitives.mjs (PERCENT shows up on the 2 link styles).
  if (style.letterSpacing.value !== 0 && style.letterSpacing.unit !== 'PIXELS') {
    throw new Error(`text style "${style.name}" non-zero letterSpacing unit ${style.letterSpacing.unit} not supported — only PIXELS`);
  }
  const fontSize = style.fontSize;
  const lineHeight = round(style.lineHeight.value, 4);
  const letterSpacing = style.letterSpacing.value === 0 ? 0 : round(style.letterSpacing.value, 4);

  const composite = {
    fontFamily: aliasOrThrow(typoMap.fontFamily(family), 'fontFamily', family, style.name),
    fontSize: aliasOrInline(typoMap.fontSize(fontSize), fontSize, 'fontSize', style.name),
    fontWeight: aliasOrThrow(typoMap.fontWeight(weight), 'fontWeight', weight, style.name),
    lineHeight: aliasOrInline(typoMap.lineHeight(lineHeight), lineHeight, 'lineHeight', style.name),
    letterSpacing: aliasOrThrow(typoMap.letterSpacing(letterSpacing), 'letterSpacing', letterSpacing, style.name),
  };

  const ext = {};
  if (style.textCase && style.textCase !== 'ORIGINAL') ext['com.acronis.textCase'] = style.textCase;
  if (style.textDecoration && style.textDecoration !== 'NONE') ext['com.acronis.textDecoration'] = style.textDecoration;
  ext['com.figma.styleId'] = style.id;

  setPath(out.typography, ourPath, { $value: composite, platforms: ['PD'], $extensions: ext });
  typoCount++;
}

if (rawValueWarnings.length) {
  console.warn('Typography primitive gaps (raw dimensions inlined):');
  for (const w of rawValueWarnings) console.warn('  -', w);
}

// ---------- sort + reorder ----------
const sorted = sortNode(out);
sorted.colors = reorderByList(sorted.colors, ['$type', 'background', 'border', 'glyph', 'text']);
if (sorted.colors.background) sorted.colors.background = reorderByList(sorted.colors.background, ['surface', 'brand', 'overlay', 'status', 'status-inverted', 'inverted']);
if (sorted.colors.background?.ai) sorted.colors.background.ai = reorderByList(sorted.colors.background.ai, ['$type', 'idle', 'hover', 'active', 'disabled']);
if (sorted.colors.border) sorted.colors.border = reorderByList(sorted.colors.border, ['on-surface', 'on-brand', 'on-status']);
for (const role of ['glyph', 'text']) {
  if (sorted.colors[role]) sorted.colors[role] = reorderByList(sorted.colors[role], ['on-surface', 'on-brand', 'on-overlay', 'on-status', 'on-inverted']);
}
sorted.typography = reorderByList(sorted.typography, ['$type', 'headings', 'body', 'link', 'caption', 'note', 'fineprint']);
if (sorted.typography.headings) sorted.typography.headings = reorderByList(sorted.typography.headings, ['display', 'title', 'lead']);
if (sorted.typography.body)     sorted.typography.body     = reorderByList(sorted.typography.body,     ['default', 'strong', 'strong-underlined', 'heading', 'accent']);
if (sorted.typography.link)     sorted.typography.link     = reorderByList(sorted.typography.link,     ['primary', 'secondary']);
if (sorted.typography.caption)  sorted.typography.caption  = reorderByList(sorted.typography.caption,  ['default', 'strong', 'accent']);
if (sorted.typography.note)     sorted.typography.note     = reorderByList(sorted.typography.note,     ['default', 'heading']);
const root = reorderByList(sorted, ['$schema', 'colors', 'typography']);

fs.writeFileSync(OUT, formatDtcgJson(root) + '\n');

console.log(`Wrote ${OUT}: ${count + AI_GRADIENTS.length + typoCount} leaves (${count} variable-backed colors + ${AI_GRADIENTS.length} paint-style gradient + ${typoCount} typography)`);
