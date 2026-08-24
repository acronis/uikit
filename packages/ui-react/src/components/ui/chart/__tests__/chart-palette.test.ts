import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CHART_CATEGORICAL_TOKENS,
  CHART_DEFAULT_PALETTE,
  CHART_DIVERGING_TOKENS,
  CHART_SEQUENTIAL_TOKENS,
  CHART_STATUS_TOKENS,
  findDuplicateTones,
  listPaletteChoices,
  listPaletteStops,
  resolveChartColors,
  resolveSeriesColor,
  type ChartConfig,
  type ChartPalette,
} from '../index';

const CATEGORICAL: ChartPalette = { type: 'categorical' };
const SEQUENTIAL: ChartPalette = { type: 'sequential', ramp: 'blue' };
const DIVERGING: ChartPalette = { type: 'diverging', pair: 'blue-orange' };
const STATUS: ChartPalette = { type: 'status' };

/** The color N series would paint with, in order. */
const assign = (palette: ChartPalette, total: number) =>
  Array.from({ length: total }, (_, index) =>
    resolveSeriesColor(palette, { index })
  );

afterEach(() => {
  vi.restoreAllMocks();
});

describe('chart palette tokens', () => {
  it('exposes every dataviz token the design ships', () => {
    expect(CHART_CATEGORICAL_TOKENS).toHaveLength(16);
    expect(Object.keys(CHART_SEQUENTIAL_TOKENS)).toEqual([
      'blue',
      'teal',
      'orange',
      'violet',
    ]);
    expect(CHART_SEQUENTIAL_TOKENS.blue).toHaveLength(8);
    expect(Object.keys(CHART_DIVERGING_TOKENS)).toEqual([
      'blue-orange',
      'teal-violet',
    ]);
    expect(CHART_DIVERGING_TOKENS['blue-orange']).toHaveLength(6);
    expect(Object.keys(CHART_STATUS_TOKENS)).toHaveLength(6);
  });

  it('references only --ui-dataviz-* custom properties', () => {
    const every = [
      ...CHART_CATEGORICAL_TOKENS,
      ...Object.values(CHART_SEQUENTIAL_TOKENS).flat(),
      ...Object.values(CHART_DIVERGING_TOKENS).flat(),
      ...Object.values(CHART_STATUS_TOKENS),
    ];

    for (const color of every) {
      expect(color).toMatch(/^var\(--ui-dataviz-[a-z0-9-]+\)$/);
    }
  });

  it('walks a diverging pair from one hue through to the other', () => {
    expect(CHART_DIVERGING_TOKENS['blue-orange']).toEqual([
      'var(--ui-dataviz-diverging-blue-orange-a3)',
      'var(--ui-dataviz-diverging-blue-orange-a2)',
      'var(--ui-dataviz-diverging-blue-orange-a1)',
      'var(--ui-dataviz-diverging-blue-orange-b1)',
      'var(--ui-dataviz-diverging-blue-orange-b2)',
      'var(--ui-dataviz-diverging-blue-orange-b3)',
    ]);
  });

  it('defaults to the categorical palette', () => {
    expect(CHART_DEFAULT_PALETTE).toEqual({ type: 'categorical' });
  });
});

