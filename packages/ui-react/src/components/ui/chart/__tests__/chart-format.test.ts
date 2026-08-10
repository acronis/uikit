import { describe, expect, it } from 'vitest';

import {
  createTickFormatter,
  formatCompactNumber,
  formatPercent,
  resolveAnimation,
  resolveAxisDomain,
  resolveBrushProps,
  resolveCartesianLabelPosition,
  resolveCategoryRange,
  resolveLabelFillClass,
  resolveChartReferenceValue,
  resolveRotatedTickAnchor,
  resolveXAxisHeight,
  resolveXAxisTitle,
  resolveYAxisTitle,
  toLabelFormatter,
  CHART_BRUSH_ARIA_LABEL,
  CHART_BRUSH_HEIGHT,
  CHART_LABEL_FILL_CLASS,
  CHART_LABEL_FILL_ON_SERIES_CLASS,
} from '../chart-format';

describe('formatCompactNumber', () => {
  it('compacts thousands and millions', () => {
    expect(formatCompactNumber(1234)).toBe('1.2K');
    expect(formatCompactNumber(146500)).toBe('146.5K');
    expect(formatCompactNumber(1_500_000)).toBe('1.5M');
  });

  it('leaves small numbers intact', () => {
    expect(formatCompactNumber(42)).toBe('42');
    expect(formatCompactNumber(0)).toBe('0');
  });

  it('coerces numeric strings', () => {
    expect(formatCompactNumber('2500')).toBe('2.5K');
  });

  it('passes non-numeric values through unchanged', () => {
    expect(formatCompactNumber('Jan')).toBe('Jan');
  });

  // `Number('')` is 0, not NaN — so a blank label used to render as "0".
  it('passes blank and whitespace-only values through unchanged', () => {
    expect(formatCompactNumber('')).toBe('');
    expect(formatCompactNumber(' ')).toBe(' ');
    expect(formatCompactNumber('\t')).toBe('\t');
  });
});

describe('formatPercent', () => {
  it('appends a percent sign to an already-scaled value', () => {
    expect(formatPercent(41.8)).toBe('41.8%');
    expect(formatPercent(0)).toBe('0%');
  });

  it('passes non-numeric values through unchanged', () => {
    expect(formatPercent('n/a')).toBe('n/a');
  });

  it('passes blank and whitespace-only values through unchanged', () => {
    expect(formatPercent('')).toBe('');
    expect(formatPercent(' ')).toBe(' ');
  });
});

describe('resolveAxisDomain', () => {
  it('anchors at zero for the "zero" preset', () => {
    expect(resolveAxisDomain('zero')).toEqual([0, 'auto']);
  });

  it('fits the data tightly for "dataMin-dataMax"', () => {
    expect(resolveAxisDomain('dataMin-dataMax')).toEqual(['dataMin', 'dataMax']);
  });

  it('leaves an unset preset to recharts', () => {
    expect(resolveAxisDomain(undefined)).toBeUndefined();
  });

  // recharts' own default for an unspecified numeric domain is [0, 'auto'], so
  // "auto" has to be spelled out — mapping it to undefined would make it render
  // identically to "zero" and the preset would be a silent no-op.
  it('spells out "auto" so it differs from "zero" and from the default', () => {
    expect(resolveAxisDomain('auto')).toEqual(['auto', 'auto']);
    expect(resolveAxisDomain('auto')).not.toEqual(resolveAxisDomain('zero'));
    expect(resolveAxisDomain('auto')).not.toEqual(resolveAxisDomain(undefined));
  });
});

