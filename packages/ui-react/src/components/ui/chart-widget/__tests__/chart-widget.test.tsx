import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ChartWidget } from '../index';

const plot = <div data-testid="plot">plot</div>;

describe('ChartWidget', () => {
  it('renders the chart inside a card', () => {
    const { container } = render(<ChartWidget>{plot}</ChartWidget>);

    const root = container.querySelector('[data-slot="chart-widget"]');
    expect(root).toBeInTheDocument();
    expect(root).toContainElement(screen.getByTestId('plot'));
  });

  it('forwards the whole header object to CardHeader', () => {
    render(
      <ChartWidget
        header={{
          title: 'Active alerts',
          description: 'By severity',
          hasDescription: true,
          actions: <button type="button">More</button>,
          extras: <span>Last 6 months</span>,
        }}
      >
        {plot}
      </ChartWidget>
    );

    expect(screen.getByText('Active alerts')).toBeInTheDocument();
    expect(screen.getByText('By severity')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
    expect(screen.getByText('Last 6 months')).toBeInTheDocument();
  });

  it('picks up a CardHeader feature without declaring it', () => {
    // The point of spreading `CardHeaderProps`: this widget never mentions
    // `hasRename`, yet the affordance and its callback work.
    const onRename = vi.fn();
    render(
      <ChartWidget header={{ title: 'Storage', hasRename: true, onRename }}>
        {plot}
      </ChartWidget>
    );

    expect(screen.getByRole('button', { name: 'Rename' })).toBeInTheDocument();
  });

  it('renders no header when none is given', () => {
    const { container } = render(<ChartWidget>{plot}</ChartWidget>);

    // `CardHeader`'s `title` defaults to the literal 'Title', so a header that
    // rendered would show it even with no props — which is what makes this a
    // real assertion rather than a check for an attribute nothing sets.
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="chart-widget"]')?.children
    ).toHaveLength(1);
  });

  it('puts the metric in its own row above the plot', () => {
    const { container } = render(
      <ChartWidget metric={<span>125</span>}>{plot}</ChartWidget>
    );

    const metric = container.querySelector('[data-slot="chart-widget-metric"]');
    const body = container.querySelector('[data-slot="chart-widget-body"]');
    expect(metric).toHaveTextContent('125');
    // Source order matters: the readout reads above the plot.
    expect(metric?.compareDocumentPosition(body!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it('omits the metric row when there is no metric', () => {
    const { container } = render(<ChartWidget>{plot}</ChartWidget>);

    expect(
      container.querySelector('[data-slot="chart-widget-metric"]')
    ).toBeNull();
  });

  describe('state', () => {
    it('swaps the plot for a placeholder, keeping the header', () => {
      render(
        <ChartWidget header={{ title: 'Storage' }} state="empty">
          {plot}
        </ChartWidget>
      );

      expect(screen.queryByTestId('plot')).not.toBeInTheDocument();
      expect(screen.getByText('No data found')).toBeInTheDocument();
      expect(screen.getByText('Storage')).toBeInTheDocument();
    });

    it('lets the placeholder fill the same body the plot would', () => {
      const { container } = render(
        <ChartWidget state="empty">{plot}</ChartWidget>
      );

      expect(
        container.querySelector('[data-slot="chart-widget-body"]')?.className
      ).toContain('flex-1');
    });

    it('overrides the placeholder description', () => {
      render(
        <ChartWidget state="empty" stateDescription="Nothing to plot yet">
          {plot}
        </ChartWidget>
      );

      expect(screen.getByText('Nothing to plot yet')).toBeInTheDocument();
      expect(screen.queryByText('No data found')).not.toBeInTheDocument();
    });

    it('renders the error action', () => {
      render(
        <ChartWidget
          state="error"
          stateAction={<button type="button">Try again</button>}
        >
          {plot}
        </ChartWidget>
      );

      expect(
        screen.getByRole('button', { name: 'Try again' })
      ).toBeInTheDocument();
    });

    it('gives the card its error border on state="error"', () => {
      const { container } = render(
        <ChartWidget state="error">{plot}</ChartWidget>
      );

      expect(
        container.querySelector('[data-slot="chart-widget"]')?.className
      ).toContain('border-[var(--ui-border-on-surface-border-error)]');
    });

    it('leaves the border alone for the other states', () => {
      for (const state of ['loading', 'empty'] as const) {
        const { container } = render(
          <ChartWidget state={state}>{plot}</ChartWidget>
        );
        expect(
          container.querySelector('[data-slot="chart-widget"]')?.className
        ).toContain('border-[var(--ui-border-on-surface-border)]');
      }
    });
  });

  it('passes the card height down so the plot can fill it', () => {
    // The chain the grid relies on: the card is a full-height flex column, the
    // body takes what the header leaves, and the plot slot takes what the metric
    // row leaves. `min-h-0` at each step, or a tall chart pushes past the cell.
    const { container } = render(
      <ChartWidget header={{ title: 'Storage' }} metric={<span>1</span>}>
        {plot}
      </ChartWidget>
    );

    const root = container.querySelector('[data-slot="chart-widget"]');
    expect(root?.className).toContain('h-full');
    expect(root?.className).toContain('flex-col');

    const body = root?.querySelector(':scope > :last-child');
    expect(body?.className).toContain('flex-1');
    expect(body?.className).toContain('min-h-0');

    const plotSlot = container.querySelector('[data-slot="chart-widget-body"]');
    expect(plotSlot?.className).toContain('flex-1');
    expect(plotSlot?.className).toContain('min-h-0');

    // The readout must not stretch — the plot gets the slack, not the metric.
    expect(
      container.querySelector('[data-slot="chart-widget-metric"]')?.className
    ).toContain('shrink-0');
  });

  it('merges a className onto the card rather than replacing it', () => {
    const { container } = render(
      <ChartWidget className="col-span-2">{plot}</ChartWidget>
    );

    const root = container.querySelector('[data-slot="chart-widget"]');
    expect(root?.className).toContain('col-span-2');
    expect(root?.className).toContain('rounded-lg');
  });

  it('renders as another element through `render`, for a landmark', () => {
    // The a11y docs point at this as the way to give a widget a landmark role,
    // so it has to actually work — not just type-check.
    render(
      <ChartWidget render={<section aria-label="Sessions" />}>
        {plot}
      </ChartWidget>
    );

    const region = screen.getByRole('region', { name: 'Sessions' });
    expect(region).toHaveAttribute('data-slot', 'chart-widget');
    expect(region).toContainElement(screen.getByTestId('plot'));
  });

  it('forwards a ref to the card', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ChartWidget ref={ref}>{plot}</ChartWidget>);

    expect(ref.current).toHaveAttribute('data-slot', 'chart-widget');
  });
});
