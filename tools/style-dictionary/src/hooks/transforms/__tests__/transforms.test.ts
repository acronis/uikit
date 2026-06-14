// Unit tests for the pure value/name transforms the CSS build applies, plus the
// semantic-only emit filter. These run without Style Dictionary or disk I/O —
// they pin the HSL→rgb math, the Figma-matrix→angle gradient math, the `ui`
// naming convention, dimension formatting, and which tiers get emitted, so the
// generated tokens-pd output can't drift silently as brands/data grow (#177).

import type { TransformedToken } from 'style-dictionary/types';
import { describe, expect, it } from 'vitest';

import { type DtcgColor, hslColorToRgb, colorHslToRgb } from '../color-hsl-rgb';
import { gradientCss } from '../gradient-css';
import { uiName } from '../name-ui';
import { formatDimension } from '../dimension-px';
import { isEmittableToken } from '../../filters/semantic-only';

const hsl = (h: number, s: number, l: number, alpha?: number): DtcgColor => ({
  colorSpace: 'hsl',
  components: [h, s, l],
  ...(alpha === undefined ? {} : { alpha }),
});

describe('hslColorToRgb', () => {
  it('converts the achromatic extremes', () => {
    expect(hslColorToRgb(hsl(0, 0, 0))).toBe('rgb(0 0 0)');
    expect(hslColorToRgb(hsl(0, 0, 100))).toBe('rgb(255 255 255)');
    expect(hslColorToRgb(hsl(0, 0, 50))).toBe('rgb(128 128 128)');
  });

  it('converts saturated primaries at each hue third', () => {
    expect(hslColorToRgb(hsl(0, 100, 50))).toBe('rgb(255 0 0)');
    expect(hslColorToRgb(hsl(120, 100, 50))).toBe('rgb(0 255 0)');
    expect(hslColorToRgb(hsl(240, 100, 50))).toBe('rgb(0 0 255)');
  });

  it('renders the modern rgb() space-separated form with no commas', () => {
    expect(hslColorToRgb(hsl(210, 100, 30))).toMatch(/^rgb\(\d+ \d+ \d+\)$/);
  });

  it('appends the alpha channel only when it is below 1 (and above 0)', () => {
    expect(hslColorToRgb(hsl(0, 0, 0, 0.4))).toBe('rgb(0 0 0 / 0.4)');
    expect(hslColorToRgb(hsl(0, 0, 0, 1))).toBe('rgb(0 0 0)');
  });

  it('collapses any fully-transparent color (alpha 0) to the `transparent` keyword', () => {
    // Figma stores zero-alpha colors with arbitrary channels (often a magenta
    // placeholder); they must all render as `transparent`, never `rgb(… / 0)`.
    expect(hslColorToRgb(hsl(300, 100, 50, 0))).toBe('transparent'); // magenta @ alpha 0
    expect(hslColorToRgb(hsl(0, 0, 0, 0))).toBe('transparent'); // black @ alpha 0
    expect(hslColorToRgb(hsl(0, 0, 100, 0))).toBe('transparent'); // white @ alpha 0
  });

  it('passes an already-resolved `transparent` value through the transform untouched', () => {
    const transform = colorHslToRgb.transform as (token: TransformedToken) => string;
    expect(transform({ $type: 'color', $value: 'transparent' } as TransformedToken)).toBe('transparent');
  });

  it('clamps channels into the 0–255 byte range', () => {
    // every channel stays a valid byte regardless of input
    const out = hslColorToRgb(hsl(59, 100, 50));
    const channels = out.match(/\d+/g)!.map(Number);
    for (const c of channels) expect(c).toBeGreaterThanOrEqual(0);
    for (const c of channels) expect(c).toBeLessThanOrEqual(255);
  });

  it('throws on a non-hsl colorSpace instead of emitting garbage', () => {
    expect(() => hslColorToRgb({ colorSpace: 'srgb', components: [1, 0, 0] } as unknown as DtcgColor)).toThrow(
      /colorSpace/
    );
  });

  it('the transform filters to color tokens', () => {
    expect(colorHslToRgb.filter?.({ $type: 'color' } as TransformedToken, {} as never)).toBe(true);
    expect(colorHslToRgb.filter?.({ $type: 'dimension' } as TransformedToken, {} as never)).toBe(false);
  });
});