describe('createTickFormatter', () => {
  it('formats compact currency from Intl options', () => {
    const format = createTickFormatter({
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    expect(format(146500)).toBe('$146.5K');
  });

  it('formats fixed decimals', () => {
    const format = createTickFormatter({
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    expect(format(3)).toBe('3.00');
  });

  it('respects a non-default locale', () => {
    const format = createTickFormatter(
      { minimumFractionDigits: 1, maximumFractionDigits: 1 },
      'de-DE'
    );
    // de-DE uses a comma as the decimal separator.
    expect(format(1.5)).toBe('1,5');
  });

  it('passes non-numeric values through unchanged', () => {
    const format = createTickFormatter({ style: 'percent' });
    expect(format('Feb')).toBe('Feb');
  });
});

describe('resolveAnimation', () => {
  it('defaults to animation off, matching the previous hardcoded value', () => {
    expect(resolveAnimation({})).toEqual({ isAnimationActive: false });
  });

  // 'auto' rather than `true`: it is the only value recharts resolves against
  // prefers-reduced-motion (and SSR). A literal `true` would force the motion.
  it('maps animate to recharts\' reduced-motion-aware "auto"', () => {
    expect(resolveAnimation({ animate: true })).toEqual({
      isAnimationActive: 'auto',
    });
  });

  it('never emits a literal true, which would bypass prefers-reduced-motion', () => {
    for (const props of [
      { animate: true },
      { animate: true, animationDuration: 400 },
      { animate: true, animationBegin: 10, animationEasing: 'linear' as const },
    ]) {
      expect(resolveAnimation(props).isAnimationActive).not.toBe(true);
    }
  });

  it('includes only the timing props that are provided', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 400 })
    ).toEqual({ isAnimationActive: 'auto', animationDuration: 400 });
  });

  it('passes through duration, begin, and easing', () => {
    expect(
      resolveAnimation({
        animate: true,
        animationDuration: 300,
        animationBegin: 50,
        animationEasing: 'ease-in-out',
      })
    ).toEqual({
      isAnimationActive: 'auto',
      animationDuration: 300,
      animationBegin: 50,
      animationEasing: 'ease-in-out',
    });
  });

  it('omits undefined timing props rather than emitting undefined keys', () => {
    const resolved = resolveAnimation({ animate: false });
    expect(Object.keys(resolved)).toEqual(['isAnimationActive']);
  });
});

describe('toLabelFormatter', () => {
  it('returns undefined with no formatter, so labels render their raw value', () => {
    expect(toLabelFormatter(undefined)).toBeUndefined();
  });

  it('applies the tick formatter to a normal value', () => {
    const format = toLabelFormatter(formatCompactNumber)!;
    expect(format(1234)).toBe('1.2K');
    expect(format('2500')).toBe('2.5K');
  });

  // recharts builds a label entry for *every* point, including the null gaps
  // `connectNulls` bridges — and the tick formatters coerce, so forwarding the
  // null would paint "0" (or "undefined") over an intentional gap.
  it('renders nothing for a null or undefined value instead of coercing it', () => {
    const compact = toLabelFormatter(formatCompactNumber)!;
    expect(compact(null)).toBe('');
    expect(compact(undefined)).toBe('');
    expect(formatCompactNumber(null as never)).toBe('0');

    const percent = toLabelFormatter(formatPercent)!;
    expect(percent(null)).toBe('');
    expect(percent(undefined)).toBe('');
  });

  it('still formats zero, which is a real value and not a gap', () => {
    const format = toLabelFormatter(formatCompactNumber)!;
    expect(format(0)).toBe('0');
  });
});

describe('resolveLabelFillClass', () => {
  it('uses the on-surface token for positions outside the shape', () => {
    for (const position of ['top', 'bottom', 'left', 'right', 'outside'] as const) {
      expect(resolveLabelFillClass(position)).toBe(CHART_LABEL_FILL_CLASS);
    }
  });

  // The on-surface token inverts with the theme and drops to ~1.6:1 over the
  // saturated series fills in dark mode — below the `must`-severity contrast rule.
  it('uses the on-fill token for every position that sits on the series', () => {
    for (const position of [
      'center',
      'centerTop',
      'centerBottom',
      'insideTop',
      'insideBottom',
      'insideLeft',
      'insideRight',
      'insideStart',
      'insideEnd',
      'end',
    ] as const) {
      expect(resolveLabelFillClass(position)).toBe(CHART_LABEL_FILL_ON_SERIES_CLASS);
    }
  });

  // The cartesian charts scope `[&_.recharts-label]:fill-foreground` on their
  // container to theme axis titles, and a LabelList's text also carries
  // `.recharts-label` — so the fill has to be an `!`-flagged class, not an SVG
  // `fill` attribute, or that CSS rule silently wins and undoes the contrast fix.
  it('emits an important-flagged class so container CSS cannot override it', () => {
    for (const position of ['top', 'center', 'insideStart', 'outside'] as const) {
      expect(resolveLabelFillClass(position)).toMatch(/^fill-\[var\(--ui-[a-z-]+\)\]!$/);
    }
  });

  // An area's fill is a gradient/low-opacity wash, so an on-series label is really
  // drawn over the tinted surface — the white on-fill token vanishes into it in
  // light mode.
  it('keeps the on-surface token for a translucent series at every position', () => {
    for (const position of ['top', 'center', 'insideEnd', 'centerTop'] as const) {
      expect(resolveLabelFillClass(position, { translucentSeries: true })).toBe(
        CHART_LABEL_FILL_CLASS
      );
    }
  });

  it('keeps the two fills distinct', () => {
    expect(CHART_LABEL_FILL_CLASS).not.toBe(CHART_LABEL_FILL_ON_SERIES_CLASS);
  });
});

