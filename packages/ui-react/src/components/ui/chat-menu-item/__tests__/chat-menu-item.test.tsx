import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ChatMenuItem } from '../chat-menu-item';
import { ChatMenuItemExtras } from '@/components/ui/chat-menu-item-extras';

describe('ChatMenuItem', () => {
  it('renders a real button whose accessible name comes from the label', () => {
    render(<ChatMenuItem label="Q3 roadmap" />);
    const item = screen.getByRole('button', { name: 'Q3 roadmap' });
    expect(item).toHaveAttribute('type', 'button');
  });

  it('wires the expanded geometry to the --ui-chat-* tokens', () => {
    render(<ChatMenuItem label="Q3 roadmap" />);
    expect(screen.getByRole('button')).toHaveClass(
      'h-[var(--ui-chat-menu-item-height)]',
      'min-w-[var(--ui-chat-menu-item-expanded-min-width)]',
      'px-[var(--ui-chat-menu-item-padding-x)]',
      'gap-[var(--ui-chat-menu-item-expanded-gap)]'
    );
  });

  it('draws the rail seam as a logical inline-start border so it mirrors in RTL', () => {
    render(<ChatMenuItem label="Q3 roadmap" />);
    expect(screen.getByRole('button')).toHaveClass(
      '[border-inline-start-width:var(--ui-chat-global-border-width)]',
      '[border-inline-start-color:var(--ui-chat-global-border-color)]'
    );
  });

  it('defaults to the idle state and wires hover/focus to their own tokens', () => {
    render(<ChatMenuItem label="Q3 roadmap" />);
    const item = screen.getByRole('button');
    expect(item).toHaveClass(
      'bg-[var(--ui-chat-menu-item-color-idle)]',
      'hover:bg-[var(--ui-chat-menu-item-color-hover)]',
      'focus-visible:ring-[var(--ui-focus-primary)]'
    );
    expect(item).not.toHaveAttribute('aria-current');
  });

  it('marks the active state as the current chat via its own token and aria-current', () => {
    render(<ChatMenuItem label="Q3 roadmap" state="active" />);
    const item = screen.getByRole('button');
    expect(item).toHaveClass('bg-[var(--ui-chat-menu-item-color-active)]');
    expect(item).toHaveAttribute('aria-current', 'page');
  });

  it('renders the icon inside a slot coloured by the chat icon token', () => {
    render(
      <ChatMenuItem label="Q3 roadmap" icon={<svg data-testid="icon" />} />
    );
    const slot = screen.getByTestId('icon').parentElement!;
    expect(slot).toHaveClass('text-[var(--ui-chat-menu-item-icon-color)]');
    expect(slot).toHaveClass('size-4');
  });

  it('renders no icon slot when icon is omitted', () => {
    const { container } = render(<ChatMenuItem label="Q3 roadmap" />);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('renders the label using the chat label token and text style', () => {
    render(<ChatMenuItem label="Q3 roadmap" />);
    expect(screen.getByText('Q3 roadmap')).toHaveClass(
      'ui-chat-menu-item-label-text-style',
      'text-[var(--ui-chat-menu-item-label-color)]'
    );
  });

  it('hides extras by default even when provided', () => {
    render(
      <ChatMenuItem
        label="Q3 roadmap"
        extras={<ChatMenuItemExtras labelTag="New" />}
      />
    );
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('renders a composed ChatMenuItemExtras element when hasExtras is set', () => {
    render(
      <ChatMenuItem
        label="Q3 roadmap"
        hasExtras
        extras={<ChatMenuItemExtras labelTag="New" />}
      />
    );
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('fires onClick when activated', async () => {
    const onClick = vi.fn();
    render(<ChatMenuItem label="Q3 roadmap" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick while disabled', async () => {
    const onClick = vi.fn();
    render(<ChatMenuItem label="Q3 roadmap" onClick={onClick} disabled />);
    const item = screen.getByRole('button');
    expect(item).toBeDisabled();
    await userEvent.click(item);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ChatMenuItem label="Q3 roadmap" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges a consumer className without dropping the token classes', () => {
    render(<ChatMenuItem label="Q3 roadmap" className="my-2" />);
    expect(screen.getByRole('button')).toHaveClass(
      'my-2',
      'h-[var(--ui-chat-menu-item-height)]'
    );
  });
});
