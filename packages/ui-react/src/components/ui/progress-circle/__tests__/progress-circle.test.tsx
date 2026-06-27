import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressCircle } from '../index';

describe('ProgressCircle', () => {
  it('exposes the progressbar role with the current value', () => {
    render(<ProgressCircle value={40} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('shows the rounded percentage when showValue', () => {
    render(<ProgressCircle value={42} showValue />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('honours a custom max in the percentage', () => {
    render(<ProgressCircle value={5} max={10} showValue />);
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
  });

  it('derives the arc status color from the value', () => {
    const { container, rerender } = render(<ProgressCircle value={25} />);
    // low → danger
    expect(
      container.querySelector('.stroke-\\[var\\(--ui-text-on-status-danger\\)\\]')
    ).toBeTruthy();
    rerender(<ProgressCircle value={90} />);
    expect(
      container.querySelector('.stroke-\\[var\\(--ui-text-on-status-success\\)\\]')
    ).toBeTruthy();
  });

  it('lets the status be overridden', () => {
    const { container } = render(<ProgressCircle value={90} status="danger" />);
    expect(
      container.querySelector('.stroke-\\[var\\(--ui-text-on-status-danger\\)\\]')
    ).toBeTruthy();
  });

  it('uses a single brand color in the brand mode (no value→color)', () => {
    const { container } = render(<ProgressCircle value={60} status="brand" />);
    expect(
      container.querySelector(
        '.stroke-\\[var\\(--ui-background-brand-secondary\\)\\]'
      )
    ).toBeTruthy();
    // not the value-derived critical color
    expect(
      container.querySelector(
        '.stroke-\\[var\\(--ui-text-on-status-critical\\)\\]'
      )
    ).toBeFalsy();
  });

  it('renders custom center content over the value', () => {
    render(
      <ProgressCircle value={40} showValue>
        <span>OK</span>
      </ProgressCircle>
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.queryByText('40%')).not.toBeInTheDocument();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ProgressCircle value={50} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
