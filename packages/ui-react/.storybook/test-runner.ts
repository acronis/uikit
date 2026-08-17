import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import * as process from 'node:process';
import { existsSync } from 'node:fs';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import {
  getSnapshotIdentifier,
  resolveVisualProfile,
  rootThemeState,
  type RootThemeState,
} from './visual-regression';

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

    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: snapshotsDir,
      customSnapshotIdentifier: snapshotIdentifier,
      failureThreshold: 0.005,
      failureThresholdType: 'percent',
    });
  },
};

export default config;
