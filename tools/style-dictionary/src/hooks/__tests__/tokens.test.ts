// Token-domain unit tests: the two pure pieces stage 1 (dtcg) and stage 2 (css)
// are built from — the DTCG normalization preprocessor and the `light-dark()`
// zipping CSS format. These run without Style Dictionary or disk I/O, against a
// small in-memory fixture token tree, so the normalization rules and the
// light/dark zip stay pinned independently of a full `build`.

import type { TransformedToken } from 'style-dictionary/types';
import { describe, expect, it } from 'vitest';

import { collectDecls, serializeCss } from '../formats/css-light-dark';
import { gapUtilityClasses, STATIC_GAP_CLASSES } from '../formats/gap-utility-classes';
import { normalizeTree } from '../preprocessors/acronis-dtcg';
import { diffDecls } from '../../tokens';

// ── normalizeTree (stage 1) ──────────────────────────────────────────────────

// A fixture in the Acronis source shape: per-mode `values`, a native DTCG
// dimension `$value` { value, unit }, plain fontWeight/fontFamily scalar
// `$value`s, a `$value` composite, and a token scoped to a different platform.
const SOURCE = {
  $type: 'color',
  colors: {
    background: {
      base: {
        platforms: ['PD', 'WEB'],
        values: { light: { h: 0, s: 0, l: 100 }, dark: { h: 0, s: 0, l: 0 } },
      },
      'web-only': {
        platforms: ['WEB'],
        values: { light: { h: 1, s: 1, l: 1 }, dark: { h: 2, s: 2, l: 2 } },
      },
    },
  },
  units: {
    gap: {
      '8': {
        $type: 'dimension',
        platforms: ['PD'],
        $value: { value: 8, unit: 'px' },
      },
    },
  },
  font: {
    weight: {
      bold: {
        $type: 'fontWeight',
        platforms: ['PD'],
        $value: 700,
      },
    },
    family: {
      default: {
        $type: 'fontFamily',
        platforms: ['PD'],
        $value: 'Inter',
      },
    },
  },
  typography: {
    body: {
      $type: 'typography',
      platforms: ['PD'],
      $value: { fontFamily: 'Inter', fontSize: '14px' },
    },
  },
};

// Walk into a normalized tree by key path, keeping each level typed as a node
// (avoids `any` while still reaching `$value`/`$type` on the leaf).
type DtcgNode = Record<string, unknown>;
const at = (tree: unknown, ...keys: string[]): DtcgNode => {
  let node = tree as DtcgNode;
  for (const key of keys) node = node[key] as DtcgNode;
  return node;
};

describe('normalizeTree', () => {
  it('picks the requested mode out of each token `values` dict', () => {
    expect(at(normalizeTree(SOURCE, 'light', 'PD'), 'colors', 'background', 'base').$value).toEqual({
      h: 0,
      s: 0,
      l: 100,
    });
    expect(at(normalizeTree(SOURCE, 'dark', 'PD'), 'colors', 'background', 'base').$value).toEqual({
      h: 0,
      s: 0,
      l: 0,
    });
  });

  it('drops tokens not scoped to the requested platform, pruning empty groups', () => {
    const background = at(normalizeTree(SOURCE, 'light', 'PD'), 'colors', 'background');
    // `web-only` is WEB-scoped; `base` is the only PD child of `background`.
    expect(background['web-only']).toBeUndefined();
    expect(Object.keys(background)).toEqual(['base']);
  });

  it('passes a native dimension `$value` { value, unit } through untouched', () => {
    const gap8 = at(normalizeTree(SOURCE, 'light', 'PD'), 'units', 'gap', '8');
    expect(gap8.$type).toBe('dimension');
    expect(gap8.$value).toEqual({ value: 8, unit: 'px' });
  });

  it('passes plain fontWeight (number) and fontFamily (string) scalars through untouched', () => {
    const tree = normalizeTree(SOURCE, 'light', 'PD');
    expect(at(tree, 'font', 'weight', 'bold').$value).toBe(700);
    expect(at(tree, 'font', 'family', 'default').$value).toBe('Inter');
  });

  it('keeps a mode-invariant `$value` composite untouched', () => {
    expect(at(normalizeTree(SOURCE, 'light', 'PD'), 'typography', 'body').$value).toEqual({
      fontFamily: 'Inter',
      fontSize: '14px',
    });
  });

  it('strips the non-DTCG `platforms` array off normalized tokens', () => {
    expect('platforms' in at(normalizeTree(SOURCE, 'light', 'PD'), 'colors', 'background', 'base')).toBe(
      false
    );
  });

  it('returns an empty tree when no token matches the platform', () => {
    expect(normalizeTree(SOURCE, 'light', 'OTHER')).toEqual({});
  });

  it('infers `$type: color` for an untyped token whose value is a DTCG color object', () => {
    // The `branding` primitives are emitted without a group-level `$type: color`;
    // resolution + the type-gated color transform need it, so it is inferred.
    const source = {
      branding: {
        acme: {
          primary: {
            platforms: ['PD'],
            values: {
              light: { colorSpace: 'hsl', components: [195, 100, 28] },
              dark: { colorSpace: 'hsl', components: [240, 8, 5] },
            },
          },
        },
      },
    };
    const leaf = at(normalizeTree(source, 'light', 'PD'), 'branding', 'acme', 'primary');
    expect(leaf.$type).toBe('color');
    expect(leaf.$value).toEqual({ colorSpace: 'hsl', components: [195, 100, 28] });
  });

  it('leaves an untyped non-color token untyped (inference is color-only)', () => {
    const source = { misc: { flag: { platforms: ['PD'], values: { light: 'yes', dark: 'no' } } } };
    const leaf = at(normalizeTree(source, 'light', 'PD'), 'misc', 'flag');
    expect('$type' in leaf).toBe(false);
    expect(leaf.$value).toBe('yes');
  });
});

