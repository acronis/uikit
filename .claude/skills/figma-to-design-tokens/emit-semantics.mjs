#!/usr/bin/env node
// .claude/skills/figma-to-design-tokens/emit-semantics.mjs
// Entry point for Step 6b: emit tiers/semantics.json from the current snapshot.
//
// Prerequisites:
//   - snapshot/figma-snapshot.json must exist
//   - tiers/primitives.json must be current (run emit-primitives.mjs first if needed)
//
// Usage: node .claude/skills/figma-to-design-tokens/emit-semantics.mjs

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SemanticsEmitter } from './helpers/emit-semantics-builder.mjs';

const SNAPSHOT_PATH = fileURLToPath(new URL('./snapshot/figma-snapshot.json', import.meta.url));

if (!fs.existsSync(SNAPSHOT_PATH)) {
  console.error(`Missing snapshot: ${SNAPSHOT_PATH}`);
  console.error('Run figma-snapshot-build.mjs (Phase 2) first.');
  process.exit(1);
}

const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
const emitter = new SemanticsEmitter(snapshot);
emitter.emit();
console.log(`Wrote ${emitter.outputPath}`);
