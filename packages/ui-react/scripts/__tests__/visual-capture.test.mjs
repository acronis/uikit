// Guards the decisions in scripts/visual-capture.mjs that a reader cannot check
// by eye: what a profile name expands to, and how a captured run is turned into a
// verdict.
//
// `.mjs` rather than `.ts` on purpose: the subject is a plain Node script outside
// `tsconfig.json`'s `include`, and vitest's default `include` already matches
// `*.test.mjs`.
//
// The fixtures carry ANSI escapes and Compose's `service-1  | ` prefix, shaped
// like this repo's real capture logs, because that prefix/escape stripping is the
// layer that decides whether a summary line is found at all — and a hand-written
// approximation without them would let it regress silently.
import { describe, expect, it } from 'vitest';

import {
  clean,
  KNOWN_MODES,
  MODE_GROUPS,
  parseSummary,
  resolveModes,
  SUBSET_MODES,
  summarise,
} from '../visual-capture.mjs';
// The TS module this script mirrors. Imported from the `.mjs` test rather than the
// reverse: vitest transforms the TS for us, while the script itself runs under
// bare Node and cannot import it at all.
import { VISUAL_PROFILES } from '../../.storybook/visual-regression';

const E = '\u001b';

/** A full-corpus light run with a real regression: 2 snapshots failed. */
const RUN_WITH_SNAPSHOT_FAILURES = [
  `test-runner-1  | ${E}[1mTest Suites: ${E}[22m${E}[1m${E}[31m2 failed${E}[39m${E}[22m, ${E}[1m${E}[32m146 passed${E}[39m${E}[22m, 148 total`,
  `test-runner-1  | ${E}[1mTests:       ${E}[22m${E}[1m${E}[31m2 failed${E}[39m${E}[22m, ${E}[1m${E}[32m759 passed${E}[39m${E}[22m, 761 total`,
  `test-runner-1  | ${E}[1mSnapshots:   ${E}[22m${E}[1m${E}[31m2 failed${E}[39m${E}[22m, ${E}[1m${E}[32m759 passed${E}[39m${E}[22m, 761 total`,
  `${E}[Ktest-runner-1 exited with code 1`,
].join('\n');

/**
 * A run that FAILED on something other than a snapshot: tests red, snapshot phase
 * clean. The distinction the verdict has to preserve — under a `&&` chain this is
 * also what cancels the next profile.
 */
const RUN_WITH_TIMEOUTS = [
  `test-runner-1  | ${E}[1mTest Suites: ${E}[22m${E}[1m${E}[31m1 failed${E}[39m${E}[22m, ${E}[1m${E}[32m147 passed${E}[39m${E}[22m, 148 total`,
  `test-runner-1  | ${E}[1mTests:       ${E}[22m${E}[1m${E}[31m3 failed${E}[39m${E}[22m, ${E}[1m${E}[32m758 passed${E}[39m${E}[22m, 761 total`,
  `test-runner-1  | ${E}[1mSnapshots:   ${E}[22m${E}[1m${E}[32m758 passed${E}[39m${E}[22m, 758 total`,
  `${E}[Ktest-runner-1 exited with code 1`,
].join('\n');

/**
 * A real Compose container-name collision, of the shape this repo has produced
 * (`dependency failed to start` / `No such container`). The loser ran ZERO tests,
 * and the only thing resembling a verdict is an exit code — which is exactly why
 * the runner must not read a verdict from one.
 */
const CONTAINER_NAME_COLLISION = [
  ' Container ui-react-storybook-1  Error dependency storybook failed to start',
  ' dependency failed to start: Error response from daemon: No such container: c204356edc52',
  'ELIFECYCLE  Command failed with exit code 1.',
].join('\n');

