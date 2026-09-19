// Framework-agnostic width/height fraction utility classes — a fixed, finite
// set copied verbatim from Tailwind's own default fraction scale (PLTFRM-94106:
// "these are fixed, finite sets — generate all of them once, done forever").
// Not token-driven: a fraction is pure percentage math, not a design value.
// Selectors mirror Tailwind's own naming (`w-1/2`) so consumers can port
// markup unchanged; the `/` is escaped in the CSS selector (invalid
// unescaped) but matches an unescaped `class="ui-w-1/2"` attribute as-is.

/** [label, percentage] — kept as literal fraction labels (not reduced), matching Tailwind's own scale. */
const FRACTIONS: ReadonlyArray<readonly [string, string]> = [
  ['1/2', '50%'],
  ['1/3', '33.333333%'],
  ['2/3', '66.666667%'],
  ['1/4', '25%'],
  ['2/4', '50%'],
  ['3/4', '75%'],
  ['1/5', '20%'],
  ['2/5', '40%'],
  ['3/5', '60%'],
  ['4/5', '80%'],
  ['1/6', '16.666667%'],
  ['2/6', '33.333333%'],
  ['3/6', '50%'],
  ['4/6', '66.666667%'],
  ['5/6', '83.333333%'],
  ['1/12', '8.333333%'],
  ['2/12', '16.666667%'],
  ['3/12', '25%'],
  ['4/12', '33.333333%'],
  ['5/12', '41.666667%'],
  ['6/12', '50%'],
  ['7/12', '58.333333%'],
  ['8/12', '66.666667%'],
  ['9/12', '75%'],
  ['10/12', '83.333333%'],
  ['11/12', '91.666667%'],
];

const FRACTION_DIRECTIONS: Record<string, string> = {
  w: 'width',
  h: 'height',
};

function buildFractionClasses(): Map<string, string> {
  const classes = new Map<string, string>();
  for (const [prefix, property] of Object.entries(FRACTION_DIRECTIONS)) {
    for (const [label, percentage] of FRACTIONS) {
      const selector = `.ui-${prefix}-${label.replace('/', '\\/')}`;
      classes.set(selector, `${property}: ${percentage};`);
    }
  }
  return classes;
}

/** Static, non-token-driven fraction utility classes, emitted once per build. */
export const STATIC_FRACTION_CLASSES: ReadonlyMap<string, string> = buildFractionClasses();
