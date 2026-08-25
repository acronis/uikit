import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Metric } from '../metric';
import { Tag } from '../../tag';

describe('Metric', () => {
  it('renders value, unit and supporting text', () => {
    render(
      <Metric
        value="73"
        unit="%"
        supportingText="Down from 78% last quarter"
      />
    );
    expect(screen.getByText('73')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
    expect(screen.getByText('Down from 78% last quarter')).toBeInTheDocument();
  });

  it('renders a caption at the right of the stats row', () => {
    render(<Metric value="73" unit="%" caption={<Tag>Last 30 days</Tag>} />);
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('renders a TrendIndicator from the first-class trend prop', () => {
    render(<Metric value="42" trend="up" trendValue="20%" />);
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('renders the icon in the badge and a metadata badge', () => {
    render(
      <Metric
        value="$72K"
        icon={<svg data-testid="lead-icon" />}
        badge={<span>Low confidence</span>}
      />
    );
    expect(screen.getByTestId('lead-icon')).toBeInTheDocument();
    expect(screen.getByText('Low confidence')).toBeInTheDocument();
  });

  it('shows a skeleton in place of the value when loading', () => {
    const { container } = render(<Metric value={82} loading />);
    expect(
      container.querySelector('[data-slot="skeleton"]')
    ).toBeInTheDocument();
    expect(screen.queryByText('82')).not.toBeInTheDocument();
  });

  it('renders a keyboard-reachable, named info affordance for the tooltip', () => {
    render(
      <Metric
        value="$72K"
        tooltip="Annual recurring revenue"
        tooltipLabel="About ARR"
      />
    );
    expect(
      screen.getByRole('button', { name: 'About ARR' })
    ).toBeInTheDocument();
  });

  it('accepts a numeric or ReactNode value', () => {
    render(<Metric value={<span>82</span>} unit="/100" />);
    expect(screen.getByText('82')).toBeInTheDocument();
    expect(screen.getByText('/100')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Metric value="1" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = render(<Metric value="1" className="w-48" />);
    expect(container.firstElementChild).toHaveClass('w-48');
  });
});