/** A clean subset run: 112 stories, the size of the curated sample. */
const CLEAN_SUBSET_RUN = [
  `test-runner-1  | ${E}[1mTest Suites: ${E}[22m${E}[1m${E}[32m20 passed${E}[39m${E}[22m, 20 total`,
  `test-runner-1  | ${E}[1mTests:       ${E}[22m${E}[1m${E}[32m112 passed${E}[39m${E}[22m, 112 total`,
  `test-runner-1  | ${E}[1mSnapshots:   ${E}[22m${E}[1m${E}[32m112 passed${E}[39m${E}[22m, 112 total`,
].join('\n');

describe('clean', () => {
  it('strips ANSI colour and the Compose service prefix', () => {
    expect(clean(`test-runner-1  | ${E}[1mTests:${E}[22m 1 passed`)).toBe(
      'Tests: 1 passed'
    );
  });

  it('strips the erase-line sequence Compose puts on container status lines', () => {
    // Any CSI sequence, not only colour (`m`). Leaving the escape byte at the head
    // of the line would make every `startsWith` below miss a summary that IS in the
    // output. The `service-1 |` prefix rule does not apply to this line — it has no
    // pipe — so the container name legitimately stays.
    expect(clean(`${E}[Ktest-runner-1 exited with code 1`)).toBe(
      'test-runner-1 exited with code 1'
    );
  });

  it('leaves an unprefixed line alone', () => {
    expect(clean('Tests:       1 passed, 1 total')).toBe(
      'Tests:       1 passed, 1 total'
    );
  });
});

describe('parseSummary', () => {
  it('reads jest tallies through ANSI and the Compose prefix', () => {
    const s = parseSummary(RUN_WITH_SNAPSHOT_FAILURES);

    expect(s.ran).toBe(true);
    expect(s.tests).toEqual({ failed: 2, passed: 759, written: 0, total: 761 });
    expect(s.suites).toEqual({
      failed: 2,
      passed: 146,
      written: 0,
      total: 148,
    });
    expect(s.snapshots).toEqual({
      failed: 2,
      passed: 759,
      written: 0,
      total: 761,
    });
  });

  it('separates a test failure from a snapshot failure', () => {
    // Both exit 1, and only this distinction says whether a baseline moved or an
    // unrelated test timed out.
    const s = parseSummary(RUN_WITH_TIMEOUTS);
    expect(s.tests.failed).toBe(3);
    expect(s.snapshots.failed).toBe(0);
  });

  it('does not mistake "Test Suites:" for the "Tests:" line', () => {
    const suitesOnly = `test-runner-1  | Test Suites: 3 passed, 3 total`;
    expect(parseSummary(suitesOnly).ran).toBe(false);
  });

  it('reports ran=false when a run produced no jest summary at all', () => {
    // THE load-bearing case. A container collision exits non-zero having run
    // nothing; if that ever parses as "ran", a zero-test capture reads as a result
    // and a profile goes missing unnoticed.
    expect(parseSummary(CONTAINER_NAME_COLLISION).ran).toBe(false);
  });
});

