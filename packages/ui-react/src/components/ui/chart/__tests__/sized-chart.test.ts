import { afterEach, describe, expect, it } from 'vitest';

import {
  CHART_HEIGHT,
  CHART_WIDTH,
  giveTheChartASize,
  restoreTheChartSize,
} from './sized-chart';

// The stub reaches into a DOM prototype, so a restore that only looks like it
// works would silently leak a sized chart into every later test in the file.
describe('sized-chart', () => {
  afterEach(restoreTheChartSize);

  function container() {
    const element = document.createElement('div');
    element.className = 'recharts-responsive-container';
    return element;
  }

  it('sizes the responsive container and leaves everything else measured', () => {
    giveTheChartASize();
    expect(container().getBoundingClientRect()).toMatchObject({
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
    });
    expect(document.createElement('div').getBoundingClientRect().width).toBe(0);
  });

  it('fully restores the prototype it patched', () => {
    const original = Element.prototype.getBoundingClientRect;
    giveTheChartASize();
    restoreTheChartSize();

    expect(Element.prototype.getBoundingClientRect).toBe(original);
    expect(
      Object.prototype.hasOwnProperty.call(
        HTMLElement.prototype,
        'getBoundingClientRect'
      )
    ).toBe(false);
    expect(container().getBoundingClientRect().width).toBe(0);
  });
});