describe('automatic series assignment', () => {
  it('walks the categorical palette in order', () => {
    expect(assign(CATEGORICAL, 3)).toEqual(
      CHART_CATEGORICAL_TOKENS.slice(0, 3)
    );
  });

  it('wraps past the 16th categorical hue rather than running out', () => {
    expect(resolveSeriesColor(CATEGORICAL, { index: 16 })).toBe(
      CHART_CATEGORICAL_TOKENS[0]
    );
  });

  it('walks a sequential ramp in its defined order, without spreading', () => {
    // 3 series read stops 1 / 2 / 3 — the palette's own order. Re-spacing them
    // across the ramp would be this module inventing a rule the design has not
    // stated.
    expect(assign(SEQUENTIAL, 3)).toEqual(
      CHART_SEQUENTIAL_TOKENS.blue.slice(0, 3)
    );
  });

  it('gives a lone series the ramp’s first stop', () => {
    expect(assign(SEQUENTIAL, 1)).toEqual([CHART_SEQUENTIAL_TOKENS.blue[0]]);
  });

  it('uses every stop when the series count matches the ramp length', () => {
    expect(assign(SEQUENTIAL, 8)).toEqual([...CHART_SEQUENTIAL_TOKENS.blue]);
  });

  it('walks a diverging pair in order too', () => {
    expect(assign(DIVERGING, 2)).toEqual(
      CHART_DIVERGING_TOKENS['blue-orange'].slice(0, 2)
    );
  });

  it('never repeats a color while there are stops left', () => {
    for (const palette of [CATEGORICAL, SEQUENTIAL, DIVERGING]) {
      const colors = assign(palette, listPaletteStops(palette).length);
      expect(new Set(colors).size).toBe(colors.length);
    }
  });
});

describe('per-series overrides', () => {
  it('pins a categorical series to another hue of the palette', () => {
    expect(
      resolveSeriesColor(CATEGORICAL, { index: 0, tone: { slot: 7 } })
    ).toBe(CHART_CATEGORICAL_TOKENS[6]);
  });

  it('clamps an out-of-range categorical slot instead of going off-palette', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(
      resolveSeriesColor(CATEGORICAL, { index: 0, tone: { slot: 99 } })
    ).toBe(CHART_CATEGORICAL_TOKENS[15]);
    expect(
      resolveSeriesColor(CATEGORICAL, { index: 0, tone: { slot: 0 } })
    ).toBe(CHART_CATEGORICAL_TOKENS[0]);
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('refuses a per-series slot on a sequential ramp', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // The ramp reads as an ordered scale; letting one series jump to an
    // arbitrary stop would break that reading. Falls back to its position.
    expect(
      resolveSeriesColor(SEQUENTIAL, { index: 1, tone: { slot: 8 } })
    ).toBe(CHART_SEQUENTIAL_TOKENS.blue[1]);
    expect(warn).toHaveBeenCalledOnce();
  });

  it('refuses a per-series slot on a diverging pair', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(resolveSeriesColor(DIVERGING, { index: 0, tone: { slot: 6 } })).toBe(
      CHART_DIVERGING_TOKENS['blue-orange'][0]
    );
    expect(warn).toHaveBeenCalledOnce();
  });

  it('names a status tone under the status palette', () => {
    expect(
      resolveSeriesColor(STATUS, { index: 0, tone: { status: 'danger' } })
    ).toBe(CHART_STATUS_TOKENS.danger);
  });

  it('falls back to neutral and warns when a status series names no tone', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(resolveSeriesColor(STATUS, { index: 0 })).toBe(
      CHART_STATUS_TOKENS.neutral
    );
    expect(warn).toHaveBeenCalledOnce();
  });

  it('ignores a status tone under an ordered palette, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(
      resolveSeriesColor(CATEGORICAL, { index: 1, tone: { status: 'danger' } })
    ).toBe(CHART_CATEGORICAL_TOKENS[1]);
    expect(warn).toHaveBeenCalledOnce();
  });
});

