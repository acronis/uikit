import type { SelectionStrategyName } from './strategies/types';

export interface FetcherConfig {
  token?: string;
  fileKey?: string;
  // When set, the fetcher pulls this node's subtree directly instead of
  // resolving pages by name. The selection strategy then runs against the node.
  nodeId?: string;
  selectionStrategy: SelectionStrategyName;
  skipMissingImages: boolean;
  pageNames: string[];
  frameNames: string[];
  className?: string;
  systemColor: string;
  outputDir: string;
  outputDirs: string[];
  generateManifests: boolean;
  manifestDir: string;
  // When true, the manifest dir is wiped before regenerating, so renamed/removed
  // groups don't leave stale manifests behind. Off by default to preserve
  // hand-maintained manifests in packages that keep them alongside generated ones.
  cleanManifests: boolean;
  categorizeByColor: boolean;
  monoColorDir: string;
  multiColorDir: string;
}

export interface FigmaIcon {
  id: string;
  name: string;
  pageName: string;
}

export interface IconWithUrl extends FigmaIcon {
  image?: string;
}

export interface DownloadedIcon extends IconWithUrl {
  isMulticolor: boolean;
  savedPaths: string[];
}

export interface CategoryStats {
  monoAdded: number;
  multiAdded: number;
  monoTotal?: number;
  multiTotal?: number;
}
