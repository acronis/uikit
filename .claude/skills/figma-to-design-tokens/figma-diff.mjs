#!/usr/bin/env node
// .claude/skills/figma-to-design-tokens/figma-diff.mjs
// Entry point for Step 5: diff snapshot/figma-snapshot.json against tiers/*.json.
//
// Usage:
//   node .claude/skills/figma-to-design-tokens/figma-diff.mjs
//   node .claude/skills/figma-to-design-tokens/figma-diff.mjs --tier components

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TiersReader } from './helpers/diff-tiers-reader.mjs';
import { DiffEngine } from './helpers/diff-engine.mjs';
import { DiffReporter } from './helpers/diff-reporter.mjs';

const SNAPSHOT_PATH = fileURLToPath(
  new URL('./snapshot/figma-snapshot.json', import.meta.url),
);

const args = process.argv.slice(2);
const tierIdx = args.indexOf('--tier');
const tierFilter = tierIdx !== -1 ? args[tierIdx + 1] : null;

if (!fs.existsSync(SNAPSHOT_PATH)) {
  console.error(`Missing snapshot: ${SNAPSHOT_PATH}`);
  console.error('Run figma-snapshot-build.mjs (Phase 2) first.');
  process.exit(1);
}

const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
const tiersReader = new TiersReader().load();
const engine = new DiffEngine(snapshot, tiersReader).run();
const reporter = new DiffReporter(engine.changes);

reporter.print(tierFilter);
const reportPath = reporter.writeJson();
console.log(`\nReport written to ${reportPath}`);
