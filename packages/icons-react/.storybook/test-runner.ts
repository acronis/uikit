import type { TestRunnerConfig } from '@storybook/test-runner';
import * as process from 'node:process';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import {
  getSnapshotIdentifier,
  resolveVisualColorMode,
} from './visual-regression';

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Wait for fonts/images before snapshotting.
    await page.waitForLoadState('networkidle');
    const colorMode = resolveVisualColorMode(process.env.STORYBOOK_COLOR_MODE);

    await page.evaluate((mode: 'light' | 'dark') => {
      const html = document.documentElement;
      html.dataset.theme = mode;
      html.style.colorScheme = mode;
    }, colorMode);
    await page.waitForTimeout(50);

    // Icon gallery stories can be taller than the viewport; screenshotting the
    // story root element (not a viewport clip) captures the whole grid so no
    // icon is cut off.
    const image = await page
      .locator('#storybook-root')
      .screenshot({ animations: 'disabled' });

    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `${process.cwd()}/test/__snapshots__`,
      customSnapshotIdentifier: getSnapshotIdentifier(context.id, colorMode),
      failureThreshold: 0.005,
      failureThresholdType: 'percent',
    });
  },
};

export default config;
