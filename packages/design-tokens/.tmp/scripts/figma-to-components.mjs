#!/usr/bin/env node
// Convert the Figma DTCG export into tiers/components.json — per-component
// tokens that alias semantic colors/typography and primitive units, inheriting
// the Brand mode dimension from semantics (today: acronis; more brands later).
//
// Usage: node .tmp/scripts/figma-to-components.mjs [export-file]
//   export-file defaults to .tmp/figma-tokens/variables.tokens.json
//   (the path produced by the Figma token export).
//
// Output has no outer "components" wrapper — components are root groups
// (breadcrumb, button, button-icon, …). $type lives on each leaf because most
// components mix `color`, `dimension`, `gradient`, and `typography`. Every leaf
// carries `$extensions.com.figma.variableId` (no styleId paths in components).
//
// Source: the next-gen `brand.components` tier (PascalCase: Button, ButtonIcon,
// MenuItem, SidebarPrimary, …) plus a second pass over the retired
// `brand.componentLegacy` tier (icon, tree) so those `--ui-icon-*`/`--ui-tree-*`
// tokens keep flowing while the legacy components have no next-gen counterpart.
//
// Structure (next-gen): the Figma tree is already nested
// (`<Component>/<variant|_global>/<role>/<property>[/<state>]`), so the emitter
// is a faithful structural pass-through — no flat-key reconstruction. The two
// bounded normalizations (per context/next-gen-components-migration.md §1,
// Option A):
//   1. Case + separator only: PascalCase → kebab (`ButtonIcon` → `button-icon`),
//      camelCase → kebab (`borderRadius` → `border-radius`, `widthMin` →
//      `width-min`). `_global` keeps its leading underscore (sorts to front;
//      stripped later by the Tailwind router). See lib/segment-case.mjs.
//   2. Drop the literal `color` property segment (color-valued tokens only):
//      `Button/ai/container/color/idle` → `button.ai.container.idle`. Compound
//      names like `borderColor` keep their word (→ `border-color`).
//
// Value handling per leaf:
//   - reference whose target resolves to the AI gradient group
//     (`colors.background.ai.*`) → emit as $type:gradient (Figma types these
//     `string`; they alias `{semantics.gradients.ai.*}`, rewritten by alias-map).
//   - `textStyle` string literal → normalized into a `{typography.*}` alias
//     ($type:typography); the literal formats are inconsistent in Figma
//     (`typography.body.strong` / `body.default` / `caption/strong`) and are
//     reconciled by alias-map's translateTextStyle.
//   - color / dimension reference → translated + validated alias.
//   - color / dimension literal → inlined (HSL / px) and warned, as a design-
//     system gap (same posture as figma-to-semantic.mjs).
//   - any other string literal (`borderStyle`, `textDecoration`) → skipped and
//     warned: `string` is not a valid emitted $type (schema enum) and there is
//     no DTCG type for these yet.
//
// Depends on tiers/primitives.json AND tiers/semantic.json being current — the
// alias-map validator checks every translated alias target (colors, typography,
// units, palette) against those trees and fails the build on unknown targets.
//
// Mode handling is data-driven: brand mode names come from `lastSyncedValue`
// keys per leaf and are lowercased for our output. The next-gen tier is
// acronis-only today; adding a brand mode in Figma flows through unchanged.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadDtcg, loadMeta } from './lib/paths.mjs';
import { makeMetaFor } from './lib/meta.mjs';
import { hexToHslValue, round } from './lib/color.mjs';
import { setPath, sortNode, reorderByList } from './lib/tree.mjs';
import { formatDtcgJson } from './lib/format.mjs';
import { makeAliasTranslator } from './lib/alias-map.mjs';
import { kebabSegment } from './lib/segment-case.mjs';

const { path: srcPath, source } = loadDtcg(process.argv);
const figmaComponents = source.brand?.components;
if (!figmaComponents) throw new Error(`source ${srcPath} has no brand.components subtree.`);
// The retired flat tier still carries icon/tree (no next-gen equivalent); a
// second pass keeps their tokens alive. Absence is not an error.
const figmaLegacy = source.brand?.componentLegacy ?? {};

const OUT = fileURLToPath(new URL('../../tiers/components.json', import.meta.url));
const PRIMITIVES = fileURLToPath(new URL('../../tiers/primitives.json', import.meta.url));
const SEMANTIC = fileURLToPath(new URL('../../tiers/semantic.json', import.meta.url));
const primitives = JSON.parse(fs.readFileSync(PRIMITIVES, 'utf8'));
const semantic = JSON.parse(fs.readFileSync(SEMANTIC, 'utf8'));

const metaFor = makeMetaFor(loadMeta());
const aliasMap = makeAliasTranslator({ primitives, semantic });

