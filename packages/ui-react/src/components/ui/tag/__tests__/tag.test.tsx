import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tag } from '../tag';

describe('Tag', () => {
  it('stays presentational by default (no role, no tab stop)', () => {
    const { container } = render(<Tag>Active</Tag>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('SPAN');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('renders its label', () => {
    render(<Tag>Active</Tag>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('defaults to the neutral variant and default size tokens', () => {
    const { container } = render(<Tag>Active</Tag>);
    expect(container.firstElementChild).toHaveClass(
      'bg-[var(--ui-tag-neutral-container-color)]',
      'border-[var(--ui-tag-neutral-container-border-color)]',
      'text-[var(--ui-tag-neutral-label-color)]',
      'h-[var(--ui-tag-global-md-container-height)]'
    );
  });

  it('applies the requested variant and size', () => {
    const { container } = render(
      <Tag variant="success" size="sm">
        Done
      </Tag>
    );
    expect(container.firstElementChild).toHaveClass(
      'bg-[var(--ui-tag-success-container-color)]',
      'text-[var(--ui-tag-success-label-color)]',
      'h-[var(--ui-tag-global-sm-container-height)]',
      'px-[var(--ui-tag-global-container-padding-x)]'
    );
  });

  it('paints the ai variant with the gradient-border background trick', () => {
    const { container } = render(<Tag variant="ai">Ask AI</Tag>);
    expect(container.firstElementChild).toHaveClass(
      'text-[var(--ui-tag-ai-label-color)]',
      '[background:linear-gradient(var(--ui-tag-ai-container-color),var(--ui-tag-ai-container-color))_padding-box,var(--ui-tag-ai-container-border-color)_border-box]'
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
