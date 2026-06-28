/**
 * screen-audit — run the structural screen detectors over a captured snapshot.
 *
 * Capture (a `ScreenSnapshot` JSON) is produced in the browser by the probe in
 * `screens/audit/probe.ts` — driven by the `/screen-audit` skill against a
 * running Storybook story (the descriptor's `story` id), or by the VR
 * test-runner. This CLI is the Node half: load the snapshot + the screen
 * descriptor, run the detectors, print findings keyed by checklist id +
 * severity, and exit non-zero on any `must`.
 *
 * Run:   pnpm --filter @acronis-platform/ui-spec screen-audit <screen-slug> <snapshot.json>
 * Design: context/kit-consistency-audit-proposal.md §7  ·  rules: ../grammar
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';

import { auditScreen, formatScreenReport } from '../screens/audit';
import type { ScreenDescriptorLite, ScreenSnapshot } from '../screens/audit/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCREENS_DIR = resolve(HERE, '../screens');

function loadDescriptor(slug: string): ScreenDescriptorLite {
  const path = join(SCREENS_DIR, slug, 'screen.yaml');
  return parseYaml(readFileSync(path, 'utf8')) as ScreenDescriptorLite;
}

function loadSnapshot(path: string): ScreenSnapshot {
  return JSON.parse(readFileSync(resolve(path), 'utf8')) as ScreenSnapshot;
}

const [slug, snapshotPath] = process.argv.slice(2);
if (!slug || !snapshotPath) {
  process.stderr.write(
    'usage: screen-audit <screen-slug> <snapshot.json>\n'
  );
  process.exit(2);
}

const descriptor = loadDescriptor(slug);
const snapshot = loadSnapshot(snapshotPath);
const today = new Date().toISOString().slice(0, 10);
const { active, suppressed } = auditScreen(snapshot, descriptor, { today });
let report = formatScreenReport(active, slug);
if (suppressed.length)
  report += `\n${suppressed.length} suppressed by approved override(s).`;
process.stdout.write(report + '\n');
process.exit(active.some((f) => f.severity === 'must') ? 1 : 0);
