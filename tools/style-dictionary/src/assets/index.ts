// Public surface of the asset domain. `index.ts` (the tool entry point) drives the
// build through `buildAssetsForFilter`. The resolver + executor + style expansion
// are also exported so other workspaces (e.g. `@acronis-platform/icons-react`'s
// generator) can reuse the canonical design-assets resolution instead of
// reimplementing it — they consume the per-size resolved SVGs and emit their own
// React shape.

export { ASSET_FILTERS, buildAssetsForFilter, expandStyles, type AssetFilter, type BuildAssetsOptions, type StyleUnit } from './pipeline';
export { listPackNames, loadPack, loadAllRules, readSvg, resolveBinary } from './read';
export { assertPackSchema, resolveAsset, resolvePack } from './resolve';
export { executeSvg } from './executor';
export { parseSvg, walk, type INode } from './svg-ast';
export { nodeToJsx } from './react/naming';
export { type ColorMode } from './svgo-config';
export type {
  Asset,
  PackManifest,
  Platform,
  ResolvedAsset,
  ResolvedVariant,
  Rule,
  Values,
} from './types';
