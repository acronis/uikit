// Token-domain unit tests: the two pure pieces stage 1 (dtcg) and stage 2 (css)
// are built from — the DTCG normalization preprocessor and the `light-dark()`
// zipping CSS format. These run without Style Dictionary or disk I/O, against a
// small in-memory fixture token tree, so the normalization rules and the
// light/dark zip stay pinned independently of a full `build`.

import type { TransformedToken } from 'style-dictionary/types';
import { describe, expect, it, vi } from 'vitest';

import { collectDecls, serializeCss } from '../formats/css-light-dark';
import { gapUtilityClasses, STATIC_GAP_CLASSES } from '../formats/gap-utility-classes';
import { normalizeTree } from '../preprocessors/acronis-dtcg';
import { buildThemeExtend, colorKeyFromPath, routeColor, scopeToNamespace } from '../../tailwind';
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
    expect(css).toContain("[data-theme='light']");
    expect(css).toContain('color-scheme: light;');
    expect(css).toContain("[data-theme='dark']");
    expect(css).toContain('color-scheme: dark;');
  });

  it('sets the unconditional light-dark shell on :root only, not :host', () => {
    const css = serializeCss({
      brand: 'acronis',
      tier: 'semantics',
      isOverride: false,
      vars: new Map([['ui-x', 'red']]),
      classes: new Map(),
    });
    expect(css).toContain(':root {\n  color-scheme: light dark;\n}');
    expect(css).not.toContain(':host {\n  color-scheme: light dark;\n}');
    expect(css).not.toContain(':root, :host {\n  color-scheme: light dark;\n}');
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

// ── routeColor + buildThemeExtend (tailwind preset) ──────────────────────────

describe('routeColor', () => {
  it('routes semantic background to backgroundColor, dropping `colors`/role', () => {
    expect(routeColor(['colors', 'background', 'surface', 'primary'])).toEqual({
      namespace: 'backgroundColor',
      key: 'surface-primary',
    });
  });

  it('routes semantic text to textColor', () => {
    expect(routeColor(['colors', 'text', 'on-surface', 'primary'])).toEqual({
      namespace: 'textColor',
      key: 'on-surface-primary',
    });
  });

  it('routes glyph (icons) to fill — keeps it distinct from text', () => {
    expect(routeColor(['colors', 'glyph', 'on-surface', 'primary'])).toEqual({
      namespace: 'fill',
      key: 'on-surface-primary',
    });
  });

  it('routes focus to ringColor', () => {
    expect(routeColor(['colors', 'focus', 'brand'])).toEqual({
      namespace: 'ringColor',
      key: 'brand',
    });
  });

  it('routes the gradients root to backgroundImage', () => {
    expect(routeColor(['gradients', 'ai', 'idle'])).toEqual({
      namespace: 'backgroundImage',
      key: 'ai-idle',
    });
  });

  it('routes a component container.color to backgroundColor, keeping the part word', () => {
    expect(routeColor(['button', 'primary', 'container', 'color', 'idle'])).toEqual({
      namespace: 'backgroundColor',
      key: 'button-primary-container-idle',
    });
  });

  it('uses the role segment closest to the leaf (borderColor beats container)', () => {
    // Figma segments are camelCase (`borderColor`); routeColor matches the role
    // map by the verbatim segment, and `normalizeSegment` kebab-cases it for the
    // emitted key. The deeper `borderColor` wins over the outer `container`.
    expect(routeColor(['button', 'secondary', 'container', 'borderColor', 'idle'])).toEqual({
      namespace: 'borderColor',
      key: 'button-secondary-container-border-color-idle',
    });
  });

  it('normalizes leading underscores and drops the `color` wrapper', () => {
    expect(routeColor(['button', '_global', 'icon', 'color', 'idle'])).toEqual({
      namespace: 'fill',
      key: 'button-global-icon-idle',
    });
  });

  it('routes a component label.color to textColor', () => {
    expect(routeColor(['button', 'primary', 'label', 'color', 'idle'])).toEqual({
      namespace: 'textColor',
      key: 'button-primary-label-idle',
    });
  });

  it('throws for a color it cannot route', () => {
    expect(() => routeColor(['mystery', 'thing'])).toThrow(/Cannot route/);
  });
});

describe('colorKeyFromPath', () => {
  it('drops only the `color` wrapper for a component path (default args)', () => {
    // No role segment skipped, not semantic: every non-wrapper segment survives.
    expect(colorKeyFromPath(['table', 'data', 'row', 'color', 'idle'])).toBe('table-data-row-idle');
  });

  it('normalizes each surviving segment (camelCase → kebab, leading underscore)', () => {
    expect(colorKeyFromPath(['button', '_global', 'icon', 'borderColor', 'idle'])).toBe(
      'button-global-icon-border-color-idle',
    );
  });

  it('for a semantic path drops the role segment at skipIndex and a leading `colors` prefix', () => {
    // colors[0] tier prefix + role `background` at index 1 both dropped.
    expect(colorKeyFromPath(['colors', 'background', 'neutral', 'idle'], 1, true)).toBe('neutral-idle');
  });

  it('produces keys byte-identical to routeColor for the same path', () => {
    // routeColor delegates key building here — pin that they never drift.
    const path = ['button', 'secondary', 'container', 'borderColor', 'idle'];
    const { key } = routeColor(path);
    // borderColor is the role at index 3, but component paths are not semantic,
    // so no role segment is dropped — matching routeColor's component branch.
    expect(colorKeyFromPath(path)).toBe(key);
    expect(colorKeyFromPath(path)).toBe('button-secondary-container-border-color-idle');
  });
});

describe('scopeToNamespace', () => {
  it('maps each single Figma scope to its namespace', () => {
    expect(scopeToNamespace(['TEXT_FILL'])).toBe('textColor');
    expect(scopeToNamespace(['FRAME_FILL'])).toBe('backgroundColor');
    expect(scopeToNamespace(['STROKE_COLOR'])).toBe('borderColor');
    expect(scopeToNamespace(['SHAPE_FILL'])).toBe('fill');
  });

  it('defaults the icon SHAPE_FILL+STROKE_COLOR pair to fill', () => {
    expect(scopeToNamespace(['SHAPE_FILL', 'STROKE_COLOR'])).toBe('fill');
    expect(scopeToNamespace(['STROKE_COLOR', 'SHAPE_FILL'])).toBe('fill');
  });

  it('returns null when scopes give no signal', () => {
    expect(scopeToNamespace(['ALL_SCOPES'])).toBeNull();
    expect(scopeToNamespace([])).toBeNull();
    expect(scopeToNamespace(['WHO_KNOWS'])).toBeNull();
    // an unhandled multi-scope combination is ambiguous → null
    expect(scopeToNamespace(['TEXT_FILL', 'FRAME_FILL'])).toBeNull();
  });
});

describe('buildThemeExtend', () => {
  const tok = (over: Partial<TransformedToken>): TransformedToken =>
    ({ name: 'x', path: ['x'], ...over }) as TransformedToken;

  it('splits colors into role namespaces and bakes light-dark()', () => {
    const theme = buildThemeExtend(
      [
        tok({
          name: 'ui-background-surface-primary',
          path: ['colors', 'background', 'surface', 'primary'],
          $type: 'color',
          $value: 'rgb(255 255 255)',
        }),
      ],
      new Map([['colors.background.surface.primary', 'rgb(0 0 0)']])
    );
    expect(theme.backgroundColor['surface-primary']).toBe(
      'light-dark(rgb(255 255 255), rgb(0 0 0))'
    );
  });

  it('puts gradients in backgroundImage (not a color namespace)', () => {
    const theme = buildThemeExtend(
      [
        tok({
          name: 'ui-gradients-ai-idle',
          path: ['gradients', 'ai', 'idle'],
          $type: 'gradient',
          $value: 'linear-gradient(180deg, rgb(0 0 0) 20%, rgb(255 0 255) 100%)',
        }),
      ],
      new Map()
    );
    expect(theme.backgroundImage['ai-idle']).toContain('linear-gradient(');
    expect(theme.backgroundColor['ai-idle']).toBeUndefined();
  });

  it('drops the ui- prefix from dimension keys and splits radius vs spacing', () => {
    const theme = buildThemeExtend(
      [
        tok({ name: 'ui-button-global-gap', path: ['button', '_global', 'gap'], $type: 'dimension', $value: '8px' }),
        tok({ name: 'ui-button-global-radius', path: ['button', '_global', 'radius'], $type: 'dimension', $value: '4px' }),
      ],
      new Map()
    );
    expect(theme.spacing['button-global-gap']).toBe('8px');
    expect(theme.borderRadius['button-global-radius']).toBe('4px');
  });

  it('puts shadows in boxShadow, with the theme pair spliced into the color slot', () => {
    const theme = buildThemeExtend(
      [
        tok({
          name: 'ui-shadow-md',
          path: ['shadow', 'md'],
          $type: 'shadow',
          $value: '0px 16px 32px 0px rgb(0 0 0 / 0.102)',
        }),
      ],
      new Map([['shadow.md', '0px 16px 32px 0px rgb(0 0 0 / 0.4)']])
    );
    // The `shadow` role word is redundant with the namespace, so it is dropped —
    // the key `md` yields the utility `shadow-md`, not `shadow-shadow-md`.
    expect(theme.boxShadow.md).toBe(
      '0px 16px 32px 0px light-dark(rgb(0 0 0 / 0.102), rgb(0 0 0 / 0.4))'
    );
    expect(theme.spacing.md).toBeUndefined();
  });

  it('drops the redundant trailing role word from a component shadow key', () => {
    const theme = buildThemeExtend(
      [
        tok({
          name: 'ui-toast-global-container-shadow',
          path: ['Toast', '_global', 'container', 'shadow'],
          $type: 'shadow',
          $value: '0px 16px 32px 0px rgb(0 0 0 / 0.102)',
        }),
      ],
      new Map()
    );
    // `shadow-toast-global-container`, not `shadow-toast-global-container-shadow`.
    expect(theme.boxShadow['toast-global-container']).toBeDefined();
  });

  it('throws on a key collision instead of silently overwriting', () => {
    expect(() =>
      buildThemeExtend(
        [
          tok({ path: ['colors', 'background', 'surface', 'primary'], $type: 'color', $value: 'rgb(1 1 1)' }),
          tok({ path: ['colors', 'background', 'surface', 'primary'], $type: 'color', $value: 'rgb(2 2 2)' }),
        ],
        new Map()
      )
    ).toThrow(/collision/);
  });

  it('skips component color tokens with invalid light-dark() args', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const theme = buildThemeExtend(
        [
          tok({
            name: 'ui-button-primary-container-idle',
            path: ['button', 'primary', 'container', 'color', 'idle'],
            $type: 'color',
            $value: 'light-dark(rgb(255 255 255), rgb(0 0 0))',
          }),
        ],
        new Map()
      );
      expect(theme.backgroundColor['button-primary-container-idle']).toBeUndefined();
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('skipped invalid component color token value for light-dark()')
      );
    } finally {
      warn.mockRestore();
    }
  });

  it('throws for invalid semantic color token values in light-dark()', () => {
    expect(() =>
      buildThemeExtend(
        [
          tok({
            name: 'ui-background-surface-primary',
            path: ['colors', 'background', 'surface', 'primary'],
            $type: 'color',
            $value: 'rgb(255 255 255); color: red',
          }),
        ],
        new Map()
      )
    ).toThrow(/Invalid characters in color value for light-dark\(\)/);
  });

  it('falls back to the Figma scope for the namespace when the path has no role word', () => {
    // path carries no routable role (`table`/`data`/`row` aren't roles, `color`
    // is the skipped wrapper) → routeColor throws → scope decides the namespace,
    // path still builds the key (drop only `color`).
    const theme = buildThemeExtend(
      [
        tok({
          name: 'ui-table-data-row-idle',
          path: ['table', 'data', 'row', 'color', 'idle'],
          $type: 'color',
          $value: 'rgb(255 255 255)',
          $extensions: { 'com.figma.scopes': ['TEXT_FILL'] },
        } as Partial<TransformedToken>),
      ],
      new Map([['table.data.row.color.idle', 'rgb(0 0 0)']])
    );
    expect(theme.textColor['table-data-row-idle']).toBe('light-dark(rgb(255 255 255), rgb(0 0 0))');
  });

  it('still warns and skips a path-unroutable component color whose scope is ALL_SCOPES', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const theme = buildThemeExtend(
        [
          tok({
            name: 'ui-table-data-row-idle',
            path: ['table', 'data', 'row', 'color', 'idle'],
            $type: 'color',
            $value: 'rgb(255 255 255)',
            $extensions: { 'com.figma.scopes': ['ALL_SCOPES'] },
          } as Partial<TransformedToken>),
        ],
        new Map()
      );
      expect(theme.textColor['table-data-row-idle']).toBeUndefined();
      expect(theme.backgroundColor['table-data-row-idle']).toBeUndefined();
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('skipped unroutable component color token')
      );
    } finally {
      warn.mockRestore();
    }
  });

  it('keeps semantic color route failures fatal even with a mappable scope', () => {
    expect(() =>
      buildThemeExtend(
        [
          tok({
            path: ['colors', 'mystery', 'thing'],
            $type: 'color',
            $value: 'rgb(1 1 1)',
            $extensions: { 'com.figma.scopes': ['TEXT_FILL'] },
          } as Partial<TransformedToken>),
        ],
        new Map()
      )
    ).toThrow(/Cannot route/);
  });
});
