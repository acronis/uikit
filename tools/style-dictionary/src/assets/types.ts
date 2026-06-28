// Shared types for the asset domain: the on-disk shapes read from
// `@acronis-platform/design-assets` (pack manifests + rule declarations) and the
// resolved shapes this tool's resolver produces for the executor / codegen.
//
// The manifest shapes mirror `packages/design-assets/schemas/{pack,rule}.schema.json`
// and the divergence documented in that package's `context/spec.md`.

export type AssetType = 'vector' | 'raster';
export type Platform = 'WEB' | 'PD';
export type RuleKind = 'scale' | 'stroke';

/** A `$file` source variant: a binary on disk, optionally the canonical. */
export interface SourceValue {
  $file: string;
  default?: true;
}

/** A computed variant: derive from a sibling (or the canonical) via ordered rules. */
export interface ComputedValue {
  $rules: string[];
  $from?: string;
  default?: true;
}

/** The pack-level bare canonical marker (`{ "default": true }`, no `$file`). */
export interface CanonicalMarker {
  default: true;
}

/** One entry in a `values` map: source, computed, bare marker, or opt-out (`null`). */
export type VariantValue = SourceValue | ComputedValue | CanonicalMarker | null;

export type Values = Record<string, VariantValue>;

export interface Metadata {
  category: string[];
  tags: string[];
  legacyNames: string[];
}

export interface Asset {
  $type?: AssetType;
  $description?: string;
  values: Values;
  platforms: Platform[];
  metadata: Metadata;
  $extensions?: Record<string, unknown>;
}

export interface PackManifest {
  $schema: string;
  name: string;
  version: string;
  $type: AssetType;
  values: Values;
  assets: Record<string, Asset>;
}

export interface Rule {
  $schema: string;
  name: string;
  kind: RuleKind;
  target: { value: number; unit: 'px' };
}

// ── Resolved shapes (resolver → executor / codegen) ──────────────────────────

/**
 * One fully-resolved variant of an asset. Every variant is flattened to a single
 * source binary (`leafFile`) plus the ordered rules to apply to it — the
 * derivation chain (`$from` hops) is concatenated leaf-first into `rules`. A
 * direct `$file` leaf has `rules: []`.
 */
export interface ResolvedVariant {
  /** Variant id (e.g. `"24"`, `"dark"`). */
  id: string;
  /** True for the asset's effective canonical. */
  canonical: boolean;
  /** Absolute path to the leaf binary this variant derives from (or is). */
  leafFile: string;
  /** Leaf file extension without the dot (`svg` | `png` | `webp`). */
  leafExt: string;
  /** Ordered rules to apply to the leaf, leaf-first. Empty for a direct leaf. */
  rules: Rule[];
}

export interface ResolvedAsset {
  /** Pack this asset belongs to. */
  pack: string;
  /** Asset id (manifest key). */
  id: string;
  /** Effective `$type` (`asset.$type ?? pack.$type`). */
  type: AssetType;
  /** Effective canonical variant id. */
  canonical: string;
  platforms: Platform[];
  metadata: Metadata;
  description?: string;
  /** Every non-null variant, including the canonical, in declaration order. */
  variants: ResolvedVariant[];
}
