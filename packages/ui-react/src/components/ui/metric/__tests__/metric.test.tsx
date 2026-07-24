import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Metric } from '../metric';
import { TrendIndicator } from '../../trend-indicator';
import { Tag } from '../../tag';

describe('Metric', () => {
  it('renders label, value, unit and supporting text', () => {
    render(
      <Metric
        label="Gross margin"
        value="73"
        unit="%"
        supportingText="Down from 78% last quarter"
      />
    );
    expect(screen.getByText('Gross margin')).toBeInTheDocument();
    expect(screen.getByText('73')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
    expect(screen.getByText('Down from 78% last quarter')).toBeInTheDocument();
  });

  it('renders a top-right caption', () => {
    render(
      <Metric
        label="Gross margin"
        value="73"
        caption={<Tag>Last 30 days</Tag>}
      />
    );
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('composes a TrendIndicator passed via the trend slot', () => {
    render(
      <Metric
        label="Gross margin"
        value="73"
        trend={
          <TrendIndicator direction="down" sentiment="negative" value="5%" />
        }
      />
    );
    expect(screen.getByText('5%')).toBeInTheDocument();
  });

  it('renders the icon in the badge and a metadata badge', () => {
    render(
      <Metric
        label="ARR"
        value="$72K"
        icon={<svg data-testid="lead-icon" />}
        badge={<span>Low confidence</span>}
      />
    );
    expect(screen.getByTestId('lead-icon')).toBeInTheDocument();
    expect(screen.getByText('Low confidence')).toBeInTheDocument();
  });

  it('reflects size and status on data attributes', () => {
    const { container } = render(
      <Metric label="SLA" value="95" size="large" status="warning" />
    );
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-size', 'large');
    expect(root).toHaveAttribute('data-status', 'warning');
  });

  it('defaults to medium size / neutral status', () => {
    const { container } = render(<Metric label="Health" value={82} />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-size', 'medium');
    expect(root).toHaveAttribute('data-status', 'neutral');
  });

  it('tints the icon badge by status', () => {
    const { container } = render(
      <Metric
        label="At-risk"
        value="3"
        status="critical"
        icon={<svg data-testid="icon" />}
      />
    );
    // the badge wrapper is the icon's parent <span>
    const badge = container.querySelector('[data-testid="icon"]')?.parentElement;
    expect(badge?.className).toContain(
      'bg-[var(--ui-background-status-critical-pressed)]'
    );
  });

  it('shows a skeleton in place of the value when loading', () => {
    const { container } = render(<Metric label="Health" value={82} loading />);
    expect(
      container.querySelector('[data-slot="skeleton"]')
    ).toBeInTheDocument();
    expect(screen.queryByText('82')).not.toBeInTheDocument();
  });

  it('renders a keyboard-reachable, named info affordance for the tooltip', () => {
    render(
      <Metric
        label="ARR"
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
    render(<Metric label="Score" value={<span>82</span>} unit="/100" />);
    expect(screen.getByText('82')).toBeInTheDocument();
    expect(screen.getByText('/100')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Metric label="A" value="1" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = render(
      <Metric label="A" value="1" className="w-48" />
    );
    expect(container.firstElementChild).toHaveClass('w-48');
  });
});
