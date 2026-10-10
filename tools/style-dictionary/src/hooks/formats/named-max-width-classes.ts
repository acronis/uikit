// Framework-agnostic named max-width utility classes — Tailwind's own bounded
// `xs`…`7xl` max-width scale, copied verbatim (PLTFRM-94106: "these are fixed,
// finite sets — generate all of them once, done forever"). Not token-driven:
// there is no design token behind this scale, it's Tailwind's own convention.
// Values match Tailwind's defaults (rem * 16px).

const NAMED_MAX_WIDTHS: ReadonlyArray<readonly [string, string]> = [
  ['xs', '320px'],
  ['sm', '384px'],
  ['md', '448px'],
  ['lg', '512px'],
  ['xl', '576px'],
  ['2xl', '672px'],
  ['3xl', '768px'],
  ['4xl', '896px'],
  ['5xl', '1024px'],
  ['6xl', '1152px'],
  ['7xl', '1280px'],
];

/** Static, non-token-driven named max-width utility classes, emitted once per build. */
export const STATIC_NAMED_MAX_WIDTH_CLASSES: ReadonlyMap<string, string> = new Map(
  NAMED_MAX_WIDTHS.map(([name, value]) => [`.ui-max-w-${name}`, `max-width: ${value};`])
);