describe('listPaletteChoices', () => {
  it('offers one choice per hue for the categorical palette', () => {
    expect(listPaletteChoices(CATEGORICAL)).toHaveLength(16);
    expect(listPaletteChoices(CATEGORICAL)[6]).toEqual({ slot: 7 });
  });

  it('offers nothing for the ramp palettes — they have no per-series control', () => {
    expect(listPaletteChoices(SEQUENTIAL)).toEqual([]);
    expect(listPaletteChoices(DIVERGING)).toEqual([]);
  });

  it('offers the six named tones for the status palette', () => {
    expect(listPaletteChoices(STATUS)).toEqual([
      { status: 'danger' },
      { status: 'critical' },
      { status: 'warning' },
      { status: 'success' },
      { status: 'info' },
      { status: 'neutral' },
    ]);
  });

  it('resolves every offered choice to a real palette color', () => {
    for (const palette of [CATEGORICAL, STATUS]) {
      for (const tone of listPaletteChoices(palette)) {
        const color = resolveSeriesColor(palette, { index: 0, tone });
        expect(color).toMatch(/^var\(--ui-dataviz-/);
      }
    }
  });
});

describe('resolveChartColors', () => {
  it('fills in a color for every series that has none', () => {
    const config = {
      desktop: { label: 'Desktop' },
      mobile: { label: 'Mobile' },
    } satisfies ChartConfig;

    expect(resolveChartColors(config, CATEGORICAL)).toEqual({
      desktop: { label: 'Desktop', color: CHART_CATEGORICAL_TOKENS[0] },
      mobile: { label: 'Mobile', color: CHART_CATEGORICAL_TOKENS[1] },
    });
  });

  it('leaves a series that states its own color untouched', () => {
    const config = {
      pinned: { label: 'Pinned', color: 'var(--ui-background-brand-primary)' },
      auto: { label: 'Auto' },
    } satisfies ChartConfig;

    const resolved = resolveChartColors(config, CATEGORICAL);

    expect(resolved.pinned.color).toBe('var(--ui-background-brand-primary)');
    // The pinned series doesn't consume a slot, so `auto` still gets the first.
    expect(resolved.auto.color).toBe(CHART_CATEGORICAL_TOKENS[0]);
  });

  it('does not let a pinned series consume a ramp stop', () => {
    const config = {
      pinned: { label: 'Pinned', color: 'red' },
      a: { label: 'A' },
      b: { label: 'B' },
    } satisfies ChartConfig;

    const resolved = resolveChartColors(config, SEQUENTIAL);

    // The two assignable series take stops 1 and 2, not 2 and 3.
    expect(resolved.a.color).toBe(CHART_SEQUENTIAL_TOKENS.blue[0]);
    expect(resolved.b.color).toBe(CHART_SEQUENTIAL_TOKENS.blue[1]);
  });

  it('honors a per-series tone', () => {
    const config = {
      ok: { label: 'OK', tone: { status: 'success' } },
      bad: { label: 'Bad', tone: { status: 'danger' } },
    } satisfies ChartConfig;

    const resolved = resolveChartColors(config, STATUS);

    expect(resolved.ok.color).toBe(CHART_STATUS_TOKENS.success);
    expect(resolved.bad.color).toBe(CHART_STATUS_TOKENS.danger);
  });

  it('preserves the series order', () => {
    const config = {
      first: {},
      second: {},
      third: {},
    } satisfies ChartConfig;

    expect(Object.keys(resolveChartColors(config, CATEGORICAL))).toEqual([
      'first',
      'second',
      'third',
    ]);
  });
});

describe('findDuplicateTones', () => {
  it('reports nothing when every series paints a different color', () => {
    const config = { a: {}, b: {}, c: {} } satisfies ChartConfig;
    const resolved = resolveChartColors(config, CATEGORICAL);

    expect(findDuplicateTones(colorsOf(resolved))).toEqual([]);
  });

  it('groups the series that would paint the same color', () => {
    const config = {
      a: { tone: { slot: 3 } },
      b: { tone: { slot: 3 } },
      c: { tone: { slot: 5 } },
      d: { tone: { slot: 5 } },
      e: { tone: { slot: 9 } },
    } satisfies ChartConfig;

    expect(
      findDuplicateTones(colorsOf(resolveChartColors(config, CATEGORICAL)))
    ).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });
});

/** The `key -> color` map the duplicate check runs over. */
function colorsOf(config: ChartConfig): Record<string, string> {
  return Object.fromEntries(
    Object.entries(config)
      .filter(([, item]) => item.color)
      .map(([key, item]) => [key, item.color as string])
  );
}