describe('resolveCartesianLabelPosition', () => {
  it('defaults to the series growing end', () => {
    expect(resolveCartesianLabelPosition({})).toBe('top');
    expect(resolveCartesianLabelPosition({ growingEnd: 'right' })).toBe('right');
  });

  // A stacked segment's growing end is covered by the next segment, so a `top`
  // label would render inside its neighbour — in the on-surface colour, over a
  // saturated fill. Both orientations have to fall back to the segment centre.
  it('centres the label inside its own segment when stacked', () => {
    expect(resolveCartesianLabelPosition({ isStacked: true })).toBe('center');
    expect(
      resolveCartesianLabelPosition({ isStacked: true, growingEnd: 'right' })
    ).toBe('center');
  });

  it('pairs the stacked default with the on-fill token', () => {
    const stacked = resolveCartesianLabelPosition({ isStacked: true });
    expect(resolveLabelFillClass(stacked)).toBe(CHART_LABEL_FILL_ON_SERIES_CLASS);

    const grouped = resolveCartesianLabelPosition({ isStacked: false });
    expect(resolveLabelFillClass(grouped)).toBe(CHART_LABEL_FILL_CLASS);
  });

  it('lets an explicit position win over every default', () => {
    for (const isStacked of [true, false]) {
      for (const growingEnd of ['top', 'right'] as const) {
        expect(
          resolveCartesianLabelPosition({
            labelPosition: 'insideEnd',
            isStacked,
            growingEnd,
          })
        ).toBe('insideEnd');
      }
    }
  });
});

describe('resolveBrushProps', () => {
  it('falls back to the shared brush height', () => {
    expect(resolveBrushProps({}).height).toBe(CHART_BRUSH_HEIGHT);
    expect(resolveBrushProps({ brushHeight: undefined }).height).toBe(
      CHART_BRUSH_HEIGHT
    );
  });

  it('honors a caller height', () => {
    expect(resolveBrushProps({ brushHeight: 48 }).height).toBe(48);
  });

  // recharts drops the brush entirely for height <= 0, so passing one through
  // would turn `showBrush` into a silent no-op rather than a sized-down strip.
  it('falls back rather than letting a non-positive height erase the brush', () => {
    for (const brushHeight of [0, -1, -28]) {
      expect(resolveBrushProps({ brushHeight }).height).toBe(CHART_BRUSH_HEIGHT);
    }
  });

  // recharts' own defaults are the literals '#fff' / '#666', which ignore the
  // theme entirely — both have to be replaced with token references or the brush
  // stays light in dark mode.
  it('drives both colors from --ui-* tokens', () => {
    const { fill, stroke } = resolveBrushProps({});
    expect(fill).toMatch(/^var\(--ui-[a-z-]+\)$/);
    expect(stroke).toMatch(/^var\(--ui-[a-z-]+\)$/);
    expect(fill).not.toBe(stroke);
  });

  // Without an explicit ariaLabel recharts names both handles from a `name`
  // field on the data row — which our charts never require, so it announces
  // "Min value: undefined, Max value: undefined".
  it('always names the handles, and lets the caller override the default', () => {
    expect(resolveBrushProps({}).ariaLabel).toBe(CHART_BRUSH_ARIA_LABEL);
    expect(resolveBrushProps({}).ariaLabel).not.toMatch(/undefined/);
    expect(
      resolveBrushProps({ brushAriaLabel: 'Selector de rango' }).ariaLabel
    ).toBe('Selector de rango');
  });
});

