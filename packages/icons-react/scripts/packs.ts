/**
 * Single source of truth for which @acronis-platform/design-assets packs
 * this library generates, shared by the generator and the Vite lib config.
 *
 * - `assetPack` — manifest name in design-assets.
 * - `name` — published subpath (the `icons-` prefix is dropped).
 * - `paint` — `stroke` packs apply the rule-derived stroke width and default
 *   `fill: none`; `solid` packs paint via `fill`.
 * - `multicolor` — `false` (mono) collapses authored colors to `currentColor`
 *   so the icon inherits text color; `true` keeps the authored colors (and
 *   namespaces any gradient/clip ids to avoid cross-icon collisions).
 */
export interface PackConfig {
  assetPack: string;
  name: string;
  paint: 'stroke' | 'solid';
  multicolor: boolean;
}

export const PACKS: PackConfig[] = [
  {
    assetPack: 'icons-stroke-mono',
    name: 'stroke-mono',
    paint: 'stroke',
    multicolor: false,
  },
  {
    assetPack: 'icons-solid-mono',
    name: 'solid-mono',
    paint: 'solid',
    multicolor: false,
  },
  {
    assetPack: 'icons-stroke-multi',
    name: 'stroke-multi',
    paint: 'stroke',
    multicolor: true,
  },
  {
    assetPack: 'icons-solid-multi',
    name: 'solid-multi',
    paint: 'solid',
    multicolor: true,
  },
];
