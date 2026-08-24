import {
  getSnapshotIdentifier,
  resolveVisualProfile,
  rootThemeState,
  VISUAL_PROFILES,
} from './visual-regression';

describe('resolveVisualProfile', () => {
  it('defaults an unset or empty mode to light', () => {
    // docker-compose passes `${STORYBOOK_COLOR_MODE:-light}`, and this stack does
    // hand through empty strings — "nobody asked" is not the same as a typo.
    expect(resolveVisualProfile(undefined).name).toBe('light');
    expect(resolveVisualProfile('').name).toBe('light');
  });

  it('resolves every declared profile by name', () => {
    for (const name of Object.keys(VISUAL_PROFILES)) {
      expect(resolveVisualProfile(name).name).toBe(name);
    }
  });

  it('THROWS on an unrecognised mode instead of falling back to light', () => {
    // Four of the six profiles file against a baseline family they do not own, two
    // of them against the opposite family — so a typo in an `--update` run would
    // overwrite committed PNGs with renders captured under the wrong theme input.
    // A lenient default is only safe while every branch is harmless.
    expect(() => resolveVisualProfile('sytem-dark')).toThrow(/Unknown/);
    expect(() => resolveVisualProfile('invalid')).toThrow(/system-dark/);
  });

  it('names every profile in the error, so a typo shows the real vocabulary', () => {
    const message = (() => {
      try {
        resolveVisualProfile('nope');
        return '';
      } catch (error) {
        return (error as Error).message;
      }
    })();
    for (const name of Object.keys(VISUAL_PROFILES)) {
      expect(message).toContain(name);
    }
  });
});

describe('VISUAL_PROFILES', () => {
  // These six rows ARE the specification — the table in the module docblock is
  // prose, and prose does not fail. Each profile's `baseline` is the assertion it
  // makes, so a wrong value here does not error: it compares a dark render against
  // a light PNG and reports a defect that is really a config mistake.
  it.each([
    ['light', 'light', true, 'light', 'light', false],
    ['dark', 'dark', true, 'light', 'dark', false],
    ['system-dark', null, false, 'dark', 'dark', true],
    ['system-light', null, false, 'light', 'light', true],
    ['forced-light', 'light', false, 'dark', 'light', true],
    ['forced-dark', 'dark', false, 'dark', 'dark', true],
  ])(
    '%s: attr=%s inline=%s emulate=%s baseline=%s subset=%s',
    (name, themeAttribute, inlineColorScheme, emulate, baseline, subset) => {
      expect(VISUAL_PROFILES[name as keyof typeof VISUAL_PROFILES]).toMatchObject(
        {
          themeAttribute,
          inlineColorScheme,
          emulate,
          baseline,
          subset,
        }
      );
    }
  );

  it('covers the [data-theme] × OS cross product exactly once', () => {
    // The reason there are six profiles and not "a few useful ones": the two
    // inputs have 3 × 2 states and each is reachable by a real consumer. A
    // duplicate pair means two legs paying for the same evidence; a missing pair
    // means a state a user can be in that nothing captures. Both are invisible
    // from the profile list alone, which is why this counts rather than reads.
    const inputs = Object.values(VISUAL_PROFILES).map(
      (p) => `${p.themeAttribute ?? 'absent'}/${p.emulate}`
    );
    expect([...inputs].sort()).toEqual(
      [
        'absent/dark',
        'absent/light',
        'dark/dark',
        'dark/light',
        'light/dark',
        'light/light',
      ].sort()
    );
  });

  it('derives every baseline from the theme the used color-scheme resolves to', () => {
    // The invariant behind the whole scheme. With no attribute the OS decides;
    // with one, it wins. So `baseline` is not a free choice — it is a function of
    // the two inputs, and a row that disagrees is a config error that presents as
    // a component defect.
    for (const profile of Object.values(VISUAL_PROFILES)) {
      expect(profile.baseline).toBe(profile.themeAttribute ?? profile.emulate);
    }
  });

  it('lets only the two exhaustive profiles own baselines', () => {
    // `subset: false` means "writes PNGs". Exactly light and dark may, and they
    // must stay exhaustive: a sample cannot own a corpus, because the stories it
    // skips would have no baseline at all.
    const owners = Object.values(VISUAL_PROFILES)
      .filter((p) => !p.subset)
      .map((p) => p.name);
    expect(owners.sort()).toEqual(['dark', 'light']);
  });

  it('gives every non-baseline profile an input its baseline owner does not have', () => {
    // A profile whose attribute, emulated OS and inline `color-scheme` all matched
    // its baseline owner would re-run an identical render, assert nothing, and
    // still cost a leg.
    for (const profile of Object.values(VISUAL_PROFILES).filter(
      (p) => p.subset
    )) {
      const owner = VISUAL_PROFILES[profile.baseline];
      expect({
        sameAttribute: profile.themeAttribute === owner.themeAttribute,
        sameEmulate: profile.emulate === owner.emulate,
        sameInlineColorScheme:
          profile.inlineColorScheme === owner.inlineColorScheme,
      }).not.toEqual({
        sameAttribute: true,
        sameEmulate: true,
        sameInlineColorScheme: true,
      });
    }
  });
});

describe('rootThemeState', () => {
  it('clears both inputs for the system profiles', () => {
    // `null` means ABSENT. Storybook's preview decorator has already set both by
    // the time the runner acts, so "don't set it" would inherit the attribute path
    // and the profile would silently capture the wrong state.
    for (const name of ['system-dark', 'system-light'] as const) {
      expect(rootThemeState(VISUAL_PROFILES[name])).toEqual({
        dataTheme: null,
        inlineColorScheme: null,
      });
    }
  });

  it('sets the attribute but NOT an inline color-scheme for the forced profiles', () => {
    // An inline `color-scheme` would bypass the token bundle's `[data-theme]`
    // rule — the rule these profiles exist to test.
    expect(rootThemeState(VISUAL_PROFILES['forced-light'])).toEqual({
      dataTheme: 'light',
      inlineColorScheme: null,
    });
    expect(rootThemeState(VISUAL_PROFILES['forced-dark'])).toEqual({
      dataTheme: 'dark',
      inlineColorScheme: null,
    });
  });

  it('sets both for the baseline-owning profiles', () => {
    expect(rootThemeState(VISUAL_PROFILES.light)).toEqual({
      dataTheme: 'light',
      inlineColorScheme: 'light',
    });
    expect(rootThemeState(VISUAL_PROFILES.dark)).toEqual({
      dataTheme: 'dark',
      inlineColorScheme: 'dark',
    });
  });
});

describe('getSnapshotIdentifier', () => {
  it('suffixes dark snapshot identifiers', () => {
    expect(getSnapshotIdentifier('ui-button--default', 'light')).toBe(
      'ui-button--default'
    );
    expect(getSnapshotIdentifier('ui-button--default', 'dark')).toBe(
      'ui-button--default--dark'
    );
  });

  it('files a non-owning profile under its BASELINE, not its name', () => {
    // The reuse is the assertion: `system-dark` has no `--system-dark` PNGs, it
    // must reproduce the committed dark ones.
    expect(
      getSnapshotIdentifier(
        'ui-button--default',
        VISUAL_PROFILES['system-dark'].baseline
      )
    ).toBe('ui-button--default--dark');
    expect(
      getSnapshotIdentifier(
        'ui-button--default',
        VISUAL_PROFILES['forced-light'].baseline
      )
    ).toBe('ui-button--default');
  });
});
