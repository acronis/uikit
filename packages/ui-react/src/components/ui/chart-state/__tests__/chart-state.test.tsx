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

  it('keeps the state a11y contract when a conflicting role prop is passed', () => {
    render(<ChartState state="loading" role="region" data-testid="cs" />);
    expect(screen.getByTestId('cs')).toHaveAttribute('role', 'status');
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

  it('marks the loading state busy', () => {
    render(<ChartState state="loading" data-testid="cs" />);
    expect(screen.getByTestId('cs')).toHaveAttribute('aria-busy', 'true');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ChartState state="empty" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
