import chalk from 'chalk';

import { figmaClientRequest } from './figma-client';
import { findDuplicates } from './helpers';
import { getSelectionStrategy } from './strategies';
import type { FigmaNode, FigmaPage } from './strategies/types';
import type { FetcherConfig, FigmaIcon } from './types';

interface FileStructureResponse {
  err?: string;
  document: { children: FigmaNode[] };
}

interface NodesResponse {
  err?: string;
  nodes: Record<string, { document: FigmaNode }>;
}

/**
 * Fetches icon metadata from Figma using a two-step approach:
 * 1. Gets file structure to find page IDs
 * 2. Fetches specific pages with icon frames
 *
 * Which nodes within those pages become icons is decided by the configured
 * selection strategy (see ./strategies).
 */
export async function getFigmaIcons(config: FetcherConfig): Promise<FigmaIcon[]> {
  if (!config.token) {
    throw new Error('Token not found. Please add FIGMA_FETCHER_FIGMA_TOKEN to .env.local');
  }

  if (!config.fileKey) {
    throw new Error('File key not found. Please add FIGMA_FETCHER_FILE_KEY to .env.local');
  }

  const selectIcons = getSelectionStrategy(config.selectionStrategy);
  const figmaClient = figmaClientRequest(config.token);

  // Step 1: Get file structure to find page IDs
  console.log('Fetching Figma file structure...');
  const structureStartTime = Date.now();
  const structureResponse = await figmaClient.get<FileStructureResponse>(`/files/${config.fileKey}?depth=1`);

  if (structureResponse.data.err) {
    throw new Error(`Cannot get Figma file structure: ${structureResponse.data.err}`);
  }

  const structureEndTime = Date.now();
  console.log(chalk.cyan(`Fetched structure in ${(structureEndTime - structureStartTime) / 1000}s`));

  // Find target pages
  const allPages = structureResponse.data.document.children;
  const targetPages = allPages.filter((page) => config.pageNames.includes(page.name));

  if (!targetPages.length) {
    throw new Error(
      `Cannot find pages: ${config.pageNames.join(', ')}. `
      + `Available: ${allPages.map((p) => p.name).join(', ')}`,
    );
  }

  console.log(`Found ${targetPages.length} pages: ${targetPages.map((p) => p.name).join(', ')}`);

  // Step 2: Fetch specific pages
  console.log('Fetching icon data...');
  const pagesStartTime = Date.now();

  const pageIds = targetPages.map((page) => page.id).join(',');
  const pagesResponse = await figmaClient.get<NodesResponse>(`/files/${config.fileKey}/nodes?ids=${pageIds}`);

  if (pagesResponse.data.err) {
    throw new Error(`Cannot get Figma pages: ${pagesResponse.data.err}`);
  }

  const pagesEndTime = Date.now();
  console.log(chalk.cyan(`Fetched pages in ${(pagesEndTime - pagesStartTime) / 1000}s\n`));

  // Extract pages with their names
  const pages: FigmaPage[] = Object.entries(pagesResponse.data.nodes).map(([pageId, node]) => ({
    id: pageId,
    name: targetPages.find((p) => p.id === pageId)?.name ?? 'unknown',
    document: node.document,
  }));

  // Delegate node selection to the configured strategy
  const icons = pages.flatMap((page) => selectIcons(page, config));

  if (!icons.length) {
    throw new Error(
      `No icons found using the "${config.selectionStrategy}" strategy in pages: ${config.pageNames.join(', ')}`,
    );
  }

  return findDuplicates<FigmaIcon>('name', icons);
}
