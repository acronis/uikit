import fs from 'node:fs/promises';
import path from 'node:path';

import chalk from 'chalk';

import type { SyncConfig } from './config';
import type { DownloadedIcon } from './download-svgs';
import { parseDescription } from './helpers';

interface AssetsGroup {
  $type?: string;
  $values?: Record<string, unknown>;
  $description?: string;
  assets: Record<string, unknown>;
}

interface PackManifest {
  $schema: string;
  name: string;
  version: string;
  $type: string;
  values: Record<string, unknown>;
  assets?: Record<string, unknown>;
  assetsGroups?: Record<string, AssetsGroup>;
}

/**
 * Reads the existing pack manifest, regenerates one group's `assets` map from
 * the downloaded icons, and writes the result back to disk. Every other key —
 * the manifest root, every other group, and this group's own `$values` /
 * `$type` / `$description` — is preserved untouched (see
 * context/manifest-pack.md — "Asset groups").
 */
export async function generateManifest(
  config: SyncConfig,
  icons: DownloadedIcon[],
): Promise<void> {
  const manifestPath = path.join('packs', `${config.packName}.json`);

  let existing: PackManifest;
  try {
    existing = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as PackManifest;
  } catch {
    throw new Error(`Cannot read existing manifest at ${manifestPath}`);
  }

  const existingGroup = existing.assetsGroups?.[config.groupName];
  if (!existingGroup) {
    throw new Error(
      `Manifest ${manifestPath} has no assetsGroups.${config.groupName} — `
      + `add the group (or its $values patch) by hand before syncing it from Figma.`,
    );
  }

  const assets: Record<string, unknown> = {};
  for (const icon of icons) {
    const meta = parseDescription(icon.description);
    assets[icon.name] = {
      values: {
        '24': { $file: `./packs/${config.packName}/${icon.name}.svg` },
      },
      platforms: config.platforms,
      metadata: {
        category: meta.category,
        tags: meta.tags,
        legacyNames: meta.legacyNames,
      },
    };
  }

  const sortedAssets: Record<string, unknown> = {};
  for (const key of Object.keys(assets).sort()) {
    sortedAssets[key] = assets[key];
  }

  const manifest: PackManifest = {
    ...existing,
    assetsGroups: {
      ...existing.assetsGroups,
      [config.groupName]: { ...existingGroup, assets: sortedAssets },
    },
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  console.log(
    chalk.green(
      `  Manifest written → ${manifestPath} (assetsGroups.${config.groupName}: ${Object.keys(sortedAssets).length} assets)`,
    ),
  );
}
