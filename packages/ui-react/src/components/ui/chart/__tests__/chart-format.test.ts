import { describe, expect, it } from 'vitest';

import {
  createTickFormatter,
  formatCompactNumber,
  formatPercent,
  resolveAnimation,
  resolveAxisDomain,
  resolveCartesianLabelPosition,
  resolveLabelFillClass,
  toLabelFormatter,
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
