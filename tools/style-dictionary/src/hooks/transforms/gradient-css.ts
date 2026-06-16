// Value transform `gradient/css`: a resolved DTCG gradient (`$value` = an array of
// `{ color, position }` stops, plus the gradient angle in `$extensions` — either a
// `com.figma.gradientTransform` matrix or, when that's absent, the angle inline in
// `com.figma.cssGradient`) → a CSS `linear-gradient(...)` string. Non-transitive:
// the stops carry inline colors, not aliases, so it runs once after resolution.
// Each stop color is rendered with the same hsl→rgb conversion the color transform
// uses, so gradient and solid colors stay consistent. The matrix angle math is
// ported from the retired `design-theme` build.

import type { Transform } from 'style-dictionary/types';
import { transformTypes } from 'style-dictionary/enums';

import { type DtcgColor, hslColorToRgb } from './color-hsl-rgb';

export const GRADIENT_CSS = 'gradient/css';

interface GradientStop {
  color: DtcgColor;
  position: number;
}

const round = (n: number): number => Math.round(n * 1000) / 1000;

const normalizeDeg = (deg: number): number => round(((deg % 360) + 360) % 360);

/**
 * Resolve the CSS gradient angle for a Figma gradient token.
 *
 * Preferred source is the `com.figma.gradientTransform` matrix: the gradient
 * progresses along the first row's linear part `(a, c)` in the shape's (y-down)
 * space; CSS 0deg points up and increases clockwise, so the angle is
 * `atan2(a, -c)`. Identity (`[[1,0,0],[0,1,0]]`) → 90deg (to right).
 *
 * The current token snapshot omits that matrix and instead carries the angle
 * inline in `com.figma.cssGradient` (e.g. `linear-gradient(90deg, …)`), so when
 * the matrix is absent we parse the angle from there. The last-resort default is
 * 90deg (to right) — never assume a matrix of all-zeros, which would resolve to
 * `atan2(0, -1) = 180deg` and silently flip every gradient vertical.
 */
function gradientAngle(ext: Record<string, unknown> | undefined): number {
  const m = ext?.['com.figma.gradientTransform'] as number[][] | undefined;
  if (Array.isArray(m)) {
    const a = m[0]?.[0] ?? 0;
    const c = m[0]?.[1] ?? 1;
    return normalizeDeg((Math.atan2(a, -c) * 180) / Math.PI);
  }
  const css = ext?.['com.figma.cssGradient'];
  const match = typeof css === 'string' ? css.match(/(-?[\d.]+)deg/) : null;
  return match ? normalizeDeg(Number(match[1])) : 90;
}

export const gradientCss: Transform = {
  name: GRADIENT_CSS,
  type: transformTypes.value,
  transitive: false,
  filter: (token) => token.$type === 'gradient',
  transform: (token) => {
    const stops = token.$value as GradientStop[];
    const ext = token.$extensions as Record<string, unknown> | undefined;
    const css = stops
      .map((s) => `${hslColorToRgb(s.color)} ${round(s.position * 100)}%`)
      .join(', ');
    return `linear-gradient(${gradientAngle(ext)}deg, ${css})`;
  },
};
