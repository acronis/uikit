// Token-domain unit tests: the two pure pieces stage 1 (dtcg) and stage 2 (css)
// are built from — the DTCG normalization preprocessor and the `light-dark()`
// zipping CSS format. These run without Style Dictionary or disk I/O, against a
// small in-memory fixture token tree, so the normalization rules and the
// light/dark zip stay pinned independently of a full `build`.

import type { TransformedToken } from 'style-dictionary/types';
import { describe, expect, it, vi } from 'vitest';

import { STATIC_BORDER_WIDTH_CLASSES } from '../formats/border-width-classes';
import { spaceYUtilityClass, STATIC_DIVIDE_CLASSES } from '../formats/child-spacing-classes';
import { collectDecls, serializeCss } from '../formats/css-light-dark';
import { STATIC_FRACTION_CLASSES } from '../formats/fraction-utility-classes';
import { gapUtilityClasses, STATIC_GAP_CLASSES } from '../formats/gap-utility-classes';
import { STATIC_LAYOUT_CLASSES } from '../formats/layout-utility-classes';
import { STATIC_LIST_CURSOR_RESIZE_CLASSES } from '../formats/list-cursor-resize-classes';
import { STATIC_NAMED_MAX_WIDTH_CLASSES } from '../formats/named-max-width-classes';
import {
  offsetUtilityClasses,
  STATIC_OFFSET_CLASSES,
  STATIC_POSITION_TYPE_CLASSES,
} from '../formats/position-utility-classes';
import { semanticColorClasses } from '../formats/semantic-color-classes';
import { sizingUtilityClasses, STATIC_SIZING_CLASSES } from '../formats/sizing-utility-classes';
import { STATIC_TEXT_DECORATION_CLASSES } from '../formats/text-decoration-classes';
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

describe('sizingUtilityClasses', () => {
  it('returns one selector per width/height direction, all referencing the same var', () => {
    const classes = sizingUtilityClasses('ui-gap-16', '16');
    expect(classes.size).toBe(6); // w, h, min-w, min-h, max-w, max-h
    for (const block of classes.values()) {
      expect(block).toContain('var(--ui-gap-16)');
    }
  });

  it('maps each selector to the correct CSS property', () => {
    const classes = sizingUtilityClasses('ui-gap-16', '16');
    const expected: Record<string, string> = {
      '.ui-w-16': 'width',
      '.ui-h-16': 'height',
      '.ui-min-w-16': 'min-width',
      '.ui-min-h-16': 'min-height',
      '.ui-max-w-16': 'max-width',
      '.ui-max-h-16': 'max-height',
    };
    for (const [selector, property] of Object.entries(expected)) {
      expect(classes.get(selector)).toBe(`${property}: var(--ui-gap-16);`);
    }
  });
});

describe('STATIC_SIZING_CLASSES', () => {
  it('renders .ui-max-w-full once', () => {
    const { vars, classes } = collectDecls([token({ name: 'ui-x', $type: 'dimension', $value: '1px' })], new Map());
    for (const [selector, block] of STATIC_SIZING_CLASSES) classes.set(selector, block);
    const css = serializeCss({ brand: 'acronis', tier: 'semantics', isOverride: false, vars, classes });
    expect(css.match(/\.ui-max-w-full/g)).toHaveLength(1);
    expect(css).toContain('max-width: 100%;');
  });

  it('brand override omits the class when identical to the default (no diff)', () => {
    const base = collectDecls([], new Map());
    for (const [selector, block] of STATIC_SIZING_CLASSES) base.classes.set(selector, block);

    const brand = collectDecls([], new Map());
    for (const [selector, block] of STATIC_SIZING_CLASSES) brand.classes.set(selector, block);

    const { classes } = diffDecls(base, brand);
    expect(classes.size).toBe(0);
  });
});

describe('STATIC_LAYOUT_CLASSES', () => {
  it('emits the flex/grid/alignment/text-flow/display classes, no typographic ones', () => {
    const classes = STATIC_LAYOUT_CLASSES;
    expect(classes.get('.ui-flex')).toBe('display: flex;');
    expect(classes.get('.ui-grid-cols-12')).toBe('grid-template-columns: repeat(12, minmax(0, 1fr));');
    expect(classes.get('.ui-col-span-3')).toBe('grid-column: span 3 / span 3;');
    expect(classes.get('.ui-items-center')).toBe('align-items: center;');
    expect(classes.get('.ui-justify-between')).toBe('justify-content: space-between;');
    expect(classes.get('.ui-text-left')).toBe('text-align: left;');
    expect(classes.get('.ui-float-right')).toBe('float: right;');
    expect(classes.get('.ui-whitespace-nowrap')).toBe('white-space: nowrap;');
    expect(classes.get('.ui-truncate')).toBe(
      'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'
    );
    expect(classes.get('.ui-line-clamp-3')).toBe(
      'overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;'
    );
    expect(classes.get('.ui-hidden')).toBe('display: none;');

    // Nothing typographic — that stays owned by .ui-typography-*.
    for (const selector of classes.keys()) {
      expect(selector).not.toMatch(/font|leading|tracking/);
    }
  });

  it('does not exceed Tailwind-mirrored grid/line-clamp ceilings (12 cols, 6 rows, 6-line clamp)', () => {
    const classes = STATIC_LAYOUT_CLASSES;
    expect(classes.has('.ui-grid-cols-12')).toBe(true);
    expect(classes.has('.ui-grid-cols-13')).toBe(false);
    expect(classes.has('.ui-row-span-6')).toBe(true);
    expect(classes.has('.ui-row-span-7')).toBe(false);
    expect(classes.has('.ui-line-clamp-6')).toBe(true);
    expect(classes.has('.ui-line-clamp-7')).toBe(false);
  });

  it('renders once and diffs to nothing across identical brands', () => {
    const base = collectDecls([], new Map());
    for (const [selector, block] of STATIC_LAYOUT_CLASSES) base.classes.set(selector, block);
    const brand = collectDecls([], new Map());
    for (const [selector, block] of STATIC_LAYOUT_CLASSES) brand.classes.set(selector, block);
    const { classes } = diffDecls(base, brand);
    expect(classes.size).toBe(0);
  });
});

