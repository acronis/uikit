#!/usr/bin/env node
// Translates a Figma "Brand" variable-collection export (one fully-resolved,
// single-mode DTCG file per brand — Figma's native per-mode Variables export,
// NOT a `modes`-dict snapshot) into `values.<brand>` entries in
// packages/design-tokens/tiers/{semantics,components}.json.
//
// Usage (run from the repo root):
//   node .claude/skills/figma-brand-sync/scripts/sync-brands.mjs check <brandDir>
//   node .claude/skills/figma-brand-sync/scripts/sync-brands.mjs apply <brandDir> [brand1,brand2,...]
//
// <brandDir> is the unzipped "Brand" collection export directory — one
// <mode>.tokens.json per brand mode, plus default.tokens.json.
//
// `check` regression-tests the translation rules against every brand in
// <brandDir> that is ALREADY wired into the committed tiers (auto-discovered
// from the union of `values` keys already present) — it must report zero
// mismatches (or only explained ones) before `apply` is trusted on new data.
//
// `apply` writes `values.<brand>` for every brand in <brandDir> NOT already
// wired (or the explicit comma-separated list given), then rewrites
// tiers/semantics.json + tiers/components.json in place.
//
// See SKILL.md for the full pipeline this script is one step of, and for the
// hard-won translation rules (aliasData, palette/units/branding mapping,
// typography/shadow mocked-value decoding) this file encodes.

import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '../../../..');
const TIERS_DIR = path.join(REPO_ROOT, 'packages/design-tokens/tiers');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

// ---------- ColorUtils ----------
const round = (v, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
  };
}
function srgbToHsl(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    default: h = ((r - g) / d + 4) / 6;
  }
  return { h: round(h * 360), s: round(s * 100), l: round(l * 100) };
}
function hexToHslValue(hex) {
  const { r, g, b, a } = hexToRgb(hex);
  const { h, s, l } = srgbToHsl(r, g, b);
  const value = { colorSpace: 'hsl', components: [h, s, l] };
  if (a < 1) value.alpha = round(a, 4);
  return value;
}

// ---------- PaletteMapper ----------
// Figma palette-group name -> our primitives.palette group key. Extend this
// map when validate/build surfaces an "alias does not resolve" warning for a
// new palette group Figma introduces (see SKILL.md Gotchas).
const NAME_MAP = {
  Blue: 'blue', Teal: 'teal', Green: 'green', Yellow: 'yellow', Orange: 'orange',
  Red: 'red', Violet: 'violet', ElectricBlue: 'electricblue',
  Grayscale: 'grayscale', Transparent: 'transparent',
};
const TRANSPARENT_MAP = { Inverted: 'inverted', Dark: 'dark', Clear: 'clear' };
function mapPaletteParts(parts) {
  if (parts.length === 1) return [parts[0].toLowerCase()];
  const [group, ...rest] = parts;
  const mappedGroup = NAME_MAP[group];
  if (!mappedGroup) return parts.map((p) => p.toLowerCase().replace(/\s+/g, '-'));
  if (mappedGroup === 'grayscale') {
    const num = rest.join('/').match(/(\d+)$/)?.[1];
    return num ? [mappedGroup, num] : [mappedGroup, rest.join('-').toLowerCase()];
  }
  if (mappedGroup === 'transparent') {
    const subParts = rest.join('/').split(/[-/]/);
    const subName = subParts[0];
    const subNum = subParts[subParts.length - 1];
    const mappedSub = TRANSPARENT_MAP[subName];
    if (mappedSub && /^\d+$/.test(subNum)) return [mappedGroup, mappedSub, subNum];
    return [mappedGroup, ...subParts.map((p) => p.toLowerCase())];
  }
  const raw = rest.join('.');
  const stripped = raw.replace(new RegExp(`^${group}-?`, 'i'), '');
  const num = stripped.match(/^(\d+)/)?.[1];
  if (num) return [mappedGroup, num];
  return [mappedGroup, stripped.toLowerCase().replace(/\s+/g, '-')];
}

