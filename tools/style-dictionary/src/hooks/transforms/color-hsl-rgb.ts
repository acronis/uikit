// Value transform `color/hsl-to-rgb`: resolved DTCG HSL color → modern `rgb()`
// string. Non-transitive, so it runs after reference resolution — `$value` is the
// concrete `{ colorSpace, components, alpha? }` the alias pointed at. Style
// Dictionary delegates DTCG `$type` down to every token before transforms run
// (token-level overrides group-level), so the `$type === 'color'` filter is the
// only type check needed — no structural value sniffing. The CSS builder zips the
// light and dark results into `light-dark()`.

import type { Transform } from 'style-dictionary/types';
import { transformTypes } from 'style-dictionary/enums';

export const COLOR_HSL_RGB = 'color/hsl-to-rgb';

export interface DtcgColor {
  colorSpace: string;
  components: [number, number, number];
  alpha?: number;
}

const channel = (value: number): string =>
  String(Math.round(Math.max(0, Math.min(255, value))));

// HSL → modern `rgb(r g b)`, or `rgb(r g b / a)` when it carries opacity. The raw
// decimal alpha is kept so fractional values stay exact. Exported so the gradient
// transform can render each color stop with the same conversion.
export function hslColorToRgb(color: DtcgColor): string {
  if (color.colorSpace !== 'hsl') {
    throw new Error(
      `Unsupported colorSpace "${color.colorSpace}" — only hsl is handled.`
    );
  }

  const [h, s, l] = color.components;
  const alpha = color.alpha ?? 1;

  // Transparent rule: a fully-transparent color renders as the `transparent`
  // keyword — its RGB channels are meaningless (Figma may store magenta, black,
  // etc. at alpha 0). Mirrors the figma-to-design-tokens emitter rule for the tiers.
  if (alpha === 0) return 'transparent';

  const sat = s / 100;
  const light = l / 100;
  const k = (n: number): number => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number): number =>
    light - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));

  const rgb = `rgb(${channel(f(0) * 255)} ${channel(f(8) * 255)} ${channel(f(4) * 255)}`;
  return alpha >= 1 ? `${rgb})` : `${rgb} / ${alpha})`;
}

export const colorHslToRgb: Transform = {
  name: COLOR_HSL_RGB,
  type: transformTypes.value,
  transitive: false,
  filter: (token) => token.$type === 'color',
  // Fully-transparent colors are stored as the CSS keyword `transparent`
  // (see the figma-to-design-tokens transparent rule); pass it through verbatim.
  transform: (token) =>
    token.$value === 'transparent' ? 'transparent' : hslColorToRgb(token.$value as DtcgColor),
};
