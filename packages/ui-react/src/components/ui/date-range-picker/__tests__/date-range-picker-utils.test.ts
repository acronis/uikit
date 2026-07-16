import { startOfDay } from 'date-fns';
import { describe, expect, it } from 'vitest';

import {
  DISPLAY_FORMAT,
  formatDate,
  normalizeRange,
  parseDate,
  rangesEqual,
} from '../date-range-picker-utils';

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

describe('parseDate', () => {
  it('parses a well-formed date', () => {
    const parsed = parseDate('Jul 1, 2026');
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(6);
    expect(parsed?.getDate()).toBe(1);
  });

  it('normalizes to the start of the day (stable round-trip time)', () => {
    const parsed = parseDate('Jul 1, 2026');
    expect(parsed?.getHours()).toBe(0);
    expect(parsed?.getMinutes()).toBe(0);
    expect(parsed?.getSeconds()).toBe(0);
    expect(parsed?.getMilliseconds()).toBe(0);
  });

  it('returns undefined for empty / whitespace-only input', () => {
    expect(parseDate('')).toBeUndefined();
    expect(parseDate('   ')).toBeUndefined();
  });

  it('returns undefined for partial input mid-type', () => {
    expect(parseDate('Jul')).toBeUndefined();
    expect(parseDate('Jul 1')).toBeUndefined();
    expect(parseDate('Jul 1,')).toBeUndefined();
  });

  it('returns undefined for garbage text', () => {
    expect(parseDate('not a date')).toBeUndefined();
    expect(parseDate('12345')).toBeUndefined();
  });

  it('returns undefined for a syntactically plausible but impossible date', () => {
    // Feb never has 30 days — date-fns must reject rather than roll over.
    expect(parseDate('Feb 30, 2026')).toBeUndefined();
  });

  it('tolerates surrounding whitespace', () => {
    const parsed = parseDate('   Jul 1, 2026   ');
    expect(parsed?.getDate()).toBe(1);
  });

  it('rejects wrong separators / mismatched casing patterns', () => {
    // Full month name does not match the abbreviated `MMM` token literally
    // enough to also satisfy the rest of the fixed pattern.
    expect(parseDate('2026-07-01')).toBeUndefined();
    expect(parseDate('07/01/2026')).toBeUndefined();
  });

  it('round-trips stably across a range of dates', () => {
    const dates = [
      new Date(2026, 0, 1),
      new Date(2026, 1, 28),
      new Date(2024, 1, 29), // leap day
      new Date(2026, 6, 15),
      new Date(2026, 11, 31),
      new Date(2000, 5, 30),
    ];
    for (const d of dates) {
      const roundTripped = parseDate(formatDate(d));
      expect(roundTripped?.getTime()).toBe(startOfDay(d).getTime());
    }
  });

  it('exposes the pattern used by the trigger', () => {
    expect(DISPLAY_FORMAT).toBe('MMM d, yyyy');
  });
});

describe('rangesEqual', () => {
  const a = new Date(2026, 6, 1);
  const b = new Date(2026, 6, 5);

  it('treats two empty ranges as equal', () => {
    expect(rangesEqual({}, {})).toBe(true);
  });

  it('treats identical ranges as equal (value, not identity)', () => {
    expect(
      rangesEqual(
        { from: new Date(2026, 6, 1), to: new Date(2026, 6, 5) },
        { from: new Date(2026, 6, 1), to: new Date(2026, 6, 5) }
      )
    ).toBe(true);
  });

  it('distinguishes a set end from an unset one', () => {
    expect(rangesEqual({ from: a }, { from: a, to: b })).toBe(false);
    expect(rangesEqual({ from: a }, {})).toBe(false);
  });

  it('treats swapped endpoints as different', () => {
    expect(rangesEqual({ from: a, to: b }, { from: b, to: a })).toBe(false);
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
