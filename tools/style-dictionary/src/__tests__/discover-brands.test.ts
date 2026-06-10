// Pins the data-driven brand matrix: `discoverBrands()` derives the brand set
// from the union of `values` keys in the brand-bearing token tiers (semantic +
// components), with the default brand first and the rest alphabetical. Adding a
// brand mode upstream must surface here with no code change — see
// `packages/design-tokens/context/brand-matrix.md`.

import { describe, expect, it } from 'vitest';

import { BRAND_NAMES, BRANDS, DEFAULT_BRAND, discoverBrands } from '../tokens';

describe('discoverBrands', () => {
  it('lists the default brand first', () => {
    expect(discoverBrands()[0]).toBe(DEFAULT_BRAND);
  });

  it('returns a deduplicated set with the non-default brands sorted', () => {
    const brands = discoverBrands();
    const rest = brands.slice(1);
    expect(new Set(brands).size).toBe(brands.length);
    expect(rest).toContain('brand-b');
    expect([...rest].sort()).toEqual(rest);
    expect(rest).not.toContain(DEFAULT_BRAND);
  });

  it('drives the exported BRAND_NAMES and BRANDS view list', () => {
    expect([...BRAND_NAMES]).toEqual(discoverBrands());
    expect(BRANDS.map((b) => b.name)).toEqual([...BRAND_NAMES]);
    for (const brand of BRANDS) {
      expect(brand.semantic).toBe(`semantic-${brand.name}`);
      expect(brand.components).toBe(`components-${brand.name}`);
    }
  });
});
