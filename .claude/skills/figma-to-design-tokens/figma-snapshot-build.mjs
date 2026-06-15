#!/usr/bin/env node
// .claude/skills/figma-to-design-tokens/figma-snapshot-build.mjs
// Entry point for Step 4: combine all Figma pull outputs into one normalized
// .claude/skills/figma-to-design-tokens/snapshot/figma-snapshot.json.
//
// Prerequisites: the source snapshot files must be populated (see source below).
//
// Usage:
//   node .claude/skills/figma-to-design-tokens/figma-snapshot-build.mjs         # reads ./snapshot/ (figma-console pull)
//   node .claude/skills/figma-to-design-tokens/figma-snapshot-build.mjs --tmp   # reads packages/design-tokens/.tmp/figma-tokens/
//
// `--tmp` builds the snapshot from the figma-token-exporter output in
// .tmp/figma-tokens/ — a fully figma-console-free path. The emit-*.mjs scripts
// run unchanged afterward; they only read the produced figma-snapshot.json.

import { fileURLToPath } from 'node:url';
import { FigmaSourceLoader } from './helpers/pull-source-loader.mjs';
import { SnapshotBuilder } from './helpers/pull-snapshot-builder.mjs';

const useTmp = process.argv.includes('--tmp');
const sourceDir = useTmp
  ? fileURLToPath(new URL('../../../packages/design-tokens/.tmp/figma-tokens/', import.meta.url))
  : undefined;

if (useTmp) console.log('Source: packages/design-tokens/.tmp/figma-tokens/ (figma-token-exporter)');
const loader = new FigmaSourceLoader(sourceDir).load();
const builder = new SnapshotBuilder(loader);
const snapshot = builder.buildAndWrite();

const varCount = countLeaves(snapshot.variables);
const styleCount = {
  text: snapshot.styles.text?.length ?? 0,
  color: snapshot.styles.color?.length ?? 0,
  effect: snapshot.styles.effect?.length ?? 0,
};

console.log(`Wrote ${builder.outputPath}`);
console.log(`  Variables: ${varCount} leaves`);
console.log(`  Styles: ${styleCount.text} text, ${styleCount.color} color, ${styleCount.effect} effect`);

function countLeaves(node) {
  if (!node || typeof node !== 'object') return 0;
  if ('$value' in node) return 1;
  return Object.values(node).reduce((n, v) => n + countLeaves(v), 0);
}
