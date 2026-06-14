#!/usr/bin/env node
// .claude/skills/figma-to-design-tokens/figma-snapshot-build.mjs
// Entry point for Step 4: combine all Figma pull outputs into one normalized
// .claude/skills/figma-to-design-tokens/snapshot/figma-snapshot.json.
//
// Prerequisites: .tmp/figma-tokens/ must be populated and the post-process
// gate (figma-pull-postprocess.mjs) must have exited 0.
//
// Usage: node .claude/skills/figma-to-design-tokens/figma-snapshot-build.mjs

import { FigmaSourceLoader } from './helpers/pull-source-loader.mjs';
import { SnapshotBuilder } from './helpers/pull-snapshot-builder.mjs';

const loader = new FigmaSourceLoader().load();
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
