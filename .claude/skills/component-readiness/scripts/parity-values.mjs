#!/usr/bin/env node
//
// Deep parity — VALUE level. Compares the resolved values of the design
// variables a Figma node uses against the resolved values of the --ui-* tokens
// the component references in tokens-pd.
//
// The Figma read is selection-bound (MCP), so this script does NOT call Figma.
// The agent saves the output of `get_variable_defs({ nodeId, fileKey })` to a
// JSON file and passes its path here; this script does the deterministic compare.
//
// Usage:
//   node parity-values.mjs <ComponentName|kebab> <figma-vars.json> [--brand acronis] [--theme light|dark]
//
// figma-vars.json: either { "component/Tooltip/container/color": "#191B23E5", ... }
//                  or [ { "name": "...", "value": "..." }, ... ]
//
// Exit 1 if any NAME-PAIRED value differs (the high-confidence signal). Unpaired
// design values that don't appear anywhere in the component are reported as
// advisory (MISSING) — they may be out of this component's scope.

import fs from 'node:fs';
import { execSync } from 'node:child_process';

const ROOT = execSync('git rev-parse --show-toplevel').toString().trim();
const TOKENS = `${ROOT}/packages/tokens-pd/css`;
const UI = `${ROOT}/packages/ui-react/src/components/ui`;

const [, , rawName, figmaJsonPath, ...rest] = process.argv;
if (!rawName || !figmaJsonPath) {
  console.error('usage: parity-values.mjs <Component> <figma-vars.json> [--theme light|dark]');
  process.exit(2);
}
const theme = rest.includes('--theme') ? rest[rest.indexOf('--theme') + 1] : 'light';
const kebab = rawName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// --- normalize a color/dimension value to a canonical comparable string ---
function norm(v) {
  if (v == null) return null;
  if (typeof v === 'number') return `${v}`; // dimension
  let s = String(v).trim();

  // hex → r,g,b,a
  let m = s.match(/^#([0-9a-fA-F]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 4) h = h.split('').map((c) => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    const a = h.length >= 8 ? +(parseInt(h.slice(6, 8), 16) / 255).toFixed(3) : 1;
    return `${r},${g},${b},${a}`;
  }
  // rgb(r g b / a) | rgb(r,g,b) | rgba(...)
  m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].replace('/', ' ').split(/[\s,]+/).filter(Boolean).map(Number);
    const [r, g, b] = parts;
    const a = parts.length >= 4 ? +parts[3].toFixed(3) : 1;
    return `${r},${g},${b},${a}`;
  }
  // dimension like "12px" / "0.5rem"
  m = s.match(/^(-?[\d.]+)(px|rem|em)?$/);
  if (m) return `${parseFloat(m[1])}`;
  return s.toLowerCase();
}

// --- map a Figma variable name → --ui-* token name (best effort, Option-A) ---
function toToken(figmaName) {
  const segs = String(figmaName).split('/').filter((s) => s && s.toLowerCase() !== 'component');
  const kebabed = segs.map((s) =>
    s.replace(/^_/, '')                                  // _global → global
     .replace(/([a-z0-9])([A-Z])/g, '$1-$2')             // camel/Pascal → kebab
     .toLowerCase()
  );
  return `--ui-${kebabed.join('-')}`;
}

// --- resolve --ui-* token values from tokens-pd for the chosen brand/theme ---
function loadTokenValues(brand) {
  const map = new Map();
  const files = [`${TOKENS}/${brand}.css`];
  for (const d of fs.readdirSync(TOKENS)) {
    const p = `${TOKENS}/${d}/${brand}.css`;
    if (fs.existsSync(p)) files.push(p);
  }
  const re = /(--ui-[a-z0-9-]+)\s*:\s*([^;]+);/g;
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const css = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(css))) {
      const name = m[1];
      let val = m[2].trim();
      const ld = val.match(/light-dark\(\s*(.+?)\s*,\s*(.+?)\s*\)$/);
      if (ld) val = theme === 'dark' ? ld[2] : ld[1];
      map.set(name, val);
    }
  }
  return map;
}

// --- referenced tokens in the component source (.tsx/.ts) ---
function referencedTokens() {
  const dir = `${UI}/${kebab}`;
  const out = new Set();
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) walk(p);
      else if (/\.(tsx?|ts)$/.test(e.name)) {
        for (const t of fs.readFileSync(p, 'utf8').match(/--ui-[a-z0-9-]+/g) || []) {
          if (!t.endsWith('-')) out.add(t);
        }
      }
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return out;
}

// --- load figma vars json into [{name, value}] ---
function loadFigma(path) {
  const j = JSON.parse(fs.readFileSync(path, 'utf8'));
  if (Array.isArray(j)) return j.map((x) => ({ name: x.name, value: x.value }));
  return Object.entries(j).map(([name, value]) => ({ name, value }));
}

const brand = rest.includes('--brand') ? rest[rest.indexOf('--brand') + 1] : 'acronis';
const tokenVals = loadTokenValues(brand);
const refd = referencedTokens();
const figma = loadFigma(figmaJsonPath);

// value→[tokenNames] index over the component's referenced tokens (for unpaired lookup)
const refdValueSet = new Map();
for (const t of refd) {
  const nv = norm(tokenVals.get(t));
  if (nv != null) (refdValueSet.get(nv) || refdValueSet.set(nv, []).get(nv)).push(t);
}

let paired = 0, diffs = 0, missing = 0;
console.log(`Value parity — ${kebab} (brand ${brand}, ${theme})  [figma ${figma.length} vars vs ${refd.size} referenced tokens]\n`);
for (const { name, value } of figma) {
  const tok = toToken(name);
  const fval = norm(value);
  if (refd.has(tok)) {
    paired++;
    const tval = norm(tokenVals.get(tok));
    if (fval === tval) {
      console.log(`  MATCH      ${name}  →  ${tok}`);
    } else {
      diffs++;
      console.log(`  VALUE-DIFF ${name} = ${fval}  →  ${tok} = ${tval}`);
    }
  } else if (fval != null && refdValueSet.has(fval)) {
    console.log(`  ~ unpaired ${name} = ${fval}  (value present via ${refdValueSet.get(fval).join(', ')}; name didn't map to a referenced token)`);
  } else {
    missing++;
    console.log(`  MISSING    ${name} = ${fval}  (no referenced token maps to this name or value)`);
  }
}

console.log(`\nsummary: ${paired} name-paired, ${diffs} value-diff, ${missing} missing(advisory)`);
if (diffs > 0) {
  console.log('RESULT: VALUE DRIFT — a referenced token resolves to a different value than the design.');
  process.exit(1);
}
console.log('RESULT: no name-paired value drift. Review MISSING rows (may be out of component scope).');
