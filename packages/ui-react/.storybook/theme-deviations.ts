import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { VisualProfileName } from './visual-regression';

/**
 * Accepted deviations: stories that are KNOWN to render differently under a
 * non-baseline theme profile, and that we have decided not to fix (yet).
 *
 * ── WHY AN ALLOWLIST AND NOT A BASELINE ──────────────────────────────────────
 * The obvious way to "accept" a difference is to let the profile record its own
 * PNG. That is the one option that must not be taken. A profile-owned baseline
 * compares a render against itself, so the day it is written the check stops
 * asserting anything: the deviation is frozen as ground truth and every later run
 * is green, including the run where the deviation gets *worse*.
 *
 * An entry here does the opposite. It **inverts** the assertion — the listed story
 * MUST differ from the committed baseline under that profile. So:
 *
 *   * the deviation stays visible (it is a named row with a reason and an owner,
 *     not a silent PNG among 1500), and
 *   * the moment someone fixes the underlying styling, the entry becomes STALE and
 *     the run FAILS, telling them to delete it. A waiver that outlives its cause is
 *     the failure mode of every allowlist, and this is the one shape that cannot.
 *
 * Ships empty, and should stay that way: every story in the sample currently
 * reproduces its baseline under all four profiles. Add a row only when the
 * difference is understood and deliberately kept — the default response to a
 * failing profile is to fix the component, because the failure means its styling
 * keyed off `[data-theme]` instead of resolving through a token.
 *
 * The data lives in `theme-deviations.json` (schema in
 * `theme-deviations.schema.json`) rather than in this module, because
 * `scripts/visual-capture.mjs` reads the same file under bare Node — it cannot
 * import TypeScript, and a second hand-maintained copy of the list is exactly the
 * drift this repo already guards against for the profile names.
 */
export interface ThemeDeviation {
  /** Storybook story id, e.g. `widgets-chart--default`. */
  story: string;
  /** The non-baseline profiles under which this story is known to differ. */
  profiles: VisualProfileName[];
  reason: string;
  approvedBy: string;
  /** ISO date the deviation was accepted. */
  date: string;
  /** Optional ISO date after which the entry is refused as expired. */
  expires?: string;
  /** Optional tracking issue. */
  issue?: string;
}

/** Only profiles that own no baselines can have a deviation — see `validate`. */
const DEVIATABLE_PROFILES: VisualProfileName[] = [
  'system-dark',
  'system-light',
  'forced-light',
  'forced-dark',
];

/**
 * Read, not `import`ed.
 *
 * `import registry from './theme-deviations.json'` works under vitest and dies
 * inside the capture container: `@storybook/test-runner` loads this config through
 * Node's ESM loader, which requires `with { type: 'json' }` — an attribute the TS
 * emit here does not carry (`ERR_IMPORT_ATTRIBUTE_MISSING`, seen for real). Reading
 * the file sidesteps the loader entirely and is what `scripts/visual-capture.mjs`
 * already does with the same JSON, so both sides stay on one source of truth.
 *
 * Resolved from `process.cwd()`, which is the package directory in every context
 * that loads this — the same assumption the runner already makes for
 * `${process.cwd()}/test/__snapshots__`.
 */
function readRegistry(): ThemeDeviation[] {
  const path = join(process.cwd(), '.storybook/theme-deviations.json');
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as {
    deviations?: ThemeDeviation[];
  };
  return parsed.deviations ?? [];
}

export const THEME_DEVIATIONS = readRegistry();

/**
 * Structural problems that would make an entry lie, as a list of messages.
 *
 * Returned rather than thrown so the caller decides where they surface — the unit
 * test reports all of them at once, while the runner fails the capture.
 *
 * `today` is injected instead of read from the clock so the expiry rule is
 * testable without freezing time.
 */
export function validateThemeDeviations(
  entries: ThemeDeviation[],
  today: string
): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    const where = `deviation for '${entry.story}'`;

    for (const profile of entry.profiles) {
      if (!DEVIATABLE_PROFILES.includes(profile)) {
        problems.push(
          `${where}: '${profile}' owns its baselines, so a deviation from it is ` +
            'meaningless — it would be asserting that a profile differs from ' +
            'itself. Only these can deviate: ' +
            `${DEVIATABLE_PROFILES.join(', ')}.`
        );
      }
      const key = `${entry.story}::${profile}`;
      if (seen.has(key)) {
        problems.push(
          `${where}: listed twice for '${profile}'. Two rows for one pair means ` +
            'deleting the fixed one still leaves the check inverted.'
        );
      }
      seen.add(key);
    }

    if (entry.profiles.length === 0) {
      problems.push(`${where}: names no profiles, so it can never apply.`);
    }
    if (!entry.reason?.trim()) {
      problems.push(
        `${where}: has no reason. An accepted deviation without one cannot be ` +
          're-judged later, which is when it matters.'
      );
    }
    if (!entry.approvedBy?.trim()) {
      problems.push(`${where}: has no approvedBy.`);
    }
    if (entry.expires && entry.expires <= today) {
      problems.push(
        `${where}: expired on ${entry.expires}. Re-approve it with a new date, ` +
          'or delete it and fix the component.'
      );
    }
  }

  return problems;
}

/** The entry covering this story under this profile, if any. */
export function findThemeDeviation(
  entries: ThemeDeviation[],
  profile: VisualProfileName,
  storyId: string
): ThemeDeviation | undefined {
  return entries.find(
    (entry) => entry.story === storyId && entry.profiles.includes(profile)
  );
}
