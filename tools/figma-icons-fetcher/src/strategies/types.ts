import type { FetcherConfig, FigmaIcon } from '../types';

/**
 * A minimal Figma node as returned by the `/files/:key/nodes` endpoint. Only
 * the fields the selection strategies rely on are typed; everything else is
 * ignored.
 */
export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

/**
 * A resolved Figma page (canvas) plus the document subtree under it.
 */
export interface FigmaPage {
  id: string;
  name: string;
  document: FigmaNode;
}

/**
 * Strategies decide *which* nodes in a page become icons. They are pure:
 * given the already-fetched page subtree and the config, they return the
 * icons to download. No network, no fs. De-duplication and image-URL
 * resolution happen afterwards in the shared pipeline.
 */
export type SelectionStrategy = (page: FigmaPage, config: FetcherConfig) => FigmaIcon[];

export type SelectionStrategyName = 'frames-by-name' | 'new-frames';
