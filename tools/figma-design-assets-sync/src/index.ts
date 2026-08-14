import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

import chalk from 'chalk';

import { getBaseConfig } from './config';
import { checkStrokeIntegrity } from './check-stroke-integrity';
import {
  abortRevert,
  ensureCleanBeforeSync,
  finalizeGate,
  parseGateOptions,
} from './diff-gate';
import { discoverPacks } from './discover-packs';
import { syncPack, type PackSyncResult } from './sync-pack';
import { validateManifest } from './validate-manifest';

async function main(): Promise<void> {
  const config = getBaseConfig();
  const gate = parseGateOptions();

  if (!config.token) {
    console.error(chalk.red.bold('Token not found. Please add FIGMA_SYNC_TOKEN to .env.local'));
    process.exit(1);
  }
  if (!config.fileKey) {
    console.error(chalk.red.bold('File key not found. Please add FIGMA_SYNC_FILE_KEY to .env.local'));
    process.exit(1);
  }
  if (!config.sectionNodeId) {
    console.error(chalk.red.bold('Section node ID not found. Please add FIGMA_SYNC_SECTION_NODE_ID to .env.local'));
    process.exit(1);
  }

  console.log(chalk.bold('\n🎨 Figma Design Assets Sync\n'));
  console.log(`  File:    ${config.fileKey}`);
  console.log(`  Section: ${config.sectionNodeId}\n`);

  // Diff-gate: require a clean packs/ up front so a decline can revert cleanly.
  const gateActive = ensureCleanBeforeSync(gate);

  let packs;
  try {
    packs = await discoverPacks(config);
  } catch (err) {
    const error = err as Error;
    console.error(chalk.red.bold('✗ Failed to discover packs:'), error.message);
    process.exit(1);
  }

  const results: PackSyncResult[] = [];
  for (const pack of packs) {
    try {
      const result = await syncPack(config, pack);
      results.push(result);
    } catch (err) {
      const error = err as Error & { cause?: Error };
      console.error(chalk.red.bold(`\n✗ Error syncing ${pack.packName}:`), error.message);
      if (error.cause) console.error(chalk.red('  Cause:'), error.cause.message);
      abortRevert(gateActive);
      process.exit(1);
    }
  }

  console.log(chalk.bold('\n\n══ Sync summary ════════════════════════════'));
  for (const r of results) {
    const prunedNote = r.pruned > 0 ? chalk.yellow(`  ${r.pruned} pruned`) : '';
    console.log(`  ${chalk.green('✓')} ${r.packName.padEnd(24)} ${r.assetCount} assets  (${(r.durationMs / 1000).toFixed(1)}s)${prunedNote}`);
  }

  console.log(chalk.bold('\n\n══ Validations ═════════════════════════════'));

  console.log('\n▸ Schema validation (ajv)...');
  const ajv = 'node_modules/.bin/ajv';
  const ajvCmd = [
    `${ajv} compile -s schemas/pack.schema.json --spec=draft2020`,
    `${ajv} compile -s schemas/rule.schema.json --spec=draft2020`,
    `${ajv} validate -s schemas/pack.schema.json -d "packs/*.json" --spec=draft2020`,
    `${ajv} validate -s schemas/rule.schema.json -d "rules/*.json" --spec=draft2020`,
  ].join(' && ');
  const ajvResult = spawnSync(ajvCmd, { stdio: 'inherit', shell: true });
  if (ajvResult.status !== 0) {
    console.error(chalk.red.bold('\n✗ Schema validation failed'));
    abortRevert(gateActive);
    process.exit(1);
  }

  console.log('\n▸ Duplicate legacyNames check...');
  let hasLegacyDuplicates = false;
  for (const pack of packs) {
    const manifestPath = path.join('packs', `${pack.packName}.json`);
    console.log(chalk.dim(`\n  ${manifestPath}`));
    const result = await validateManifest(manifestPath);
    console.log(`  Assets: ${result.assetCount}  Legacy names: ${result.legacyCount}`);
    if (result.duplicates.length === 0) {
      console.log(chalk.green('  ✓ No duplicates'));
    } else {
      hasLegacyDuplicates = true;
      console.error(chalk.red(`  ✗ ${result.duplicates.length} duplicate(s):`));
      for (const d of result.duplicates) {
        console.error(chalk.red(`    "${d.legacyName}"`), chalk.dim(`→ ${d.icons[0]} and ${d.icons[1]}`));
      }
    }
  }

  console.log('\n▸ Stroke fill integrity (icons-stroke-mono)...');
  const integrity = await checkStrokeIntegrity();
  const affectedCount = integrity.fullyOutlined.length + integrity.mixed.length;
  if (affectedCount === 0) {
    console.log(chalk.green('  ✓ No hardcoded fills found'));
  } else {
    console.log(chalk.yellow(`  ⚠ ${affectedCount} icon(s) with hardcoded fills:`));
    if (integrity.fullyOutlined.length > 0) {
      console.log(chalk.yellow(`    Fully outlined (${integrity.fullyOutlined.length}): ${integrity.fullyOutlined.join(' · ')}`))
    }
    if (integrity.mixed.length > 0) {
      console.log(chalk.dim(`    Mixed fill+stroke (${integrity.mixed.length}): ${integrity.mixed.join(' · ')}`))
    }
    console.log(chalk.dim(`  Report: ${integrity.reportPath}`));
  }

  if (hasLegacyDuplicates) {
    console.error(chalk.red.bold('\n✗ Duplicate legacyNames found — resolve before committing\n'));
    abortRevert(gateActive);
    process.exit(1);
  }

  await finalizeGate(gateActive, gate);
}

main();
