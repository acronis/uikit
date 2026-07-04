#!/usr/bin/env node
// Convert the Figma DTCG export into tiers/components.json — per-component
// tokens that alias semantic colors (and primitive units), inheriting the
// Brand mode dimension from semantics (today: acronis; more brands later).
//
// Usage: node .tmp/scripts/figma-to-components.mjs [export-file]
//   export-file defaults to ./figma/variables.tokens.json
//   (the path produced by figma-console MCP's figma_export_tokens).
//
// Output has no outer "components" wrapper — components are root groups
// (breadcrumb, button, chip, ...). $type lives on each leaf because most
// components mix `color` and `dimension`. Every leaf carries
// `$extensions.com.figma.variableId` (no styleId paths in components).
//
// Depends on tiers/primitives.json AND tiers/semantic.json being current —
// the alias-map validator checks every translated alias target against those
// trees and fails the build on unknown targets.
//
// Mode handling is data-driven: brand mode names come from `lastSyncedValue`
// keys per leaf and are lowercased for our output. Adding a new brand mode in
// Figma flows through unchanged — no edits here.
//
// Raw values: 66 leaves in Figma today hold raw literals instead of aliases
// (button: 61 raw hex; tree: 4; tag: 1). Per the alias-chain rule these are
// gaps in the design system. We inline them (HSL for colors, {value, unit:'px'}
// for dimensions) and warn — same posture as the typography primitive gaps
// in figma-to-semantic.mjs.
//
// Input  (figma/variables.tokens.json):
//   brand.component.breadcrumb.chevron
//     → { $type: "color", $value: "{color.glyph.on surface.neutral}",
//          $extensions["figma-console-mcp"].lastSyncedValue.Acronis.reference }
//   brand.component.button.inverted["background-active"]
//     → { $type: "color", $value: "#244467",
//          $extensions["figma-console-mcp"].lastSyncedValue.Acronis.literal }
//
// Output (tiers/components.json):
//   breadcrumb.chevron
//     → { $type: "color",
//         values: { acronis: "{colors.glyph.on-surface.neutral}" },
//         platforms: ["PD"],
//         $extensions: { com.figma.scopes: [...], com.figma.variableId: "VariableID:..." } }
//   button.inverted["background-active"]
//     → { $type: "color",
//         values: { acronis: { colorSpace: "hsl", components: [...] } },
//         platforms: ["PD"],
//         $extensions: { com.figma.scopes: [...], com.figma.variableId: "VariableID:..." } }

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadDtcg, loadMeta } from './lib/paths.mjs';
import { makeMetaFor } from './lib/meta.mjs';
import { hexToHslValue, round } from './lib/color.mjs';
import { setPath, sortNode, reorderByList } from './lib/tree.mjs';
import { formatDtcgJson } from './lib/format.mjs';
import { makeAliasTranslator } from './lib/alias-map.mjs';

const { path: srcPath, source } = loadDtcg(process.argv);
const figmaComponents = source.brand?.component;
if (!figmaComponents) throw new Error(`source ${srcPath} has no brand.component subtree.`);

const OUT = fileURLToPath(new URL('../../tiers/components.json', import.meta.url));
const PRIMITIVES = fileURLToPath(new URL('../../tiers/primitives.json', import.meta.url));
const SEMANTIC = fileURLToPath(new URL('../../tiers/semantic.json', import.meta.url));
const primitives = JSON.parse(fs.readFileSync(PRIMITIVES, 'utf8'));
const semantic = JSON.parse(fs.readFileSync(SEMANTIC, 'utf8'));

const metaFor = makeMetaFor(loadMeta());
const aliasMap = makeAliasTranslator({ primitives, semantic });

const fcExt = leaf => leaf?.$extensions?.['figma-console-mcp'] ?? {};
const normalizeKey = k => k.replace(/\s+/g, '-');
// Mode keys come from Figma as title-case ("Acronis", "Brand B"). Lower-case
// and hyphenate so they're kebab-stable in our output.
const normalizeMode = m => m.toLowerCase().replace(/\s+/g, '-');

const aliasErrors = [];
const rawValueWarnings = [];

function isLeaf(node) {
  return node && typeof node === 'object' && '$type' in node && '$value' in node;
}

function inlineRawColor(literal, leafPath) {
  rawValueWarnings.push(`${leafPath}: raw ${literal} has no matching semantic — inlined as HSL`);
  return hexToHslValue(literal);
}

function inlineRawDimension(literal, leafPath) {
  rawValueWarnings.push(`${leafPath}: raw ${literal} has no matching primitive — inlined as px`);
  return { value: round(Number(literal), 4), unit: 'px' };
}

function resolveModeValue($type, modeData, leafPath) {
  if ('reference' in modeData) {
    const figmaAlias = modeData.reference;
    const codeAlias = aliasMap.translate(figmaAlias);
    if (!aliasMap.has(codeAlias)) aliasErrors.push(`${leafPath}: unknown alias target ${codeAlias} (from Figma ${figmaAlias})`);
    return codeAlias;
  }
  if ('literal' in modeData) {
    if ($type === 'color') return inlineRawColor(modeData.literal, leafPath);
    if ($type === 'dimension') return inlineRawDimension(modeData.literal, leafPath);
    throw new Error(`${leafPath}: cannot inline literal for $type=${$type}`);
  }
  throw new Error(`${leafPath}: lastSyncedValue mode has neither reference nor literal`);
}

const out = {
  $schema: '../schemas/tokens.schema.json',
};