describe('gradientCss', () => {
  const stop = (color: DtcgColor, position: number) => ({ color, position });
  const run = (value: unknown, ext?: Record<string, unknown>) =>
    (gradientCss.transform as (t: TransformedToken) => string)({
      $type: 'gradient',
      $value: value,
      $extensions: ext,
    } as unknown as TransformedToken);

  it('renders stops as `rgb pos%` joined, using the same color conversion', () => {
    const out = run([stop(hsl(0, 100, 50), 0), stop(hsl(240, 100, 50), 1)], {
      'com.figma.gradientTransform': [
        [1, 0, 0],
        [0, 1, 0],
      ],
    });
    expect(out).toBe('linear-gradient(90deg, rgb(255 0 0) 0%, rgb(0 0 255) 100%)');
  });

  it('maps the identity Figma transform matrix to 90deg (to right)', () => {
    const out = run([stop(hsl(0, 0, 0), 0), stop(hsl(0, 0, 100), 1)], {
      'com.figma.gradientTransform': [
        [1, 0, 0],
        [0, 1, 0],
      ],
    });
    expect(out).toContain('linear-gradient(90deg,');
  });

  it('defaults to 180deg (to bottom) when no transform matrix is present', () => {
    expect(run([stop(hsl(0, 0, 0), 0)])).toContain('linear-gradient(180deg,');
  });

  it('rounds fractional stop positions', () => {
    expect(run([stop(hsl(0, 0, 0), 0.2), stop(hsl(0, 0, 100), 1)])).toContain('rgb(0 0 0) 20%');
  });

  it('filters to gradient tokens', () => {
    expect(gradientCss.filter?.({ $type: 'gradient' } as TransformedToken, {} as never)).toBe(true);
    expect(gradientCss.filter?.({ $type: 'color' } as TransformedToken, {} as never)).toBe(false);
  });
});

describe('uiName', () => {
  it('drops a leading `colors` tier segment and prefixes `ui`', () => {
    expect(uiName(['colors', 'background', 'surface', 'primary'])).toBe('ui-background-surface-primary');
  });

  it('keeps a non-colors tier root (component tokens)', () => {
    expect(uiName(['button', 'primary', 'background', 'idle'])).toBe('ui-button-primary-background-idle');
  });

  it('strips underscores so `_global` becomes `global`', () => {
    expect(uiName(['button', '_global', 'radius'])).toBe('ui-button-global-radius');
  });

  it('kebab-cases camelCase segments', () => {
    expect(uiName(['colors', 'backgroundColor'])).toBe('ui-background-color');
  });
});

describe('formatDimension', () => {
  it('joins value and unit', () => {
    expect(formatDimension({ value: 4, unit: 'px' })).toBe('4px');
    expect(formatDimension({ value: 0.25, unit: 'rem' })).toBe('0.25rem');
  });
});

describe('isEmittableToken (semantic-only filter)', () => {
  it('drops primitive resolution roots', () => {
    expect(isEmittableToken({ path: ['palette', 'blue', '7'] })).toBe(false);
    expect(isEmittableToken({ path: ['units', 'gap', 'sm'] })).toBe(false);
    expect(isEmittableToken({ path: ['font', 'family', 'sans'] })).toBe(false);
  });

  it('keeps emitted tiers (semantic + component)', () => {
    expect(isEmittableToken({ path: ['colors', 'background', 'brand', 'primary'] })).toBe(true);
    expect(isEmittableToken({ path: ['button', 'primary', 'background', 'idle'] })).toBe(true);
  });
});
