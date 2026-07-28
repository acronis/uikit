/**
 * The icon packs this library generates from `@acronis-platform/design-assets`,
 * shared by the generator and the Vite lib config.
 *
 * Each `name` is, at once, the published subpath (the `icons-` prefix is
 * dropped), the `src/packs` directory, AND the design-assets `assetsGroups` key
 * the generator reads its icons from — they map 1:1. Everything else about a
 * pack (which sizes exist, stroke widths, mono vs multicolor paint) is resolved
 * from design-assets at generation time via the shared resolver + executor, not
 * configured here.
 */
export interface PackConfig {
  name: string;
}

export const PACKS: PackConfig[] = [
  { name: 'stroke-mono' },
  { name: 'solid-mono' },
  { name: 'stroke-multi' },
  { name: 'solid-multi' },
];
