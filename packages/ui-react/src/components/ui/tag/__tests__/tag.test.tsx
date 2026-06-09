import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tag } from '../tag';

describe('Tag', () => {
  it('renders its label', () => {
    render(<Tag>Active</Tag>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('defaults to the neutral variant and default size tokens', () => {
    const { container } = render(<Tag>Active</Tag>);
    expect(container.firstElementChild).toHaveClass(
      'bg-[var(--ui-background-status-neutral)]',
      'border-[var(--ui-border-on-status-neutral)]',
      'text-[var(--ui-text-on-status-neutral)]',
      'h-6'
    );
  });

  it('applies the requested variant and size', () => {
    const { container } = render(
      <Tag variant="success" size="sm">
        Done
      </Tag>
    );
    expect(container.firstElementChild).toHaveClass(
      'bg-[var(--ui-background-status-success)]',
      'text-[var(--ui-text-on-status-success)]',
      'h-5',
      'px-1'
    );
  });

  it('renders an optional leading icon before the label', () => {
    const { container } = render(
      <Tag icon={<svg data-testid="icon" />}>Active</Tag>
    );
    const root = container.firstElementChild!;
    expect(root.querySelector('[data-testid="icon"]')).toBeInTheDocument();
    // The icon precedes the label.
    expect(root.firstElementChild?.getAttribute('data-testid')).toBe('icon');
  });

  it('forwards the ref to the underlying span', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Tag ref={ref}>Active</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
