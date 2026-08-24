// The dataviz palettes a chart paints its series from.
//
// Every color here resolves to a `--ui-dataviz-*` token from
// `@acronis-platform/tokens-pd`'s semantic tier (already imported by
// `styles/index.css`), so light/dark and brand overrides come for free — the
// tokens are `light-dark()` pairs. There is deliberately no `--ui-chart-*`
// component tier: these tokens are already semantic and shared across every
// chart type, and a 1:1 alias layer would be pure indirection (see
// `context/conventions.md`, "bridge what's reused").
//
// The four palettes mirror the product's widget editor, which offers exactly
// this choice — Categorical / Sequential / Diverging / Status — and then, for
// Categorical and Status only, a per-series color picker. Sequential and
// Diverging expose the ramp/pair and nothing else, so how N series spread
// across a ramp's stops is this module's decision, not the user's.

/** A sequential ramp: one hue, eight stops from lightest to darkest. */
export type ChartSequentialRamp = 'blue' | 'teal' | 'orange' | 'violet';

/** A diverging pair: two hues meeting at a pale midpoint. */
export type ChartDivergingPair = 'blue-orange' | 'teal-violet';

/**
 * A semantic status tone. Ordered by severity in the product's picker:
 * danger (red) · critical (orange) · warning (yellow) · success (green) ·
 * info (blue) · neutral (gray). Note that `critical` is orange and ranks
 * *below* `danger` — that is what the tokens say, across the whole semantic
 * tier, not a typo here.
 */
export type ChartStatusTone =
  | 'danger'
  | 'critical'
  | 'warning'
  | 'success'
  | 'info'
  | 'neutral';

/** Which palette a chart's series are painted from. */
export type ChartPalette =
  | { type: 'categorical' }
  | { type: 'sequential'; ramp: ChartSequentialRamp }
  | { type: 'diverging'; pair: ChartDivergingPair }
  | { type: 'status' };

/**
 * How one series picks its color out of the active palette.
 *
 * Only the two palettes whose colors are independent of each other accept an
 * override:
 *
 * - `categorical` — `{ slot }` picks one of the 16 hues.
 * - `status` — `{ status }` names a tone.
 *
 * `sequential` and `diverging` accept none. Their stops are a *ramp*: the
 * colors mean something only in relation to each other, so letting one series
 * jump to an arbitrary stop would break the reading order the ramp exists to
 * convey. The product's widget editor agrees — it offers a ramp/pair picker
 * and no per-series control. An override passed under those palettes is
 * ignored, with a dev warning.
 *
 * Neither form can express a color from outside the palette — that is the point.
 */
export type ChartSeriesTone =
  | { slot: number; status?: never; sameAs?: never }
  | { slot?: never; status: ChartStatusTone; sameAs?: never }
  /**
   * Paint whatever the series under this key paints, under any palette. For a
   * twin series that is the *same* metric drawn differently — a forecast tail
   * continuing its actuals, a projection band behind its bars — where two hues
   * would read as two metrics. Resolved by `resolveChartColors`, which is the
   * only place the whole config is in view.
   */
  | { slot?: never; status?: never; sameAs: string };

const token = (name: string) => `var(--ui-dataviz-${name})`;

/** The 16 categorical hues, in the order the product's picker lists them. */
export const CHART_CATEGORICAL_TOKENS = Object.freeze(
  Array.from({ length: 16 }, (_, i) => token(`categorical-${i + 1}`))
);

/** Each sequential ramp's eight stops, lightest (1) to darkest (8). */
export const CHART_SEQUENTIAL_TOKENS: Readonly<
  Record<ChartSequentialRamp, readonly string[]>
> = Object.freeze({
  blue: Object.freeze(
    Array.from({ length: 8 }, (_, i) => token(`sequential-blue-${i + 1}`))
  ),
  teal: Object.freeze(
    Array.from({ length: 8 }, (_, i) => token(`sequential-teal-${i + 1}`))
  ),
  orange: Object.freeze(
    Array.from({ length: 8 }, (_, i) => token(`sequential-orange-${i + 1}`))
  ),
  violet: Object.freeze(
    Array.from({ length: 8 }, (_, i) => token(`sequential-violet-${i + 1}`))
  ),
});

// Ordered `a3 → a1` then `b1 → b3`: strongest of the first hue, through the two
// pale midpoints, out to the strongest of the second. That is the order the
// ChartTreeMap mockup paints its tiles in (Figma node 8999:72012), and it is
// what makes a diverging palette read as a single gradient rather than two
// unrelated ramps.
const divergingStops = (pair: string) =>
  Object.freeze([
    token(`diverging-${pair}-a3`),
    token(`diverging-${pair}-a2`),
    token(`diverging-${pair}-a1`),
    token(`diverging-${pair}-b1`),
    token(`diverging-${pair}-b2`),
    token(`diverging-${pair}-b3`),
  ]);

/** Each diverging pair's six stops, one hue's strongest through to the other's. */
export const CHART_DIVERGING_TOKENS: Readonly<
  Record<ChartDivergingPair, readonly string[]>
> = Object.freeze({
  'blue-orange': divergingStops('blue-orange'),
  'teal-violet': divergingStops('teal-violet'),
});

/** The six semantic status tones. */
export const CHART_STATUS_TOKENS: Readonly<Record<ChartStatusTone, string>> =
  Object.freeze({
    danger: token('meaningful-status-danger'),
    critical: token('meaningful-status-critical'),
    warning: token('meaningful-status-warning'),
    success: token('meaningful-status-success'),
    info: token('meaningful-status-info'),
    neutral: token('meaningful-status-neutral'),
  });

