import { describe, expect, it } from 'vitest';

import {
  createTickFormatter,
  formatCompactNumber,
  formatPercent,
  resolveAnimation,
  resolveAxisDomain,
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

  it('enables animation when animate is true', () => {
    expect(resolveAnimation({ animate: true })).toEqual({
      isAnimationActive: true,
    });
  });

  it('includes only the timing props that are provided', () => {
    expect(
      resolveAnimation({ animate: true, animationDuration: 400 })
    ).toEqual({ isAnimationActive: true, animationDuration: 400 });
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
      isAnimationActive: true,
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