let count = 0;
(function walk(node, path) {
  if (!node || typeof node !== 'object') return;
  if (isLeaf(node)) {
    const variableId = fcExt(node).variableId;
    const lastSynced = fcExt(node).lastSyncedValue ?? {};
    const leafPath = path.join('.');
    const values = {};
    for (const [figmaModeKey, modeData] of Object.entries(lastSynced)) {
      values[normalizeMode(figmaModeKey)] = resolveModeValue(node.$type, modeData, leafPath);
    }
    const meta = metaFor(variableId);
    const ext = {
      'com.figma.scopes': meta.scopes,
      'com.figma.variableId': variableId,
    };
    if (meta.hidden) ext['com.figma.hiddenFromPublishing'] = true;
    setPath(out, path.map(normalizeKey), { $type: node.$type, values, platforms: ['PD'], $extensions: ext });
    count++;
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    walk(v, [...path, k]);
  }
})(figmaComponents, []);

if (aliasErrors.length) {
  console.error('Alias errors:');
  for (const e of aliasErrors) console.error('  -', e);
  process.exit(1);
}

if (rawValueWarnings.length) {
  console.warn('Component alias gaps (raw values inlined):');
  for (const w of rawValueWarnings) console.warn('  -', w);
}

// Move direct-leaf children of these components into a `_global` sub-group.
// The value is an optional $type filter — `null` moves all direct leaves; a
// string moves only that $type. Tooltip restricts to `dimension` because the
// designer keeps `background` and `label` at tooltip root; every other listed
// component moves all of its direct leaves (dimensions describe geometry, and
// where a direct color leaf exists — tree.border-color — it belongs with the
// component-wide tokens). `_global` sorts to the front via the leading
// underscore.
const GLOBAL_SCOPE = {
  button:  null,
  chip:    null,
  form:    null,
  menubar: null,
  sidebar: null,
  tag:     null,
  tooltip: 'dimension',
  tree:    null,
};
const isLeafNode = v => v && typeof v === 'object' && '$type' in v && '$extensions' in v;
for (const [comp, typeFilter] of Object.entries(GLOBAL_SCOPE)) {
  if (!out[comp]) continue;
  const globals = {};
  for (const [k, v] of Object.entries(out[comp])) {
    if (k.startsWith('$')) continue;
    if (!isLeafNode(v)) continue;
    if (typeFilter && v.$type !== typeFilter) continue;
    globals[k] = v;
    delete out[comp][k];
  }
  if (Object.keys(globals).length > 0) out[comp]._global = globals;
}

// Regroup `<prefix>-<state>` sibling leaves into nested `<prefix>.<state>`
// sub-groups across every component. In Figma the four interaction states are
// flattened into kebab keys (background-idle / background-hover / …); in code
// we split them so consumers can reach `button.primary.background.hover`
// directly. State order is fixed (idle → hover → active → disabled) and
// applied after sortNode below.
const STATE_ORDER = ['idle', 'hover', 'active', 'disabled'];
const STATE_RE = new RegExp(`^(.+)-(${STATE_ORDER.join('|')})$`);
(function regroupStates(node) {
  if (!node || typeof node !== 'object' || isLeafNode(node)) return;
  const groups = new Map();
  for (const k of Object.keys(node)) {
    if (k.startsWith('$')) continue;
    if (!isLeafNode(node[k])) continue;
    const m = k.match(STATE_RE);
    if (!m) continue;
    const [, prefix, state] = m;
    if (!groups.has(prefix)) groups.set(prefix, {});
    groups.get(prefix)[state] = k;
  }
  for (const [prefix, stateMap] of groups) {
    if (prefix in node) throw new Error(`state regroup conflict: '${prefix}' already exists alongside its state variants`);
    const group = {};
    for (const state of STATE_ORDER) {
      if (stateMap[state]) {
        group[state] = node[stateMap[state]];
        delete node[stateMap[state]];
      }
    }
    node[prefix] = group;
  }
  for (const k of Object.keys(node)) {
    if (k.startsWith('$')) continue;
    regroupStates(node[k]);
  }
})(out);

const sorted = sortNode(out);

// sortNode alphabetised the regrouped state keys (active, disabled, hover,
// idle). Walk every state-only group and reorder to STATE_ORDER in place.
(function reorderStates(node) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return;
  const keys = Object.keys(node);
  if (keys.length > 0 && keys.every(k => STATE_ORDER.includes(k))) {
    for (const s of STATE_ORDER) {
      if (s in node) { const v = node[s]; delete node[s]; node[s] = v; }
    }
  }
  for (const k of Object.keys(node)) {
    if (k.startsWith('$')) continue;
    reorderStates(node[k]);
  }
})(sorted);

// Per-component sub-group ordering follows the design-system structure spec
// rather than alphabetical. `_global` already sorts to the front via sortNode
// (leading underscore precedes letters in ASCII) — listing it here is just
// for clarity. Root-level components stay alphabetical (sortNode default).
if (sorted.button)  sorted.button  = reorderByList(sorted.button,  ['_global', 'primary', 'secondary', 'ghost', 'destructive', 'inverted', 'ai']);
if (sorted.form)    sorted.form    = reorderByList(sorted.form,    ['_global', 'input', 'text', 'switch']);
if (sorted.sidebar) sorted.sidebar = reorderByList(sorted.sidebar, ['_global', 'side-bar', 'menu-item']);
if (sorted.menubar) sorted.menubar = reorderByList(sorted.menubar, ['_global', 'side-bar', 'menu-item']);
if (sorted.tree)    sorted.tree    = reorderByList(sorted.tree,    ['_global', 'item', 'title', 'nesting']);

fs.writeFileSync(OUT, formatDtcgJson(sorted) + '\n');
console.log(`Wrote ${OUT}: ${count} leaves (${rawValueWarnings.length} raw-value gaps inlined)`);
