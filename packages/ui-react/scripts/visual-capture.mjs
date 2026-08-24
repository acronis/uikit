#!/usr/bin/env node
// packages/ui-react/scripts/visual-capture.mjs
//
// Runs the Dockerized Storybook visual-regression suite for one or more capture
// profiles, and reports a per-profile verdict.
//
// ── WHY A RUNNER AND NOT A `&&` CHAIN ────────────────────────────────────────
// The multi-mode scripts were `…:update && …:update:dark`. In that form any
// non-zero light exit skips dark entirely, and the trigger need not be a real
// regression — a single per-test timeout is enough, in a run whose snapshot phase
// was clean. What it leaves behind is a checkout with the light baselines
// rewritten and the dark ones untouched, which is indistinguishable from an
// operator walking away mid-run. Here EVERY requested profile runs; failures are
// collected and aggregated into the exit code at the end.
//
// ── WHY IT TAKES AN EXCLUSIVE LOCK ───────────────────────────────────────────
// Two captures in one checkout are a correctness hazard, not a throughput
// opportunity:
//
//   * Both bind-mount the same `test/__snapshots__`. Two writers, one directory:
//     whichever finishes last wins per file, and nothing detects the interleave.
//   * Both consume the same host-built `storybook-static`, which each run rebuilds
//     before starting — so one rebuilds the artifact the other is serving.
//   * Storybook broadcasts `setCurrentStory` to EVERY connected preview, so a
//     second runner can retarget the first one's page and a screenshot gets filed
//     under a story it does not belong to. A mislabelled baseline inverts the
//     review: it flags the innocent story whose name the wrong content landed
//     under, and stays silent about the story whose real change went missing.
//
// Compose's fixed container names make the collision loud but unreadable (`the
// container name "…-storybook-1" is already in use`, after paying for two builds
// and running zero tests). So this runner refuses in under a second, before
// building anything, and says why.
//
// ── WHY THE VERDICT IS PARSED, NOT INHERITED FROM AN EXIT CODE ───────────────
// A wrapper's exit code is easy to lose (a trailing `echo` resets `$?`), and the
// evidence that settles a dispute — the per-profile `Snapshots:` line — is what
// gets destroyed by piping a run through `tail`. So:
//   * every profile's full output is written to a file, never only to a pipe;
//   * the verdict comes from jest's own summary lines in the captured stream;
//   * a profile that produced **no** `Tests:` line at all is reported as DID NOT
//     RUN and fails the overall result. "No news" must never read as success.

import { spawn } from 'node:child_process';
import {
  createWriteStream,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  buildTestPathPatterns,
  resolveTitleIds,
  SUBSET_TITLES,
  subsetStoryIds,
} from './system-theme-subset.mjs';

const PACKAGE_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const LOG_DIR = join(PACKAGE_DIR, '.visual-capture');
// A directory, because `mkdir` is atomic on every platform we run on: it either
// creates and returns, or fails with EEXIST. A "check then write" lock has a
// window between the two calls, which is exactly the race being closed.
const LOCK_DIR = join(LOG_DIR, 'lock');
const LOCK_PID = join(LOCK_DIR, 'pid');

const BASE_COMPOSE = './docker-compose.storybook.yml';
const UPDATE_COMPOSE = './docker-compose.storybook.update.yml';

/**
 * Capture profiles, mirroring `VISUAL_PROFILES` in `.storybook/visual-regression.ts`.
 *
 * Exported, and cross-checked against that module in
 * `__tests__/visual-capture.test.mjs` — the two cannot import each other in
 * production, because this script runs under bare Node with no TS loader. The
 * halves fail asymmetrically, which is why the mirror is tested rather than
 * commented: a profile missing from `KNOWN_MODES` is refused loudly (harmless),
 * but a *subset* profile missing from `SUBSET_MODES` is treated as a baseline
 * owner — `--update` is no longer refused and the story-count assertion no longer
 * applies, so the run can overwrite the corpus it was supposed to be checked
 * against.
 */
export const KNOWN_MODES = [
  'light',
  'dark',
  'system-dark',
  'system-light',
  'forced-light',
  'forced-dark',
];
/** Profiles that own no baselines and run only the curated subset. */
export const SUBSET_MODES = [
  'system-dark',
  'system-light',
  'forced-light',
  'forced-dark',
];

/**
 * Aliases that expand to several profiles, so a leg does not have to be spelled
 * out (and cannot be spelled out incompletely).
 *
 * `both` means light + dark — the pair that owns the baselines — because that is
 * what the existing `…:all` package scripts mean by it. `themes` is the
 * complement: the four profiles that own nothing and only re-render. `all` is the
 * full cross product.
 */