// ── collectDecls + serializeCss (stage 2) ────────────────────────────────────

const token = (over: Partial<TransformedToken>): TransformedToken =>
  ({ name: 'x', path: ['x'], ...over }) as TransformedToken;

const render = (tokens: TransformedToken[], darkTokens = new Map<string, string>()): string => {
  const { vars, classes } = collectDecls(tokens, darkTokens);
  return serializeCss({ brand: 'acronis', tier: 'semantics', isOverride: false, vars, classes });
};

describe('collectDecls', () => {
  it('zips a color into light-dark() using its dark override', () => {
    const css = render(
      [token({ name: 'ui-bg', path: ['colors', 'bg'], $type: 'color', $value: 'rgb(255 255 255)' })],
      new Map([['colors.bg', 'rgb(0 0 0)']])
    );
    expect(css).toContain('--ui-bg: light-dark(rgb(255 255 255), rgb(0 0 0));');
  });

  it('falls back to the light value when no dark override exists', () => {
    const css = render([
      token({ name: 'ui-bg', path: ['colors', 'bg'], $type: 'color', $value: 'rgb(255 255 255)' }),
    ]);
    expect(css).toContain('--ui-bg: light-dark(rgb(255 255 255), rgb(255 255 255));');
  });

  it('emits a dimension token as a plain custom property', () => {
    const css = render([token({ name: 'ui-spacing-sm', $type: 'dimension', $value: '8px' })]);
    expect(css).toContain('--ui-spacing-sm: 8px;');
  });

  it('emits a resolved gradient string as a plain custom property', () => {
    const css = render([
      token({ name: 'ui-bg-ai', $type: 'gradient', $value: 'linear-gradient(180deg, rgb(0 0 0) 0%)' }),
    ]);
    expect(css).toContain('--ui-bg-ai: linear-gradient(180deg, rgb(0 0 0) 0%);');
  });

  it('wraps a typography composite in a utility class selector', () => {
    const css = render([
      token({ name: 'ui-typography-body', $type: 'typography', $value: 'font-family: Inter;\nfont-size: 14px;' }),
    ]);
    expect(css).toContain('.ui-typography-body {');
    expect(css).toContain('  font-family: Inter;');
  });

  // `light-dark()` is a COLOR function — it is only valid where CSS expects a
  // <color>, so it cannot wrap a whole box-shadow. The theme pair has to be spliced
  // into the shadow's color slot instead.
  it('splices light-dark() into the color slot when only the shadow color varies by theme', () => {
    const css = render(
      [
        token({
          name: 'ui-shadow-md',
          path: ['shadow', 'md'],
          $type: 'shadow',
          $value: '0px 16px 32px 0px rgb(0 0 0 / 0.102)',
        }),
      ],
      new Map([['shadow.md', '0px 16px 32px 0px rgb(0 0 0 / 0.4)']])
    );
    expect(css).toContain(
      '--ui-shadow-md: 0px 16px 32px 0px light-dark(rgb(0 0 0 / 0.102), rgb(0 0 0 / 0.4));'
    );
  });

  it('emits a theme-invariant shadow unwrapped', () => {
    const value = '0px 16px 32px 0px rgb(0 0 0 / 0.102)';
    const css = render(
      [token({ name: 'ui-shadow-md', path: ['shadow', 'md'], $type: 'shadow', $value: value })],
      new Map([['shadow.md', value]])
    );
    expect(css).toContain(`--ui-shadow-md: ${value};`);
    expect(css).not.toContain('light-dark');
  });

  it('skips a shadow whose geometry varies by theme rather than emitting something wrong', () => {
    const { skipped, vars } = collectDecls(
      [
        token({
          name: 'ui-shadow-md',
          path: ['shadow', 'md'],
          $type: 'shadow',
          $value: '0px 16px 32px 0px rgb(0 0 0 / 0.102)',
        }),
      ],
      new Map([['shadow.md', '0px 99px 32px 0px rgb(0 0 0 / 0.4)']])
    );
    expect(vars.has('ui-shadow-md')).toBe(false);
    expect(skipped).toContain('ui-shadow-md (shadow: theme-varying geometry)');
  });

  it('collects unrepresentable tokens into the skipped list', () => {
    const { skipped } = collectDecls(
      [token({ name: 'grad', $type: 'gradient', $value: { stops: [] } as unknown as string })],
      new Map()
    );
    expect(skipped).toContain('grad (gradient)');
  });

  it('sorts custom properties by name for stable output', () => {
    const css = render([
      token({ name: 'b-token', $type: 'dimension', $value: '2px' }),
      token({ name: 'a-token', $type: 'dimension', $value: '1px' }),
    ]);
    expect(css.indexOf('--a-token')).toBeLessThan(css.indexOf('--b-token'));
  });

  // Every emitted class is an unlayered, single-class selector, so document
  // order decides which rule wins when two classes land on the same element.
  // Side-specific utilities (physical or logical) must always render after
  // the axis utilities they're meant to override — plain alphabetical order
  // gets this backwards (px/py sort after every pt/pb/pl/pr/ps/pe prefix).
  it('orders side-specific padding/margin classes after axis classes, regardless of size', () => {
    const { vars, classes } = collectDecls([], new Map());
    for (const [selector, block] of gapUtilityClasses('ui-gap-16', '16')) classes.set(selector, block);
    for (const [selector, block] of gapUtilityClasses('ui-gap-24', '24')) classes.set(selector, block);
    const css = serializeCss({ brand: 'acronis', tier: 'semantics', isOverride: false, vars, classes });

    for (const side of ['.ui-pt-16', '.ui-pb-16', '.ui-pl-16', '.ui-pr-16', '.ui-ps-16', '.ui-pe-16']) {
      expect(css.indexOf('.ui-px-16')).toBeLessThan(css.indexOf(side));
      expect(css.indexOf('.ui-py-16')).toBeLessThan(css.indexOf(side));
    }
    // Different sizes must not defeat the prefix-category ordering.
    expect(css.indexOf('.ui-px-24')).toBeLessThan(css.indexOf('.ui-ps-16'));
  });

});

