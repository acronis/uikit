// Resolver coverage: every R-case (R1–R16) against the live `concept-pack`
// fixture (built for exactly this), plus synthetic fail-closed negatives.

import { describe, expect, it } from 'vitest';

import { loadAllRules, loadPack } from '../read';
import { resolveAsset } from '../resolve';
import type { Asset, PackManifest, ResolvedAsset, Values } from '../types';

const rules = loadAllRules();
const concept = loadPack('concept-pack');

const resolveOne = (id: string): ResolvedAsset => resolveAsset(concept, id, concept.assets[id], rules);
const variantIds = (a: ResolvedAsset): string[] => a.variants.map((v) => v.id).sort();
const variant = (a: ResolvedAsset, id: string) => a.variants.find((v) => v.id === id);
const base = (p: string): string => p.split('/').pop() ?? '';

describe('resolver — concept-pack R-cases', () => {
  it('R1+R2: inherits pack computed variants from the canonical', () => {
    const a = resolveOne('icon-basic');
    expect(a.canonical).toBe('24');
    expect(variantIds(a)).toEqual(['16', '24', '32']);
    expect(variant(a, '24')!.rules).toHaveLength(0);
    expect(variant(a, '16')!.rules.map((r) => r.name)).toEqual(['scale-16']);
    expect(base(variant(a, '16')!.leafFile)).toBe('icon-24.svg');
  });

  it('R3: extends with a new 96 variant computed from the canonical', () => {
    const a = resolveOne('icon-extended');
    expect(variantIds(a)).toContain('96');
    expect(variant(a, '96')!.rules.map((r) => r.name)).toEqual(['scale-96']);
  });

  it('R4: overrides a computed variant with different rules', () => {
    const a = resolveOne('icon-rule-override');
    expect(variant(a, '16')!.rules.map((r) => r.name)).toEqual(['stroke-2-5', 'scale-16']);
  });

  it('R5: opts out of a pack variant via null', () => {
    expect(variantIds(resolveOne('icon-opted-out'))).toEqual(['16', '24']);
  });

  it('R6: replaces a computed variant with its own binary (leaf, no rules)', () => {
    const a = resolveOne('icon-file-override');
    expect(variant(a, '16')!.rules).toHaveLength(0);
    expect(base(variant(a, '16')!.leafFile)).toBe('icon-alt-16.svg');
  });

  it('R7: ships independent binaries at every variant', () => {
    const a = resolveOne('icon-multi-source');
    for (const id of ['16', '24', '32']) expect(variant(a, id)!.rules).toHaveLength(0);
  });

  it('R8: raster asset fails closed on the missing upstream binary', () => {
    // concept-pack ships image-raster-24.svg but the manifest references
    // image-raster-24.png — a genuine upstream defect. The resolver catches it.
    expect(() => resolveOne('image-raster')).toThrow(/image-raster-24\.png/);
  });

  it('R9: computes from a non-canonical sibling via $from', () => {
    const a = resolveOne('icon-cross-source');
    expect(variant(a, '96')!.rules.map((r) => r.name)).toEqual(['scale-96']);
    expect(base(variant(a, '96')!.leafFile)).toBe('icon-48.svg'); // from 48, not canonical 24
  });

  it('R10: supports a non-numeric variant key', () => {
    const a = resolveOne('icon-themed');
    expect(variantIds(a)).toEqual(['24', 'dark']);
    expect(a.canonical).toBe('24');
  });

  it('R11: reads the pack-level canonical marker', () => {
    expect(resolveOne('icon-basic').canonical).toBe('24');
  });

  it('R12: honors an asset-level canonical override', () => {
    const a = resolveOne('icon-special-default');
    expect(a.canonical).toBe('32');
    expect(variantIds(a)).toEqual(['32']);
  });

  it('R13: carries per-asset platforms', () => {
    expect(resolveOne('icon-cross-source').platforms.slice().sort()).toEqual(['PD', 'WEB']);
  });

  it('R14: carries per-asset metadata', () => {
    expect(resolveOne('icon-basic').metadata).toEqual({ category: [], tags: [], legacyNames: [] });
  });

  it('R15: allows digit-first asset ids (illustrations)', () => {
    const ill = loadPack('illustrations');
    const first = Object.keys(ill.assets)[0];
    expect(first).toMatch(/^[0-9]/);
    expect(() => resolveAsset(ill, first, ill.assets[first], rules)).not.toThrow();
  });

  it('R16: resolves assets carrying $extensions (ignored by resolution)', () => {
    expect(() => resolveOne('icon-with-extensions')).not.toThrow();
  });
});

// ── Fail-closed negatives (synthetic manifests) ──────────────────────────────

const META = { category: [], tags: [], legacyNames: [] };
const REAL = './packs/concept-pack/icon-24.svg';

const synthetic = (assetValues: Values, $type: 'vector' | 'raster' = 'vector'): PackManifest => ({
  $schema: '',
  name: 'syn',
  version: '1.0.0',
  $type,
  values: { '24': { default: true } },
  assets: { x: { values: assetValues, platforms: ['PD'], metadata: META } as Asset },
});

const run = (pack: PackManifest): ResolvedAsset => resolveAsset(pack, 'x', pack.assets.x, rules);

describe('resolver — fail closed', () => {
  it('rejects two canonical markers in one asset', () => {
    const pack = synthetic({
      '24': { $file: REAL, default: true },
      '32': { $file: './packs/concept-pack/icon-special-32.svg', default: true },
    });
    expect(() => run(pack)).toThrow(/multiple canonical/);
  });

  it('rejects a computed effective canonical', () => {
    expect(() => run(synthetic({ '24': { $rules: ['scale-16'] } }))).toThrow(/canonical must resolve to a \$file/);
  });

  it('rejects an unknown rule id', () => {
    expect(() => run(synthetic({ '24': { $file: REAL }, '16': { $rules: ['nope'] } }))).toThrow(/unknown rule/);
  });

  it('rejects a $file missing on disk', () => {
    expect(() => run(synthetic({ '24': { $file: './packs/concept-pack/does-not-exist.svg' } }))).toThrow(/does not exist/);
  });

  it('rejects a derivation cycle', () => {
    const pack = synthetic({
      '24': { $file: REAL },
      '48': { $from: '96', $rules: ['scale-96'] },
      '96': { $from: '48', $rules: ['scale-96'] },
    });
    expect(() => run(pack)).toThrow(/cycle/);
  });

  it('rejects a $type / extension mismatch', () => {
    // raster asset whose canonical points at an existing .svg
    expect(() => run(synthetic({ '24': { $file: REAL } }, 'raster'))).toThrow(/not valid for \$type "raster"/);
  });
});
