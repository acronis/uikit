// Pins the two pure pieces of the brand model: data-driven discovery
// (`collectValueKeys` surfaces any `values.<brand>` key, so a new Figma brand
// needs no code change) and override-only emission (`diffDecls` keeps only what a
// brand changes vs. the default base). Together these guard the contract that
// adding a brand = adding data, and that non-default brands ship diffs, not full
// copies (#177). No Style Dictionary or disk I/O — synthetic fixtures only.

import { describe, expect, it } from 'vitest';

import type { Decls } from '../hooks/formats/css-light-dark';
import { collectValueKeys, diffDecls } from '../tokens';

describe('collectValueKeys (data-driven brand discovery)', () => {
  it('collects the union of `values` keys across a token tree', () => {
    const tree = {
      background: {
        brand: {
          $type: 'color',
          values: { acronis: { ref: 'a' }, 'brand-b': { ref: 'b' } },
        },
      },
      text: {
        primary: { $type: 'color', values: { acronis: { ref: 'c' } } },
      },
    };
    const keys = new Set<string>();
    collectValueKeys(tree, keys);
    expect([...keys].sort()).toEqual(['acronis', 'brand-b']);
  });

  it('surfaces a newly added brand mode with no code change', () => {
    const tree = {
      background: {
        brand: {
          $type: 'color',
          values: { acronis: 1, 'brand-b': 2, telstra: 3 },
        },
      },
    };
    const keys = new Set<string>();
    collectValueKeys(tree, keys);
    expect(keys.has('telstra')).toBe(true);
  });

  it('does not descend into the resolved values, and ignores $-prefixed metadata', () => {
    const tree = {
      token: {
        $type: 'color',
        $extensions: { 'com.figma.variableId': 'X' },
        // a brand value object whose own keys must NOT be mistaken for brands
        values: { acronis: { colorSpace: 'hsl', components: [0, 0, 0] } },
      },
    };
    const keys = new Set<string>();
    collectValueKeys(tree, keys);
    expect([...keys]).toEqual(['acronis']);
  });
});

describe('diffDecls (override-only emission)', () => {
  const decls = (vars: Record<string, string>, classes: Record<string, string> = {}): Decls => ({
    vars: new Map(Object.entries(vars)),
    classes: new Map(Object.entries(classes)),
    skipped: [],
  });

  it('emits nothing when the brand equals the base', () => {
    const base = decls({ '--ui-a': '1', '--ui-b': '2' });
    const out = diffDecls(base, decls({ '--ui-a': '1', '--ui-b': '2' }));
    expect(out.vars.size).toBe(0);
    expect(out.classes.size).toBe(0);
  });

  it('keeps only the vars whose value differs from the base', () => {
    const base = decls({ '--ui-a': '1', '--ui-b': '2' });
    const out = diffDecls(base, decls({ '--ui-a': '1', '--ui-b': '9' }));
    expect([...out.vars]).toEqual([['--ui-b', '9']]);
  });

  it('keeps a var the brand introduces that the base lacks', () => {
    const base = decls({ '--ui-a': '1' });
    const out = diffDecls(base, decls({ '--ui-a': '1', '--ui-c': '3' }));
    expect([...out.vars]).toEqual([['--ui-c', '3']]);
  });

  it('diffs typography class blocks the same way', () => {
    const base = decls({}, { '.ui-typography-body': 'font-size: 14px;' });
    const out = diffDecls(base, decls({}, { '.ui-typography-body': 'font-size: 16px;' }));
    expect([...out.classes]).toEqual([['.ui-typography-body', 'font-size: 16px;']]);
  });
});