describe('gapUtilityClasses', () => {
  it('returns one selector per property/direction combination, all referencing the same var', () => {
    const classes = gapUtilityClasses('ui-gap-16', '16');
    expect(classes.size).toBe(21); // 9 padding + 9 margin + 3 gap
    for (const block of classes.values()) {
      expect(block).toContain('var(--ui-gap-16)');
    }
  });

  // Pins each selector to its CSS property — a swap in PADDING_DIRECTIONS/
  // MARGIN_DIRECTIONS (e.g. ps↔pe or ml↔mr) would still pass the size/var
  // assertion above but silently break the logical (RTL-mirroring) or
  // physical side utilities.
  it('maps each selector to the correct CSS property', () => {
    const classes = gapUtilityClasses('ui-gap-16', '16');
    const expected: Record<string, string> = {
      '.ui-p-16': 'padding',
      '.ui-px-16': 'padding-inline',
      '.ui-py-16': 'padding-block',
      '.ui-pt-16': 'padding-top',
      '.ui-pb-16': 'padding-bottom',
      '.ui-pl-16': 'padding-left',
      '.ui-pr-16': 'padding-right',
      '.ui-ps-16': 'padding-inline-start',
      '.ui-pe-16': 'padding-inline-end',
      '.ui-m-16': 'margin',
      '.ui-mx-16': 'margin-inline',
      '.ui-my-16': 'margin-block',
      '.ui-mt-16': 'margin-top',
      '.ui-mb-16': 'margin-bottom',
      '.ui-ml-16': 'margin-left',
      '.ui-mr-16': 'margin-right',
      '.ui-ms-16': 'margin-inline-start',
      '.ui-me-16': 'margin-inline-end',
      '.ui-gap-16': 'gap',
      '.ui-gap-x-16': 'column-gap',
      '.ui-gap-y-16': 'row-gap',
    };
    for (const [selector, property] of Object.entries(expected)) {
      expect(classes.get(selector)).toBe(`${property}: var(--ui-gap-16);`);
    }
  });
});