describe('summarise', () => {
  const ok = (mode) => ({ mode, code: 0, ...parseSummary(CLEAN_SUBSET_RUN) });
  const ranAndFailed = (mode) => ({
    mode,
    code: 1,
    ...parseSummary(RUN_WITH_SNAPSHOT_FAILURES),
  });
  const neverRan = (mode) => ({
    mode,
    code: 1,
    ...parseSummary(CONTAINER_NAME_COLLISION),
  });

  it('passes only when every requested profile ran and passed', () => {
    const v = summarise([ok('light'), ok('dark')]);
    expect(v).toMatchObject({ requested: 2, ranCount: 2, ok: true });
    expect(v.notRun).toHaveLength(0);
    expect(v.failed).toHaveLength(0);
  });

  it('fails when a profile never ran, even though the other one passed', () => {
    // The `&&`-chain shape exactly: light fine, dark absent. Must not be green.
    const v = summarise([ok('light'), neverRan('dark')]);

    expect(v.ok).toBe(false);
    expect(v.ranCount).toBe(1);
    expect(v.requested).toBe(2);
    expect(v.notRun.map((r) => r.mode)).toEqual(['dark']);
    // Kept out of `failed`: "never ran" and "ran and regressed" demand different
    // responses, so the report distinguishes them.
    expect(v.failed).toHaveLength(0);
  });

  it('fails when a profile ran and reported failures', () => {
    const v = summarise([ranAndFailed('light'), ok('dark')]);

    expect(v.ok).toBe(false);
    expect(v.ranCount).toBe(2);
    expect(v.failed.map((r) => r.mode)).toEqual(['light']);
    expect(v.notRun).toHaveLength(0);
  });

  it('fails a subset profile that ran the wrong number of stories', () => {
    // A test-path pattern that matched fewer files than intended does not error:
    // jest runs what it found, all of it passes, and the run is GREEN over less
    // than it claims. This is the only check that catches it.
    const v = summarise([{ ...ok('system-dark'), expected: 120 }]);

    expect(v.ok).toBe(false);
    expect(v.miscounted.map((r) => r.mode)).toEqual(['system-dark']);
    expect(v.failed).toHaveLength(0);
    expect(v.notRun).toHaveLength(0);
  });

  it('accepts a subset profile whose count matches', () => {
    expect(summarise([{ ...ok('forced-dark'), expected: 112 }]).ok).toBe(true);
  });
});

/**
 * The mode vocabulary this script accepts, and the fact that it still describes
 * the profiles the runner implements.
 *
 * Two lists in two languages (`.mjs` here, `.ts` in `.storybook/`) cannot import
 * each other in production — the script runs under bare Node, outside any TS
 * loader — so the mirror is checked here instead of trusted to a comment. The two
 * halves fail asymmetrically, which is why this matters: an unknown profile name
 * is refused loudly, but a subset profile that this script does not KNOW is a
 * subset profile is treated as a baseline owner, and then `--update` is no longer
 * refused for it.
 */
describe('mode vocabulary mirrors VISUAL_PROFILES', () => {
  it('knows exactly the profiles the runner declares', () => {
    expect([...KNOWN_MODES].sort()).toEqual(
      Object.keys(VISUAL_PROFILES).sort()
    );
  });

  it('marks exactly the non-baseline profiles as subset modes', () => {
    const declared = Object.values(VISUAL_PROFILES)
      .filter((p) => p.subset)
      .map((p) => p.name);
    expect([...SUBSET_MODES].sort()).toEqual(declared.sort());
  });
});

describe('resolveModes', () => {
  it('defaults to the baseline-owning pair when --mode is absent', () => {
    expect(resolveModes(undefined)).toEqual(['light', 'dark']);
  });

  it('expands each group', () => {
    expect(resolveModes('both')).toEqual(['light', 'dark']);
    expect(resolveModes('themes')).toEqual(SUBSET_MODES);
    expect(resolveModes('all')).toEqual(KNOWN_MODES);
  });

  it('covers every profile across both and themes, with no overlap', () => {
    // `all` is the union by construction; this asserts the partition, so a profile
    // cannot go missing from BOTH groups (unreachable except by naming it
    // directly) or sit in both (paid for twice per `all` run).
    const partition = [...MODE_GROUPS.both, ...MODE_GROUPS.themes];
    expect([...partition].sort()).toEqual([...KNOWN_MODES].sort());
    expect(new Set(partition).size).toBe(partition.length);
  });

  it('accepts any single profile by name', () => {
    for (const mode of KNOWN_MODES) {
      expect(resolveModes(mode)).toEqual([mode]);
    }
  });

  it('throws on an unknown mode, naming every profile and group', () => {
    expect(() => resolveModes('forced')).toThrow(/Unknown --mode 'forced'/);
    const message = (() => {
      try {
        resolveModes('sytem-dark');
        return '';
      } catch (error) {
        return error.message;
      }
    })();
    for (const name of [...KNOWN_MODES, ...Object.keys(MODE_GROUPS)]) {
      expect(message).toContain(name);
    }
  });
});
