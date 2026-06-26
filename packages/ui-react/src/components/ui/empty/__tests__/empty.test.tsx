import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
} from '../empty';

describe('Empty', () => {
  it('renders the composed empty state', () => {
    render(
      <Empty>
        <EmptyIcon>
          <svg data-testid="icon" aria-hidden="true" />
        </EmptyIcon>
        <EmptyHeader>
          <EmptyTitle>No messages</EmptyTitle>
          <EmptyDescription>You have no messages yet.</EmptyDescription>
        </EmptyHeader>
        <EmptyActions>
          <button>Refresh</button>
        </EmptyActions>
      </Empty>
    );
    expect(
      screen.getByRole('heading', { name: 'No messages' })
    ).toBeInTheDocument();
    expect(screen.getByText('You have no messages yet.')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  it('renders the title as a level-3 heading', () => {
    render(<EmptyTitle>No data</EmptyTitle>);
    const heading = screen.getByRole('heading', { level: 3, name: 'No data' });
    expect(heading).toHaveClass('text-foreground');
  });

  it('mutes the supporting text via the secondary token', () => {
    render(
      <Empty data-testid="empty">
        <EmptyDescription>desc</EmptyDescription>
      </Empty>
    );
    expect(screen.getByTestId('empty')).toHaveClass('text-muted-foreground');
  });

  it('merges a custom className without dropping base classes', () => {
    render(
      <Empty data-testid="empty" className="custom">
        x
      </Empty>
    );
    const el = screen.getByTestId('empty');
    expect(el).toHaveClass('custom');
    expect(el).toHaveClass('max-w-[448px]');
  });

  it('forwards refs to the underlying elements', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Empty ref={ref}>x</Empty>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
