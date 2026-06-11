import chalk from 'chalk';

import { figmaClientRequest } from './figma-client';
import { findDuplicates } from './helpers';
import { getSelectionStrategy } from './strategies';
import type { FigmaNode, FigmaPage } from './strategies/types';
import type { FetcherConfig, FigmaIcon } from './types';

type FigmaClient = ReturnType<typeof figmaClientRequest>;

interface FileStructureResponse {
  err?: string;
  document: { children: FigmaNode[] };
}

interface NodesResponse {
  err?: string;
  nodes: Record<string, { document: FigmaNode }>;
}

/**
 * Resolves the target pages by name (the two-call structure → nodes path).
 */
async function fetchPagesByName(figmaClient: FigmaClient, config: FetcherConfig): Promise<FigmaPage[]> {
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

  return Object.entries(pagesResponse.data.nodes).map(([pageId, node]) => ({
    id: pageId,
    name: targetPages.find((p) => p.id === pageId)?.name ?? 'unknown',
    document: node.document,
  }));
}

/**
 * Fetches a single node's subtree directly (used when FIGMA_FETCHER_NODE_ID is
 * set). The node is handed to the strategy as a one-element "page" list.
 */
async function fetchNode(figmaClient: FigmaClient, config: FetcherConfig): Promise<FigmaPage[]> {
  console.log(`Fetching Figma node ${config.nodeId}...`);
  const startTime = Date.now();
  const response = await figmaClient.get<NodesResponse>(`/files/${config.fileKey}/nodes?ids=${config.nodeId}`);

  if (response.data.err) {
    throw new Error(`Cannot get Figma node ${config.nodeId}: ${response.data.err}`);
  }

  const entry = response.data.nodes[config.nodeId!] ?? Object.values(response.data.nodes)[0];
  if (!entry) {
    throw new Error(`Node ${config.nodeId} not found in file ${config.fileKey}`);
  }

  console.log(chalk.cyan(`Fetched node in ${(Date.now() - startTime) / 1000}s\n`));

  return [{ id: config.nodeId!, name: entry.document.name, document: entry.document }];
}

/**
 * Fetches icon metadata from Figma. Icons come either from a single node
 * (FIGMA_FETCHER_NODE_ID — fetched directly) or from named pages (the two-call
 * structure → nodes path). Which nodes then become icons is decided by the
 * configured selection strategy (see ./strategies).
 */
export async function getFigmaIcons(config: FetcherConfig): Promise<FigmaIcon[]> {
  if (!config.token) {
    throw new Error('Token not found. Please add FIGMA_FETCHER_FIGMA_TOKEN to .env.local');
  }

  if (!config.fileKey) {
    throw new Error('File key not found. Please add FIGMA_FETCHER_FILE_KEY to .env.local');
  }

  if (!config.nodeId && !config.pageNames.length) {
    throw new Error('Provide FIGMA_FETCHER_NODE_ID or FIGMA_FETCHER_PAGE_NAMES to locate the icons.');
  }

  const selectIcons = getSelectionStrategy(config.selectionStrategy);
  const figmaClient = figmaClientRequest(config.token);

  const pages = config.nodeId
    ? await fetchNode(figmaClient, config)
    : await fetchPagesByName(figmaClient, config);

  // Delegate node selection to the configured strategy
  const icons = pages.flatMap((page) => selectIcons(page, config));

  if (!icons.length) {
    const source = config.nodeId ? `node ${config.nodeId}` : `pages: ${config.pageNames.join(', ')}`;
    throw new Error(`No icons found using the "${config.selectionStrategy}" strategy in ${source}`);
  }

  return findDuplicates<FigmaIcon>('name', icons);
}