/** The default palette — what a chart paints with when none is chosen. */
export const CHART_DEFAULT_PALETTE: ChartPalette = Object.freeze({
  type: 'categorical',
});

/**
 * The stops a palette offers, in picker order. `status` has named tones rather
 * than positional stops, so it returns an empty list — use
 * `CHART_STATUS_TOKENS` for those.
 */
export function listPaletteStops(palette: ChartPalette): readonly string[] {
  switch (palette.type) {
    case 'categorical':
      return CHART_CATEGORICAL_TOKENS;
    case 'sequential':
      return CHART_SEQUENTIAL_TOKENS[palette.ramp];
    case 'diverging':
      return CHART_DIVERGING_TOKENS[palette.pair];
    case 'status':
      return [];
  }
}

/**
 * Every choice a per-series picker may offer for this palette — what the
 * product's widget editor renders in its dropdown. Pure, so the form can build
 * its UI without re-deriving the palette.
 *
 * Empty for `sequential` and `diverging`: those have no per-series control, so
 * a form driven by this function renders no picker for them, which is exactly
 * the design.
 */
export function listPaletteChoices(
  palette: ChartPalette
): readonly ChartSeriesTone[] {
  switch (palette.type) {
    case 'status':
      return (Object.keys(CHART_STATUS_TOKENS) as ChartStatusTone[]).map(
        (status) => ({ status })
      );
    case 'categorical':
      return CHART_CATEGORICAL_TOKENS.map((_, i) => ({ slot: i + 1 }));
    default:
      return [];
  }
}

function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[ui-react] ${message}`);
  }
}

function clampSlot(slot: number, length: number, palette: ChartPalette) {
  const rounded = Math.round(slot);

  if (!Number.isFinite(slot) || rounded < 1 || rounded > length) {
    warn(
      `Chart series slot ${slot} is outside the "${palette.type}" palette (1–${length}). Clamping.`
    );
    return Math.min(
      Math.max(Number.isFinite(rounded) ? rounded : 1, 1),
      length
    );
  }

  return rounded;
}

export interface ResolveSeriesColorOptions {
  /** This series' position among the chart's series. */
  index: number;
  /** This series' explicit choice within the palette, if it may make one. */
  tone?: ChartSeriesTone;
}

/**
 * The color one series paints with.
 *
 * Series walk the palette **in its defined order** — series 1 takes stop 1,
 * series 2 takes stop 2, and so on, wrapping once the stops run out. The order
 * is the design's, not something derived here: no re-ordering, no spreading
 * across a ramp, no skipping stops.
 *
 * On top of that, `categorical` and `status` honour a per-series override
 * (see `ChartSeriesTone`); `sequential` and `diverging` do not.
 *
 * Always returns a token from the active palette. A `slot` out of range is
 * clamped (with a dev warning) rather than passed through, so switching
 * palettes can never leave a series painting off-palette.
 */
export function resolveSeriesColor(
  palette: ChartPalette,
  { index, tone }: ResolveSeriesColorOptions
): string {
  if (palette.type === 'status') {
    if (tone?.status) {
      return CHART_STATUS_TOKENS[tone.status];
    }

    // Unlike the ordered palettes there is no meaningful "next" tone to fall
    // back to — status colors carry meaning, and inventing one would be worse
    // than reading gray.
    warn(
      'A chart series has no `status` under the "status" palette. Falling back to neutral.'
    );
    return CHART_STATUS_TOKENS.neutral;
  }

  const stops = listPaletteStops(palette);

  if (tone?.status) {
    warn(
      `A chart series names a status ("${tone.status}") under the "${palette.type}" palette, which has no status tones. Ignoring.`
    );
  } else if (typeof tone?.slot === 'number') {
    if (palette.type === 'categorical') {
      return stops[clampSlot(tone.slot, stops.length, palette) - 1];
    }

    warn(
      `A chart series pins slot ${tone.slot} under the "${palette.type}" palette, whose stops are a ramp and are not individually selectable. Ignoring.`
    );
  }

  // Wraps rather than clamps once the stops run out: a chart with more series
  // than the palette has colors is unreadable either way, but wrapping keeps
  // each series distinguishable from its immediate neighbours.
  return stops[index % stops.length];
}

/**
 * Series that would paint the same color — what the widget editor's "duplicate
 * color" warning is keyed to. Returns one group per collision, each holding the
 * colliding series' keys in input order.
 *
 * Only series that named a `tone` can collide: automatic assignment is
 * injective by construction (up to `categorical`'s 16-series wrap).
 *
 * Pass the chart's `config` to exclude intentional aliases: a series with
 * `tone: { sameAs }` shares its target's colour on purpose, so it is not a
 * collision. Without the config every alias reads as a duplicate.
 */
export function findDuplicateTones(
  colors: Readonly<Record<string, string>>,
  config?: Readonly<Record<string, { tone?: { sameAs?: string } }>>
): string[][] {
  const byColor = new Map<string, string[]>();

  for (const [key, color] of Object.entries(colors)) {
    if (config?.[key]?.tone?.sameAs) {
      continue;
    }
    const group = byColor.get(color);
    if (group) {
      group.push(key);
    } else {
      byColor.set(color, [key]);
    }
  }

  return [...byColor.values()].filter((group) => group.length > 1);
}
