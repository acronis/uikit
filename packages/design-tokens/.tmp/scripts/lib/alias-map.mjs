// .tmp/scripts/lib/alias-map.mjs
// Translate Figma DTCG aliases to our code paths, and validate the target
// exists in the emitted primitives / semantic trees.
//
// Figma writes aliases like `{semantic.colors.background.surface.primary}` or
// `{gap.gap-4}` or `{Blue.Blue-7-Primary}`. Our code uses
// `{colors.background.surface.primary}`, `{units.gap.4}`, `{palette.blue.7}`.
// The rules:
//
//   semantic.colors.* → colors.*           (Figma nests under the semantic group; ours doesn't)
//   gap.gap-N         → units.gap.N        (drop the redundant group prefix)
//   size.size-N       → units.size.N
//   stroke.width-N    → units.stroke.N     (Figma uses width-N for stroke widths)
//   radius.radius-N   → units.radius.N
//   {Base}            → palette.base       (single-element → lowercased palette name)
//   {Blue.Blue-7-…}   → palette.blue.7     (multi-element → mapPaletteParts)
//
// All keys are space-normalized (`on surface` → `on-surface`) so the translated
// path matches what figma-to-semantic.mjs emits.
//
// Example:
//   const t = makeAliasTranslator({ primitives, semantic });
//   t.translate("{semantic.colors.glyph.on surface.neutral}")
//   // → "{colors.glyph.on-surface.neutral}"
//   t.translate("{gap.gap-4}")
//   // → "{units.gap.4}"
//   t.translate("{Blue.Blue-4}")
//   // → "{palette.blue.4}"
//   t.has("{colors.glyph.on-surface.neutral}")  // → true / false

import { mapPaletteParts } from './palette-map.mjs';

const normalizeKey = k => k.replace(/\s+/g, '-');

// Prefix translation table: a Figma path's first segment(s) → our path's
// first segment(s). The remaining segments pass through with key normalization.
// Each rule has:
//   match(parts) — returns the head segments it consumed, or null
//   emit(parts)  — produces the head segments for our path
const PREFIX_RULES = [
  {
    // {semantic.colors.X.Y...} → {colors.X.Y...}
    match: parts => parts[0] === 'semantic' && parts[1] === 'colors' ? 2 : 0,
    emit: () => ['colors'],
  },
  {
    // {gap.gap-N} → {units.gap.N}
    match: parts => parts[0] === 'gap' && /^gap-/.test(parts[1] ?? '') ? 2 : 0,
    emit: parts => ['units', 'gap', parts[1].replace(/^gap-/, '')],
  },
  {
    // {size.size-N} → {units.size.N}
    match: parts => parts[0] === 'size' && /^size-/.test(parts[1] ?? '') ? 2 : 0,
    emit: parts => ['units', 'size', parts[1].replace(/^size-/, '')],
  },
  {
    // {stroke.width-N} → {units.stroke.N}
    match: parts => parts[0] === 'stroke' && /^width-/.test(parts[1] ?? '') ? 2 : 0,
    emit: parts => ['units', 'stroke', parts[1].replace(/^width-/, '')],
  },
  {
    // {radius.radius-N} → {units.radius.N}
    match: parts => parts[0] === 'radius' && /^radius-/.test(parts[1] ?? '') ? 2 : 0,
    emit: parts => ['units', 'radius', parts[1].replace(/^radius-/, '')],
  },
];

// Figma palette aliases come as bare names: {Base}, {Blue.Blue-7-Primary},
// {Grayscale.Gray-5}, {Transparent.Inverted-6}. Single-element → lowercased
// palette key; multi-element → shared mapPaletteParts (same translator used by
// figma-to-semantic.mjs for semantic-color aliases that target palette).
function translatePalette(parts) {
  if (parts.length === 1) return ['palette', parts[0].toLowerCase()];
  return ['palette', ...mapPaletteParts(parts)];
}

export function translateAliasPath(figmaAlias) {
  const m = figmaAlias.match(/^\{([^}]+)\}$/);
  if (!m) throw new Error(`expected DTCG alias, got ${figmaAlias}`);
  const rawParts = m[1].split('.');
  const parts = rawParts.map(normalizeKey);
  for (const rule of PREFIX_RULES) {
    const consumed = rule.match(parts);
    if (consumed) {
      const head = rule.emit(parts);
      const tail = parts.slice(consumed);
      return `{${[...head, ...tail].join('.')}}`;
    }
  }
  // Fallback: anything that isn't a known prefix is a palette-direct alias.
  // mapPaletteParts is unaware of the space→hyphen normalization and matches
  // on the raw Figma capitalisation, so pass rawParts.
  return `{${translatePalette(rawParts).join('.')}}`;
}

// Walk a path inside a tree. Returns true iff every segment exists.
function pathExists(tree, parts) {
  let cur = tree;
  for (const k of parts) {
    if (!cur || typeof cur !== 'object' || !(k in cur)) return false;
    cur = cur[k];
  }
  return true;
}

// Build a translator + existence checker over the two emitted trees. The
// translator throws on unknown prefixes (extend PREFIX_RULES when new ones
// appear) — `has` answers cleanly true/false for downstream validation.
export function makeAliasTranslator({ primitives, semantic }) {
  return {
    translate: translateAliasPath,
    has(codeAlias) {
      const m = codeAlias.match(/^\{([^}]+)\}$/);
      if (!m) throw new Error(`expected DTCG alias, got ${codeAlias}`);
      const parts = m[1].split('.');
      const root = parts[0];
      const rest = parts.slice(1);
      if (root === 'colors')    return pathExists(semantic.colors,    rest);
      if (root === 'units')     return pathExists(primitives.units,   rest);
      if (root === 'palette')   return pathExists(primitives.palette, rest);
      if (root === 'font')      return pathExists(primitives.font, rest);
      return false;
    },
  };
}
