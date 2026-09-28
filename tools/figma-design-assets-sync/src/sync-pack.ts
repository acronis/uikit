import chalk from 'chalk';

import type { BaseConfig } from './config';
import { makeSyncConfig } from './config';
import type { GroupDefinition } from './discover-groups';
import { downloadSvgs } from './download-svgs';
import { generateManifest } from './generate-manifest';
import { getPackIcons } from './get-pack-icons';
import { getSvgUrls } from './get-svg-urls';

export interface PackSyncResult {
  groupId: string;
  assetCount: number;
  durationMs: number;
}

/**
 * Runs the full sync pipeline for one group:
 * fetch icons → resolve SVG URLs → download + SVGO → update the group's
 * assets in the manifest. Binaries are shared flat across every group, so
 * pruning stale/orphaned SVGs happens once, globally, after all groups have
 * synced (see prune-orphaned-binaries.ts) — not per group.
 */
export async function syncPack(base: BaseConfig, group: GroupDefinition): Promise<PackSyncResult> {
  const t0 = Date.now();
  const config = makeSyncConfig(base, group.frameId, group.groupId);

  console.log(chalk.bold(`\n── ${group.groupId} ──────────────────────────`));
  console.log(`  Frame:  ${group.frameId}`);
  console.log(`  Output: ${group.outputDir}\n`);

  const icons = await getPackIcons(config);
  const iconsWithUrls = await getSvgUrls(config, icons);
  const downloaded = await downloadSvgs(config, iconsWithUrls);

  console.log(chalk.green.bold(`✓ Downloaded ${downloaded.length} SVGs\n`));

  await generateManifest(config, downloaded);

  return { groupId: group.groupId, assetCount: downloaded.length, durationMs: Date.now() - t0 };
}
