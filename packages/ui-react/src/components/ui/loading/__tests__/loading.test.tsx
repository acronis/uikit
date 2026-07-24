import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Loading } from '../loading';

describe('Loading', () => {
  it('renders a status role with the label as its accessible content', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toHaveTextContent('Data is loading…');
  });

  it('defaults to the inline variant', () => {
    render(<Loading data-testid="loading" />);
    expect(screen.getByTestId('loading')).toHaveClass(
      'gap-[var(--ui-loading-inline-container-gap)]'
    );
  });

  it('applies the onSurfacePrimary variant', () => {
    render(<Loading data-testid="loading" variant="onSurfacePrimary" />);
    expect(screen.getByTestId('loading')).toHaveClass(
      'bg-[var(--ui-loading-element-container-color-primary)]'
    );
  });

  it('applies the onSurfaceSecondary variant', () => {
    render(<Loading data-testid="loading" variant="onSurfaceSecondary" />);
    expect(screen.getByTestId('loading')).toHaveClass(
      'bg-[var(--ui-loading-element-container-color-secondary)]'
    );
  });

  it('applies the onScreen variant', () => {
    render(<Loading data-testid="loading" variant="onScreen" />);
    expect(screen.getByTestId('loading')).toHaveClass(
      'bg-[var(--ui-loading-screen-container-color)]'
    );
  });

  it('resolves an explicit null variant to the inline styling', () => {
    render(<Loading data-testid="loading" variant={null} />);
    expect(screen.getByTestId('loading')).toHaveClass(
      'gap-[var(--ui-loading-inline-container-gap)]'
    );
  });

  it('renders a custom label', () => {
    render(<Loading label="Uploading files…" />);
    expect(screen.getByText('Uploading files…')).toBeInTheDocument();
  });

  it('hides the visible label but keeps it accessible when hasLabel is false', () => {
    render(<Loading hasLabel={false} label="Uploading files…" />);
    expect(screen.queryByText('Uploading files…')).not.toBeInTheDocument();
    expect(
      screen.getByRole('status', { name: 'Uploading files…' })
    ).toBeInTheDocument();
  });

  it('hides the spinner icon from assistive tech', () => {
    render(<Loading />);
    const icon = screen
      .getByRole('status')
      .querySelector('[aria-hidden="true"]');
    expect(icon).toHaveClass('animate-spin');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Loading ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
