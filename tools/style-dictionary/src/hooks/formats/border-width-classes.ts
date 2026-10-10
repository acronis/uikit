// Framework-agnostic border-width utility classes — Tailwind's own bounded
// border-width scale (0, DEFAULT=1px, 2, 4, 8) per side, copied wholesale
// (PLTFRM-94106's "misc/layout primitives" note: ship the whole group).
// Not token-driven — border widths aren't backed by a design token.

const BORDER_WIDTH_VALUES: ReadonlyArray<readonly [string, string]> = [
  ['', '1px'],
  ['0', '0px'],
  ['2', '2px'],
  ['4', '4px'],
  ['8', '8px'],
];

const BORDER_DIRECTIONS: Record<string, string> = {
  '': 'border-width',
  t: 'border-top-width',
  r: 'border-right-width',
  b: 'border-bottom-width',
  l: 'border-left-width',
  x: 'border-inline-width',
  y: 'border-block-width',
};

function buildBorderWidthClasses(): Map<string, string> {
  const classes = new Map<string, string>();
  for (const [direction, property] of Object.entries(BORDER_DIRECTIONS)) {
    for (const [suffix, value] of BORDER_WIDTH_VALUES) {
      const parts = ['ui-border', direction, suffix].filter(Boolean);
      classes.set(`.${parts.join('-')}`, `${property}: ${value};`);
    }
  }
  return classes;
}

/** Static, non-token-driven border-width utility classes, emitted once per build. */
export const STATIC_BORDER_WIDTH_CLASSES: ReadonlyMap<string, string> = buildBorderWidthClasses();