const fcExt = leaf => leaf?.$extensions?.['figma-console-mcp'] ?? {};
// Mode keys come from Figma as title-case ("Acronis", "Brand B"). Lower-case
// and hyphenate so they're kebab-stable in our output.
const normalizeMode = m => m.toLowerCase().replace(/\s+/g, '-');

// Targets under this alias prefix are the AI gradients (emitted by
// figma-to-semantic.mjs as colors.background.ai.* with $type:gradient).
const isGradientTarget = codeAlias => codeAlias.startsWith('{colors.background.ai.');

const aliasErrors = [];
const rawValueWarnings = [];
const skippedWarnings = [];

function isLeaf(node) {
  return node && typeof node === 'object' && '$type' in node && '$value' in node;
}

// Will this leaf be emitted (vs. skipped)? Mirrors the skip rules in `walk`:
// only `string` leaves carrying a literal that is NOT a `textStyle` are dropped
// (borderStyle/textDecoration). Everything else emits.
function leafEmits(node, lastSeg) {
  if (node.$type !== 'string') return true;
  if (lastSeg === 'textStyle') return true;
  const ls = fcExt(node).lastSyncedValue ?? {};
  // A string leaf with a reference (gradient alias) emits; a string literal does not.
  return !Object.values(ls).some(m => m && 'literal' in m);
}

// Does this subtree contain at least one token that will be emitted? Used to
// decide whether a stateless `color` leaf collides with real siblings.
function subtreeEmits(node, lastSeg) {
  if (!node || typeof node !== 'object') return false;
  if (isLeaf(node)) return leafEmits(node, lastSeg);
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (subtreeEmits(v, k)) return true;
  }
  return false;
}

// A stateless `color` leaf collides with its siblings (so its `color` segment
// must be kept, not dropped) iff the parent has a non-`color` child that emits.
function colorLeafCollides(parentNode) {
  for (const [k, v] of Object.entries(parentNode)) {
    if (k.startsWith('$') || k === 'color') continue;
    if (subtreeEmits(v, k)) return true;
  }
  return false;
}

// Emitted path: kebab each segment, then drop the literal `color` property word.
// `borderColor` etc. survive (they kebab to a different segment before this runs).
//
// `color` is dropped in two positions:
//   - intermediate `color` (a group of states, `.../color/idle`): its state
//     children hoist up to the role node, which stays a pure group — always safe.
//   - trailing `color` (a stateless color leaf, `.../container/color`): dropping
//     collapses the value onto the role node. Safe ONLY when that role node has
//     no other token children. When it does (e.g. Tooltip/container also has
//     paddingX, Tag/x/container also has borderColor), dropping would shadow the
//     siblings and they'd be lost in the build — so the trailing `color` is KEPT
//     (`tooltip.container.color`) to preserve a leaf-vs-group separation.
//
// `keepTrailingColor` carries that per-leaf collision decision from the walk.
function emittedPath(figmaPath, keepTrailingColor) {
  const kebabbed = figmaPath.map(kebabSegment);
  const lastIdx = kebabbed.length - 1;
  return kebabbed.filter((seg, i) => {
    if (seg !== 'color') return true;
    if (i === lastIdx && keepTrailingColor) return true;
    return false;
  });
}

function inlineRawColor(literal, leafPath) {
  rawValueWarnings.push(`${leafPath}: raw ${literal} has no matching semantic — inlined as HSL`);
  return hexToHslValue(literal);
}

function inlineRawDimension(literal, leafPath) {
  rawValueWarnings.push(`${leafPath}: raw ${literal} has no matching primitive — inlined as px`);
  return { value: round(Number(literal), 4), unit: 'px' };
}

// Resolve one mode value for a non-typography leaf. Returns `{ type, value }`:
// the (possibly promoted) $type and the emitted value. References to the AI
// gradient group promote the leaf to $type:gradient (Figma mis-types these
// `string`).
function resolveModeValue($type, modeData, leafPath) {
  if ('reference' in modeData) {
    const figmaAlias = modeData.reference;
    const codeAlias = aliasMap.translate(figmaAlias);
    if (!aliasMap.has(codeAlias)) aliasErrors.push(`${leafPath}: unknown alias target ${codeAlias} (from Figma ${figmaAlias})`);
    const type = isGradientTarget(codeAlias) ? 'gradient' : $type;
    return { type, value: codeAlias };
  }
  if ('literal' in modeData) {
    if ($type === 'color') return { type: 'color', value: inlineRawColor(modeData.literal, leafPath) };
    if ($type === 'dimension') return { type: 'dimension', value: inlineRawDimension(modeData.literal, leafPath) };
    throw new Error(`${leafPath}: cannot inline literal for $type=${$type}`);
  }
  throw new Error(`${leafPath}: lastSyncedValue mode has neither reference nor literal`);
}

