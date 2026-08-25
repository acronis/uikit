import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ChartState } from '../chart-state';

describe('ChartState', () => {
  it('renders the loading state as a single status region with the default label', () => {
    render(<ChartState state="loading" />);
    // The Spinner is aria-hidden, so the root is the only status region — no
    // double announce.
    expect(screen.getByRole('status')).toHaveTextContent('Data is loading…');
  });

  it('keeps the full state a11y contract when conflicting a11y props are passed', () => {
    render(
      <ChartState
        state="loading"
        role="region"
        aria-live="off"
        data-testid="cs"
      />
    );
    // The intrinsic live-region contract (role + aria-live) wins over the
    // consumer props, and the region is never marked busy.
    const el = screen.getByTestId('cs');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).not.toHaveAttribute('aria-busy');
  });

  it('renders the empty state with its default label', () => {
    render(<ChartState state="empty" />);
    expect(screen.getByRole('status')).toHaveTextContent('No data found');
  });

  it('renders the error state as an alert', () => {
    render(<ChartState state="error" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('overrides the default description', () => {
    render(<ChartState state="empty" description="Nothing to plot" />);
    expect(screen.getByText('Nothing to plot')).toBeInTheDocument();
  });

  it('shows the action only for the error state', () => {
    const { rerender } = render(
      <ChartState state="empty" action={<button>Try again</button>} />
    );
    expect(
      screen.queryByRole('button', { name: 'Try again' })
    ).not.toBeInTheDocument();

    rerender(<ChartState state="error" action={<button>Try again</button>} />);
    expect(
      screen.getByRole('button', { name: 'Try again' })
    ).toBeInTheDocument();
  });

  it('does not mark the loading live region busy (would suppress the announcement)', () => {
    render(<ChartState state="loading" data-testid="cs" />);
    const el = screen.getByTestId('cs');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).not.toHaveAttribute('aria-busy');
  });

  describe('per-type empty states', () => {
    it('draws the type silhouette instead of the generic glyph', () => {
      const { container } = render(
        <ChartState state="empty" variant="donut" />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Decorative: the label carries the meaning, so the artwork is hidden.
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      // One tone, set on the container — every path inside inherits it, which is
      // what lets brand/theme overrides reach the artwork.
      expect(
        svg?.querySelectorAll('[fill="currentColor"]').length
      ).toBeGreaterThan(0);
    });

    it('shows only text when no variant is given', () => {
      const { container } = render(<ChartState state="empty" />);

      // No illustration is mounted when there is no variant — just the label.
      expect(
        container.querySelector('[class*="ui-background-status-off"]')
      ).toBeNull();
    });

    it('gives every variant its own artwork, with donut and radial sharing one', () => {
      const seen = new Map<string, number>();

      for (const variant of [
        'area',
        'bar',
        'line',
        'donut',
        'radial',
        'funnel',
        'radar',
        'sankey',
        'scatter',
        'treemap',
        'table',
        'text',
      ] as const) {
        const { container } = render(
          <ChartState state="empty" variant={variant} />
        );
        const svg = container.querySelector('svg');
        expect(svg, variant).toBeInTheDocument();
        const key = svg?.outerHTML ?? '';
        seen.set(key, (seen.get(key) ?? 0) + 1);
      }

      // 12 variants, 11 distinct silhouettes: the design draws one ring for both
      // donut and radial.
      expect(seen.size).toBe(11);
      expect([...seen.values()].filter((n) => n === 2)).toHaveLength(1);
    });

    it('ignores the variant for loading and error, which share one treatment', () => {
      for (const state of ['loading', 'error'] as const) {
        const { container } = render(
          <ChartState state={state} variant="treemap" />
        );
        expect(
          container.querySelector('[class*="ui-background-status-off"]')
        ).toBeNull();
      }
    });

    it('makes the description the caption, replacing the status label', () => {
      // The mockups draw the silhouette over "Widget description" and no status
      // line: the artwork already says "no data", so the one useful sentence is
      // what the widget would show.
      render(
        <ChartState
          state="empty"
          variant="area"
          description="Sessions over the selected range"
        />
      );

      expect(
        screen.getByText('Sessions over the selected range')
      ).toBeInTheDocument();
      expect(screen.queryByText('No data found')).not.toBeInTheDocument();
    });

    it('falls back to the status label when there is no description', () => {
      render(<ChartState state="empty" variant="area" />);

      expect(screen.getByText('No data found')).toBeInTheDocument();
    });

    it('allows description to override the label for loading and error', () => {
      for (const state of ['loading', 'error'] as const) {
        const { unmount } = render(
          <ChartState state={state} description="Custom text" />
        );
        expect(screen.getByText('Custom text')).toBeInTheDocument();
        unmount();
      }
    });
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ChartState state="empty" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
