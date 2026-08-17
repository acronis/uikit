// The subset resolver decides WHICH stories a non-baseline profile re-renders, and
// every way it can go wrong is silent: a filter that matches fewer test files than
// intended does not error — jest runs what it found, all of it passes, and the run
// is green over less than it claims. So each refusal below is a test.
import { describe, expect, it } from 'vitest';

import {
  assertShellInert,
  buildTestPathPatterns,
  resolveTitleIds,
  SUBSET_GROUPS,
  SUBSET_TITLES,
  subsetStoryIds,
} from '../system-theme-subset.mjs';

/** Shaped like `storybook-static/index.json`'s `entries`, values only. */
const entries = [
  { id: 'ui-button--default', title: 'UI/Button', type: 'story' },
  { id: 'ui-button--sizes', title: 'UI/Button', type: 'story' },
  { id: 'widgets-chart--default', title: 'Widgets/Chart', type: 'story' },
  { id: 'ui-card--default', title: 'UI/Card', type: 'story' },
  // Docs entries share a title with their stories and must not be counted.
  { id: 'ui-button--docs', title: 'UI/Button', type: 'docs' },
];

describe('SUBSET_GROUPS', () => {
  it('flattens to SUBSET_TITLES with no duplicates', () => {
    // A title listed twice would run its stories twice per profile and inflate the
    // expected count, turning the story-count assertion into a false failure.
    expect(SUBSET_TITLES).toEqual(SUBSET_GROUPS.flatMap((g) => g.titles));
    expect(new Set(SUBSET_TITLES).size).toBe(SUBSET_TITLES.length);
  });

  it('gives every group a mechanism, because that is the argument for the sample', () => {
    // The grouping is what tells a future reader whether their new component adds a
    // rendering mechanism the sample does not already cover. A group without one is
    // just "some components we picked".
    for (const group of SUBSET_GROUPS) {
      expect(group.mechanism).toBeTruthy();
      expect(group.titles.length).toBeGreaterThan(0);
    }
  });
});

describe('resolveTitleIds', () => {
  it('derives the title id from the ids Storybook actually emitted', () => {
    // Not by re-implementing Storybook's `sanitize()`: a local copy of that slug
    // rule would be a second source of truth that drifts silently.
    expect(resolveTitleIds(entries, ['UI/Button', 'Widgets/Chart'])).toEqual([
      'ui-button',
      'widgets-chart',
    ]);
  });

  it('preserves the order the titles were given', () => {
    expect(resolveTitleIds(entries, ['UI/Card', 'UI/Button'])).toEqual([
      'ui-card',
      'ui-button',
    ]);
  });

  it('THROWS on a title that no longer exists, naming it', () => {
    // The stale-title case. Returning a partial list here is what shrinks a run
    // while keeping it green.
    expect(() => resolveTitleIds(entries, ['UI/Button', 'UI/Gone'])).toThrow(
      /UI\/Gone/
    );
  });

  it('THROWS when a title maps to more than one id prefix', () => {
    // The `--` split is an assumption; this is where it is checked rather than
    // trusted.
    const ambiguous = [
      ...entries,
      { id: 'ui-button-legacy--default', title: 'UI/Button', type: 'story' },
    ];
    expect(() => resolveTitleIds(ambiguous, ['UI/Button'])).toThrow(
      /2 id prefixes/
    );
  });

  it('THROWS on a story id with no `--` separator', () => {
    const malformed = [{ id: 'uibutton', title: 'UI/Button', type: 'story' }];
    expect(() => resolveTitleIds(malformed, ['UI/Button'])).toThrow(
      /no '--' separator/
    );
  });
});

describe('subsetStoryIds', () => {
  it('counts stories only, not docs entries', () => {
    // The count feeds the runner's story-count assertion, so a docs entry included
    // here would make every subset run "miscount" and fail.
    expect(subsetStoryIds(entries, ['UI/Button'])).toEqual([
      'ui-button--default',
      'ui-button--sizes',
    ]);
  });
});

describe('buildTestPathPatterns', () => {
  it('emits one anchored pattern per title', () => {
    // One per title because jest ORs its positional path patterns; a single
    // `(a|b)` alternation does not survive the shells in between.
    expect(buildTestPathPatterns(['ui-button', 'widgets-chart'])).toEqual([
      '/ui-button.test.js',
      '/widgets-chart.test.js',
    ]);
  });

  it('refuses an empty list rather than matching every test', () => {
    // jest treats no pattern as "run everything", which for a subset profile means
    // the full corpus under a theme input that owns no baselines.
    expect(() => buildTestPathPatterns([])).toThrow(/empty test-path pattern/);
  });
});

describe('assertShellInert', () => {
  it('accepts the characters a generated test path uses', () => {
    expect(assertShellInert('/ui-input_text.test.js')).toBe(
      '/ui-input_text.test.js'
    );
  });

  it('rejects anything a shell may reinterpret, listing the offenders', () => {
    // These arguments cross at least two shells before jest's argv, so an
    // allowlist is the only safe rule — escaping guesses at a layer we do not
    // control.
    expect(() => assertShellInert('/(ui-button|ui-card).test.js')).toThrow(
      /may reinterpret/
    );
    expect(() => assertShellInert('/ui-button$')).toThrow(/\$/);
  });
});
