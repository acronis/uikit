import { execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import process from 'node:process';

import chalk from 'chalk';

// The sync only ever writes under packs/ (SVGs + manifests), relative to the
// design-assets package root, which is this process's cwd. Everything the gate
// inspects or reverts is scoped to that one directory.
const PACKS = 'packs';

export interface GateOptions {
  /** `--yes`/`-y`: skip the gate and keep whatever the sync wrote (automation). */
  keep: boolean;
  /** `--dry-run`: show the diff but always revert — a preview that never persists. */
  dryRun: boolean;
  /** Whether an interactive prompt is possible (a TTY is attached). */
  interactive: boolean;
}

export function parseGateOptions(argv: string[] = process.argv.slice(2)): GateOptions {
  return {
    keep: argv.includes('--yes') || argv.includes('-y'),
    dryRun: argv.includes('--dry-run'),
    interactive: Boolean(process.stdin.isTTY),
  };
}

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' });
}

/** True only when cwd is inside a git work tree (the gate needs git to diff/revert). */
function gitAvailable(): boolean {
  try {
    return git(['rev-parse', '--is-inside-work-tree']).trim() === 'true';
  } catch {
    return false;
  }
}

/** Uncommitted changes (tracked or untracked) under packs/, one porcelain line each. */
function packsStatusLines(): string[] {
  return git(['status', '--porcelain', '--', PACKS])
    .split('\n')
    .filter(Boolean);
}

/** Restore packs/ to HEAD: revert modified/pruned tracked files and drop new untracked ones. */
export function revertPacks(): void {
  git(['checkout', '--', PACKS]);
  git(['clean', '-fdq', '--', PACKS]);
}

/**
 * Guard run before the sync writes: the gate reverts by restoring packs/ to
 * HEAD, so any pre-existing uncommitted work there must be committed or stashed
 * first (or the gate skipped with --yes) — otherwise a decline would discard it
 * too. No-op when the gate is off (`--yes`) or git isn't available.
 *
 * @returns whether the gate is active for this run.
 */
export function ensureCleanBeforeSync(opts: GateOptions): boolean {
  if (opts.keep) return false;
  if (!gitAvailable()) {
    console.log(
      chalk.yellow('  ⚠ Not a git work tree — diff-gate disabled; changes are written directly.')
    );
    return false;
  }
  const dirty = packsStatusLines();
  if (dirty.length > 0) {
    console.error(
      chalk.red.bold('\n✗ packs/ has uncommitted changes:') +
        '\n' +
        dirty.map((l) => `    ${l}`).join('\n') +
        chalk.dim(
          '\n\n  Commit or stash them before syncing so the gate can show a clean diff' +
            '\n  (or pass --yes to write directly without the gate).\n'
        )
    );
    process.exit(1);
  }
  return true;
}

/** Revert packs/ on an aborted run (sync error or failed validation) when the gate is active. */
export function abortRevert(gateActive: boolean): void {
  if (!gateActive) return;
  revertPacks();
  console.error(chalk.dim('  ↩ Reverted packs/ (nothing written).'));
}

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(question)).trim().toLowerCase();
    return answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
}

/**
 * Final gate after a successful sync + validations: show the packs/ diff
 * (including deletions), then keep it only on explicit approval — otherwise
 * revert so nothing persists unreviewed. Mirrors the token sync's diff-gate.
 */
export async function finalizeGate(gateActive: boolean, opts: GateOptions): Promise<void> {
  if (!gateActive) {
    console.log(chalk.green.bold('\n\n✓ All done! (changes kept — gate skipped via --yes)\n'));
    return;
  }

  const lines = packsStatusLines();
  if (lines.length === 0) {
    console.log(chalk.green.bold('\n\n✓ All done! packs/ is already up to date — no changes.\n'));
    return;
  }

  const added = lines.filter((l) => l.startsWith('??')).length;
  const deleted = lines.filter((l) => /^.?D/.test(l)).length;
  const modified = lines.filter((l) => /^.?M/.test(l)).length;

  console.log(chalk.bold('\n\n══ Review — design-assets/packs changes ════'));
  console.log(
    `  ${chalk.green(`${added} added`)}  ·  ${chalk.yellow(`${modified} modified`)}  ·  ${chalk.red(`${deleted} deleted`)}\n`
  );
  console.log(git(['-c', 'color.ui=always', 'status', '--short', '--', PACKS]));
  console.log(git(['-c', 'color.ui=always', 'diff', '--stat', '--', PACKS]));
  console.log(
    chalk.dim('  Full diff: `git -C packages/design-assets diff -- packs` (new SVGs shown as ?? above)\n')
  );

  let keep: boolean;
  if (opts.dryRun) {
    keep = false;
  } else if (opts.interactive) {
    keep = await confirm(chalk.bold('Apply these changes to design-assets/packs? [y/N] '));
  } else {
    console.log(chalk.yellow('  ⚠ No TTY to confirm — declining. Re-run with --yes to write directly.'));
    keep = false;
  }

  if (keep) {
    console.log(chalk.green.bold('\n✓ Changes kept. Review the git diff, run `validate`, and commit.\n'));
  } else {
    revertPacks();
    console.log(
      opts.dryRun
        ? chalk.dim('\n↩ Dry run — reverted; packs/ unchanged.\n')
        : chalk.dim('\n↩ Declined — reverted; packs/ unchanged.\n')
    );
  }
}
