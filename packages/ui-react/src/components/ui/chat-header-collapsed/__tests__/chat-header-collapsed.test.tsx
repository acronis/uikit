import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ChatHeaderCollapsed } from '../chat-header-collapsed';

describe('ChatHeaderCollapsed', () => {
  it('renders a header element', () => {
    render(<ChatHeaderCollapsed data-testid="header" />);
    const header = screen.getByTestId('header');
    expect(header.tagName).toBe('HEADER');
  });

  it('wires the collapsed band geometry to the --ui-chat-* tokens', () => {
    render(<ChatHeaderCollapsed data-testid="header" />);
    expect(screen.getByTestId('header')).toHaveClass(
      'h-[var(--ui-chat-header-height)]',
      'w-[var(--ui-chat-container-collapsed-width)]',
      'px-[var(--ui-chat-header-padding-x)]'
    );
  });

  it('draws the bottom seam using the shared chat border tokens', () => {
    render(<ChatHeaderCollapsed data-testid="header" />);
    expect(screen.getByTestId('header')).toHaveClass(
      'border-b-[length:var(--ui-chat-global-border-width)]',
      'border-[var(--ui-chat-global-border-color)]',
      '[border-bottom-style:var(--ui-chat-global-border-style)]'
    );
  });

  it('composes TagIcon (violet, 32px) around the provided icon', () => {
    render(
      <ChatHeaderCollapsed icon={<svg data-testid="icon" />} />
    );
    const tagIcon = screen.getByTestId('icon').parentElement!;
    expect(tagIcon).toHaveClass(
      'bg-[var(--ui-avatar-color-violet)]',
      'text-[var(--ui-avatar-label-color-violet)]',
      'size-8'
    );
  });

  it('renders TagIcon with no glyph when icon is omitted', () => {
    const { container } = render(<ChatHeaderCollapsed />);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('accepts hasHistory without any visual effect (no-op today)', () => {
    const { container: withoutHistory } = render(
      <ChatHeaderCollapsed icon={<svg />} />
    );
    const { container: withHistory } = render(
      <ChatHeaderCollapsed icon={<svg />} hasHistory />
    );
    expect(withHistory.querySelector('header')?.className).toBe(
      withoutHistory.querySelector('header')?.className
    );
    expect(withHistory.querySelectorAll('svg')).toHaveLength(1);
  });

  it('does not forward hasHistory onto the DOM element', () => {
    render(<ChatHeaderCollapsed data-testid="header" hasHistory />);
    expect(screen.getByTestId('header')).not.toHaveAttribute('hashistory');
  });

  it('forwards the ref to the underlying header', () => {
    const ref = createRef<HTMLElement>();
    render(<ChatHeaderCollapsed ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('HEADER');
  });

  it('merges a consumer className without dropping the token classes', () => {
    render(<ChatHeaderCollapsed data-testid="header" className="my-2" />);
    expect(screen.getByTestId('header')).toHaveClass(
      'my-2',
      'h-[var(--ui-chat-header-height)]'
    );
  });

  it('supports polymorphic rendering via the render prop', () => {
    render(
      <ChatHeaderCollapsed
        data-testid="header"
        render={<div />}
        icon={<svg />}
      />
    );
    expect(screen.getByTestId('header').tagName).toBe('DIV');
  });
});
