import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Meter } from '../meter';

describe('Meter', () => {
  it('renders a meter role with the value/range and accessible name', () => {
    render(<Meter label="Critical" value={6} max={29} color="red" />);
    const meter = screen.getByRole('meter', { name: 'Critical' });
    expect(meter).toHaveAttribute('aria-valuenow', '6');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '29');
  });

  it('shows the value and its share of the max', () => {
    render(<Meter label="Critical" value={6} max={29} color="red" />);
    // 6 / 29 ≈ 21%
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('· 21%')).toBeInTheDocument();
  });

  it('formats the value with valueFormatter', () => {
    render(
      <Meter
        label="Revenue"
        value={1240}
        max={5000}
        color="red"
        valueFormatter={(v) => `$${v.toLocaleString()}`}
      />
    );
    expect(screen.getByText('$1,240')).toBeInTheDocument();
  });

  it('guards a zero max (0%, no divide-by-zero)', () => {
    render(<Meter label="Empty" value={0} max={0} color="red" />);
    expect(screen.getByText('· 0%')).toBeInTheDocument();
  });

  it('renders without the tooltip trigger when showTooltip is false', () => {
    render(<Meter label="Critical" value={6} max={29} color="red" showTooltip={false} />);
    // With the tooltip, the meter is wrapped as a trigger (gets aria-describedby);
    // without it, it's the bare meter.
    expect(screen.getByRole('meter')).not.toHaveAttribute('aria-describedby');
  });

  it('shows the tooltip content when defaultOpen', () => {
    render(<Meter label="Critical" value={6} max={29} color="red" defaultOpen />);
    expect(screen.getByText('6 of 29 · 21%')).toBeInTheDocument();
  });

  it('renders custom tooltip content via the tooltip prop', () => {
    render(
      <Meter
        label="Critical"
        value={6}
        max={29}
        color="red"
        defaultOpen
        tooltip={<span>Custom hint</span>}
      />
    );
    expect(screen.getByText('Custom hint')).toBeInTheDocument();
    expect(screen.queryByText('6 of 29 · 21%')).not.toBeInTheDocument();
  });

  it('forwards a ref to the meter element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Meter label="Critical" value={6} max={29} color="red" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'meter');
  });

  it('merges a caller className onto the meter', () => {
    render(
      <Meter label="Critical" value={6} max={29} color="red" className="w-80" />
    );
    expect(screen.getByRole('meter')).toHaveClass('w-80');
  });
});
