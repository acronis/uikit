import { describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_YEAR_SPAN,
  buildModeProps,
  buildMonthItems,
  buildYearItems,
  clampNavigationTarget,
  resolveWeekStartsOn,
  resolveYearRange,
} from '../calendar-panel-utils';

describe('resolveYearRange', () => {
  it('defaults to currentYear ± the default span', () => {
    expect(resolveYearRange(undefined, undefined, 2026)).toEqual({
      fromYear: 2026 - DEFAULT_YEAR_SPAN,
      toYear: 2026 + DEFAULT_YEAR_SPAN,
    });
  });

  it('honors an explicit fromYear/toYear override', () => {
    expect(resolveYearRange(2000, 2030, 2026)).toEqual({
      fromYear: 2000,
      toYear: 2030,
    });
  });

  it('honors one explicit bound while defaulting the other', () => {
    expect(resolveYearRange(2010, undefined, 2026)).toEqual({
      fromYear: 2010,
      toYear: 2026 + DEFAULT_YEAR_SPAN,
    });
    expect(resolveYearRange(undefined, 2040, 2026)).toEqual({
      fromYear: 2026 - DEFAULT_YEAR_SPAN,
      toYear: 2040,
    });
  });

  it('honors a custom span', () => {
    expect(resolveYearRange(undefined, undefined, 2026, 5)).toEqual({
      fromYear: 2021,
      toYear: 2031,
    });
  });

  it('does not reorder an inverted explicit range', () => {
    expect(resolveYearRange(2030, 2000, 2026)).toEqual({
      fromYear: 2030,
      toYear: 2000,
    });
  });
});

describe('resolveWeekStartsOn', () => {
  it('prefers an explicit weekStartsOn over the locale', () => {
    const locale = { options: { weekStartsOn: 0 } } as never;
    expect(resolveWeekStartsOn(3, locale)).toBe(3);
  });

  it('falls back to the locale week start when unset', () => {
    const locale = { options: { weekStartsOn: 0 } } as never;
    expect(resolveWeekStartsOn(undefined, locale)).toBe(0);
  });

  it('honors an explicit weekStartsOn={0} over a locale with a non-zero week start', () => {
    // The falsy boundary: a `??`-based implementation returns 0 here; a `||`-based
    // regression would treat 0 as unset and fall through to the locale's 3.
    const locale = { options: { weekStartsOn: 3 } } as never;
    expect(resolveWeekStartsOn(0, locale)).toBe(0);
  });

  it('defaults to Monday when neither is provided', () => {
    expect(resolveWeekStartsOn(undefined, undefined)).toBe(1);
  });

  it('defaults to Monday when the locale has no weekStartsOn', () => {
    const locale = { options: {} } as never;
    expect(resolveWeekStartsOn(undefined, locale)).toBe(1);
  });
});

describe('buildMonthItems', () => {
  it('returns 12 items indexed 0-11', () => {
    const items = buildMonthItems((date) => String(date.getMonth()));
    expect(items).toHaveLength(12);
    expect(items.map((item) => item.value)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
  });

  it('formats every month, including February, from a valid (leap-year) date', () => {
    const formatMonthLabel = vi.fn((date: Date) => date.toISOString());
    const items = buildMonthItems(formatMonthLabel);
    expect(items).toHaveLength(12);
    // Year 2000 is a leap year — passing Feb 1 confirms no RangeError-prone date was built.
    expect(formatMonthLabel).toHaveBeenNthCalledWith(2, new Date(2000, 1, 1));
  });

  it('uses the given formatter for each label', () => {
    const items = buildMonthItems((date) => `month-${date.getMonth()}`);
    expect(items[0].label).toBe('month-0');
    expect(items[11].label).toBe('month-11');
  });
});

describe('buildYearItems', () => {
  it('builds an inclusive range of years', () => {
    const items = buildYearItems(2020, 2023);
    expect(items).toEqual([
      { value: 2020, label: '2020' },
      { value: 2021, label: '2021' },
      { value: 2022, label: '2022' },
      { value: 2023, label: '2023' },
    ]);
  });

  it('returns a single item for a single-year range', () => {
    expect(buildYearItems(2020, 2020)).toEqual([{ value: 2020, label: '2020' }]);
  });

  it('clamps an inverted range to a single fromYear item rather than going negative', () => {
    expect(buildYearItems(2023, 2020)).toEqual([{ value: 2023, label: '2023' }]);
  });
});

describe('clampNavigationTarget', () => {
  it('passes the target through when it leaves room for every displayed month', () => {
    const target = new Date(2030, 9, 1); // October 2030
    const endMonth = new Date(2030, 11, 1); // December 2030
    expect(clampNavigationTarget(target, endMonth, 2)).toEqual(target);
  });

  it('backs a two-month target off by one when it lands on endMonth', () => {
    const target = new Date(2030, 11, 1); // December 2030 — the second month
    const endMonth = new Date(2030, 11, 1); // would otherwise fall past endMonth.
    expect(clampNavigationTarget(target, endMonth, 2)).toEqual(
      new Date(2030, 10, 1) // November 2030
    );
  });

  it('backs a two-month target off when it is already past endMonth', () => {
    const target = new Date(2031, 2, 1); // March 2031
    const endMonth = new Date(2030, 11, 1); // December 2030
    expect(clampNavigationTarget(target, endMonth, 2)).toEqual(
      new Date(2030, 10, 1) // November 2030
    );
  });

  it('only clamps a single-month target once it is past endMonth', () => {
    const endMonth = new Date(2030, 11, 1); // December 2030
    expect(clampNavigationTarget(new Date(2030, 11, 1), endMonth, 1)).toEqual(
      endMonth
    );
    expect(clampNavigationTarget(new Date(2031, 0, 1), endMonth, 1)).toEqual(
      endMonth
    );
  });
});

describe('buildModeProps', () => {
  const onSelect = vi.fn();

  it('omits min/max for the single variant', () => {
    const props = buildModeProps('single', undefined, onSelect, 1, 5);
    expect(props).toEqual({ mode: 'single', selected: undefined, onSelect });
    expect(props).not.toHaveProperty('min');
    expect(props).not.toHaveProperty('max');
  });

  it('includes min/max for the multiple variant', () => {
    const props = buildModeProps('multiple', [], onSelect, 1, 5);
    expect(props).toMatchObject({ mode: 'multiple', min: 1, max: 5 });
  });

  it('includes min/max for the range variant', () => {
    const props = buildModeProps('range', undefined, onSelect, 2, 4);
    expect(props).toMatchObject({ mode: 'range', min: 2, max: 4 });
  });

  it('passes through selected and onSelect unchanged', () => {
    const selected = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 5) };
    const props = buildModeProps('range', selected, onSelect, undefined, undefined) as {
      selected: unknown;
      onSelect: unknown;
    };
    expect(props.selected).toBe(selected);
    expect(props.onSelect).toBe(onSelect);
  });
});