describe('STATIC_GAP_CLASSES', () => {
  it('renders .ui-mx-auto once', () => {
    const withoutStatic = render([token({ name: 'ui-x', $type: 'dimension', $value: '1px' })]);
    expect(withoutStatic).not.toContain('.ui-mx-auto');

    const { vars, classes } = collectDecls([token({ name: 'ui-x', $type: 'dimension', $value: '1px' })], new Map());
    for (const [selector, block] of STATIC_GAP_CLASSES) classes.set(selector, block);
    const withStatic = serializeCss({ brand: 'acronis', tier: 'semantics', isOverride: false, vars, classes });
    expect(withStatic.match(/\.ui-mx-auto/g)).toHaveLength(1);
    expect(withStatic).toContain('margin-inline: auto;');
  });

  it('brand override omits gap vars/classes when identical to the default (no diff)', () => {
    // `tokens.ts`'s dedicated gap resolution path (not collectDecls) injects
    // `--ui-gap-*` vars + classes identically into every brand's semantics
    // slice, since `units.gap` carries no brand axis — this pins that
    // identical inputs diff to nothing, the same way STATIC_GAP_CLASSES does.
    const base = collectDecls(
      [token({ name: 'ui-gap-8', path: ['units', 'gap', '8'], $type: 'dimension', $value: '8px' })],
      new Map()
    );
    for (const [selector, block] of STATIC_GAP_CLASSES) base.classes.set(selector, block);

    const brand = collectDecls(
      [token({ name: 'ui-gap-8', path: ['units', 'gap', '8'], $type: 'dimension', $value: '8px' })],
      new Map()
    );
    for (const [selector, block] of STATIC_GAP_CLASSES) brand.classes.set(selector, block);

    const { vars, classes } = diffDecls(base, brand);
    expect(vars.size).toBe(0);
    expect(classes.size).toBe(0);
  });
});

describe('serializeCss', () => {
  it('includes the light/dark shell in base files', () => {
    const css = serializeCss({
      brand: 'acronis',
      tier: 'semantics',
      isOverride: false,
      vars: new Map([['ui-x', 'red']]),
      classes: new Map(),
    });
    expect(css).toContain('color-scheme: light dark;');
    expect(css).toContain("[data-theme='dark']");
  });

  it('targets both :root and :host so tokens resolve in shadow roots', () => {
    const base = serializeCss({
      brand: 'acronis',
      tier: 'semantics',
      isOverride: false,
      vars: new Map([['ui-x', 'red']]),
      classes: new Map(),
    });
    expect(base).toContain(':root, :host {');
    expect(base).toContain(":host([data-theme='light'])");
    expect(base).toContain(":host([data-theme='dark'])");

    const override = serializeCss({
      brand: 'brand-b',
      tier: 'semantics',
      isOverride: true,
      vars: new Map([['ui-x', 'blue']]),
      classes: new Map(),
    });
    expect(override).toContain(':root, :host {');
  });

  it('omits the shell from override files', () => {
    const css = serializeCss({
      brand: 'brand-b',
      tier: 'semantics',
      isOverride: true,
      vars: new Map([['ui-x', 'blue']]),
      classes: new Map(),
    });
    expect(css).not.toContain('color-scheme');
    expect(css).toContain('--ui-x: blue;');
  });
});
