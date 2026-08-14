import { describe, expect, it } from 'vitest';

import { DISPLAY_FORMAT, formatDate, normalizeRange } from '../date-range-picker-utils';

describe('formatDate', () => {
  it('formats a valid date with the display pattern', () => {
    expect(formatDate(new Date(2026, 6, 1))).toBe('Jul 1, 2026');
    expect(formatDate(new Date(2026, 11, 31))).toBe('Dec 31, 2026');
  });

  it('returns an empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('returns an empty string for an invalid Date instead of throwing', () => {
    // `date-fns`' format() throws RangeError on an invalid Date; formatDate must
    // guard against a truthy-but-invalid Date reaching it.
    expect(() => formatDate(new Date('garbage'))).not.toThrow();
    expect(formatDate(new Date('garbage'))).toBe('');
    expect(formatDate(new Date(NaN))).toBe('');
  });

  it('formats far-future and far-past dates', () => {
    expect(formatDate(new Date(1900, 0, 1))).toBe('Jan 1, 1900');
    expect(formatDate(new Date(2999, 11, 31))).toBe('Dec 31, 2999');
  });
});

describe('DISPLAY_FORMAT', () => {
  it('exposes the pattern used by the trigger', () => {
    expect(DISPLAY_FORMAT).toBe('MMM d, yyyy');
  });
});

describe('normalizeRange', () => {
  const early = new Date(2026, 6, 1);
  const late = new Date(2026, 6, 20);

  it('leaves an already-ordered range unchanged', () => {
    const range = { from: early, to: late };
    expect(normalizeRange(range)).toBe(range);
  });

  it('swaps an inverted range', () => {
    expect(normalizeRange({ from: late, to: early })).toEqual({
      from: early,
      to: late,
    });
  });

  it('leaves a partial range unchanged', () => {
    expect(normalizeRange({ from: late })).toEqual({ from: late });
    expect(normalizeRange({ to: early })).toEqual({ to: early });
    expect(normalizeRange({})).toEqual({});
  });

  it('leaves a same-day range unchanged', () => {
    const range = { from: early, to: new Date(2026, 6, 1) };
    expect(normalizeRange(range)).toBe(range);
  });
});
