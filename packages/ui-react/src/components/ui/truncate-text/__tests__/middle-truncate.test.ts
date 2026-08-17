import { describe, expect, it } from 'vitest';

import { middleTruncate } from '../middle-truncate';

// `measure` = character count throughout: deterministic, and the search logic is
// unit-agnostic — it never inspects a width beyond comparing it to `maxWidth`, so
// this stands in for "pixels" without pulling in a real (or fake) font metric.
const charWidth = (candidate: string) => candidate.length;

describe('middleTruncate', () => {
  it('returns the text unchanged when it already fits', () => {
    expect(middleTruncate('short', 10, { measure: charWidth })).toBe('short');
  });

  it('returns the text unchanged at exactly the budget', () => {
    expect(middleTruncate('12345', 5, { measure: charWidth })).toBe('12345');
  });

  it('preserves both the start and the end, not just the start', () => {
    const result = middleTruncate('abcdefghijklmnopqrstuvwxyz', 11, {
      measure: charWidth,
    });
    expect(result).toHaveLength(11);
    expect(result.startsWith('a')).toBe(true);
    expect(result.endsWith('z')).toBe(true);
    expect(result).toContain('…');
  });

  it('gives the extra character to the start on an odd kept-count', () => {
    // kept=5 → start=3, end=2: "abc" + "…" + "yz".
    expect(middleTruncate('abcdefghijklmnopqrstuvwxyz', 6, { measure: charWidth })).toBe(
      'abc…yz'
    );
  });

  it('never returns something wider than maxWidth', () => {
    for (let width = 0; width <= 30; width += 1) {
      const result = middleTruncate('abcdefghijklmnopqrstuvwxyz', width, {
        measure: charWidth,
      });
      expect(charWidth(result)).toBeLessThanOrEqual(width);
    }
  });

  it('falls back to the bare ellipsis when nothing else fits', () => {
    expect(middleTruncate('abcdefghij', 1, { measure: charWidth })).toBe('…');
  });

  it('falls back to empty when even the ellipsis does not fit', () => {
    expect(middleTruncate('abcdefghij', 0, { measure: charWidth })).toBe('');
  });

  it('respects a custom ellipsis string', () => {
    const result = middleTruncate('abcdefghijklmnopqrstuvwxyz', 12, {
      measure: charWidth,
      ellipsis: '...',
    });
    expect(result).toContain('...');
    expect(charWidth(result)).toBeLessThanOrEqual(12);
  });

  it('finds the widest fitting slice, not an arbitrarily smaller one', () => {
    // A measure function that is not simply "length" — has a fixed 3-unit cost
    // per character plus the string's own length, so the search cannot get away
    // with assuming `measure` is linear in kept-count.
    const measure = (candidate: string) => candidate.length * 3;
    const result = middleTruncate('abcdefghijklmnopqrstuvwxyz', 30, { measure });
    // 30/3 = 10 units of budget in "characters" → kept=10 is the largest that fits
    // (kept=11 would need 11*3=33 > 30).
    expect(measure(result)).toBeLessThanOrEqual(30);
    expect(result).toHaveLength(10);
  });

  it('handles maxWidth large enough for the whole string with room to spare', () => {
    expect(middleTruncate('hi', 1000, { measure: charWidth })).toBe('hi');
  });

  it('handles an empty string', () => {
    expect(middleTruncate('', 10, { measure: charWidth })).toBe('');
  });
});