export const MODE_GROUPS = {
  both: ['light', 'dark'],
  themes: SUBSET_MODES,
  all: KNOWN_MODES,
};

/**
 * `--mode <arg>` → the profiles to run, in order.
 *
 * Pure and exported so the expansion is asserted directly: a group that silently
 * dropped a profile would leave a CI leg reporting green over less than it names.
 * Throws with the full vocabulary rather than falling back to a default — see
 * `resolveVisualProfile` for why a lenient default stopped being safe once
 * profiles started filing against other profiles' baselines.
 */
export function resolveModes(modeArg) {
  if (modeArg === undefined) return MODE_GROUPS.both;
  if (Object.hasOwn(MODE_GROUPS, modeArg)) return MODE_GROUPS[modeArg];
  if (KNOWN_MODES.includes(modeArg)) return [modeArg];
  throw new Error(
    `Unknown --mode '${modeArg}'. Use a profile ` +
      `(${KNOWN_MODES.join(', ')}) or a group ` +
      `(${Object.entries(MODE_GROUPS)
        .map(([group, modes]) => `${group} = ${modes.join(' + ')}`)
        .join('; ')}).`
  );
}

/**
 * Strips ANSI escapes and Compose's `service-1  | ` line prefix.
 *
 * The escape byte is part of the pattern, and is written as an escape sequence
 * rather than pasted in raw — a literal 0x1B in source is invisible to every
 * reader and to review. Matching only the bracket-and-letter would leave the
 * escape byte at the head of the line, and every `startsWith('Tests:')` below
 * would then miss: a summary that IS in the output would read as absent, which is
 * the one failure this file exists to prevent.
 *
 * Matches any CSI sequence rather than only colour (`m`), because Compose also
 * emits an erase-line sequence around its container status lines.
 */
export function clean(line) {
  return (
    line
      // eslint-disable-next-line no-control-regex -- deliberate; see the note above
      .replace(/\u001b\[[0-9;]*[A-Za-z]/g, '')
      .replace(/^[a-z0-9_-]+-\d+\s+\|\s?/i, '')
  );
}

/**
 * Pulls jest's own tallies out of a captured run.
 *
 * `ran` is the load-bearing field. jest always prints a `Tests:` line once it has
 * executed a suite, so its absence means the run never got that far — a Compose
 * name collision, an image build failure, an unreachable Storybook. Without this
 * field that case presents as a bare non-zero exit and gets attributed to
 * whatever the reader expected.
 */
export function parseSummary(text) {
  const lines = text.split('\n').map(clean);
  const find = (label) => lines.find((l) => l.startsWith(label));

  const tally = (line) => {
    if (!line) return undefined;
    const grab = (word) => {
      const m = line.match(new RegExp(`(\\d+)\\s+${word}`));
      return m ? Number(m[1]) : 0;
    };
    return {
      failed: grab('failed'),
      passed: grab('passed'),
      written: grab('written'),
      total: grab('total'),
    };
  };

  const tests = tally(find('Tests:'));
  return {
    ran: tests !== undefined,
    suites: tally(find('Test Suites:')),
    tests,
    snapshots: tally(find('Snapshots:')),
  };
}

/**
 * The overall verdict across every requested profile.
 *
 * Separate from the printing so it can be asserted directly. THREE ways to fail,
 * deliberately distinct — collapsing them loses the only signal that
 * distinguishes "dark has a real regression" from "dark never happened":
 *
 *   1. a profile that ran and reported failures,
 *   2. a profile that never ran at all, and
 *   3. **a subset profile that ran the wrong number of stories.**
 *
 * (3) exists because the subset profiles are selected by a jest test-path regex.
 * A regex that matches fewer files than intended does not error — jest runs what
 * it found, every one of them passes, and the run is GREEN while covering less
 * than it claims. `scripts/system-theme-subset.mjs` refuses to build a pattern
 * from a stale title, but that guards the input; this guards the outcome, which is
 * the only thing that proves the pattern reached jest intact through
 * `VISUAL_TEST_ARGS`'s unquoted shell expansion.
 */
export function summarise(results) {
  const notRun = results.filter((r) => !r.ran);
  const failed = results.filter((r) => r.ran && r.code !== 0);
  const miscounted = results.filter(
    (r) => r.ran && r.expected !== undefined && r.tests?.total !== r.expected
  );
  return {
    requested: results.length,
    ranCount: results.filter((r) => r.ran).length,
    notRun,
    failed,
    miscounted,
    ok: notRun.length === 0 && failed.length === 0 && miscounted.length === 0,
  };
}

/** Runs a command, streaming to stdout AND capturing to a file + string. */
function run(command, args, { logFile, env }) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: PACKAGE_DIR,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let captured = '';
    const sink = logFile ? createWriteStream(logFile) : undefined;
    for (const stream of [child.stdout, child.stderr]) {
      stream.on('data', (chunk) => {
        captured += chunk;
        process.stdout.write(chunk);
        sink?.write(chunk);
      });
    }

    child.on('error', reject);
    child.on('close', (code) => {
      sink?.end();
      resolve({ code: code ?? 1, captured });
    });
  });
}