// ---------- Gradient parsing ----------
// Decodes the mocked gradient pattern: a Figma STRING variable holding a raw
// `linear-gradient(90deg, #hex pct%, ...)` literal (DTCG has no gradient
// variable type) into our `{ color, position }[]` stop array.
function parseCssGradient(css) {
  const m = css.trim().replace(/;$/, '').match(/^linear-gradient\(([^)]+)\)$/);
  if (!m) throw new Error(`Unparseable gradient: ${css}`);
  const parts = m[1].split(',').map((s) => s.trim());
  const angle = parts.shift();
  if (!/^\d+deg$/.test(angle)) throw new Error(`Unexpected gradient angle: ${angle}`);
  return parts.map((p) => {
    const sm = p.match(/^(#[0-9A-Fa-f]{6})\s+([\d.]+)%$/);
    if (!sm) throw new Error(`Unparseable gradient stop: ${p}`);
    return { color: hexToHslValue(sm[1]), position: round(Number(sm[2]) / 100, 4) };
  });
}

// ---------- Tree utils ----------
function getPath(obj, pathArr) {
  let cur = obj;
  for (const k of pathArr) {
    if (cur == null || typeof cur !== 'object' || !(k in cur)) return undefined;
    cur = cur[k];
  }
  return cur;
}
function compareKeys(a, b) {
  const na = /^\d+$/.test(a);
  const nb = /^\d+$/.test(b);
  if (na && nb) return Number(a) - Number(b);
  return a < b ? -1 : a > b ? 1 : 0;
}
function sortNode(node) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return node;
  const out = {};
  for (const k of Object.keys(node).sort(compareKeys)) out[k] = sortNode(node[k]);
  return out;
}

// ---------- DtcgFormatter ----------
// Approximates the tiers/*.json house style ($extensions/values always
// expanded, everything else inlines at printWidth 80). Not guaranteed
// byte-identical to Prettier for deeply-nested arrays-of-objects (e.g.
// gradient stop arrays) — SKILL.md's Phase 4 runs `prettier --write` on the
// output afterward, which is the authoritative formatter and absorbs any
// difference. Don't try to make this formatter perfect; let Prettier do it.
const PRINT_WIDTH = 80;
function isScalarObject(obj) {
  return Object.values(obj).every((v) => v === null || typeof v !== 'object' || Array.isArray(v));
}
function inlineFmt(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return value.length === 0 ? '[]' : `[${value.map(inlineFmt).join(', ')}]`;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return '{}';
  return `{ ${keys.map((k) => `${JSON.stringify(k)}: ${inlineFmt(value[k])}`).join(', ')} }`;
}
function formatNode(value, indent, key) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  const pad = '  '.repeat(indent);
  const childPad = '  '.repeat(indent + 1);
  const prefixLen = pad.length + (key !== null ? `${JSON.stringify(key)}: `.length : 0);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const inline = inlineFmt(value);
    if (prefixLen + inline.length <= PRINT_WIDTH) return inline;
    const lines = value.map((v) => `${childPad}${formatNode(v, indent + 1, null)}`);
    return `[\n${lines.join(',\n')}\n${pad}]`;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return '{}';
  if (indent > 0 && key !== '$extensions' && key !== 'values' && isScalarObject(value)) {
    const inline = inlineFmt(value);
    if (prefixLen + inline.length <= PRINT_WIDTH) return inline;
  }
  const lines = keys.map((k) => `${childPad}${JSON.stringify(k)}: ${formatNode(value[k], indent + 1, k)}`);
  return `{\n${lines.join(',\n')}\n${pad}}`;
}
function serialize(root) {
  return formatNode(root, 0, null) + '\n';
}

// ---------- Brand-identity guard ----------
// A `Branding/<brand>/...` alias must target the SAME brand this leaf is
// being translated for — Figma occasionally mis-wires a new brand's alias to
// point at an unrelated, already-shipped brand (e.g. `Branding/yellow_1c/...`
// showing up in a leaf being translated for a brand-new mode). That class of
// bug must fail loudly instead of silently landing in committed tier JSON.
class BrandAliasMismatchError extends Error {
  constructor(ctx, expectedBrand, actualBrand, targetName) {
    super(
      `${ctx}: Branding alias targets brand "${actualBrand}" but is being ` +
        `translated for brand "${expectedBrand}" (targetVariableName: ${targetName})`,
    );
    this.name = 'BrandAliasMismatchError';
    this.ctx = ctx;
    this.expectedBrand = expectedBrand;
    this.actualBrand = actualBrand;
    this.targetName = targetName;
  }
}
const normalizeBrandSeg = (s) => s.replace(/-/g, '_');

// ---------- Alias validation ----------
function aliasResolves(alias, root) {
  const inner = alias.slice(1, -1);
  const parts = inner.split('.');
  let cur = root;
  for (const k of parts) {
    if (!cur || typeof cur !== 'object' || !(k in cur)) return false;
    cur = cur[k];
  }
  return true;
}

