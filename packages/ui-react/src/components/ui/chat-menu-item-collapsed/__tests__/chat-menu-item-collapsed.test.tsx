import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ChatMenuItemCollapsed } from '../chat-menu-item-collapsed';

describe('ChatMenuItemCollapsed', () => {
  it('renders a real button that takes its accessible name from aria-label', () => {
    render(<ChatMenuItemCollapsed aria-label="Chats" />);
    const item = screen.getByRole('button', { name: 'Chats' });
    expect(item).toHaveAttribute('type', 'button');
  });

  it('wires the collapsed geometry to the --ui-chat-* tokens', () => {
    render(<ChatMenuItemCollapsed aria-label="Chats" />);
    expect(screen.getByRole('button')).toHaveClass(
      'h-[var(--ui-chat-menu-item-height)]',
      'w-[var(--ui-chat-menu-item-collapsed-max-width)]',
      'px-[var(--ui-chat-menu-item-padding-x)]',
      'gap-[var(--ui-chat-menu-item-expanded-gap)]'
    );
  });

  it('draws the rail seam as a logical inline-start border so it mirrors in RTL', () => {
    render(<ChatMenuItemCollapsed aria-label="Chats" />);
    expect(screen.getByRole('button')).toHaveClass(
      '[border-inline-start-width:var(--ui-chat-global-border-width)]',
      '[border-inline-start-color:var(--ui-chat-global-border-color)]'
    );
  });

  it('defaults to the idle variant and wires each interaction state to its own token', () => {
    render(<ChatMenuItemCollapsed aria-label="Chats" />);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-[var(--ui-chat-menu-item-color-idle)]',
      'hover:bg-[var(--ui-chat-menu-item-color-hover)]',
      'active:bg-[var(--ui-chat-menu-item-color-active)]',
      'focus-visible:ring-[var(--ui-focus-primary)]'
    );
  });

  it('applies an explicitly requested idle variant identically', () => {
    render(<ChatMenuItemCollapsed aria-label="Chats" variant="idle" />);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-[var(--ui-chat-menu-item-color-idle)]'
    );
  });

  it('renders the icon inside a slot coloured by the chat icon token', () => {
    render(
      <ChatMenuItemCollapsed
        aria-label="Chats"
        icon={<svg data-testid="icon" />}
      />
    );
    const slot = screen.getByTestId('icon').parentElement!;
    expect(slot).toHaveClass('text-[var(--ui-chat-menu-item-icon-color)]');
    expect(slot).toHaveClass('size-4');
  });

  it('hides the alert dot by default', () => {
    const { container } = render(<ChatMenuItemCollapsed aria-label="Chats" />);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('shows a decorative alert dot when hasAlert is set', () => {
    const { container } = render(
      <ChatMenuItemCollapsed aria-label="Chats, 3 unread" hasAlert />
    );
    const dot = container.querySelector('svg')!;
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    // Logical positioning so the badge mirrors under dir="rtl".
    expect(dot).toHaveClass('start-2.5', '-top-2');
    // The dot is decorative: the name still comes from the label alone.
    expect(
      screen.getByRole('button', { name: 'Chats, 3 unread' })
    ).toBeInTheDocument();
  });

  it('shows the alert dot alongside a provided icon', () => {
    render(
      <ChatMenuItemCollapsed
        aria-label="Chats"
        icon={<svg data-testid="icon" />}
        hasAlert
      />
    );
    const slot = screen.getByTestId('icon').parentElement!;
    expect(slot.querySelectorAll('svg')).toHaveLength(2);
  });

  it('fires onClick when activated', async () => {
    const onClick = vi.fn();
    render(<ChatMenuItemCollapsed aria-label="Chats" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick while disabled', async () => {
    const onClick = vi.fn();
    render(
      <ChatMenuItemCollapsed aria-label="Chats" onClick={onClick} disabled />
    );
    const item = screen.getByRole('button');
    expect(item).toBeDisabled();
    await userEvent.click(item);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ChatMenuItemCollapsed aria-label="Chats" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges a consumer className without dropping the token classes', () => {
    render(<ChatMenuItemCollapsed aria-label="Chats" className="my-2" />);
    expect(screen.getByRole('button')).toHaveClass(
      'my-2',
      'h-[var(--ui-chat-menu-item-height)]'
    );
  });
});