/**
 * Takes the exclusive capture lock, or refuses.
 *
 * A lock whose holder has died must not wedge the repo, so a PID that is gone is
 * reclaimed rather than respected. `process.kill(pid, 0)` sends no signal — it
 * only asks whether the process exists.
 */
function acquireLock() {
  mkdirSync(LOG_DIR, { recursive: true });
  try {
    mkdirSync(LOCK_DIR);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;

    const holder = Number(readFileSync(LOCK_PID, 'utf8').trim());
    const alive = (() => {
      try {
        process.kill(holder, 0);
        return true;
      } catch {
        return false;
      }
    })();

    if (alive) {
      console.error(
        `\nREFUSING TO START: another visual capture is already running ` +
          `(pid ${holder}).\n\n` +
          `Two captures cannot share this checkout. They bind-mount the same\n` +
          `test/__snapshots__, rebuild the same storybook-static, and Storybook\n` +
          `broadcasts setCurrentStory to every connected preview — so a second\n` +
          `runner can retarget the first one's page and file a screenshot under\n` +
          `the wrong story id.\n\n` +
          `Wait for pid ${holder} to finish, or if you are certain it is dead:\n` +
          `  rm -rf ${LOCK_DIR}\n`
      );
      process.exit(2);
    }

    console.warn(
      `Reclaiming a stale capture lock: pid ${holder} is no longer running.`
    );
    rmSync(LOCK_DIR, { recursive: true, force: true });
    mkdirSync(LOCK_DIR);
  }

  writeFileSync(LOCK_PID, String(process.pid));

  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    rmSync(LOCK_DIR, { recursive: true, force: true });
  };
  process.on('exit', release);
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(signal, () => {
      release();
      process.exit(130);
    });
  }
  return release;
}

/**
 * The accepted-deviation registry, read from the JSON both sides share.
 *
 * `.storybook/theme-deviations.ts` is the typed reader for the test-runner; this
 * script runs under bare Node with no TS loader, so it reads the same JSON rather
 * than keeping a second copy of the list — the drift this repo already guards
 * against for the profile names.
 */
