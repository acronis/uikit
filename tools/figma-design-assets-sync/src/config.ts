import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import dotenv from 'dotenv';

function getEnvConfig(file: string): Record<string, string> {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    return dotenv.parse(fs.readFileSync(fullPath));
  }
  return {};
}

export function parseNodeId(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return /^\d+-\d+$/.test(trimmed) ? trimmed.replace('-', ':') : trimmed;
}

/**
 * The single pack manifest this tool syncs into. Every discovered Figma frame
 * becomes a `assetsGroups.<groupId>` entry inside this one manifest — see
 * `packs/icons.json`. Overridable for future packs that adopt the same
 * section/frame → group convention.
 */
export const DEFAULT_PACK_NAME = 'icons';

export interface BaseConfig {
  token: string;
  fileKey: string;
  sectionNodeId: string;
  packName: string;
  platforms: string[];
}

export interface SyncConfig {
  token: string;
  fileKey: string;
  frameNodeId: string;
  packName: string;
  groupName: string;
  platforms: string[];
  outputDir: string;
}

export function getBaseConfig(): BaseConfig {
  const env = { ...getEnvConfig('.env'), ...getEnvConfig('.env.local'), ...process.env };

  return {
    token: env.FIGMA_SYNC_TOKEN ?? '',
    fileKey: env.FIGMA_SYNC_FILE_KEY ?? '',
    sectionNodeId: parseNodeId(env.FIGMA_SYNC_SECTION_NODE_ID) ?? '',
    packName: env.FIGMA_SYNC_PACK_NAME ?? DEFAULT_PACK_NAME,
    platforms: (env.FIGMA_SYNC_PLATFORMS ?? 'PD').split(',').map((p) => p.trim()).filter(Boolean),
  };
}

export function makeSyncConfig(base: BaseConfig, frameNodeId: string, groupName: string): SyncConfig {
  return {
    token: base.token,
    fileKey: base.fileKey,
    frameNodeId,
    packName: base.packName,
    groupName,
    platforms: base.platforms,
    // Binaries are flat and shared by every group in the pack (see
    // context/manifest-pack.md — "Binary layout"), not one directory per group.
    outputDir: path.join('packs', base.packName),
  };
}
