import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import * as process from 'node:process';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const config: TestRunnerConfig = {
    setup() {
        expect.extend({ toMatchImageSnapshot });
    },
    async postVisit(page, context) {
        // Wait for fonts and images to load
        await page.waitForLoadState('networkidle');

        const storyContext = await getStoryContext(page, context);
        const snapshotFullPage = storyContext.parameters?.snapshot?.fullPage === true;

        // Only wait for animations when the story opts in via parameters.snapshot.animationDelay
        // or when Sonner toasts are present (they use CSS transitions not caught by Playwright's
        // animations: 'disabled'). This avoids a blanket 400ms wait on every story.
        const animationDelay = storyContext.parameters?.snapshot?.animationDelay;
        const sonnerContainer = page.locator('[data-sonner-toaster]');
        const hasSonner = (await sonnerContainer.count()) > 0;

        if (hasSonner) {
            await page.locator('[data-sonner-toaster]:has([data-sonner-toast])')
                .waitFor({ state: 'attached', timeout: 1500 })
                .catch(() => {}); // silence timeout — no toast is a valid state
        }

        if (animationDelay) {
            await page.waitForTimeout(typeof animationDelay === 'number' ? animationDelay : 400);
        }

        const toaster = page.locator('[data-sonner-toaster]:has([data-sonner-toast])');
        const hasToasts = (await toaster.count()) > 0;

        let image: Buffer;
        if (hasToasts || snapshotFullPage) {
            // Toasts render in a fixed portal, and some stories are too tall for the
            // default viewport — screenshot the full page so nothing is clipped.
            image = await page.screenshot({ animations: 'disabled', fullPage: true });
        } else {
            const overlay = page.locator('[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]').first();
            const hasOverlay = (await overlay.count()) > 0;
            const target = hasOverlay ? overlay : page.locator('#storybook-root');
            const box = await target.boundingBox();
            const padding = 24;
            image = await page.screenshot({
                animations: 'disabled',
                clip: box ? {
                    x: Math.max(0, box.x - padding),
                    y: Math.max(0, box.y - padding),
                    width: box.width + padding * 2,
                    height: box.height + padding * 2,
                } : undefined,
            });
        }
        expect(image).toMatchImageSnapshot({
            customSnapshotsDir: `${process.cwd()}/test/__snapshots__`,
            customSnapshotIdentifier: context.id,
            failureThreshold: 0.005,
            failureThresholdType: 'percent',
        });
    },
};

export default config;
