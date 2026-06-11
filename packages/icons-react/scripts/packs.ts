/**
 * Single source of truth for the icon packs this library generates from
 * `@acronis-platform/icons-svg-next`, shared by the generator and the Vite lib
 * config.
 *
 * - `name` — published subpath (the `icons-` prefix is dropped) and `src/packs`
 *   directory.
 * - `paint` — `stroke` packs apply the rule-derived stroke width and default
 *   `fill: none`; `solid` packs paint via `fill`.
 * - `multicolor` — `false` (mono) collapses authored colors to `currentColor`
 *   so the icon inherits text color; `true` keeps the authored colors (and
 *   namespaces any gradient/clip ids to avoid cross-icon collisions).
 *
 * Pack → manifest mapping: a pack reads every icons-svg-next manifest named
 * `<name>` or `<name>-<category>` (so `stroke-mono` merges its six category
 * manifests), and resolves each icon name to the flat `svg/<name>.svg`.
 */
export interface PackConfig {
  name: string;
  paint: 'stroke' | 'solid';
  multicolor: boolean;
}

export const PACKS: PackConfig[] = [
  { name: 'stroke-mono', paint: 'stroke', multicolor: false },
  { name: 'solid-mono', paint: 'solid', multicolor: false },
  { name: 'stroke-multi', paint: 'stroke', multicolor: true },
  { name: 'solid-multi', paint: 'solid', multicolor: true },
];

/**
 * The supported rendered sizes (px) and their designed stroke weights (px), per
 * the Figma "icon components (generated)" rules — sm/md/lg = 16/24/32 with
 * stroke 1.6/2.0/2.5. The md (24) artwork is the source SVG; for stroke packs
 * the generator converts these px weights into viewBox user units per size, so
 * one master renders at any size with the designed stroke weight.
 */
export const ICON_SIZES = [16, 24, 32] as const;
export const STROKE_WIDTH_PX: Record<number, number> = {
  16: 1.6,
  24: 2,
  32: 2.5,
};
