import { describe, expect, it } from 'vitest';

import { CHART_HEIGHT, CHART_WIDTH, giveTheChartASize } from './chart-layout';

// The stub reaches into a DOM prototype, so a restore that only looks like it
// works would silently leak a sized chart into every later test in the file.
describe('chart-layout', () => {
  function container() {
    const element = document.createElement('div');
    element.className = 'recharts-responsive-container';
    return element;
  }

  // Captured before the first stub is installed, then asserted against after
  // that test has finished — the cleanup runs via `onTestFinished`, so it can
  // only be observed from a later test.
  const originalRect = Element.prototype.getBoundingClientRect;

  it('sizes the responsive container and leaves everything else measured', () => {
    giveTheChartASize();
    expect(container().getBoundingClientRect()).toMatchObject({
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
    });
    expect(document.createElement('div').getBoundingClientRect().width).toBe(0);
  });

  it('fully restores the prototype it patched once the test finishes', () => {
    expect(Element.prototype.getBoundingClientRect).toBe(originalRect);
    expect(
      Object.prototype.hasOwnProperty.call(
        HTMLElement.prototype,
        'getBoundingClientRect'
      )
    ).toBe(false);
    expect(container().getBoundingClientRect().width).toBe(0);
  });
});