// The category/value helpers below are shared by every cartesian chart that
// scopes something to a slice of the categories (a reference band, a per-series
// override) or draws a target line — BarChart and ComposedChart today.
const rangeData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
];

describe('resolveChartReferenceValue', () => {
  const keys = ['desktop', 'mobile'];

  it('returns undefined with no config', () => {
    expect(resolveChartReferenceValue(undefined, rangeData, keys)).toBeUndefined();
  });

  it('returns a fixed value (including 0)', () => {
    expect(resolveChartReferenceValue({ value: 150 }, rangeData, keys)).toBe(150);
    expect(resolveChartReferenceValue({ value: 0 }, rangeData, keys)).toBe(0);
  });

  it('prefers a fixed value over average', () => {
    expect(
      resolveChartReferenceValue({ value: 42, average: true }, rangeData, keys)
    ).toBe(42);
  });

  it('averages a single named series', () => {
    // desktop: (186 + 305 + 237) / 3
    expect(resolveChartReferenceValue({ average: 'desktop' }, rangeData, keys)).toBeCloseTo(
      242.667,
      2
    );
  });

  it('averages every plotted series when average is true', () => {
    // (186+305+237 + 80+200+120) / 6 = 188
    expect(resolveChartReferenceValue({ average: true }, rangeData, keys)).toBe(188);
  });

  it('returns undefined when there is nothing numeric to average', () => {
    expect(resolveChartReferenceValue({ average: true }, [], keys)).toBeUndefined();
    expect(
      resolveChartReferenceValue({ average: 'missing' }, rangeData, keys)
    ).toBeUndefined();
  });

  // LineChart/AreaChart rows carry `null` for a gap in a series, so the mean has
  // to skip those rows rather than count them as zero.
  it('skips null values when averaging', () => {
    const gappy = [
      { month: 'Jan', desktop: null },
      { month: 'Feb', desktop: 100 },
      { month: 'Mar', desktop: 200 },
    ];
    expect(
      resolveChartReferenceValue({ average: 'desktop' }, gappy, ['desktop'])
    ).toBe(150);
    expect(
      resolveChartReferenceValue({ average: true }, [{ desktop: null }], [
        'desktop',
      ])
    ).toBeUndefined();
  });
});

describe('resolveCategoryRange', () => {
  it('resolves category values to inclusive row indices', () => {
    expect(resolveCategoryRange({ from: 'Feb', to: 'Mar' }, rangeData, 'month')).toEqual([
      1, 2,
    ]);
  });

  it('resolves a numeric bound as a row index', () => {
    expect(resolveCategoryRange({ from: 1 }, rangeData, 'month')).toEqual([1, 2]);
  });

  it('prefers a matching category value over the index reading', () => {
    const numeric = [{ q: 3, sales: 1 }, { q: 1, sales: 2 }, { q: 2, sales: 3 }];
    // `1` is a real category here (row 1), not "index 1" by coincidence — the
    // value match wins so numeric categories stay addressable.
    expect(resolveCategoryRange({ from: 1, to: 2 }, numeric, 'q')).toEqual([1, 2]);
  });

  it('runs to the ends of the data when a bound is omitted', () => {
    expect(resolveCategoryRange({}, rangeData, 'month')).toEqual([0, 2]);
    expect(resolveCategoryRange({ to: 'Feb' }, rangeData, 'month')).toEqual([0, 1]);
  });

  it('returns undefined for an unknown bound, an inverted range, or no data', () => {
    expect(resolveCategoryRange({ from: 'Dec' }, rangeData, 'month')).toBeUndefined();
    expect(resolveCategoryRange({ from: 9 }, rangeData, 'month')).toBeUndefined();
    expect(
      resolveCategoryRange({ from: 'Mar', to: 'Jan' }, rangeData, 'month')
    ).toBeUndefined();
    expect(resolveCategoryRange({ from: 'Jan' }, [], 'month')).toBeUndefined();
  });
});