const out = {
  $schema: '../schemas/tokens.schema.json',
};

let count = 0;
function walk(node, path, parentNode) {
  if (!node || typeof node !== 'object') return;
  if (isLeaf(node)) {
    const variableId = fcExt(node).variableId;
    const lastSynced = fcExt(node).lastSyncedValue ?? {};
    const leafPath = path.join('.');
    const lastSeg = path[path.length - 1];
    // A trailing `color` segment is kept (not dropped) only when dropping would
    // collapse this stateless color leaf onto a role node that also carries
    // emittable siblings — see emittedPath().
    const keepTrailingColor = lastSeg === 'color' && parentNode != null && colorLeafCollides(parentNode);

    // `textStyle` string leaves point at a semantic typography style. Normalize
    // the inconsistent Figma literal into a {typography.*} alias.
    if (node.$type === 'string' && lastSeg === 'textStyle') {
      const values = {};
      let ok = true;
      for (const [figmaModeKey, modeData] of Object.entries(lastSynced)) {
        if (!('literal' in modeData)) {
          skippedWarnings.push(`${leafPath}: textStyle mode ${figmaModeKey} is not a literal — skipped`);
          ok = false;
          break;
        }
        const alias = aliasMap.translateTextStyle(modeData.literal);
        if (!aliasMap.has(alias)) aliasErrors.push(`${leafPath}: unknown typography target ${alias} (from "${modeData.literal}")`);
        values[normalizeMode(figmaModeKey)] = alias;
      }
      if (!ok) return;
      emitLeaf(path, 'typography', values, variableId, false);
      return;
    }

    // String leaves carrying a *literal* (borderStyle "solid", textDecoration
    // "underline") have no valid emitted $type (`string` is not in the schema
    // enum) and no DTCG type yet — skip and warn. String leaves carrying a
    // *reference* are mis-typed gradient aliases (`{semantics.gradients.ai.*}`)
    // and fall through to the reference path below, which promotes them to
    // $type:gradient.
    if (node.$type === 'string' && Object.values(lastSynced).some(m => m && 'literal' in m)) {
      skippedWarnings.push(`${leafPath}: $type=string (${lastSeg}) literal not modeled in components tier — skipped`);
      return;
    }

    const values = {};
    let emittedType = node.$type;
    for (const [figmaModeKey, modeData] of Object.entries(lastSynced)) {
      const { type, value } = resolveModeValue(node.$type, modeData, leafPath);
      emittedType = type;
      values[normalizeMode(figmaModeKey)] = value;
    }
    emitLeaf(path, emittedType, values, variableId, keepTrailingColor);
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    walk(v, [...path, k], node);
  }
}

function emitLeaf(figmaPath, $type, values, variableId, keepTrailingColor) {
  const meta = metaFor(variableId);
  const ext = {
    'com.figma.scopes': meta.scopes,
    'com.figma.variableId': variableId,
  };
  if (meta.hidden) ext['com.figma.hiddenFromPublishing'] = true;
  setPath(out, emittedPath(figmaPath, keepTrailingColor), { $type, values, platforms: ['PD'], $extensions: ext });
  count++;
}

walk(figmaComponents, [], null);
walk(figmaLegacy, [], null);

if (aliasErrors.length) {
  console.error('Alias errors:');
  for (const e of aliasErrors) console.error('  -', e);
  process.exit(1);
}

if (rawValueWarnings.length) {
  console.warn('Component alias gaps (raw values inlined):');
  for (const w of rawValueWarnings) console.warn('  -', w);
}

if (skippedWarnings.length) {
  console.warn('Skipped unmodeled component tokens:');
  for (const w of skippedWarnings) console.warn('  -', w);
}

const sorted = sortNode(out);

// Per-component variant ordering follows the design-system structure rather than
// alphabetical. `_global` already sorts to the front via sortNode (leading
// underscore precedes letters in ASCII); listing it is just for clarity.
// Root-level components stay alphabetical (sortNode default).
if (sorted.button) sorted.button = reorderByList(sorted.button, ['_global', 'primary', 'secondary', 'ghost', 'destructive', 'inverted', 'ai']);
if (sorted['button-icon']) sorted['button-icon'] = reorderByList(sorted['button-icon'], ['_global', 'primary', 'secondary', 'ghost', 'destructive', 'inverted', 'ai']);
if (sorted.tag) sorted.tag = reorderByList(sorted.tag, ['_global', 'neutral', 'info', 'success', 'warning', 'danger', 'critical', 'ai']);

fs.writeFileSync(OUT, formatDtcgJson(sorted) + '\n');
console.log(`Wrote ${OUT}: ${count} leaves (${rawValueWarnings.length} raw-value gaps inlined, ${skippedWarnings.length} skipped)`);
