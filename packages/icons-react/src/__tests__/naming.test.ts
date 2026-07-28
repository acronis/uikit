import { describe, expect, it } from 'vitest';

import { kebabCase, pascalCase, toComponentName } from '../lib/naming';

describe('toComponentName', () => {
  it('suffixes normal names with Icon', () => {
    expect(toComponentName('ban')).toBe('BanIcon');
    expect(toComponentName('chevron-down')).toBe('ChevronDownIcon');
    expect(toComponentName('circle-check-solid')).toBe('CircleCheckSolidIcon');
  });

  it('keeps the suffix when a digit appears mid-name (still a valid identifier)', () => {
    expect(toComponentName('office-365')).toBe('Office365Icon');
    expect(toComponentName('microsoft-365')).toBe('Microsoft365Icon');
  });

  it('prefixes numeric-leading names with Icon to stay a valid identifier', () => {
    expect(toComponentName('365-sync')).toBe('Icon365Sync');
    expect(toComponentName('3d-view')).toBe('Icon3dView');
    // every result must be a legal JS identifier (not start with a digit)
    for (const name of ['365-sync', '3d-view', '1-2-3']) {
      expect(toComponentName(name)).toMatch(/^[A-Za-z_$]/);
    }
  });

  it('pascalCase drops empty segments from stray separators', () => {
    expect(pascalCase('a--b_c')).toBe('ABC');
  });
});

describe('kebabCase', () => {
  it('splits camel boundaries in a design-assets PascalCase key', () => {
    expect(kebabCase('ChevronDown')).toBe('chevron-down');
    expect(kebabCase('AppWindowArrow')).toBe('app-window-arrow');
    expect(kebabCase('CircleCheckGreen')).toBe('circle-check-green');
    expect(kebabCase('AcronisAiMulti')).toBe('acronis-ai-multi');
  });

  it('keeps digit runs attached (matches the source SVG basenames)', () => {
    expect(kebabCase('Microsoft365')).toBe('microsoft365');
    expect(kebabCase('ComplianceE8')).toBe('compliance-e8');
    expect(kebabCase('S3')).toBe('s3');
  });

  it('round-trips back to the same component name as the kebab form', () => {
    for (const key of ['ChevronDown', 'AppWindowArrow', 'Microsoft365']) {
      expect(pascalCase(kebabCase(key))).toBe(key);
    }
  });
});
