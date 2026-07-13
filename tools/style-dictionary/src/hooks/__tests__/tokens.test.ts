// Token-domain unit tests: the two pure pieces stage 1 (dtcg) and stage 2 (css)
// are built from — the DTCG normalization preprocessor and the `light-dark()`
// zipping CSS format. These run without Style Dictionary or disk I/O, against a
// small in-memory fixture token tree, so the normalization rules and the
// light/dark zip stay pinned independently of a full `build`.

import type { TransformedToken } from 'style-dictionary/types';
import { describe, expect, it, vi } from 'vitest';

import { collectDecls, serializeCss } from '../formats/css-light-dark';
import { normalizeTree } from '../preprocessors/acronis-dtcg';
import { buildThemeExtend, routeColor } from '../../tailwind';

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
  spacing: {
    sm: {
      $type: 'dimension',
      platforms: ['PD'],
      $value: { value: 8, unit: 'px' },
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
    const sm = at(normalizeTree(SOURCE, 'light', 'PD'), 'spacing', 'sm');
    expect(sm.$type).toBe('dimension');
    expect(sm.$value).toEqual({ value: 8, unit: 'px' });
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
});
