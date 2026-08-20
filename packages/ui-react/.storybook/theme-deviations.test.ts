import {
  findThemeDeviation,
  THEME_DEVIATIONS,
  validateThemeDeviations,
  type ThemeDeviation,
} from './theme-deviations';

const TODAY = '2026-08-20';

const entry = (over: Partial<ThemeDeviation> = {}): ThemeDeviation => ({
  story: 'widgets-chart--default',
  profiles: ['system-dark'],
  reason: 'ChartStyle scopes its dark series colours under [data-theme=dark].',
  approvedBy: 'someone',
  date: '2026-08-20',
  ...over,
});

describe('THEME_DEVIATIONS (the committed registry)', () => {
  it('is empty, and should stay that way', () => {
    // Every story in the sample currently reproduces its baseline under all four
    // profiles. A row here is an accepted defect — the default response to a
    // failing profile is to fix the component, not to waive it.
    expect(THEME_DEVIATIONS).toEqual([]);
  });

  it('validates', () => {
    expect(validateThemeDeviations(THEME_DEVIATIONS, TODAY)).toEqual([]);
  });
});

describe('validateThemeDeviations', () => {
  it('accepts a well-formed entry', () => {
    expect(validateThemeDeviations([entry()], TODAY)).toEqual([]);
  });

  it('rejects a deviation from a profile that owns its baselines', () => {
    // `dark` compares against its own PNG, so "known to differ from the baseline"
    // would mean differing from itself — an entry that can never be satisfied and
    // would fail the story forever.
    const problems = validateThemeDeviations(
      [entry({ profiles: ['dark'] })],
      TODAY
    );
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/owns its baselines/);
  });

  it('rejects the same story+profile pair listed twice', () => {
    // Deleting the fixed row would leave the check still inverted, so the story
    // stays exempt with nothing pointing at why.
    const problems = validateThemeDeviations(
      [entry(), entry({ approvedBy: 'someone else' })],
      TODAY
    );
    expect(problems.some((p) => /listed twice/.test(p))).toBe(true);
  });

  it('allows one story to deviate under several profiles', () => {
    expect(
      validateThemeDeviations(
        [entry({ profiles: ['system-dark', 'forced-dark'] })],
        TODAY
      )
    ).toEqual([]);
  });

  it('rejects an entry that names no profiles', () => {
    const problems = validateThemeDeviations([entry({ profiles: [] })], TODAY);
    expect(problems[0]).toMatch(/names no profiles/);
  });

  it('requires a reason and an approver', () => {
    expect(
      validateThemeDeviations([entry({ reason: '   ' })], TODAY)[0]
    ).toMatch(/no reason/);
    expect(
      validateThemeDeviations([entry({ approvedBy: '' })], TODAY)[0]
    ).toMatch(/no approvedBy/);
  });

  it('refuses an expired entry, and accepts one expiring later', () => {
    // The date is injected rather than read from the clock, so this is a real
    // assertion about the boundary instead of a test that passes until it doesn't.
    expect(
      validateThemeDeviations([entry({ expires: '2026-08-19' })], TODAY)[0]
    ).toMatch(/expired on 2026-08-19/);
    // Same-day expiry is expired: the waiver covered up to that date.
    expect(
      validateThemeDeviations([entry({ expires: TODAY })], TODAY)
    ).toHaveLength(1);
    expect(
      validateThemeDeviations([entry({ expires: '2026-08-21' })], TODAY)
    ).toEqual([]);
  });

  it('reports every problem at once rather than the first', () => {
    const problems = validateThemeDeviations(
      [entry({ profiles: ['light'], reason: '', approvedBy: '' })],
      TODAY
    );
    expect(problems.length).toBeGreaterThanOrEqual(3);
  });
});

describe('findThemeDeviation', () => {
  const entries = [
    entry({ story: 'widgets-chart--default', profiles: ['system-dark'] }),
    entry({
      story: 'ui-table--default',
      profiles: ['forced-dark', 'system-light'],
    }),
  ];

  it('matches on story AND profile, not either alone', () => {
    expect(
      findThemeDeviation(entries, 'system-dark', 'widgets-chart--default')
    ).toBeDefined();
    // Right story, wrong profile — the chart is only waived under system-dark.
    expect(
      findThemeDeviation(entries, 'forced-dark', 'widgets-chart--default')
    ).toBeUndefined();
    // Right profile, wrong story.
    expect(
      findThemeDeviation(entries, 'system-dark', 'ui-button--default')
    ).toBeUndefined();
  });

  it('finds an entry that lists several profiles', () => {
    for (const profile of ['forced-dark', 'system-light'] as const) {
      expect(
        findThemeDeviation(entries, profile, 'ui-table--default')
      ).toBeDefined();
    }
  });
});
