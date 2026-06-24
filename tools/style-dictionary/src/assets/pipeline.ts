// Asset build orchestrator. For one platform filter (pd | web) it walks the
// deliverable GROUPS, resolves each source pack, filters assets by platform,
// executes every variant to an optimized SVG (or copies a raster), generates the
// React components for the group, and writes the dist layout + a manifest.
//
//   dist/assets/pd-icons-{svg,react}/   one icons pack, its assetsGroups merged
//   dist/assets/web-illustrations-svg/  SVG-only
//
// The icons pack ships its rendering styles as `assetsGroups` (stroke-mono,
// solid-multi, …); each group becomes one `variant` member and namespaces its
// SVGs by style within the deliverable. A flat pack (illustrations) is a single
// implicit style. currentColor is driven by whether a style references a `color`
// rule, not a hardcoded pack list.

import path from 'node:path';

import { writeManifest, writeRaster, writeReact, writeSvg } from './emit';
import { executeSvg } from './executor';
import { copyRaster } from './raster';
import { generateComponent, type StyleInput } from './react/codegen';
import { loadAllRules, loadPack, readSvg } from './read';
import { assertPackSchema, resolveAsset } from './resolve';
import type { ColorMode } from './svgo-config';
import type {
  Asset,
  ComputedValue,
  PackManifest,
  Platform,
  ResolvedAsset,
  Rule,
  Values,
  VariantValue,
} from './types';

export type AssetFilter = 'pd' | 'web';

interface GroupDef {
  /** Deliverable name (`dist/assets/<filter>-<name>-<format>/`). */
  name: string;
  filter: AssetFilter;
  /** Source pack file stem under `packs/`. */
  pack: string;
  react: boolean;
  hasVariantAxis: boolean;
  namespaceSvgByStyle: boolean;
}

const GROUPS: GroupDef[] = [
  { name: 'icons', filter: 'pd', pack: 'icons', react: true, hasVariantAxis: true, namespaceSvgByStyle: true },
  { name: 'illustrations', filter: 'web', pack: 'illustrations', react: false, hasVariantAxis: false, namespaceSvgByStyle: false },
];

/** Filters that have at least one deliverable group. */
export const ASSET_FILTERS: AssetFilter[] = [...new Set(GROUPS.map((g) => g.filter))];

const FILTER_ENUM: Record<AssetFilter, Platform> = { pd: 'PD', web: 'WEB' };
const RASTER_EXTS = new Set(['png', 'webp']);

const isFlagged = (v: VariantValue): boolean =>
  v != null && typeof v === 'object' && (v as { default?: unknown }).default === true;

/**
 * Effective `values` for a group: the pack `values` with the group's `$values`
 * RFC 7396 merge-patch applied. A `null` entry removes the variant; a non-null
 * entry overrides or adds it. The pack-level canonical marker is preserved when
 * the patch only changes a variant's derivation — the canonical is determined
 * from these `values` (spec §canonical), so dropping the flag would orphan it.
 */
function effectiveGroupValues(packValues: Values, patch: Values | undefined): Values {
  if (!patch) return { ...packValues };
  const out: Values = { ...packValues };
  for (const [key, val] of Object.entries(patch)) {
    if (val === null) {
      delete out[key];
      continue;
    }
    out[key] = isFlagged(packValues[key]) && !isFlagged(val) ? { ...val, default: true } : val;
  }
  return out;
}

/** Whether any computed entry in `values` applies a `color`-kind rule. */
function usesColorRule(values: Values, rules: Map<string, Rule>): boolean {
  for (const val of Object.values(values)) {
    if (val == null || typeof val !== 'object' || !('$rules' in val)) continue;
    if ((val as ComputedValue).$rules.some((id) => rules.get(id)?.kind === 'color')) return true;
  }
  return false;
}

/** One resolvable rendering style: a synthesized flat manifest + its color mode + React label. */
interface StyleUnit {
  /** React `variant` member + SVG subdir name (group id, or the pack name for a flat pack). */
  label: string;
  manifest: PackManifest;
  color: ColorMode;
}

/** Expand a pack into its rendering styles: one per `assetsGroups` entry, or a single flat style. */
function expandStyles(pack: PackManifest, rules: Map<string, Rule>): StyleUnit[] {
  if (pack.assetsGroups) {
    return Object.entries(pack.assetsGroups).map(([groupId, group]) => {
      const values = effectiveGroupValues(pack.values, group.$values);
      return {
        label: groupId,
        manifest: {
          $schema: pack.$schema,
          name: groupId,
          version: pack.version,
          $type: group.$type ?? pack.$type,
          values,
          assets: group.assets,
        },
        color: usesColorRule(values, rules) ? 'mono' : 'preserve',
      };
    });
  }
  return [
    {
      label: pack.name,
      manifest: pack,
      color: usesColorRule(pack.values, rules) ? 'mono' : 'preserve',
    },
  ];
}

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
    if (packs && !packs.includes(group.pack)) continue;

    const pack = loadPack(group.pack);
    assertPackSchema(pack);
    const styles = expandStyles(pack, rules);

    // One deliverable dir per format: `dist/assets/<filter>-<group>-<format>/`.
    const deliverable = `${filter}-${group.name}`;
    const svgDeliverable = path.join(outDir, `${deliverable}-svg`);
    const reactDeliverable = path.join(outDir, `${deliverable}-react`);
    const reactByAsset = new Map<string, StyleInput[]>();
    const manifestAssets: unknown[] = [];
    let svgCount = 0;

    for (const style of styles) {
      const { manifest, label, color } = style;
      // Resolve per-asset so one broken asset (e.g. a missing upstream binary) is
      // reported and skipped rather than aborting the whole build. The resolver
      // itself stays strict/fail-closed (resolvePack) for the R1–R16 tests.
      const resolved: ResolvedAsset[] = [];
      for (const [id, asset] of Object.entries(manifest.assets ?? {}) as [string, Asset][]) {
        if (!asset.platforms.includes(platform)) continue;
        try {
          resolved.push(resolveAsset(manifest, id, asset, rules));
        } catch (error) {
          console.warn(`  ⚠ skipped ${error instanceof Error ? error.message : String(error)}`);
        }
      }
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
          const styleInputs = reactByAsset.get(asset.id) ?? [];
          styleInputs.push({ style: label, canonical: asset.canonical, variants: reactVariants });
          reactByAsset.set(asset.id, styleInputs);
        }

        manifestAssets.push({
          id: asset.id,
          pack: group.pack,
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
    const manifest = { group: group.name, filter, pack: group.pack, styles: styles.map((s) => s.label), assets: manifestAssets };
    writeManifest(svgDeliverable, manifest);

    let componentCount = 0;
    if (group.react && reactByAsset.size > 0) {
      const components = [...reactByAsset.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, styleInputs]) => generateComponent({ id, hasVariantAxis: group.hasVariantAxis, styles: styleInputs }));
      writeReact(reactDeliverable, components);
      writeManifest(reactDeliverable, manifest);
      componentCount = components.length;
    }

    log(`${deliverable}: ${svgCount} files${group.react ? ` + ${componentCount} react` : ''}`);
  }
}
