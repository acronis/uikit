// The resolver — `packages/design-assets/context/spec.md` §a–g plus the runtime
// invariants the JSON schema cannot enforce. Pure: it takes a parsed manifest and
// the rule map, and returns one ResolvedAsset per asset, or throws (fail closed)
// with the offending `<pack>.<asset> [<variant>]` on the first violation.
//
// Each variant is flattened to a single leaf binary + the ordered rules to apply
// to it; `$from`/implicit-canonical hops are concatenated leaf-first. The executor
// (executor.ts) consumes these plans; this module never touches SVG content.

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import type { ValidateFunction } from 'ajv';

import { loadPackSchema, resolveBinary } from './read';
import type {
  Asset,
  ComputedValue,
  PackManifest,
  ResolvedAsset,
  ResolvedVariant,
  Rule,
  SourceValue,
  VariantValue,
} from './types';

const isSource = (v: VariantValue): v is SourceValue =>
  v != null && typeof v === 'object' && '$file' in v;

const isComputed = (v: VariantValue): v is ComputedValue =>
  v != null && typeof v === 'object' && '$rules' in v;

/** Has the inline canonical marker. */
const isFlagged = (v: VariantValue): boolean =>
  v != null && typeof v === 'object' && (v as { default?: unknown }).default === true;

const fail = (pack: string, id: string, variant: string | null, msg: string): never => {
  const loc = variant ? `${pack}.${id} [${variant}]` : `${pack}.${id}`;
  throw new Error(`${loc}: ${msg}`);
};

const EXT_FOR_TYPE: Record<string, readonly string[]> = {
  vector: ['svg'],
  raster: ['png', 'webp'],
};

// ── Structural re-assert (invariant a) ───────────────────────────────────────

let validatePack: ValidateFunction | undefined;

/** Compile (once) and run the pack schema; fail closed on any violation. */
export function assertPackSchema(pack: PackManifest): void {
  if (!validatePack) {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    validatePack = ajv.compile(loadPackSchema());
  }
  // `as boolean` drops the ajv type-guard narrowing, which would otherwise narrow
  // `pack` to `never` in the negative branch.
  const valid = validatePack(pack) as boolean;
  if (!valid) {
    const detail = (validatePack.errors ?? [])
      .map((e) => `${e.instancePath || '/'} ${e.message}`)
      .join('; ');
    throw new Error(`${pack.name}: manifest fails pack.schema.json — ${detail}`);
  }
}

// ── Per-asset resolution ─────────────────────────────────────────────────────

export function resolveAsset(
  pack: PackManifest,
  id: string,
  asset: Asset,
  rules: Map<string, Rule>
): ResolvedAsset {
  // (b) effective type
  const type = asset.$type ?? pack.$type;

  // (c) per-key shallow merge, asset wins; then drop opted-out (null) keys.
  const merged: Record<string, VariantValue> = { ...pack.values, ...asset.values };
  for (const [key, val] of Object.entries(merged)) {
    if (val === null) delete merged[key];
  }

  // (d) effective canonical — asset flag wins over pack flag.
  const assetFlags = Object.entries(asset.values ?? {})
    .filter(([, v]) => isFlagged(v))
    .map(([k]) => k);
  const packFlags = Object.entries(pack.values)
    .filter(([, v]) => isFlagged(v))
    .map(([k]) => k);
  if (assetFlags.length > 1) {
    fail(pack.name, id, null, `multiple canonical markers in asset values (${assetFlags.join(', ')})`);
  }
  if (packFlags.length !== 1) {
    fail(pack.name, pack.name, null, `pack values must flag exactly one canonical (found ${packFlags.length})`);
  }
  const canonical = assetFlags[0] ?? packFlags[0];
  const canonicalVal = merged[canonical];
  if (canonicalVal === undefined) {
    fail(pack.name, id, canonical, 'effective canonical was opted out or is missing');
  }
  if (!isSource(canonicalVal)) {
    fail(pack.name, id, canonical, 'effective canonical must resolve to a $file source (not computed/marker/null)');
  }

  // (e + f) resolve every remaining variant, flattening derivation chains and
  // detecting cycles.
  const resolveChain = (variant: string, seen: Set<string>): { leafFile: string; leafExt: string; rules: Rule[] } => {
    if (seen.has(variant)) {
      fail(pack.name, id, variant, `derivation cycle: ${[...seen, variant].join(' → ')}`);
    }
    const val = merged[variant];
    if (val === undefined) {
      fail(pack.name, id, variant, 'referenced variant is missing or opted out');
    }
    if (isSource(val)) {
      const { absPath, exists } = resolveBinary(val.$file);
      if (!exists) fail(pack.name, id, variant, `$file does not exist on disk: ${val.$file}`);
      const ext = val.$file.split('.').pop() ?? '';
      if (!EXT_FOR_TYPE[type].includes(ext)) {
        fail(pack.name, id, variant, `extension .${ext} is not valid for $type "${type}" (expected ${EXT_FOR_TYPE[type].join('/')})`);
      }
      return { leafFile: absPath, leafExt: ext, rules: [] };
    }
    if (isComputed(val)) {
      if (type === 'raster') {
        fail(pack.name, id, variant, 'raster assets cannot have computed variants (scale/stroke are vector ops)');
      }
      const source = val.$from ?? canonical;
      const ruleObjs = val.$rules.map((rid) => {
        const r = rules.get(rid);
        if (!r) fail(pack.name, id, variant, `unknown rule id "${rid}" (no rules/${rid}.json)`);
        return r as Rule;
      });
      const sub = resolveChain(source, new Set(seen).add(variant));
      return { leafFile: sub.leafFile, leafExt: sub.leafExt, rules: [...sub.rules, ...ruleObjs] };
    }
    // A bare `{ "default": true }` marker with no $file/$rules survived the merge.
    return fail(pack.name, id, variant, 'variant has no $file or $rules (bare canonical marker without a source)') as never;
  };

  const variants: ResolvedVariant[] = Object.keys(merged).map((variant) => {
    const chain = resolveChain(variant, new Set());
    return {
      id: variant,
      canonical: variant === canonical,
      leafFile: chain.leafFile,
      leafExt: chain.leafExt,
      rules: chain.rules,
    };
  });

  return {
    pack: pack.name,
    id,
    type,
    canonical,
    platforms: asset.platforms,
    metadata: asset.metadata,
    description: asset.$description,
    variants,
  };
}

/** Resolve every asset in a pack. Throws on the first invariant violation. */
export function resolvePack(pack: PackManifest, rules: Map<string, Rule>): ResolvedAsset[] {
  assertPackSchema(pack);
  return Object.entries(pack.assets).map(([id, asset]) => resolveAsset(pack, id, asset, rules));
}
