import type { SelectionStrategyName } from './strategies/types';

export interface FetcherConfig {
  token?: string;
  fileKey?: string;
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
