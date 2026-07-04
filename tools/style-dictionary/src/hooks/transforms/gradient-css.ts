// Value transform `gradient/css`: a resolved DTCG gradient (`$value` = an array of
// `{ color, position }` stops, plus a Figma transform matrix in `$extensions`) →
// a CSS `linear-gradient(...)` string. Non-transitive: the stops carry inline
// colors, not aliases, so it runs once after resolution. Each stop color is
// rendered with the same hsl→rgb conversion the color transform uses, so gradient
// and solid colors stay consistent. The angle math is ported from the retired
// `design-theme` build.

import type { Transform } from 'style-dictionary/types';
import { transformTypes } from 'style-dictionary/enums';

import { type DtcgColor, hslColorToRgb } from './color-hsl-rgb';

export const GRADIENT_CSS = 'gradient/css';

interface GradientStop {
  color: DtcgColor;
  position: number;
}

const round = (n: number): number => Math.round(n * 1000) / 1000;

/**
 * Convert a Figma gradient transform matrix to a CSS angle. The gradient
 * progresses along the first row's linear part `(a, c)` in the shape's (y-down)
 * space; CSS 0deg points up and increases clockwise, so the angle is
 * `atan2(a, -c)`. Identity (`[[1,0,0],[0,1,0]]`) → 90deg (to right).
 */
function gradientAngle(transform: unknown): number {
  const m = transform as number[][] | undefined;
  const a = m?.[0]?.[0] ?? 0;
  const c = m?.[0]?.[1] ?? 1;
  const deg = (Math.atan2(a, -c) * 180) / Math.PI;
  return round(((deg % 360) + 360) % 360);
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
    return `linear-gradient(${gradientAngle(ext?.['com.figma.gradientTransform'])}deg, ${css})`;
  },
};