function readDeviations() {
  const path = join(PACKAGE_DIR, '.storybook/theme-deviations.json');
  try {
    return JSON.parse(readFileSync(path, 'utf8')).deviations ?? [];
  } catch (error) {
    console.error(`Cannot read ${path}: ${error.message}`);
    process.exit(2);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const update = argv.includes('--update');
  const full = argv.includes('--full');

  let modes;
  try {
    modes = resolveModes(
      argv.includes('--mode') ? argv[argv.indexOf('--mode') + 1] : undefined
    );
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }

  // **`--update` is refused for the non-owning profiles, before anything is
  // built.** They deliberately file against another profile's committed baselines
  // — that reuse is the whole assertion (see `.storybook/visual-regression.ts`).
  // So `--update` here does not "regenerate their baselines": there are none. It
  // overwrites the light or dark corpus with renders captured under a different
  // theme input, which is exactly the diff these profiles exist to detect, now
  // silently baked in and unrecoverable except from git.
  const illegalUpdate = modes.filter((m) => SUBSET_MODES.includes(m));
  if (update && illegalUpdate.length) {
    console.error(
      `\nREFUSING TO UPDATE: --mode ${illegalUpdate.join(', ')} owns no ` +
        `baselines.\n\n` +
        `These profiles re-render stories under a different theme input and\n` +
        `assert the pixels match the light/dark baselines already committed.\n` +
        `Running them with --update would overwrite those baselines with the\n` +
        `very difference they exist to catch.\n\n` +
        `To re-record baselines, use --mode light / --mode dark / --mode both.\n`
    );
    process.exit(2);
  }

  // Everything after `--` is forwarded to `test-storybook` inside the container
  // (e.g. a jest test-path pattern to run a single story's generated test file).
  const passthroughAt = argv.indexOf('--');
  const passthrough = passthroughAt === -1 ? [] : argv.slice(passthroughAt + 1);

  acquireLock();

  // ONE build for every profile. `STORYBOOK_COLOR_MODE` is read only by
  // `.storybook/test-runner.ts` at run time — never during the build — so the
  // static output is profile-independent and a per-profile rebuild is waste.
  //
  // `--skip-build` is for CI, which already builds `storybook-static` in its own
  // cached step. It exists so those jobs can run THROUGH this script instead of
  // invoking `docker compose` directly: the subset resolver, the summary parsing
  // and the story-count assertion are what make a subset run trustworthy, and a
  // job that bypasses the script gets none of them.
  if (argv.includes('--skip-build')) {
    console.log('\n=== Skipping Storybook build (--skip-build) ===');
  } else {
    console.log('\n=== Building Storybook (once, shared by every profile) ===');
    const build = await run('pnpm', ['storybook:build'], {
      logFile: join(LOG_DIR, 'storybook-build.log'),
    });
    if (build.code !== 0) {
      console.error(`\nStorybook build failed (exit ${build.code}).`);
      process.exit(build.code);
    }
  }

  // Resolved from the index Storybook just emitted, so a title renamed out from
  // under the subset fails HERE — loudly, before Docker — rather than shrinking
  // the run. `resolveTitleIds` throws on any title it cannot find; a filter that
  // silently matches fewer files is indistinguishable from a suite that passed.
  let subset;
  if (modes.some((m) => SUBSET_MODES.includes(m))) {
    const entries = Object.values(
      JSON.parse(
        readFileSync(join(PACKAGE_DIR, 'storybook-static/index.json'), 'utf8')
      ).entries
    );

    if (full) {
      // `--full` drops the sample: the non-owning profiles re-render the WHOLE
      // corpus. Nothing else changes — they still own no baselines and still
      // compare against the light/dark PNGs — so this is purely coverage, and it
      // is what the scheduled workflow runs. No `expected` count is set: the
      // story-count assertion exists to prove a FILTER reached jest intact, and
      // there is no filter here.
      console.log(
        `\n--full: the subset is disabled; the non-baseline profiles will run ` +
          `all ${entries.filter((e) => e.type === 'story').length} stories.`
      );
      subset = { patterns: [], expected: undefined };
    } else {
      subset = {
        // One pattern per title — jest ORs its positional path patterns, and a
        // single `(a|b)` alternation does not survive the shells in between.
        // See buildTestPathPatterns.
        patterns: buildTestPathPatterns(resolveTitleIds(entries, SUBSET_TITLES)),
        expected: subsetStoryIds(entries).length,
      };
      console.log(
        `\nsystem-theme subset: ${SUBSET_TITLES.length} titles, ` +
          `${subset.expected} stories.`
      );
    }

    // **A waiver that can never run is a waiver nobody will ever delete.**
    // `.storybook/theme-deviations.json` inverts the assertion for the stories it
    // lists — they MUST differ from their baseline — which only happens if the
    // story is actually captured by this run. An entry naming a story outside the
    // sample (or a story that no longer exists) sits there looking like coverage
    // and asserting nothing, so it is refused here, before Docker.
    const covered = new Set(
      full
        ? entries.filter((e) => e.type === 'story').map((e) => e.id)
        : subsetStoryIds(entries)
    );
    const dead = readDeviations().filter((d) => !covered.has(d.story));
    if (dead.length) {
      console.error(
        `\nREFUSING TO START: ${dead.length} theme-deviation entr` +
          `${dead.length === 1 ? 'y names a story' : 'ies name stories'} this run ` +
          `never captures:\n` +
          dead.map((d) => `  - ${d.story} (${d.profiles.join(', ')})`).join('\n') +
          `\n\nAn entry inverts the assertion for its story, so one that is not ` +
          `run\nasserts nothing while looking like an accepted, tracked ` +
          `deviation.\nEither add the story's title to SUBSET_GROUPS in ` +
          `scripts/system-theme-subset.mjs,\nrun with --full, or delete the ` +
          `entry from .storybook/theme-deviations.json.\n`
      );
      process.exit(2);
    }
  }

  const composeFiles = update
    ? ['-f', BASE_COMPOSE, '-f', UPDATE_COMPOSE]
    : ['-f', BASE_COMPOSE];

  // Clears containers left behind by an earlier crashed run — the direct cause of
  // a Compose name collision. Safe **only** because the lock is already held:
  // nothing else can be mid-capture, so this can never tear down a live peer's
  // containers.
  console.log('\n=== Clearing any leftover containers ===');
  await run('docker', ['compose', ...composeFiles, 'down', '--remove-orphans'], {
    logFile: join(LOG_DIR, 'compose-down.log'),
  });

  const results = [];
  for (const mode of modes) {
    const isSubset = SUBSET_MODES.includes(mode);
    console.log(
      `\n=== Capture: ${mode}${update ? ' (--updateSnapshot)' : ''}` +
        `${isSubset ? (full ? ' (FULL corpus)' : ` (subset: ${subset.expected} stories)`) : ''} ===`
    );
    const logFile = join(LOG_DIR, `capture-${mode}.log`);
    // jest ORs its positional test-path patterns, so appending the subset pattern
    // to an operator's own would WIDEN the run, not narrow it. When a pattern was
    // passed explicitly it therefore replaces the subset — and says so, because a
    // subset run that quietly covered something else is the same silent-miscount
    // failure the resolver above exists to prevent.
    const operatorPattern = passthrough.some((a) => !a.startsWith('-'));
    if (isSubset && operatorPattern) {
      console.log(
        `  note: using the pattern you passed after \`--\` INSTEAD of the ` +
          `system-theme subset.`
      );
    }
    const testArgs =
      isSubset && !operatorPattern
        ? [...passthrough, ...subset.patterns]
        : passthrough;
    const { code, captured } = await run(
      'docker',
      [
        'compose',
        ...composeFiles,
        'up',
        '--build',
        '--abort-on-container-exit',
        '--exit-code-from',
        'test-runner',
      ],
      {
        logFile,
        env: {
          STORYBOOK_COLOR_MODE: mode,
          VISUAL_TEST_ARGS: testArgs.join(' '),
        },
      }
    );

    // **Every requested profile runs.** A failure here is recorded and the loop
    // continues; it is aggregated into a non-zero exit below, so nothing is
    // swallowed and nothing cancels a later profile.
    results.push({
      mode,
      code,
      logFile,
      // Only for an unmodified subset run: with an operator pattern the count is
      // whatever they asked for, and asserting the subset total would be a false
      // failure. `undefined` means "no count expectation", checked in `summarise`.
      expected: isSubset && !operatorPattern ? subset.expected : undefined,
      ...parseSummary(captured),
    });
  }

  // One source for the printed verdict and the exit code: a report that can
  // disagree with the status it returns is how this becomes hard to diagnose.
  const verdict = summarise(results);

  console.log(`\n${'='.repeat(72)}`);
  console.log('PER-PROFILE VERDICT (from jest summary lines, not exit codes)');
  console.log('='.repeat(72));
  console.log(`profiles requested: ${verdict.requested}`);
  console.log(`profiles that ran:  ${verdict.ranCount}`);
  console.log('');

  for (const r of results) {
    if (!r.ran) {
      console.log(
        `  ${r.mode.padEnd(12)}  DID NOT RUN — no jest summary in the output ` +
          `(exit ${r.code}). See ${r.logFile}`
      );
      continue;
    }
    const s = r.snapshots ?? { written: 0, passed: 0, failed: 0, total: 0 };
    console.log(
      `  ${r.mode.padEnd(12)}  tests ${r.tests.failed} failed / ` +
        `${r.tests.passed} passed / ${r.tests.total} total   ` +
        `snapshots ${s.written} written / ${s.passed} passed / ` +
        `${s.failed} failed / ${s.total} total   exit ${r.code}`
    );
  }

  console.log('');
  if (verdict.notRun.length) {
    console.log(
      `FAIL: ${verdict.notRun.length}/${verdict.requested} profile(s) never ` +
        `executed a test — ${verdict.notRun.map((r) => r.mode).join(', ')}.`
    );
  }
  if (verdict.failed.length) {
    console.log(
      `FAIL: ${verdict.failed.length}/${verdict.requested} profile(s) reported ` +
        `failures — ${verdict.failed.map((r) => r.mode).join(', ')}.`
    );
  }
  for (const r of verdict.miscounted) {
    console.log(
      `FAIL: ${r.mode} ran ${r.tests.total} tests but the subset defines ` +
        `${r.expected}. The test-path filter did not select what it claims, so ` +
        `a green result here would cover less than it reports. Check the ` +
        `pattern in ${r.logFile}.`
    );
  }
  if (verdict.ok) {
    console.log(
      `OK: all ${verdict.ranCount}/${verdict.requested} profile(s) ran and passed.`
    );
  }
  console.log(`Full logs: ${LOG_DIR}`);

  process.exit(verdict.ok ? 0 : 1);
}

// Only drive a real capture when invoked as a program. Without this guard the
// unit test that imports `parseSummary` would start Docker.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
