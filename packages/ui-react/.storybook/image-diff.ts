import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * A standalone image comparison, used only for the **inverted** assertion that an
 * accepted deviation makes (see `theme-deviations.ts`).
 *
 * ── WHY NOT REUSE `toMatchImageSnapshot` IN A try/catch ──────────────────────
 * That was the first implementation and it does not work. `jest-image-snapshot`
 * records the comparison in jest's **snapshot state** before it throws, so
 * catching the throw suppresses the test failure but leaves `1 snapshot failed`
 * in the summary — and jest exits non-zero on that alone. Measured: a waived story
 * produced `tests 0 failed / 139 passed` alongside `snapshots 1 failed`, exit 1.
 * The waiver has to compare without telling jest it compared.
 *
 * `pixelmatch` + `pngjs` are jest-image-snapshot's own engine, so the numbers here
 * mean the same thing its `failureThreshold` does — declared as direct devDeps
 * rather than reached through its `node_modules`, because a private dependency of
 * another package is not an API.
 */
export interface ImageComparison {
  /** Differing pixels ÷ total pixels, or 1 when the dimensions disagree. */
  ratio: number;
  /** `true` when the ratio is at or under the threshold — i.e. jest would pass. */
  matches: boolean;
  /** Set when the images are not the same size; a ratio cannot be computed. */
  dimensionMismatch?: { baseline: string; received: string };
}

/**
 * Compare a freshly captured PNG against a committed baseline.
 *
 * Mirrors `failureThreshold` + `failureThresholdType: 'percent'`: the comparison
 * "matches" when the proportion of differing pixels is **at or under** the
 * threshold, so the same 0.5% gate applies on both paths and a waiver cannot be
 * satisfied by noise the normal check would have ignored.
 *
 * **A dimension mismatch counts as different, not as an error.** Two captures of
 * different sizes are trivially not the same image, and for a deviation that is a
 * legitimate way to differ (a widget that lays out differently under the OS theme
 * changes the clipped bbox). Throwing here would turn a satisfied waiver into a
 * crash.
 */
export function compareToBaseline(
  received: Buffer,
  baseline: Buffer,
  threshold = 0.005
): ImageComparison {
  const a = PNG.sync.read(baseline);
  const b = PNG.sync.read(received);

  if (a.width !== b.width || a.height !== b.height) {
    return {
      ratio: 1,
      matches: false,
      dimensionMismatch: {
        baseline: `${a.width}x${a.height}`,
        received: `${b.width}x${b.height}`,
      },
    };
  }

  const differing = pixelmatch(a.data, b.data, null, a.width, a.height, {
    threshold: 0.01,
  });
  const ratio = differing / (a.width * a.height);
  return { ratio, matches: ratio <= threshold };
}
