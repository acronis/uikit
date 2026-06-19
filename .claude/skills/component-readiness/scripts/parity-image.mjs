#!/usr/bin/env node
//
// Deep parity — VISUAL level (advisory). Pixel-diffs a Figma node screenshot
// against a rendered Storybook screenshot and writes a highlighted diff PNG.
//
// The Figma read is selection-bound (MCP), so this script does NOT call Figma.
// The agent saves the node image (Figma MCP `get_screenshot` / get_design_context
// screenshot) to a PNG and passes it here, alongside a Storybook render of the
// matching story (a committed VR baseline under test/__snapshots__/ works, or a
// fresh Playwright capture).
//
// Usage:
//   node parity-image.mjs <figma.png> <storybook.png> [--out diff.png] [--threshold 0.1]
//
// ADVISORY only: a Figma node screenshot and a Storybook story are not pixel-
// aligned (different framing/padding/scale), so the % is a delta signal, not a
// pass/fail. Read the diff PNG. Best results: crop the Storybook capture to just
// the component. Uses pixelmatch + pngjs from the repo's pnpm store (no new deps).

import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = execSync('git rev-parse --show-toplevel').toString().trim();

// Resolve pixelmatch + pngjs from the pnpm store (transitive deps of
// jest-image-snapshot, already installed for visual regression).
function fromStore(pkg, preferVersion) {
  const store = `${ROOT}/node_modules/.pnpm`;
  if (!fs.existsSync(store)) return null;
  const dirs = fs.readdirSync(store).filter((d) => d.startsWith(`${pkg}@`));
  if (!dirs.length) return null;
  const pick = (preferVersion && dirs.find((d) => d.startsWith(`${pkg}@${preferVersion}`))) || dirs.sort().pop();
  const p = `${store}/${pick}/node_modules/${pkg}`;
  return fs.existsSync(p) ? p : null;
}

let PNG, pixelmatch;
try {
  const pngPath = fromStore('pngjs', '6');
  const pmPath = fromStore('pixelmatch', '5');
  if (!pngPath || !pmPath) throw new Error('not found');
  ({ PNG } = require(pngPath));
  pixelmatch = require(pmPath);
} catch {
  console.error(
    'Could not load pixelmatch/pngjs from the pnpm store.\n' +
      'Run `pnpm install` at the repo root (they ship with jest-image-snapshot), or\n' +
      'fall back to ImageMagick:  compare -metric AE figma.png storybook.png diff.png'
  );
  process.exit(2);
}

const [, , figmaPath, storyPath, ...rest] = process.argv;
if (!figmaPath || !storyPath) {
  console.error('usage: parity-image.mjs <figma.png> <storybook.png> [--out diff.png] [--threshold 0.1]');
  process.exit(2);
}
const outPath = rest.includes('--out') ? rest[rest.indexOf('--out') + 1] : 'parity-diff.png';
const threshold = rest.includes('--threshold') ? Number(rest[rest.indexOf('--threshold') + 1]) : 0.1;

const figma = PNG.sync.read(fs.readFileSync(figmaPath));
const story = PNG.sync.read(fs.readFileSync(storyPath));

// Nearest-neighbor resize `src` (RGBA) to w×h.
function resize(src, w, h) {
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const sy = Math.min(src.height - 1, (y * src.height / h) | 0);
    for (let x = 0; x < w; x++) {
      const sx = Math.min(src.width - 1, (x * src.width / w) | 0);
      src.data.copy(out, (y * w + x) * 4, (sy * src.width + sx) * 4, (sy * src.width + sx) * 4 + 4);
    }
  }
  return out;
}

const { width, height } = figma;
const a = figma.data;
const b = story.width === width && story.height === height ? story.data : resize(story, width, height);
if (story.width !== width || story.height !== height) {
  console.log(`note: resized storybook ${story.width}×${story.height} → ${width}×${height} (figma dims) before diff`);
}

const diff = new PNG({ width, height });
const mismatch = pixelmatch(a, b, diff.data, width, height, { threshold });
fs.writeFileSync(outPath, PNG.sync.write(diff));

const ratio = mismatch / (width * height);
console.log(`mismatched pixels: ${mismatch} / ${width * height}  (${(ratio * 100).toFixed(2)}%)`);
console.log(`diff image: ${outPath}`);
console.log(
  ratio > 0.2
    ? 'RESULT: large visual delta — inspect the diff PNG (could be framing, or a real design mismatch).'
    : 'RESULT: visual delta within advisory range — inspect the diff PNG to confirm parity.'
);