describe('resolveRotatedTickAnchor', () => {
  // A tick rotated anti-clockwise trails off to the lower left, so it has to be
  // anchored at its end; a clockwise one trails to the lower right.
  it('anchors an anti-clockwise tick at its end and a clockwise one at its start', () => {
    expect(resolveRotatedTickAnchor(-45)).toBe('end');
    expect(resolveRotatedTickAnchor(45)).toBe('start');
  });

  it("keeps recharts' own default only when the angle is omitted", () => {
    expect(resolveRotatedTickAnchor(undefined)).toBeUndefined();
  });

  // The documented edge case: the branch is on `angle < 0`, so an explicit `0` is
  // a clockwise rotation, not "upright". A caller that normalises upright to `0`
  // instead of leaving `xAxisAngle` off gets `start` rather than recharts'
  // `middle` — asserted so the two readings can't silently swap.
  it('treats an explicit zero angle as a rotation, not as unset', () => {
    expect(resolveRotatedTickAnchor(0)).toBe('start');
    expect(resolveRotatedTickAnchor(0)).not.toBe(
      resolveRotatedTickAnchor(undefined)
    );
  });
});

describe('resolveXAxisHeight', () => {
  it("keeps recharts' default when the row is a plain upright tick row", () => {
    expect(resolveXAxisHeight(undefined, undefined)).toBeUndefined();
  });

  it('allows for a rotated row and for a title on their own', () => {
    expect(resolveXAxisHeight(undefined, -45)).toBe(50);
    expect(resolveXAxisHeight('Month', undefined)).toBe(48);
  });

  // The reason the helper exists: the two allowances are additive, not exclusive.
  // A label-or-angle ternary would return 50 or 48 here and clip whichever of the
  // two it didn't count.
  it('adds both allowances when a chart rotates its ticks and titles the axis', () => {
    expect(resolveXAxisHeight('Month', -45)).toBe(68);
    expect(resolveXAxisHeight('Month', -45)).toBeGreaterThan(
      Math.max(
        resolveXAxisHeight('Month', undefined)!,
        resolveXAxisHeight(undefined, -45)!
      )
    );
  });

  // Kept deliberately consistent with `resolveRotatedTickAnchor`: the +20 keys off
  // the angle being present, not non-zero.
  it('reserves the rotated row for an explicit zero angle too', () => {
    expect(resolveXAxisHeight(undefined, 0)).toBe(50);
    expect(resolveXAxisHeight('Month', 0)).toBe(68);
  });

  it('ignores an empty label the same way it ignores a missing one', () => {
    expect(resolveXAxisHeight('', undefined)).toBeUndefined();
    expect(resolveXAxisHeight('', -45)).toBe(50);
  });
});

describe('resolveXAxisTitle', () => {
  it('places the title below the tick row by default', () => {
    expect(resolveXAxisTitle('Month')).toEqual({
      value: 'Month',
      position: 'insideBottom',
      offset: 0,
    });
  });

  it('takes the top edge and an offset for a secondary scale', () => {
    expect(resolveXAxisTitle('Month', 'insideTop', -8)).toEqual({
      value: 'Month',
      position: 'insideTop',
      offset: -8,
    });
  });

  it('renders no title for a missing or empty label', () => {
    expect(resolveXAxisTitle(undefined)).toBeUndefined();
    expect(resolveXAxisTitle('')).toBeUndefined();
  });
});

describe('resolveYAxisTitle', () => {
  // Angled so it reads from the outside in: upward on a left axis, downward on a
  // right one, where -90° would put the text's baseline against the plot.
  it('angles the title upward on a left axis and downward on a right one', () => {
    expect(resolveYAxisTitle('Sessions')).toEqual({
      value: 'Sessions',
      angle: -90,
      position: 'insideLeft',
      style: { textAnchor: 'middle' },
    });
    expect(resolveYAxisTitle('Sessions', 'right')).toEqual({
      value: 'Sessions',
      angle: 90,
      position: 'insideRight',
      style: { textAnchor: 'middle' },
    });
  });

  // `middle` is the one anchor keyword that is direction-immune, which is what
  // keeps the title from mirroring about its anchor under `dir="rtl"`.
  it('anchors the title at its middle in both orientations', () => {
    for (const orientation of ['left', 'right'] as const) {
      expect(resolveYAxisTitle('Sessions', orientation)?.style.textAnchor).toBe(
        'middle'
      );
    }
  });

  it('renders no title for a missing or empty label', () => {
    expect(resolveYAxisTitle(undefined)).toBeUndefined();
    expect(resolveYAxisTitle('')).toBeUndefined();
  });
});
