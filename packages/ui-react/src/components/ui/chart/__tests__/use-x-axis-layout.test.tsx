import * as React from 'react';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  mergeXAxisLayoutMargin,
  useXAxisLayout,
} from '../use-x-axis-layout';

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  disconnect = vi.fn();

  constructor(private readonly callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this);
  }

  observe = vi.fn();

  trigger() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

function rect(values: Partial<DOMRect>): DOMRect {
  return {
    x: 0,
    y: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    toJSON: () => ({}),
    ...values,
  };
}

afterEach(() => {
  FakeResizeObserver.instances = [];
  vi.unstubAllGlobals();
});

describe('useXAxisLayout', () => {
  it('keeps recharts defaults when labels are not rotated', () => {
    const containerRef = React.createRef<HTMLElement>();
    const { result } = renderHook(() =>
      useXAxisLayout(containerRef, undefined, undefined, 'unchanged')
    );

    expect(result.current).toEqual({ height: undefined, margin: undefined });
  });

  it('uses the first-pass axis height until a chart container is available', () => {
    const containerRef = React.createRef<HTMLElement>();
    const { result } = renderHook(() =>
      useXAxisLayout(containerRef, -45, undefined, 'unchanged')
    );

    expect(result.current).toEqual({ height: 50, margin: undefined });
  });

  it('measures only the required vertical and side space for rotated ticks', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);

    const container = document.createElement('div');
    const surface = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    surface.classList.add('recharts-surface');
    const labels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labels.classList.add('recharts-xAxis-tick-labels');
    const leftTick = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const rightTick = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const legend = document.createElement('div');
    legend.classList.add('recharts-legend-wrapper');

    labels.append(leftTick, rightTick);
    surface.append(labels);
    container.append(surface, legend);
    vi.spyOn(surface, 'getBoundingClientRect').mockReturnValue(
      rect({ left: 100, right: 500, top: 100, bottom: 300, width: 400, height: 200 })
    );
    vi.spyOn(leftTick, 'getBoundingClientRect').mockReturnValue(
      rect({ left: 80, right: 160, bottom: 342 })
    );
    vi.spyOn(rightTick, 'getBoundingClientRect').mockReturnValue(
      rect({ left: 450, right: 520, bottom: 335 })
    );
    vi.spyOn(legend, 'getBoundingClientRect').mockReturnValue(rect({ top: 360 }));

    const containerRef = { current: container };
    const { result, unmount } = renderHook(() =>
      useXAxisLayout(containerRef, -45, undefined, 'first-layout')
    );

    expect(result.current).toEqual({
      height: 92,
      margin: { left: 36, right: 36 },
    });
    expect(FakeResizeObserver.instances[0].observe).toHaveBeenCalledWith(container);

    unmount();
    expect(FakeResizeObserver.instances[0].disconnect).toHaveBeenCalledOnce();
  });
});

describe('mergeXAxisLayoutMargin', () => {
  it('leaves recharts in charge when neither the chart nor axis needs a margin', () => {
    expect(mergeXAxisLayoutMargin(undefined, undefined)).toBeUndefined();
  });

  it('leaves an existing chart margin unchanged without endpoint clearance', () => {
    expect(mergeXAxisLayoutMargin({ top: 16 }, undefined)).toEqual({ top: 16 });
  });

  it('keeps recharts defaults on all sides while adding endpoint clearance', () => {
    expect(mergeXAxisLayoutMargin(undefined, { left: 36, right: 12 })).toEqual({
      top: 5,
      right: 17,
      bottom: 5,
      left: 41,
    });
  });

  it('preserves an explicit chart margin while adding endpoint clearance', () => {
    expect(
      mergeXAxisLayoutMargin(
        { top: 16, right: 16, bottom: 16, left: 16 },
        { left: 36 }
      )
    ).toEqual({ top: 16, right: 16, bottom: 16, left: 52 });
  });
});
