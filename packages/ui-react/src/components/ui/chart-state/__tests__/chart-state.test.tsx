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

  it('overrides the default label with `message`', () => {
    render(<ChartState state="empty" message="Nothing to plot" />);
    expect(screen.getByText('Nothing to plot')).toBeInTheDocument();
  });

  it('shows the action only for the error state', () => {
    const { rerender } = render(
      <ChartState state="empty" action={<button>Try again</button>} />
    );
    expect(
      screen.queryByRole('button', { name: 'Try again' })
    ).not.toBeInTheDocument();

    rerender(
      <ChartState state="error" action={<button>Try again</button>} />
    );
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

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ChartState state="empty" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
