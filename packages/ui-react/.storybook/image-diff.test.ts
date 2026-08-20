import { PNG } from 'pngjs';

import { compareToBaseline } from './image-diff';

/** A solid image, optionally with `differing` pixels painted a second colour. */
function png(
  width: number,
  height: number,
  differing = 0,
  base: [number, number, number] = [10, 20, 30]
): Buffer {
  const image = new PNG({ width, height });
  for (let i = 0; i < width * height; i += 1) {
    const offset = i * 4;
    const [r, g, b] = i < differing ? [240, 240, 240] : base;
    image.data[offset] = r;
    image.data[offset + 1] = g;
    image.data[offset + 2] = b;
    image.data[offset + 3] = 255;
  }
  return PNG.sync.write(image);
}

describe('compareToBaseline', () => {
  it('reports an identical image as matching, at ratio 0', () => {
    const image = png(100, 100);
    expect(compareToBaseline(image, image)).toMatchObject({
      ratio: 0,
      matches: true,
    });
  });

  it('measures the differing proportion', () => {
    // 250 of 10 000 pixels = 2.5%.
    const result = compareToBaseline(png(100, 100, 250), png(100, 100));
    expect(result.ratio).toBeCloseTo(0.025, 5);
    expect(result.matches).toBe(false);
  });

  it('applies the same 0.5% gate as the normal check, inclusively', () => {
    // The boundary matters for the inverted assertion: a deviation must be a real
    // difference, not noise the ordinary comparison would have let through — so
    // "exactly at the threshold" has to count as MATCHING, exactly as
    // jest-image-snapshot's `failureThreshold` does.
    expect(compareToBaseline(png(100, 100, 50), png(100, 100)).matches).toBe(
      true
    );
    expect(compareToBaseline(png(100, 100, 51), png(100, 100)).matches).toBe(
      false
    );
  });

  it('honours a custom threshold', () => {
    expect(
      compareToBaseline(png(100, 100, 250), png(100, 100), 0.03).matches
    ).toBe(true);
  });

  it('treats a dimension mismatch as different rather than throwing', () => {
    // A widget that lays out differently under the OS theme changes the clipped
    // bbox, which is a legitimate way for a waived story to differ. Throwing here
    // would turn a satisfied waiver into a crash.
    const result = compareToBaseline(png(120, 100), png(100, 100));
    expect(result).toMatchObject({ ratio: 1, matches: false });
    expect(result.dimensionMismatch).toEqual({
      baseline: '100x100',
      received: '120x100',
    });
  });
});
