import { describe, expect, it } from 'vitest';

import {
  createTickFormatter,
  formatCompactNumber,
  formatPercent,
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
});

describe('formatPercent', () => {
  it('appends a percent sign to an already-scaled value', () => {
    expect(formatPercent(41.8)).toBe('41.8%');
    expect(formatPercent(0)).toBe('0%');
  });

  it('passes non-numeric values through unchanged', () => {
    expect(formatPercent('n/a')).toBe('n/a');
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
