import path from 'node:path';

import chalk from 'chalk';

import type { BaseConfig } from './config';
import { figmaClientRequest } from './figma-client';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

interface NodesResponse {
  err?: string;
  nodes: Record<string, { document: FigmaNode }>;
}

export interface GroupDefinition {
  frameId: string;
  frameName: string;
  groupId: string;
  outputDir: string;
}

// Frame name == assetsGroups id in packs/icons.json (see context/manifest-pack.md
// — "Pack catalog"). This is a known-group allow-list, not a rename table: a
// frame is only synced if the target manifest already declares a matching group.
const KNOWN_GROUP_IDS = new Set(['solid-mono', 'solid-multi', 'stroke-mono', 'stroke-multi']);

/**
 * Fetches the section node and returns a GroupDefinition for each recognised
 * child frame (stroke-mono, stroke-multi, solid-mono, solid-multi) — each one
 * syncs into the matching `assetsGroups.<groupId>` of the single target pack.
 */
export async function discoverPacks(config: BaseConfig): Promise<GroupDefinition[]> {
  const client = figmaClientRequest(config.token);

  const resp = await client.get<NodesResponse>(
    `/files/${config.fileKey}/nodes?ids=${config.sectionNodeId}`,
  );

  if (resp.data.err) {
    throw new Error(`Cannot fetch section ${config.sectionNodeId}: ${resp.data.err}`);
  }

  const sectionEntry = Object.values(resp.data.nodes)[0];
  if (!sectionEntry) {
    throw new Error(`Section ${config.sectionNodeId} not found in file ${config.fileKey}`);
  }

  const groups: GroupDefinition[] = [];
  for (const child of sectionEntry.document.children ?? []) {
    if (child.type !== 'FRAME') continue;
    if (!KNOWN_GROUP_IDS.has(child.name)) continue;
    groups.push({
      frameId: child.id,
      frameName: child.name,
      groupId: child.name,
      outputDir: path.join('packs', config.packName),
    });
  }

  if (groups.length === 0) {
    throw new Error(
      `No known group frames found in section ${config.sectionNodeId}. `
      + `Expected one of: ${Array.from(KNOWN_GROUP_IDS).join(', ')}`,
    );
  }

  console.log(chalk.cyan(`  Discovered ${groups.length} groups: ${groups.map((g) => g.groupId).join(', ')}\n`));
  return groups;
}
