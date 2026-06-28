// Asset build orchestrator. For one platform filter (pd | web) it walks the
// deliverable GROUPS, resolves each source pack, filters assets by platform,
// executes every variant to an optimized SVG (or copies a raster), generates the
// React components for the group, and writes the dist layout + a manifest.
//
//   dist/assets/pd-concept-pack-svg/    <asset>-<size>.svg + manifest.json
//   dist/assets/pd-concept-pack-react/  <asset>.tsx + index.ts + manifest.json
//   dist/assets/pd-icons-{svg,react}/   4 icon packs merged (svg namespaced by style)
//   dist/assets/web-illustrations-svg/  SVG-only
//
// The four icon packs merge into one `icons` group: per asset id one component
// whose `variant` is the style (stroke-mono, …) and `size` the manifest sizes.

import path from 'node:path';

import { writeManifest, writeRaster, writeReact, writeSvg } from './emit';
import { executeSvg } from './executor';
import { copyRaster } from './raster';
import { generateComponent, type StyleInput } from './react/codegen';
import { styleLabel } from './react/naming';
import { loadAllRules, loadPack, readSvg } from './read';
import { assertPackSchema, resolveAsset } from './resolve';
import type { ColorMode } from './svgo-config';
import type { Platform, ResolvedAsset } from './types';

export type AssetFilter = 'pd' | 'web';

interface GroupDef {
  name: string;
  filter: AssetFilter;
  packs: string[];
  react: boolean;
  hasVariantAxis: boolean;
  namespaceSvgByStyle: boolean;
}

/** Single-color packs whose hardcoded colors are rewritten to `currentColor`. */
const MONO_PACKS = new Set(['concept-pack', 'icons-solid-mono', 'icons-stroke-mono']);
const colorModeFor = (pack: string): ColorMode => (MONO_PACKS.has(pack) ? 'mono' : 'preserve');

const GROUPS: GroupDef[] = [
  { name: 'concept-pack', filter: 'pd', packs: ['concept-pack'], react: true, hasVariantAxis: false, namespaceSvgByStyle: false },
  {
    name: 'icons',
    filter: 'pd',
    packs: ['icons-solid-mono', 'icons-solid-multi', 'icons-stroke-mono', 'icons-stroke-multi'],
    react: true,
    hasVariantAxis: true,
    namespaceSvgByStyle: true,
  },
  { name: 'illustrations', filter: 'web', packs: ['illustrations'], react: false, hasVariantAxis: false, namespaceSvgByStyle: false },
];

/** Filters that have at least one deliverable group. */
export const ASSET_FILTERS: AssetFilter[] = [...new Set(GROUPS.map((g) => g.filter))];

const FILTER_ENUM: Record<AssetFilter, Platform> = { pd: 'PD', web: 'WEB' };
const RASTER_EXTS = new Set(['png', 'webp']);

export interface BuildAssetsOptions {
  filter: AssetFilter;
  /** Restrict to these source packs (CI per-pack rebuild); undefined = all. */
  packs?: string[];
  /** Dist root for assets; deliverables land under `dist/assets/<filter>-<group>-<format>/`. */
  outDir: string;
  log: (msg: string) => void;
}

const relFile = (group: GroupDef, label: string, name: string, ext: string): string =>
  group.namespaceSvgByStyle ? `${label}/${name}.${ext}` : `${name}.${ext}`;

export function buildAssetsForFilter(opts: BuildAssetsOptions): void {
  const { filter, packs, outDir, log } = opts;
  const rules = loadAllRules();
  const platform = FILTER_ENUM[filter];

  for (const group of GROUPS) {
    if (group.filter !== filter) continue;
    const groupPacks = packs ? group.packs.filter((p) => packs.includes(p)) : group.packs;
    if (groupPacks.length === 0) continue;

    // One deliverable dir per format: `dist/assets/<filter>-<group>-<format>/`.
    const deliverable = `${filter}-${group.name}`;
    const svgDeliverable = path.join(outDir, `${deliverable}-svg`);
    const reactDeliverable = path.join(outDir, `${deliverable}-react`);
    const reactByAsset = new Map<string, StyleInput[]>();
    const manifestAssets: unknown[] = [];
    let svgCount = 0;

    for (const pack of groupPacks) {
      const manifest = loadPack(pack);
      assertPackSchema(manifest);
      // Resolve per-asset so one broken asset (e.g. a missing upstream binary) is
      // reported and skipped rather than aborting the whole build. The resolver
      // itself stays strict/fail-closed (resolvePack) for the R1–R16 tests.
      const resolved: ResolvedAsset[] = [];
      for (const [id, asset] of Object.entries(manifest.assets)) {
        if (!asset.platforms.includes(platform)) continue;
        try {
          resolved.push(resolveAsset(manifest, id, asset, rules));
        } catch (error) {
          console.warn(`  ⚠ skipped ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      const color = colorModeFor(pack);
      const label = styleLabel(pack);
      // icons namespace their SVGs by style within the deliverable; others are flat.
      const svgDir = group.namespaceSvgByStyle ? path.join(svgDeliverable, label) : svgDeliverable;

      for (const asset of resolved) {
        const reactVariants: { size: string; svg: string }[] = [];
        const variantManifest: { id: string; file: string }[] = [];

        for (const variant of asset.variants) {
          const name = `${asset.id}-${variant.id}`;
          if (RASTER_EXTS.has(variant.leafExt)) {
            writeRaster(svgDir, name, variant.leafExt, copyRaster(variant.leafFile));
            variantManifest.push({ id: variant.id, file: relFile(group, label, name, variant.leafExt) });
            svgCount += 1;
            continue;
          }
          const svg = executeSvg(readSvg(variant.leafFile), variant.rules, color);
          writeSvg(svgDir, name, svg);
          variantManifest.push({ id: variant.id, file: relFile(group, label, name, 'svg') });
          reactVariants.push({ size: variant.id, svg });
          svgCount += 1;
        }

        if (group.react && reactVariants.length > 0) {
          const styles = reactByAsset.get(asset.id) ?? [];
          styles.push({ style: pack, canonical: asset.canonical, variants: reactVariants });
          reactByAsset.set(asset.id, styles);
        }

        manifestAssets.push({
          id: asset.id,
          pack,
          style: label,
          platforms: asset.platforms,
          canonical: asset.canonical,
          type: asset.type,
          variants: variantManifest,
        });
      }
    }

    // The same manifest is written into every deliverable dir for the group — a
    // deliberate duplication so each platform dir is self-describing.
    const manifest = { group: group.name, filter, packs: groupPacks, assets: manifestAssets };
    writeManifest(svgDeliverable, manifest);

    let componentCount = 0;
    if (group.react && reactByAsset.size > 0) {
      const components = [...reactByAsset.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, styles]) => generateComponent({ id, hasVariantAxis: group.hasVariantAxis, styles }));
      writeReact(reactDeliverable, components);
      writeManifest(reactDeliverable, manifest);
      componentCount = components.length;
    }

    log(`${deliverable}: ${svgCount} files${group.react ? ` + ${componentCount} react` : ''}`);
  }
}