describe('STATIC_FRACTION_CLASSES', () => {
  it('emits width and height fraction classes with escaped selectors', () => {
    const classes = STATIC_FRACTION_CLASSES;
    expect(classes.get('.ui-w-1\\/2')).toBe('width: 50%;');
    expect(classes.get('.ui-h-1\\/2')).toBe('height: 50%;');
    expect(classes.get('.ui-w-1\\/3')).toBe('width: 33.333333%;');
    expect(classes.get('.ui-w-11\\/12')).toBe('width: 91.666667%;');
  });

  it('keeps literal (unreduced) fraction labels distinct, matching Tailwind', () => {
    // 2/4 and 1/2 both render 50% but stay separate selectors — Tailwind
    // doesn't reduce fractions, and neither do we.
    const classes = STATIC_FRACTION_CLASSES;
    expect(classes.has('.ui-w-2\\/4')).toBe(true);
    expect(classes.has('.ui-w-1\\/2')).toBe(true);
    expect(classes.get('.ui-w-2\\/4')).toBe(classes.get('.ui-w-1\\/2'));
  });

  it('renders 26 fractions × 2 properties (width, height)', () => {
    expect(STATIC_FRACTION_CLASSES.size).toBe(52);
  });
});

describe('STATIC_NAMED_MAX_WIDTH_CLASSES', () => {
  it('emits the xs..7xl named scale', () => {
    const classes = STATIC_NAMED_MAX_WIDTH_CLASSES;
    expect(classes.get('.ui-max-w-xs')).toBe('max-width: 320px;');
    expect(classes.get('.ui-max-w-2xl')).toBe('max-width: 672px;');
    expect(classes.get('.ui-max-w-7xl')).toBe('max-width: 1280px;');
    expect(classes.size).toBe(11);
  });
});

describe('offsetUtilityClasses', () => {
  it('returns one selector per offset direction, all referencing the same var', () => {
    const classes = offsetUtilityClasses('ui-gap-16', '16');
    expect(classes.size).toBe(9); // top, right, bottom, left, start, end, inset, inset-x, inset-y
    for (const block of classes.values()) {
      expect(block).toContain('var(--ui-gap-16)');
    }
  });

  it('maps each selector to the correct CSS property', () => {
    const classes = offsetUtilityClasses('ui-gap-16', '16');
    const expected: Record<string, string> = {
      '.ui-top-16': 'top',
      '.ui-right-16': 'right',
      '.ui-bottom-16': 'bottom',
      '.ui-left-16': 'left',
      '.ui-start-16': 'inset-inline-start',
      '.ui-end-16': 'inset-inline-end',
      '.ui-inset-16': 'inset',
      '.ui-inset-x-16': 'inset-inline',
      '.ui-inset-y-16': 'inset-block',
    };
    for (const [selector, property] of Object.entries(expected)) {
      expect(classes.get(selector)).toBe(`${property}: var(--ui-gap-16);`);
    }
  });
});

describe('STATIC_POSITION_TYPE_CLASSES', () => {
  it('emits the five position-type classes', () => {
    const classes = STATIC_POSITION_TYPE_CLASSES;
    expect(classes.get('.ui-relative')).toBe('position: relative;');
    expect(classes.get('.ui-absolute')).toBe('position: absolute;');
    expect(classes.get('.ui-fixed')).toBe('position: fixed;');
    expect(classes.get('.ui-sticky')).toBe('position: sticky;');
    expect(classes.get('.ui-static')).toBe('position: static;');
  });
});

describe('STATIC_OFFSET_CLASSES', () => {
  it('emits a full (100%) variant for every offset direction', () => {
    const classes = STATIC_OFFSET_CLASSES;
    expect(classes.get('.ui-top-full')).toBe('top: 100%;');
    expect(classes.get('.ui-right-full')).toBe('right: 100%;');
    expect(classes.get('.ui-inset-full')).toBe('inset: 100%;');
    expect(classes.size).toBe(9);
  });
});

