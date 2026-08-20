import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import * as process from 'node:process';
import { existsSync, readFileSync } from 'node:fs';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import {
  getSnapshotIdentifier,
  resolveVisualProfile,
  rootThemeState,
  type RootThemeState,
} from './visual-regression';
import {
  findThemeDeviation,
  THEME_DEVIATIONS,
  validateThemeDeviations,
} from './theme-deviations';
import { compareToBaseline } from './image-diff';

/**
 * Resolved ONCE at module load, not per story.
 *
 * `resolveVisualProfile` throws on an unrecognised `STORYBOOK_COLOR_MODE`, and
 * where that throw lands decides how it reads. Inside `postVisit` it would fire
 * once per story — hundreds of identical stack traces with the real message
 * buried. At module scope it kills the runner before the first test, message
 * first.
 */
const PROFILE = resolveVisualProfile(process.env.STORYBOOK_COLOR_MODE);

/**
 * Validated once, here, for the same reason the profile is: a malformed or expired
 * waiver must stop the run before the first screenshot, not read as one failure per
 * story. `toISOString().slice(0, 10)` is the capture date — an entry with `expires`
 * in the past is refused rather than silently honoured, which is the only thing
 * that keeps a temporary waiver temporary.
 */
const DEVIATION_PROBLEMS = validateThemeDeviations(
  THEME_DEVIATIONS,
  new Date().toISOString().slice(0, 10)
);
if (DEVIATION_PROBLEMS.length) {
  throw new Error(
    `.storybook/theme-deviations.json is not usable:\n` +
      DEVIATION_PROBLEMS.map((p) => `  - ${p}`).join('\n')
  );
}

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Wait for fonts and images to load before snapshotting.
    await page.waitForLoadState('networkidle');

    const storyContext = await getStoryContext(page, context);

    // Diagnostic/QA-only stories (e.g. Foundations/Breakpoints) opt out via
    // parameters.snapshot.skip — they render deliberately at non-standard
    // viewport widths and aren't part of the visual regression contract.
    if (storyContext.parameters?.snapshot?.skip === true) {
      return;
    }

    const snapshotFullPage =
      storyContext.parameters?.snapshot?.fullPage === true;

    // Only wait for animations when a story opts in via
    // parameters.snapshot.animationDelay — avoids a blanket wait on every story.
    const animationDelay = storyContext.parameters?.snapshot?.animationDelay;
    if (animationDelay) {
      await page.waitForTimeout(
        typeof animationDelay === 'number' ? animationDelay : 400
      );
    }

    // The OS half of the theme input. Set for EVERY profile, including light and
    // dark — see `VisualProfile` for why an unstated Chromium default is not an
    // acceptable input to a committed corpus.
    await page.emulateMedia({ colorScheme: PROFILE.emulate });

    // The document half. The DECISION is `rootThemeState` in
    // `visual-regression.ts` (unit-tested); this callback only applies it, because
    // a `page.evaluate` body is serialized into the browser and cannot reference
    // an import. Both writes are unconditional on purpose — `null` means the
    // attribute/property must be ABSENT, which the preview decorator has already
    // made false by the time we get here.
    await page.evaluate((state: RootThemeState) => {
      const html = document.documentElement;
      if (state.dataTheme === null) {
        delete html.dataset.theme;
      } else {
        html.dataset.theme = state.dataTheme;
      }
      if (state.inlineColorScheme === null) {
        html.style.removeProperty('color-scheme');
      } else {
        html.style.setProperty('color-scheme', state.inlineColorScheme);
      }
    }, rootThemeState(PROFILE));
    await page.waitForTimeout(50);

    // Real CSS `:hover` can only be produced by moving the actual mouse, which
    // is a Playwright-level capability — `userEvent.hover()` inside a `play`
    // function dispatches synthetic pointer events and never activates a
    // `hover:` utility. Stories that need a hovered state captured opt in with
    // parameters.snapshot.hoverSelector.
    const hoverSelector = storyContext.parameters?.snapshot?.hoverSelector;
    if (typeof hoverSelector === 'string') {
      await page.hover(hoverSelector);
      // Let the hover colour transition finish before the screenshot.
      await page.waitForTimeout(200);
    }

    let image: Buffer;
    if (snapshotFullPage) {
      // Some stories are too tall for the default viewport — capture the full
      // page so nothing is clipped.
      image = await page.screenshot({ animations: 'disabled', fullPage: true });
    } else {
      // Floating UI (dialogs, menus, listboxes) renders in a portal outside
      // #storybook-root. When such an overlay is open, capture the union of the
      // story root (the trigger) and the overlay so the control AND its popup
      // are both in frame — framing the overlay alone clips the trigger above it.
      const overlay = page
        .locator(
          '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]'
        )
        .first();
      const hasOverlay = (await overlay.count()) > 0;
      const targets = hasOverlay
        ? [page.locator('#storybook-root'), overlay]
        : [page.locator('#storybook-root')];
      const boxes = (await Promise.all(targets.map((t) => t.boundingBox()))).filter(
        (b): b is NonNullable<typeof b> => b !== null
      );
      const padding = 24;
      const viewport = page.viewportSize();
      const clip = boxes.length && viewport
        ? (() => {
            const minX = Math.min(...boxes.map((b) => b.x));
            const minY = Math.min(...boxes.map((b) => b.y));
            const maxX = Math.max(...boxes.map((b) => b.x + b.width));
            const maxY = Math.max(...boxes.map((b) => b.y + b.height));
            const x = Math.max(0, minX - padding);
            const y = Math.max(0, minY - padding);
            return {
              x,
              y,
              width: Math.min(maxX - minX + padding * 2, viewport.width - x),
              height: Math.min(maxY - minY + padding * 2, viewport.height - y),
            };
          })()
        : undefined;
      image = await page.screenshot({ animations: 'disabled', clip });
    }
    const snapshotsDir = `${process.cwd()}/test/__snapshots__`;
    // `PROFILE.baseline`, not `PROFILE.name`: `system-dark` / `forced-dark` file
    // against the committed `--dark` baselines and `system-light` /
    // `forced-light` against the light ones. That reuse IS the assertion — see
    // `VisualProfile`.
    const snapshotIdentifier = getSnapshotIdentifier(
      context.id,
      PROFILE.baseline
    );

    /**
     * **A profile that owns no baselines must never create one.**
     *
     * `jest-image-snapshot` WRITES a missing snapshot instead of failing (jest's
     * usual first-run behaviour), and that is wrong here in a way no output
     * reveals. The four non-owning profiles exist to re-render an EXISTING
     * baseline under a different theme input; for a story that has none there is
     * nothing to compare, so the write records the untested state as ground truth
     * and every later run compares against it. The story would then carry a dark
     * baseline captured with no `[data-theme]` at all — sourced from the very
     * profile that is supposed to be checked against it, and green forever.
     */
    if (
      PROFILE.subset &&
      !existsSync(`${snapshotsDir}/${snapshotIdentifier}.png`)
    ) {
      throw new Error(
        `Visual regression aborted: '${context.id}' has no committed ` +
          `'${snapshotIdentifier}.png', and the '${PROFILE.name}' profile is not ` +
          'allowed to create one — it owns no baselines, it only re-renders ' +
          "other profiles' baselines under a different theme input.\n" +
          'Fix: record it first with ' +
          '`pnpm storybook:test:visual:docker:update:all`, then re-run this ' +
          'profile.'
      );
    }

    const compare = () =>
      expect(image).toMatchImageSnapshot({
        customSnapshotsDir: snapshotsDir,
        customSnapshotIdentifier: snapshotIdentifier,
        failureThreshold: 0.005,
        failureThresholdType: 'percent',
      });

    /**
     * An accepted deviation INVERTS the assertion: this story is known to render
     * differently under this profile, so matching the baseline means the
     * underlying styling was fixed and the waiver is now a lie.
     *
     * Failing on the fix is the point. The alternative — letting the profile write
     * its own PNG — freezes the deviation as ground truth and goes green forever,
     * including on the run where it gets worse. Here the waiver has a shelf life
     * enforced by the same suite it exempts.
     */
    const deviation = findThemeDeviation(
      THEME_DEVIATIONS,
      PROFILE.name,
      context.id
    );
    if (deviation) {
      // Compared by hand rather than through `toMatchImageSnapshot` in a
      // try/catch: that matcher records the comparison in jest's snapshot state
      // before throwing, so a caught failure still leaves `1 snapshot failed` in
      // the summary and jest still exits non-zero. See `image-diff.ts`.
      const comparison = compareToBaseline(
        image,
        readFileSync(`${snapshotsDir}/${snapshotIdentifier}.png`)
      );
      if (comparison.matches) {
        throw new Error(
          `Visual regression aborted: '${context.id}' now MATCHES its ` +
            `'${snapshotIdentifier}.png' baseline under the '${PROFILE.name}' ` +
            `profile (${(comparison.ratio * 100).toFixed(3)}% differing pixels), ` +
            'but theme-deviations.json still lists it as a known deviation ' +
            `(approved by ${deviation.approvedBy} on ${deviation.date}` +
            `${deviation.issue ? `, ${deviation.issue}` : ''}).\n` +
            `Recorded reason: ${deviation.reason}\n` +
            'This is the good outcome — the styling was fixed. Delete the entry ' +
            'from .storybook/theme-deviations.json so the story is guarded ' +
            'normally again.'
        );
      }
      return;
    }

    compare();
  },
};

export default config;