// ---------- Leaf translation ----------
function translateLeafValue(exportLeaf, primitives, semantics, warnings, ctx, brandKey) {
  const val = exportLeaf.$value;
  const ext = exportLeaf.$extensions || {};
  const aliasData = ext['com.figma.aliasData'];

  // A fully-transparent literal (alpha 0) is normally the CSS keyword
  // "transparent" — UNLESS it's also backed by an alias (e.g. a stroke
  // aliasing Transparent/Clear), in which case the alias below takes
  // precedence and resolves to a real primitive reference instead.
  if (val && typeof val === 'object' && 'alpha' in val && val.alpha === 0 && !aliasData) {
    return 'transparent';
  }

  if (typeof val === 'string' && /^\{(?:brand\.)?(semantics|components)\./.test(val)) {
    const stripped = val.replace(/^\{(?:brand\.)?(?:semantics|components)\./, '{');
    if (aliasResolves(stripped, semantics)) return stripped;
    // Figma's current path nests one extra group that our committed tree
    // doesn't (schema drift) — retry after removing each middle segment
    // until one resolves against our own semantics tree.
    const inner = stripped.slice(1, -1).split('.');
    for (let i = 1; i < inner.length - 1; i++) {
      const candidate = `{${[...inner.slice(0, i), ...inner.slice(i + 1)].join('.')}}`;
      if (aliasResolves(candidate, semantics)) return candidate;
    }
    warnings.push(`${ctx}: semantics self-ref does not resolve: ${stripped} (from ${val})`);
    return stripped;
  }

  // Mocked shadow reference: a bare `shadow-<name>` string (no primitive
  // shadow tier exists — semantics.shadow is the composite root directly).
  if (exportLeaf.$type === 'string' && typeof val === 'string' && /^shadow-[a-z0-9-]+$/.test(val)) {
    const alias = `{shadow.${val.slice('shadow-'.length)}}`;
    if (aliasResolves(alias, semantics)) return alias;
    warnings.push(`${ctx}: shadow alias does not resolve: ${alias} (from ${val})`);
    return alias;
  }

  // Bare dotted string (no leading '{') is a typography reference; a bare
  // word with no dot is an enum literal (e.g. "solid", "none", "underline").
  if (typeof val === 'string' && !val.startsWith('{') && val.includes('.')) {
    const bare = val.startsWith('typography.') ? val : `typography.${val}`;
    const alias = `{${bare}}`;
    if (aliasResolves(alias, { typography: semantics.typography })) return alias;
    // Hyphen-as-dot mismatch fallback: "typography.title.accent" -> find a
    // leaf under typography whose group.name, with '-' replaced by '.',
    // equals the dotted leaf we were given.
    const dottedLeaf = bare.slice('typography.'.length);
    for (const [group, sub] of Object.entries(semantics.typography || {})) {
      if (group.startsWith('$') || typeof sub !== 'object') continue;
      for (const name of Object.keys(sub)) {
        if (name.startsWith('$')) continue;
        if (name.replace(/-/g, '.') === dottedLeaf) return `{typography.${group}.${name}}`;
      }
    }
    warnings.push(`${ctx}: typography alias does not resolve: ${alias}`);
    return alias;
  }

  if (aliasData?.targetVariableName) {
    const targetName = aliasData.targetVariableName;
    const parts = targetName.split('/');
    if (parts[0] === 'Branding') {
      const [, brandSeg, ...rest] = parts;
      if (normalizeBrandSeg(brandSeg) !== normalizeBrandSeg(brandKey)) {
        throw new BrandAliasMismatchError(ctx, brandKey, brandSeg, targetName);
      }
      const alias = `{branding.${brandSeg}.${rest.join('.')}}`;
      if (aliasResolves(alias, primitives)) return alias;
      warnings.push(`${ctx}: branding alias does not resolve: ${alias} (from ${targetName})`);
    } else if (['gap', 'size', 'radius', 'stroke'].includes(parts[0])) {
      // Strip Figma's local variable-name prefix (which may differ from the
      // section name, e.g. section "stroke" uses "width-" as its prefix) to
      // get the raw key — may be numeric ("12"), signed ("neg-6"), or a
      // named sentinel ("full").
      const key = parts[1]?.replace(/^[a-zA-Z]+-/, '');
      const alias = key ? `{units.${parts[0]}.${key}}` : null;
      if (alias && aliasResolves(alias, primitives)) return alias;
      warnings.push(`${ctx}: units alias does not resolve: ${alias} (from ${targetName})`);
    } else {
      const mapped = mapPaletteParts(parts);
      const alias = `{palette.${mapped.join('.')}}`;
      if (aliasResolves(alias, primitives)) return alias;
      warnings.push(`${ctx}: palette alias does not resolve: ${alias} (from ${targetName})`);
    }
  }

  // Literal fallback
  if (val && typeof val === 'object' && val.hex) return hexToHslValue(val.hex);
  if (exportLeaf.$type === 'string' && typeof val === 'string' && val.startsWith('linear-gradient(')) {
    return parseCssGradient(val);
  }
  return val;
}

// ---------- Collect every values-bearing leaf in a tier tree ----------
function collectValueLeaves(node, curPath = [], out = []) {
  if (!node || typeof node !== 'object') return out;
  if ('values' in node) {
    out.push({ path: curPath, node });
    return out;
  }
  if ('$value' in node) return out;
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    collectValueLeaves(v, [...curPath, k], out);
  }
  return out;
}

// ---------- Brand discovery ----------
function discoverWiredBrands(semantics) {
  const leaves = collectValueLeaves(semantics);
  const keys = new Set();
  for (const { node } of leaves) for (const k of Object.keys(node.values)) keys.add(k);
  keys.delete('default');
  return keys;
}

function discoverExportBrands(brandDir) {
  return fs
    .readdirSync(brandDir)
    .filter((f) => f.endsWith('.tokens.json') && f !== 'default.tokens.json')
    .map((f) => f.replace(/\.tokens\.json$/, ''));
}

// A brand's `values.<brand>` key. If the brand is ALREADY wired, its
// committed `values` key wins outright — some legacy brands (light-gray,
// yellow-1c) keep a hyphenated values key even though their `branding.*`
// primitive group is underscored, and re-syncing must never fork that into a
// second, duplicate key. Only for a genuinely new brand do we fall back to
// matching the filename against `branding.<brand>` (keeps historical brands'
// exact key), then normalize hyphens to underscores to match this repo's
// established convention for new brands (see SKILL.md).
function brandKeyFor(filenameStem, primitives, wiredBrands) {
  const underscored = filenameStem.replace(/-/g, '_');
  if (wiredBrands?.has(filenameStem)) return filenameStem;
  if (wiredBrands?.has(underscored)) return underscored;
  if (filenameStem in (primitives.branding || {})) return filenameStem;
  if (underscored in (primitives.branding || {})) return underscored;
  return underscored;
}

// ---------- Main ----------
const [, , mode, brandDirArg, brandsArg] = process.argv;
if (!mode || !['check', 'apply'].includes(mode) || !brandDirArg) {
  console.error('Usage: node sync-brands.mjs <check|apply> <brandDir> [brand1,brand2,...]');
  process.exit(1);
}
const brandDir = path.resolve(brandDirArg);

const primitives = readJson(path.join(TIERS_DIR, 'primitives.json'));
const semantics = readJson(path.join(TIERS_DIR, 'semantics.json'));
const components = readJson(path.join(TIERS_DIR, 'components.json'));

const wiredBrands = discoverWiredBrands(semantics);
const exportBrands = discoverExportBrands(brandDir);

let targetBrands;
if (mode === 'check') {
  // Regression-check: every export brand whose filename matches an already-wired key.
  targetBrands = exportBrands.filter((f) => wiredBrands.has(f)).map((f) => ({ key: f, file: f }));
  if (targetBrands.length === 0) {
    console.error('No already-wired brand found in this export to regression-check against.');
    console.error(`Wired brands: ${[...wiredBrands].join(', ')}`);
    console.error(`Export brands: ${exportBrands.join(', ')}`);
    process.exit(1);
  }
} else {
  const requested = brandsArg ? brandsArg.split(',') : null;
  const candidates = requested ?? exportBrands.filter((f) => !wiredBrands.has(brandKeyFor(f, primitives, wiredBrands)));
  targetBrands = candidates.map((f) => ({ key: brandKeyFor(f, primitives, wiredBrands), file: f }));
}

const warnings = [];
const mismatches = [];

try {
  runTranslation();
} catch (err) {
  if (err instanceof BrandAliasMismatchError) {
    console.error(`\nBrand-identity guard failed: ${err.message}`);
    process.exit(1);
  }
  throw err;
}

function runTranslation() {
  for (const { key: brandKey, file } of targetBrands) {
    const exportPath = path.join(brandDir, `${file}.tokens.json`);
    if (!fs.existsSync(exportPath)) {
      console.error(`Missing export file for brand "${file}": ${exportPath}`);
      process.exit(1);
    }
    const brandExport = readJson(exportPath);

    // semantics.json: colors + gradients + dataviz + shadow roots.
    // `dataviz` is a top-level sibling of `semantics`/`components` in the
    // Figma export (not nested under `semantics`); everything else nests
    // under `semantics.*` as expected.
    for (const { path: p, node } of collectValueLeaves(semantics)) {
      const exportPath2 = p[0] === 'dataviz' ? [...p] : ['semantics', ...p];
      const exportLeaf = getPath(brandExport, exportPath2);
      let translated;
      try {
        translated = exportLeaf
          ? translateLeafValue(exportLeaf, primitives, semantics, warnings, `semantics.${p.join('.')}`, brandKey)
          : undefined;
      } catch (err) {
        if (err instanceof BrandAliasMismatchError && mode === 'check') {
          mismatches.push({ tier: 'semantics', path: p.join('.'), brand: brandKey, error: err.message });
          continue;
        }
        throw err;
      }
      if (translated === undefined) {
        // Genuinely absent from this export (e.g. `shadow.*`, which has no
        // Figma Variable backing at all) — brand-invariant across every
        // currently-wired brand, so carry the default value forward.
        warnings.push(`semantics.${p.join('.')}: no leaf at this path in export — used default fallback`);
        translated = node.values.default;
      }
      if (mode === 'check') {
        const existing = node.values[brandKey];
        if (JSON.stringify(existing) !== JSON.stringify(translated)) {
          mismatches.push({ tier: 'semantics', path: p.join('.'), brand: brandKey, existing, translated });
        }
      } else {
        node.values[brandKey] = translated;
      }
    }

    // components.json
    for (const { path: p, node } of collectValueLeaves(components)) {
      const exportPath2 = ['components', ...p];
      const exportLeaf = getPath(brandExport, exportPath2);
      let translated;
      try {
        translated = exportLeaf
          ? translateLeafValue(exportLeaf, primitives, semantics, warnings, `components.${p.join('.')}`, brandKey)
          : undefined;
      } catch (err) {
        if (err instanceof BrandAliasMismatchError && mode === 'check') {
          mismatches.push({ tier: 'components', path: p.join('.'), brand: brandKey, error: err.message });
          continue;
        }
        throw err;
      }
      if (translated === undefined) {
        warnings.push(`components.${p.join('.')}: no leaf at this path in export — used default fallback`);
        translated = node.values.default;
      }
      if (mode === 'check') {
        const existing = node.values[brandKey];
        if (JSON.stringify(existing) !== JSON.stringify(translated)) {
          mismatches.push({ tier: 'components', path: p.join('.'), brand: brandKey, existing, translated });
        }
      } else {
        node.values[brandKey] = translated;
      }
    }
  }
}

fs.writeFileSync('/tmp/sync-brands-warnings.json', JSON.stringify(warnings, null, 2));
console.log(`\n=== ${mode.toUpperCase()} — brands: ${targetBrands.map((b) => b.key).join(', ')} ===`);
console.log(`Warnings: ${warnings.length} (full list: /tmp/sync-brands-warnings.json)`);
for (const w of warnings.slice(0, 40)) console.log('  WARN:', w);
if (warnings.length > 40) console.log(`  ...and ${warnings.length - 40} more`);

if (mode === 'check') {
  console.log(`Mismatches vs committed data: ${mismatches.length}`);
  for (const m of mismatches.slice(0, 40)) {
    console.log(`  MISMATCH [${m.tier}] ${m.path} (${m.brand}):`);
    console.log(`    existing:    ${JSON.stringify(m.existing)}`);
    console.log(`    translated:  ${JSON.stringify(m.translated)}`);
  }
  if (mismatches.length > 40) console.log(`  ...and ${mismatches.length - 40} more`);
  fs.writeFileSync('/tmp/sync-brands-check-mismatches.json', JSON.stringify(mismatches, null, 2));
  console.log('\nFull mismatch list: /tmp/sync-brands-check-mismatches.json');
  process.exit(mismatches.length > 0 ? 1 : 0);
} else {
  fs.writeFileSync(path.join(TIERS_DIR, 'semantics.json'), serialize(sortNode(semantics)));
  fs.writeFileSync(path.join(TIERS_DIR, 'components.json'), serialize(sortNode(components)));
  console.log('\nWrote tiers/semantics.json and tiers/components.json');
  console.log(`Brand keys written: ${targetBrands.map((b) => b.key).join(', ')}`);
}