describe('STATIC_LIST_CURSOR_RESIZE_CLASSES', () => {
  it('emits the ticket-cited list/cursor classes and their sibling values', () => {
    const classes = STATIC_LIST_CURSOR_RESIZE_CLASSES;
    expect(classes.get('.ui-list-disc')).toBe('list-style-type: disc;');
    expect(classes.get('.ui-list-inside')).toBe('list-style-position: inside;');
    expect(classes.get('.ui-list-none')).toBe('list-style-type: none;');
    expect(classes.get('.ui-cursor-help')).toBe('cursor: help;');
    expect(classes.get('.ui-cursor-move')).toBe('cursor: move;');
    expect(classes.get('.ui-cursor-pointer')).toBe('cursor: pointer;');
    expect(classes.get('.ui-cursor-not-allowed')).toBe('cursor: not-allowed;');
    expect(classes.get('.ui-resize-none')).toBe('resize: none;');
    expect(classes.get('.ui-resize')).toBe('resize: both;');
  });
});

describe('STATIC_BORDER_WIDTH_CLASSES', () => {
  it('emits the ticket-cited border-width classes plus the full per-side scale', () => {
    const classes = STATIC_BORDER_WIDTH_CLASSES;
    expect(classes.get('.ui-border-t-0')).toBe('border-top-width: 0px;');
    expect(classes.get('.ui-border-x-0')).toBe('border-inline-width: 0px;');
    expect(classes.get('.ui-border-y')).toBe('border-block-width: 1px;');
    expect(classes.get('.ui-border')).toBe('border-width: 1px;');
    expect(classes.get('.ui-border-4')).toBe('border-width: 4px;');
    expect(classes.get('.ui-border-l-8')).toBe('border-left-width: 8px;');
  });

  it('renders 7 directions (all sides + 6 per-side) × 5 widths = 35 classes', () => {
    expect(STATIC_BORDER_WIDTH_CLASSES.size).toBe(35);
  });
});

describe('spaceYUtilityClass', () => {
  it('targets the not-hidden sibling combinator, referencing the shared var', () => {
    const [selector, block] = spaceYUtilityClass('ui-gap-16', '16');
    expect(selector).toBe('.ui-space-y-16 > :not([hidden]) ~ :not([hidden])');
    expect(block).toBe('margin-top: var(--ui-gap-16);');
  });
});

describe('STATIC_DIVIDE_CLASSES', () => {
  it('emits ui-divide-y using the established divider token', () => {
    const classes = STATIC_DIVIDE_CLASSES;
    const block = classes.get('.ui-divide-y > :not([hidden]) ~ :not([hidden])');
    expect(block).toContain('border-top-width: 1px;');
    expect(block).toContain('border-color: var(--ui-border-on-surface-divider);');
  });
});

describe('STATIC_TEXT_DECORATION_CLASSES', () => {
  it('emits ui-underline-offset-4', () => {
    expect(STATIC_TEXT_DECORATION_CLASSES.get('.ui-underline-offset-4')).toBe(
      'text-underline-offset: 4px;'
    );
  });
});

describe('semanticColorClasses', () => {
  it('wraps every ui-text-*/ui-background-*/ui-border-* var, full path, no truncation', () => {
    const vars = new Map<string, string>([
      ['ui-text-on-surface-link-idle', 'light-dark(rgb(0 0 0), rgb(255 255 255))'],
      ['ui-background-surface-primary', 'light-dark(rgb(255 255 255), rgb(0 0 0))'],
      ['ui-border-on-surface-border', 'light-dark(rgb(200 200 200), rgb(50 50 50))'],
    ]);
    const classes = semanticColorClasses(vars);
    expect(classes.get('.ui-text-on-surface-link-idle')).toBe(
      'color: var(--ui-text-on-surface-link-idle);'
    );
    expect(classes.get('.ui-bg-surface-primary')).toBe(
      'background-color: var(--ui-background-surface-primary);'
    );
    expect(classes.get('.ui-border-on-surface-border')).toBe(
      'border-color: var(--ui-border-on-surface-border);'
    );
  });

  it('ignores vars outside the text/background/border roots', () => {
    const vars = new Map<string, string>([
      ['ui-gap-16', '16px'],
      ['ui-shadow-md', '0px 16px 32px 0px rgb(0 0 0 / 0.4)'],
      ['ui-gradients-ai-idle', 'linear-gradient(180deg, rgb(0 0 0) 0%)'],
    ]);
    expect(semanticColorClasses(vars).size).toBe(0);
  });

  it('is brand-invariant: identical input names produce identical classes regardless of resolved value', () => {
    const brandA = new Map([['ui-text-on-surface-primary', 'light-dark(rgb(0 0 0), rgb(255 255 255))']]);
    const brandB = new Map([['ui-text-on-surface-primary', 'light-dark(rgb(10 10 10), rgb(245 245 245))']]);
    expect(semanticColorClasses(brandA).get('.ui-text-on-surface-primary')).toBe(
      semanticColorClasses(brandB).get('.ui-text-on-surface-primary')
    );
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
